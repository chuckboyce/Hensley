import asyncio
import json
import os
import shutil
from datetime import datetime
from playwright.async_api import async_playwright

# Configuration
TARGET_URL = "https://kevin-hensley.remax.com/index.php?showagent=1#rslt"
BASE_URL = "https://kevin-hensley.remax.com"
HISTORY_FILE = "listing_history.json"
DEBUG_DIR = "debug_output"
CHECK_INTERVAL_HOURS = 24 

# --- LOGIN CONFIGURATION ---
BOT_EMAIL = "automation_agent@example.com" 

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

def trigger_existing_workflow(listing_data):
    """Bridge to existing process."""
    pass 

async def extract_listings_from_map_data(page):
    try:
        await page.wait_for_selector("#map", state="attached", timeout=15000)
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
        return []

async def handle_lead_capture_modal(page):
    try:
        try:
             await page.wait_for_selector("input[type='email']", state="visible", timeout=3000)
        except:
             return 

        await page.fill("input[type='email']", BOT_EMAIL)
        
        checkboxes = await page.query_selector_all("input[type='checkbox']")
        for cb in checkboxes:
            if await cb.is_visible(): await cb.check()
                
        submit_btn = await page.query_selector("button[type='submit']")
        if not submit_btn:
            submit_btn = await page.query_selector("button:has-text('Continue')") or \
                         await page.query_selector("button:has-text('View')")
        
        if submit_btn:
            await submit_btn.click()
            await page.wait_for_selector("input[type='email']", state="hidden", timeout=5000)
    except Exception as e:
        pass

async def extract_page_details(page):
    details = {}
    try:
        photo_el = await page.query_selector(".gallery .gallery-item")
        if photo_el:
            src = await photo_el.get_attribute("data-src")
            if not src:
                src = await photo_el.get_attribute("src")
            if src:
                details["cover_photo_url"] = src
        else:
            details["cover_photo_url"] = ""

        attributes = await page.query_selector_all(".col-lg-5 .overview ul li")
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

        desc_el = await page.query_selector(".col-lg-7.overview p")
        if desc_el:
            details["description"] = (await desc_el.inner_text()).strip()
        else:
             details["description"] = ""

        return details
    except Exception:
        return {}

async def run_agent():
    if not os.path.exists(DEBUG_DIR): os.makedirs(DEBUG_DIR)

    history = await load_history()
    all_listings = []
    
    async with async_playwright() as p:
        executable_path = shutil.which("chromium")
        
        launch_args = {
            "headless": True,
            "args": ["--no-sandbox", "--disable-setuid-sandbox"]
        }
        
        if executable_path:
            launch_args["executable_path"] = executable_path
            
        browser = await p.chromium.launch(**launch_args)
        
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
        page = await context.new_page()

        try:
            await page.goto(TARGET_URL, wait_until="domcontentloaded")
            await page.wait_for_timeout(3000)

            listings = await extract_listings_from_map_data(page)

            for item in listings:
                listing_id = item['mlsid']
                
                try:
                    detail_page = await context.new_page()
                    await detail_page.goto(item['url'], wait_until="domcontentloaded")
                    
                    item['detail_url'] = detail_page.url 
                    
                    await handle_lead_capture_modal(detail_page)
                    detailed_data = await extract_page_details(detail_page)
                    item.update(detailed_data)
                    
                    await detail_page.close()
                    
                    item['date_scraped'] = str(datetime.now())
                    
                    is_new = listing_id not in history
                    item['is_new'] = is_new
                    
                    history[listing_id] = item
                    all_listings.append(item)

                except Exception as e:
                    item['error'] = str(e)
                    all_listings.append(item)

            await save_history(history)
            
            return all_listings

        except Exception as e:
            return {"error": str(e)}
        finally:
            await browser.close()

if __name__ == "__main__":
    all_items = asyncio.run(run_agent())
    print("__DATA_START__")
    print(json.dumps(all_items))
    print("__DATA_END__")
