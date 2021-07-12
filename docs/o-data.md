# Data

## Best options data for extreme rainfall monitoring

Currently there are 2 data that are suitable for monitoring and forecasting.

### Rainfall monitoring (near real-time)

**NASA GPM** (Global Precipitation Measurement - [http://pmm.nasa.gov/GPM/](http://pmm.nasa.gov/GPM/)) IMERG (Integrated Multi-satellite Retrievals for GPM) products.

**IMERG Version 06 Data**

1. IMERG is a single integrated code system for near-real and post-real time.
2. IMERG is adjusted to Gprecip monthly climatology zonally to achieve a bias profile that is considered reasonable.
3. Multiple runs for different user requirements for latency and accuracy

	1. “Early” – 4 hour (example application: flash flooding)
	2. “Late” – 14 hour. (crop forecasting)
	3. “Final” – 3 months (research)

4. TEMPORAL COVERAGE: from 1 Jun 2000 to nowadays
5. TEMPORAL RESOLUTION: 30 minutes, daily and monthly (final only)
6. SPATIAL COVERAGE: 60° N – 60° S
7. SPATIAL RESOLUTION: 0,1° x 0,1°
8. VARIABLE: precipitationCal
9. FORMAT: netCDF (nc4), Reference: [https://www.unidata.ucar.edu/software/netcdf/](https://www.unidata.ucar.edu/software/netcdf/) 
10. NAMING CONVENTION:

	1. Half-hourly - GPM_3IMERGHH 06
	2. Daily - GPM_3IMERGD 06
	3. Monthly - GPM_3IMERGM 06

	Latency:

	1. E - Early run
	2. L - Late run
	3. F - Final run (only for daily data) 

	Example: Half-hourly Early Run ~ GPM_3IMERGHHE 06

11. DOWNLOAD:

	1. 30-min Final Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHH.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHH.06/) 
	2. 30-min Early Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHE.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHE.06/)
	3. 30-min Late Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHL.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHL.06/) 
	4. Daily Final Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/) 
	5. Daily Early Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDE.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDE.06/) 
	6. Daily Late Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDL.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDL.06/) 

12. HOW-TO-DOWNLOAD AND AUTHORIZATION

	1. Link [https://disc.gsfc.nasa.gov/data-access](https://disc.gsfc.nasa.gov/data-access) 


### Rainfall forecasting

**NOAA - NCEP GEFS** (Global Ensemble Forecast System - [https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-ensemble-forecast-system-gefs](https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-ensemble-forecast-system-gefs)) deterministic weather prediction model.

**GEFS Ensemble 0.25 deg**

1. The Global Ensemble Forecast System (GEFS) is a weather forecast model produced by the National Centers for Environmental Prediction (NCEP). 
2. The GEFS dataset consists of selected model outputs as gridded forecast variables. The 384-hour forecasts, with 3-hour forecast interval, are made at 6-hour temporal resolution (i.e. updated four times daily).
3. TEMPORAL COVERAGE: from 15 Jan 2015 to nowadays (new version of GFS)
4. TEMPORAL RESOLUTION: 3h, 6h, 12h, 18h, 24h upto 16 days
5. SPATIAL COVERAGE: 90° N – 90° S
6. SPATIAL RESOLUTION: 0,25° x 0,25°
7. VARIABLE: Total Precipitation (APCP), Reference: [https://www.nco.ncep.noaa.gov/pmb/products/gens/gespr.t00z.pgrb2s.0p25.f003.shtml](https://www.nco.ncep.noaa.gov/pmb/products/gens/gespr.t00z.pgrb2s.0p25.f003.shtml)
8. FORMAT: GRIB2 (grib2), Reference: [https://wmoomm.sharepoint.com/:b:/s/wmocpdb/EUmnLNAM9WdMr1S7GRMl_G8BFqp-B1Qie-k-vMwmrG22GQ?e=cEd2Vk](https://wmoomm.sharepoint.com/:b:/s/wmocpdb/EUmnLNAM9WdMr1S7GRMl_G8BFqp-B1Qie-k-vMwmrG22GQ?e=cEd2Vk) 
9. DATA ACCESS

	1. AWS: `aws s3 ls s3://noaa-gefs-pds/ --no-sign-request`
	2. Reference: [https://registry.opendata.aws/noaa-gefs/](https://registry.opendata.aws/noaa-gefs/) 
	3. GRIB Filter: [https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?](https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?)
