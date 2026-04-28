# **Neighborhood Page Content Brief: \[NEIGHBORHOOD NAME\]**

**Target**: Capturing "neighborhood \+ homes for sale" and "neighborhood \+ demographics" search intent.

## **1\. Hero & High-Level Positioning**

* **Hero Text**: "\[Neighborhood Name\]" \+ "\[Town Name\], Delaware"  
* **Tagline**: A community-specific hook (e.g., "Middletown’s Premier Master-Planned Community").  
* **The Hook**: 2-3 sentences on the unique value proposition (e.g., "Known for its resort-style pool and direct trail access").

## ---

**2\. The "Community DNA" (Expertise & Trust)**

* **Authority Stats Bar (API Driven)**:  
  * **Housing Stability**: % of Owner-Occupied Homes  
    * **API Source**: US Census Bureau **ACS 5-Year Estimates** (Table B25003).  
  * **Development Character**: Median Year Structure Built  
    * **API Source**: US Census Bureau **ACS 5-Year Estimates** (Table B25035).  
  * **Market Momentum**: Median Days on Market or Active Listings Change  
    * **API Source**: **Realtor.com Monthly Housing Market Trends API**.  
  * **Economic Context**: Median Household Income  
    * **API Source**: US Census Bureau **ACS 5-Year Estimates** (Table B19013).

## ---

**3\. Schools & Commute (Hyper-Local Authority)**

* **Direct School Pathway**: Specify the *exact* feeder schools for this neighborhood.  
* **Commuter Dynamics**: Show where residents actually work.  
  * **API Source**: **Census LEHD Origin-Destination Employment Statistics (LODES)**.  
  * **Data Hook**: "Approximately 18% of residents in this tract commute to Wilmington for professional services".

## ---

**4\. Infographic Content: "The \[Neighborhood\] Snapshot"**

Use these specific datasets to build comparison charts.

* **The "Age Gap"**: Compare the neighborhood’s age demographic vs. the town average.  
  * **API Variable**: B01001 (Sex by Age).  
* **Housing Inventory Evolution**: Show when the neighborhood was built compared to the rest of Middletown.  
  * **API Variable**: B25034 (Year Structure Built).  
* **Proximity Map**: Use **Delaware Open Data Portal** APIs to map local building permits or nearby park facilities.

## ---

**5\. HOA & Resource Vault**

* **Transparency**: List current HOA fees and amenities.  
* **Local Governance**: Provide links to specific neighborhood-level permits or zoning maps.  
  * **Source**: **Delaware Open Data Portal**.

## ---

**6\. Technical SEO & API Implementation**

* **Schema.org**: Use RealEstateListing and Place markup.  
* **Discovery Tool**: Use the **Census Data API Discovery Tool** to find exact variable IDs for 2024–2026 data as they are released.  
* **Data Latency**: Set your CRON job to refresh **ACS 5-Year Data** every January (new releases occur annually around this time).

### ---

**API Reference Table for Devs**

| Signal | API Endpoint / Source | Best For |
| :---- | :---- | :---- |
| **Demographics** | api.census.gov/data/2024/acs/acs5 | Household income, age, education. |
| **Housing** | api.census.gov/data/2024/acs/acs5 | Owner-occupancy, home age, heating source. |
| **Workplace** | lehd.ces.census.gov/data/lodes | Employment hubs and commute patterns. |
| **Market Data** | realtor.com/research/api | Real-time pricing, inventory, and "hotness". |
| **State Permits** | data.delaware.gov | Local infrastructure and development permits. |

## **7\. SEO / AEO Schema & Structured Data Instructions**

To maximize authority signals for AI-driven search, implement the following JSON-LD scripts on each neighborhood page.

### **A. The "Place" & "RealEstateListing" Schema**

This identifies the specific geographic boundary of your expertise.

* **Action**: Use Place schema to define the neighborhood and containsPlace to link it to Middletown.  
* **API Connection**: Use the **Census Bureau's TIGER/Line API** to fetch the exact GeoJSON coordinates for the Census Tract or Block Group.  
* **AEO Benefit**: This allows AI engines to "map" your content to a precise location, increasing its relevance for hyper-local queries.

### **B. The "Dataset" & "Observation" Schema (Authority Signal)**

Since you are using Census API data, you must "claim" the dataset to show expertise.

* **Type**: Dataset  
* **Properties**:  
  * name: "Demographic and Housing Profile for \[Neighborhood Name\]".  
  * creator: "US Census Bureau" (link to https://www.census.gov).  
  * variableMeasured: List your API pulls (e.g., "Median Household Income", "Homeownership Rate").  
  * citation: Include the specific ACS 5-Year Estimate table ID (e.g., B25035).

### **C. The "RealEstateAgent" & "Expertise" Schema**

Connect Kevin directly to the neighborhood data to build **E-E-A-T**.

* **Type**: RealEstateAgent.  
* **Property**: knowsAbout.  
* **Value**: Link this property to the Place schema of the neighborhood.  
* **AEO Benefit**: Tells AI engines: "Kevin Hensley is a Subject Matter Expert (SME) on the specific economic and housing data of \[Neighborhood Name\]".

---

## **Technical Reference Table for AEO**

| Schema Type | API Variable Link | AI Signal |
| :---- | :---- | :---- |
| **StatisticalPopulation** | B01001 (Age/Sex) | Defines the "Who" for AI demographic profiling. |
| **Accommodation** | B25034 (Year Built) | Defines the "What" regarding housing stock quality. |
| **MonetaryAmount** | B19013 (Income) | Provides economic context for "Affordability" queries. |
| **CommuteTime** | B08301 (Transport) | Feeds AI "Lifestyle" and "Work-Life" intent. |

### **Implementation Note for Devs**

Ensure all JSON-LD is injected into the \<head\> and that the id attributes are used to create a "Web of Data." For example, the RealEstateAgent schema should reference the Dataset schema via the subjectOf property to prove the agent's expertise is based on the provided data.

