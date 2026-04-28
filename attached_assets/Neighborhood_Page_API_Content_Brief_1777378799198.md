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

