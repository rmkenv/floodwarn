# USGS Gauge APIs and U.S. Flood-Prone Areas Research Report

## Executive Summary

This research report provides comprehensive documentation of USGS river and tidal gauge APIs, along with identification of the top 10 most flood-prone and populated metropolitan areas in the United States. This information is essential for developing an effective flood warning application.

## USGS River Gauge API Documentation

### API Architecture
USGS provides water data through two API families:
- **Modern OGC-compliant REST endpoints** (recommended for new applications)
- **Legacy Water Services** (still supported but transitioning)

### Modern OGC-API Endpoints

**Base URL:** `https://api.waterdata.usgs.gov/ogcapi/v0/collections/`

#### Key Endpoints:
1. **Instantaneous Values:** `/instantaneous-values/items`
   - Real-time gauge measurements
   - Returns current water levels, discharge rates, etc.

2. **Daily Values:** `/daily/items` 
   - Daily aggregated data (mean, max, min)
   - Historical daily summaries

3. **Monitoring Locations:** `/monitoring-locations/items`
   - Station metadata and geographic information

#### Example Request:
```bash
curl -H "X-Api-Key: YOUR_KEY" \
  "https://api.waterdata.usgs.gov/ogcapi/v0/collections/instantaneous-values/items?station=USGS-01646500&datetime=now&limit=1"
```

### Legacy Water Services Endpoints

**Base URL:** `https://waterservices.usgs.gov/nwis/`

#### Key Endpoints:
1. **Instantaneous Values:** `/iv/`
2. **Daily Values:** `/dv/`
3. **Site Metadata:** `/site/`

### Data Formats
- **JSON** (recommended for applications)
- **RDB** (tab-delimited format)
- **GeoJSON** (for modern OGC endpoints)
- **WaterML** (XML-based legacy format)

## USGS Tidal Gauge API Documentation

### Important Note
USGS tidal gauge data uses the **same API infrastructure** as river gauges. Both river and tidal measurements are accessed through identical endpoints.

### Key Parameter Codes for Tidal Data:
- **Water Level (Gage Height):** Parameter Code `00065`
- **Water Temperature:** Parameter Code `00010`

### Tidal-Specific Considerations:
- Tidal gauges report water level measurements in feet
- Data includes both automated and manual measurements
- Coastal stations often provide both tidal and meteorological data

## Authentication Requirements

### API Key Registration
- **Free registration:** https://api.data.gov/signup/
- Required for higher rate limits and reliable access

### Authentication Methods:
1. **Query Parameter:** `?api_key=YOUR_KEY`
2. **HTTP Header:** `X-Api-Key: YOUR_KEY` (recommended)

## Rate Limits

### Unauthenticated Requests:
- Very low default limits (approximately 50 requests/hour/IP)
- Subject to aggressive throttling

### Authenticated Requests:
- Substantially higher hourly quotas (1000+ requests/hour)
- Rate limit headers included in responses:
  - `X-RateLimit-Limit`: Total requests allowed in current window
  - `X-RateLimit-Remaining`: Remaining requests before throttling

### Practical Recommendations:
- Always use API keys for production applications
- Monitor rate limit headers to avoid HTTP 429 errors
- Implement exponential backoff for failed requests

## Top 10 Most Flood-Prone and Populated U.S. Metropolitan Areas

Based on FEMA's National Risk Index (NRI) combined with population data:

### 1. New York–Newark–Jersey City, NY–NJ–PA
- **Population:** ~19.2 million (2023)
- **Flood Risk Factors:** Coastal storm surge, aging infrastructure, dense shoreline development
- **Priority Level:** Critical

### 2. Los Angeles–Long Beach–Anaheim, CA
- **Population:** ~13.2 million (2023)
- **Flood Risk Factors:** Urban river flooding, floodplain development, atmospheric river events
- **Priority Level:** Critical

### 3. Chicago–Naperville–Elgin, IL–IN–WI
- **Population:** ~9.5 million (2023)
- **Flood Risk Factors:** Chicago and Des Plaines river flooding, combined-sewer overflows
- **Priority Level:** High

### 4. Houston–The Woodlands–Sugar Land, TX
- **Population:** ~7.1 million (2023)
- **Flood Risk Factors:** Flat topography, extreme rainfall events, rapid urbanization
- **Priority Level:** High

### 5. Miami–Fort Lauderdale–West Palm Beach, FL
- **Population:** ~6.3 million (2023)
- **Flood Risk Factors:** Coastal storm surge, sunny day tidal flooding, sea level rise
- **Priority Level:** High

### 6. Washington–Arlington–Alexandria, DC–VA–MD–WV
- **Population:** ~6.5 million (2023)
- **Flood Risk Factors:** Potomac River flooding, combined sewer systems, stormwater runoff
- **Priority Level:** High

### 7. Philadelphia–Camden–Wilmington, PA–NJ–DE–MD
- **Population:** ~6.1 million (2023)
- **Flood Risk Factors:** Schuylkill and Delaware river flooding, combined-sewer overflow zones
- **Priority Level:** Medium-High

### 8. Boston–Cambridge–Newton, MA–NH
- **Population:** ~4.9 million (2023)
- **Flood Risk Factors:** Coastal storm surge, tidal flooding, development on filled land
- **Priority Level:** Medium-High

### 9. San Francisco–Oakland–Hayward, CA
- **Population:** ~4.7 million (2023)
- **Flood Risk Factors:** Sea level rise, king tides, atmospheric rivers, aging infrastructure
- **Priority Level:** Medium-High

### 10. New Orleans–Metairie, LA
- **Population:** ~1.3 million (2023)
- **Flood Risk Factors:** Below-sea-level elevation, hurricane storm surge, levee system dependency
- **Priority Level:** Critical (despite smaller population due to extreme vulnerability)

## Recommendations for Flood Warning Application

### API Implementation Strategy:
1. **Use Modern OGC Endpoints:** Implement the newer API for better performance and future-proofing
2. **Implement Robust Authentication:** Always use API keys to ensure reliable access
3. **Monitor Rate Limits:** Build rate limit monitoring into your application architecture
4. **Graceful Degradation:** Implement fallback to legacy endpoints if modern APIs are unavailable

### Geographic Coverage Priority:
1. **Phase 1:** Focus on the top 5 metropolitan areas (NYC, LA, Chicago, Houston, Miami)
2. **Phase 2:** Expand to remaining top 10 areas
3. **Phase 3:** Consider additional regional coverage based on user demand

### Data Integration Considerations:
- Combine river gauge data with tidal gauge data for comprehensive coastal coverage
- Integrate FEMA flood zone data for context
- Consider weather service integration for precipitation forecasts
- Implement historical data analysis for trend identification

## Technical Resources

### Official Documentation:
- **Modern API Docs:** https://api.waterdata.usgs.gov/docs/
- **Legacy API Docs:** https://waterservices.usgs.gov/docs/index.html
- **FEMA National Risk Index:** https://www.fema.gov/flood-maps/products-tools/national-risk-index

### API Registration:
- **Get API Key:** https://api.data.gov/signup/

---

*Report compiled on July 25, 2025*
*Sources: USGS Water Data APIs, FEMA National Risk Index, U.S. Census Bureau*
