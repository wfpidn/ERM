# Frequently Asked Question

**What is ERM?**
: ERM is an experimental tool developed by the United Nations [World Food Programme](https://www.wfp.org/countries/indonesia) in Indonesia written in [Google Earth Engine](https://earthengine.google.com) (GEE) platform to monitor extreme rainfall that could trigger a flood, and the impact to population and cropland.
: ERM module is part of [PRISM](http://prism-dev.wfp.or.id:3001) hazard features, a platform developed by WFP to support adaptive social protection in Indonesia.

**What is the main input for ERM?**
: GPM IMERG for near real-time rainfall monitoring and NOAA GFS for rainfall forecast.
: JRC Global Surface Water to develop historical flood occurrence data by months.
: JRC Global Human Settlement Layer for calculating population affected.
: MODIS Annual Land Cover for calculating cropland affected.

**What makes ERM unique compared to the competitors?**
: ERM has a simple output (yes or no / flood or no flood).
: Analysis of critical rainfall (threshold) is conducted by pixels by months, in area with spatial resolution 0.1deg x 0.1deg ~ 10km x 10km.

**What can ERM do?**
: ERM are able to inform where is the estimated location of extreme rainfall and its impact to population and crop in the last 5-days and forecast up to 5-days ahead based on selected date.
: Rainfall with extreme categories are well detected through ERM.

**What is ERM limitation:**
: ERM is an experimental application, sometimes the results are accurate (flood detected) and sometimes inaccurate (flood undetected). Sorry about that!
: Many factors cause the results to be inaccurate, one of them is the rainfall forecast data quality. Other factor is below.

**What ERM can not do?**
: ERM only able monitor or predict flood caused by extreme rainfall in a location where extreme rainfall occurred. And unable to calculate flood caused by runoff accumulation from other areas.

**Is ERM mobile friendly?**
: No, ERM not omptimised for mobile devices. Please use your computer or laptop to access it.

**What is ERM future plan?**
: See development plan in the left sidebar.