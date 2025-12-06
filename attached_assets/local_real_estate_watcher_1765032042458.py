import asyncio
import json
import os
import random
import requests
import shutil
import glob
from datetime import datetime
from playwright.async_api import async_playwright
from dotenv import load_dotenv

load_dotenv()

#Configuration
TARGET_URL = "https://kevin-hensley.remax.com/index.php?showagent=1#rslt"
BASE_URL = "https://kevin-hensley.remax.com"
HISTORY_FILE = "listing_history.json"
HOLDING_DIR = "holding" 
DEBUG_DIR = "debug_output"
# NEW: Store browser session (cookies, local storage) here
USER_DATA_DIR = "browser_profile" 

# --- WEBHOOK CONFIGURATION ---
WEBHOOK_URL = os.getenv("WEBHOOK_URL")
WEBHOOK_AUTH_TOKEN = os.getenv("WEBHOOK_AUTH_TOKEN") 

# --- LOGIN CONFIGURATION ---
BOT_EMAIL = os.getenv("BOT_EMAIL", "rbnd1521@gmail.com")

# --- WINDOW SETTINGS ---
WINDOW_WIDTH = 1280
WINDOW_HEIGHT = 800
WINDOW_X = 50
WINDOW_Y = 50

# For local trusted machine, we prefer False (Visible) to pass Cloudflare easier
IS_HEADLESS = os.getenv("HEADLESS_MODE", "False").lower() == "true"

async def load_history():
    if not os.path.exists(HISTORY_FILE):
        return {}
    try:
        with open(HISTORY_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        return {}

async def save_history(history):
    with open(HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2)

def archive_and_clean():
    if not os.path.exists(HOLDING_DIR):
        os.makedirs(HOLDING_DIR)
    
    if os.path.exists(HISTORY_FILE):
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        archive_name = f"listing_history_{timestamp}.json"
        archive_path = os.path.join(HOLDING_DIR, archive_name)
        try:
            shutil.move(HISTORY_FILE, archive_path)
            print(f"  [📁] History archived to: {archive_path}")
        except Exception as e:
            print(f"  [!] Error archiving file: {e}")

    try:
        files = glob.glob(os.path.join(HOLDING_DIR, "listing_history_*.json"))
        files.sort()
        if len(files) > 8:
            to_delete = files[:-8] 
            for f in to_delete:
                os.remove(f)
                print(f"  [🗑️] Deleted old archive: {f}")
    except Exception as e:
        print(f"  [!] Error cleaning up archives: {e}")

def trigger_existing_workflow(listing_data):
    print(f"  [->] Success! Scraped {listing_data['address']}")

def send_to_webhook(history_dict):
    if not history_dict:
        print("  [!] No listings found to send.")
        return None

    # Use the raw dict since your server expects keyed objects
    payload_data = history_dict 

    print(f"  [🌐] Sending {len(history_dict)} items (FULL SYNC) to webhook...")
    
    try:
        payload = {
            "timestamp": str(datetime.now()),
            "type": "full_sync",
            "count": len(history_dict),
            "listings": payload_data 
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {WEBHOOK_AUTH_TOKEN}"
        }
        
        response = requests.post(WEBHOOK_URL, json=payload, headers=headers, timeout=30)
        
        if response.status_code in [200, 201]:
            print("  [✅] Webhook success!")
            try:
                return response.json()
            except:
                return None
        else:
            print(f"  [❌] Webhook failed: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"  [❌] Webhook error: {e}")
        return None

async def human_like_interaction(page):
    try:
        await page.mouse.move(random.randint(100, 500), random.randint(100, 500))
        await page.wait_for_timeout(random.randint(500, 1500))
        await page.mouse.wheel(0, random.randint(300, 700))
        await page.wait_for_timeout(random.randint(1000, 2000))
    except Exception:
        pass

async def ensure_page_loaded(page):
    try:
        title = await page.title()
        content = await page.content()
        
        is_blocked = "Just a moment" in title or "challenge-platform" in content or "Cloudflare" in title
        
        if is_blocked:
            # If we are visible (Headless=False), we can wait for manual solving or auto-solve
            print("\n" + "!"*60)
            print("🔴 CLOUDFLARE BLOCK DETECTED")
            print("👉 The browser profile will attempt to pass using saved cookies.")
            print("👉 If stuck, please interact with the browser window.")
            print("!"*60 + "\n")
            
            # Wait up to 30 seconds for resolution
            for _ in range(15):
                if await page.query_selector("span[data-translate='currency']"):
                    print("    ✅ Cloudflare passed! Resuming...")
                    await asyncio.sleep(2)
                    return
                await asyncio.sleep(2)
            
            print("    ❌ Timed out waiting for Cloudflare.")
        else:
            try:
                await page.wait_for_selector("span[data-translate='currency']", timeout=10000)
            except:
                pass 

    except Exception as e:
        print(f"    ! Error checking page load: {e}")

async def extract_listings_from_map_data(page):
    print("Looking for hidden map data...")
    try:
        await page.wait_for_selector("#map", state="attached", timeout=10000)
        map_element = await page.query_selector("#map")
        if not map_element: return []

        raw_links = await map_element.get_attribute("data-link") or ""
        raw_addresses = await map_element.get_attribute("data-address") or ""
        raw_prices = await map_element.get_attribute("data-price") or ""
        raw_ids = await map_element.get_attribute("data-mlsid") or ""
        
        links = [l for l in raw_links.strip().split(" ") if l]
        addresses = [a for a in raw_addresses.strip().split("|") if a]
        prices = [p for p in raw_prices.strip().split(" ") if p]
        ids = [i for i in raw_ids.strip().split(" ") if i]

        count = min(len(ids), len(links), len(addresses), len(prices))
        listings = []
        for i in range(count):
            full_url = links[i]
            if not full_url.startswith("http"):
                clean_path = links[i].lstrip('/')
                full_url = f"{BASE_URL}/{clean_path}"

            listings.append({
                "mlsid": ids[i],
                "address": addresses[i],
                "price": prices[i],
                "url": full_url
            })
        return listings
    except Exception as e:
        print(f"Error parsing map: {e}")
        return []

async def handle_lead_capture_modal(page):
    try:
        try:
             await page.wait_for_selector("input[type='email']", state="visible", timeout=3000)
        except:
             return 

        print("    ! Lead capture modal detected. Filling...")
        await page.fill("input[type='email']", BOT_EMAIL)
        await page.wait_for_timeout(random.randint(500, 1000))
        
        checkboxes = await page.query_selector_all("input[type='checkbox']")
        for cb in checkboxes:
            if await cb.is_visible(): 
                await cb.check()
                
        submit_btn = await page.query_selector("button[type='submit']")
        if not submit_btn:
            submit_btn = await page.query_selector("button:has-text('Continue')") or \
                         await page.query_selector("button:has-text('View')")
        
        if submit_btn:
            await submit_btn.click()
            await page.wait_for_selector("input[type='email']", state="hidden", timeout=5000)
            print("    ! Modal dismissed.")
    except Exception as e:
        pass

async def extract_page_details(page):
    details = {
        "cover_photo_url": "",
        "description": "",
        "Bedrooms": "",
        "Full Bathrooms": "",
        "Half Bathrooms": "",
        "Sqr Footage": "",
        "Lot Size": "",
        "Year Built": "",
        "Style": "",
        "Taxes": "",
        "Listing Status": "",
        "County": "",
        "City": "",
        "Area": "",
        "Neighborhood": "",
        "Zip": ""
    }
    
    print("    -> Extracting details...")
    
    try:
        photo_el = await page.query_selector(".gallery .gallery-item")
        if not photo_el: photo_el = await page.query_selector(".gallery img")
            
        if photo_el:
            src = await photo_el.get_attribute("data-src")
            if not src: src = await photo_el.get_attribute("src")
            if not src: src = await photo_el.get_attribute("data-mfp-src")
            if src: details["cover_photo_url"] = src

        try:
            desc_text = await page.evaluate('''() => {
                const headers = Array.from(document.querySelectorAll('h5, h4, h6'));
                const target = headers.find(el => el.innerText.includes('Property Description'));
                if (target && target.nextElementSibling) { return target.nextElementSibling.innerText; }
                const el = document.querySelector(".col-lg-7.overview p");
                return el ? el.innerText : "";
            }''')
            if desc_text: details["description"] = desc_text.strip()
        except: pass

        attributes = await page.query_selector_all(".overview ul li")
        for attr in attributes:
            try:
                key_el = await attr.query_selector("strong")
                val_el = await attr.query_selector("span")
                if key_el and val_el:
                    key = await key_el.inner_text()
                    val = await val_el.inner_text()
                    key = key.replace(":", "").strip()
                    details[key] = val.strip()
            except:
                continue

        return details
    except Exception as e:
        print(f"Error extracting details: {e}")
        return details

async def run_agent():
    mode = "Headless" if IS_HEADLESS else "Visual"
    print(f"[{datetime.now()}] Starting Local Agent ({mode} Mode)...")
    if not os.path.exists(DEBUG_DIR): os.makedirs(DEBUG_DIR)
    
    # Ensure profile dir exists
    if not os.path.exists(USER_DATA_DIR):
        os.makedirs(USER_DATA_DIR)

    history = await load_history()
    
    async with async_playwright() as p:
        
        launch_args = {
            "headless": IS_HEADLESS,
            "args": [
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-web-security',
                '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            ]
        }
        
        if not IS_HEADLESS:
            launch_args["args"].extend([
                f'--window-size={WINDOW_WIDTH},{WINDOW_HEIGHT}',
                f'--window-position={WINDOW_X},{WINDOW_Y}'
            ])

        # NEW: launch_persistent_context saves cookies/cache to disk!
        context = await p.chromium.launch_persistent_context(
            user_data_dir=USER_DATA_DIR,
            **launch_args,
            viewport=None
        )
        
        # In persistent mode, the context already has one page
        page = context.pages[0]
        
        await context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined});")

        try:
            print(f"Visiting Hub: {TARGET_URL}...")
            await page.goto(TARGET_URL, wait_until="domcontentloaded")
            await ensure_page_loaded(page)
            await page.wait_for_timeout(3000)

            listings = await extract_listings_from_map_data(page)
            print(f"Found {len(listings)} active listings.")

            for item in listings:
                listing_id = item['mlsid']
                print(f"Processing listing: {listing_id} - {item['address']}")

                try:
                    await page.wait_for_timeout(random.randint(1500, 3000))

                    # Navigate Main Tab
                    await page.goto(item['url'], wait_until="domcontentloaded")
                    
                    await ensure_page_loaded(page)
                    await human_like_interaction(page)

                    item['detail_url'] = page.url 
                    
                    await handle_lead_capture_modal(page)
                    await page.wait_for_timeout(1000)
                    
                    detailed_data = await extract_page_details(page)
                    item.update(detailed_data)
                    
                    trigger_existing_workflow(item)
                    
                    item['date_found'] = str(datetime.now())
                    history[listing_id] = item

                except Exception as e:
                    print(f"Failed to process listing: {e}")

            # --- COMPLETION TASKS ---
            
            webhook_response = send_to_webhook(history)
            
            if webhook_response:
                history["_webhook_summary"] = webhook_response
            
            await save_history(history)
            archive_and_clean()
            
            print("Run complete.")
            return history

        except Exception as e:
            print(f"Global error: {e}")
            return []
        finally:
            await asyncio.sleep(2) 
            await context.close() # Close context instead of browser

if __name__ == "__main__":
    asyncio.run(run_agent())