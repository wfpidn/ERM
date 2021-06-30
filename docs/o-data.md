# Data

## Best options data for extreme rainfall monitoring

Currently there are 2 data that are suitable for monitoring and forecasting.

### Rainfall monitoring (near real-time)

**NASA GPM** (Global Precipitation Measurement - [http://pmm.nasa.gov/GPM/](http://pmm.nasa.gov/GPM/)) IMERG (Integrated Multi-satellite Retrievals for GPM) products.

**IMERG Version 06 Data**

- IMERG is a single integrated code system for near-real and post-real time.
- IMERG is adjusted to Gprecip monthly climatology zonally to achieve a bias profile that is considered reasonable.
- Multiple runs for different user requirements for latency and accuracy<br>
	- “Early” – 4 hour (example application: flash flooding)
	- “Late” – 14 hour. (crop forecasting)
	- “Final” – 3 months (research)

- TEMPORAL COVERAGE: from 1 Jun 2000 to nowadays
- TEMPORAL RESOLUTION: 30 minutes, daily and monthly (final only)
- SPATIAL COVERAGE: 60° N – 60° S
- SPATIAL RESOLUTION: 0,1° x 0,1°
- VARIABLE: precipitationCal
- FORMAT: netCDF (nc4), Reference: [https://www.unidata.ucar.edu/software/netcdf/](https://www.unidata.ucar.edu/software/netcdf/) 
- NAMING CONVENTION:<br>
	- Half-hourly - GPM_3IMERGHH 06
	- Daily - GPM_3IMERGD 06
	- Monthly - GPM_3IMERGM 06

	Latency:<br>
	- E - Early run
	- L - Late run
	- F - Final run (only for daily data) 

	Example: Half-hourly Early Run ~ GPM_3IMERGHHE 06

- DOWNLOAD:<br> 
	- 30-min Final Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHH.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHH.06/) 
	- 30-min Early Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHE.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHE.06/)
	- 30-min Late Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHL.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGHHL.06/) 
	- Daily Final Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDF.06/) 
	- Daily Early Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDE.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDE.06/) 
	- Daily Late Released [https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDL.06/](https://gpm1.gesdisc.eosdis.nasa.gov/data/GPM_L3/GPM_3IMERGDL.06/) 

- HOW-TO-DOWNLOAD AND AUTHORIZATION

	- Link [https://disc.gsfc.nasa.gov/data-access](https://disc.gsfc.nasa.gov/data-access) 


### Rainfall forecasting

**NOAA - NCEP GEFS** (Global Ensemble Forecast System - [https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-ensemble-forecast-system-gefs](https://www.ncdc.noaa.gov/data-access/model-data/model-datasets/global-ensemble-forecast-system-gefs)) deterministic weather prediction model.

**GEFS Ensemble 0.25 deg**

- The Global Ensemble Forecast System (GEFS) is a weather forecast model produced by the National Centers for Environmental Prediction (NCEP). 
- The GEFS dataset consists of selected model outputs as gridded forecast variables. The 384-hour forecasts, with 3-hour forecast interval, are made at 6-hour temporal resolution (i.e. updated four times daily).
- TEMPORAL COVERAGE: from 15 Jan 2015 to nowadays (new version of GFS)
- TEMPORAL RESOLUTION: 3h, 6h, 12h, 18h, 24h upto 16 days
- SPATIAL COVERAGE: 90° N – 90° S
- SPATIAL RESOLUTION: 0,25° x 0,25°
- VARIABLE: Total Precipitation (APCP), Reference: [https://www.nco.ncep.noaa.gov/pmb/products/gens/gespr.t00z.pgrb2s.0p25.f003.shtml](https://www.nco.ncep.noaa.gov/pmb/products/gens/gespr.t00z.pgrb2s.0p25.f003.shtml)
- FORMAT: GRIB2 (grib2), Reference: [https://wmoomm.sharepoint.com/:b:/s/wmocpdb/EUmnLNAM9WdMr1S7GRMl_G8BFqp-B1Qie-k-vMwmrG22GQ?e=cEd2Vk](https://wmoomm.sharepoint.com/:b:/s/wmocpdb/EUmnLNAM9WdMr1S7GRMl_G8BFqp-B1Qie-k-vMwmrG22GQ?e=cEd2Vk) 
- DATA ACCESS<br>
	- AWS: `aws s3 ls s3://noaa-gefs-pds/ --no-sign-request`
	- Reference: [https://registry.opendata.aws/noaa-gefs/](https://registry.opendata.aws/noaa-gefs/) 
	- GRIB Filter: [https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?](https://nomads.ncep.noaa.gov/cgi-bin/filter_gefs_atmos_0p25s.pl?)
