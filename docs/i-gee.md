# Google Earth Engine

Below is the example on how we translate all the process in GEE platform.

First we need to declare the global variable like basemap and color codes. As the ERM result is colorful, it's better to use Grey Style basemap so the map result will clearly visible.

ERM will produce 4 outputs:

- Rainfall
- Rainfall exceeding the threshold
- Likelihood of triggering flood
- Extreme rainfall triggering a flood (Flood Alert)

And each output will visualize with different classification.

```js
// GLOBAL VARIABLE (Basemap and color)
//---
// Grey basemap from gena
var MapStyle = require('users/gena/packages:style');
MapStyle.SetMapStyleGrey();

// SYMBOLOGY
// Visualization palette, Color-codes based on Color-Brewer https://colorbrewer2.org/
// Standard symbology for rainfall
var visRainfall = {min: 1, max: 100, opacity: 1, palette: [
    'cccccc','f9f3d5','dce2a8','a8c58d','77a87d','ace8f8',
    '4cafd9','1d5ede','001bc0','9131f1','e983f3','f6c7ec'
  ]};
// Standard symbology for rainfall exceeding the threshold
var visExtreme = {min: 1, max: 4, opacity: 1, palette: [
  'ffffcc', 'a1dab4', '41b6c4', '225ea8'
  ]};
// Standard symbology for likelihood of flooding
var visLikelihood = {min: 1, max: 3, opacity: 1, palette: [
  'f7fcb9','addd8e','31a354'
  ]};
// Standard symbology for extreme rainfall triggering flood alert class
var visFlood = {min: 0, max: 9, opacity: 1, palette: [
  '97D700','FFEDA0','FFEDA0','FFEDA0','FEB24C','FEB24C',
  'FEB24C','F03B20','F03B20','F03B20'
  ]};
 
```

ERM required some of input (threshold, slope and intercept layer) that already prepared via different platform: ArcGIS Pro, R Statistics, and Excel. All the layer uploaded as GEE assets.

```js
// Import threshold by pixel that exceeding the Percentile 50, 80, 90 and 96 of rainfall based on 1-day, 2-day,
// 3-day, 4-day and 5-days of annual maximum rainfall from 1981 - 2019
//
// Link to assets https://code.earthengine.google.com/?asset=users/bennyistanto/datasets/raster/extremerainfall/threshold/
// Threshold data for 1-day rainfall accumulation scenario
var Day1_P50 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_1day_precipthreshold_q0500_2yr_imerg_wfp");
var Day1_P80 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_1day_precipthreshold_q0800_5yr_imerg_wfp");
var Day1_P90 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_1day_precipthreshold_q0900_10yr_imerg_wfp");
var Day1_P96 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_1day_precipthreshold_q0960_25yr_imerg_wfp");

// Threshold data 2-day rainfall accumulation scenario
var Day2_P50 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_2day_precipthreshold_q0500_2yr_imerg_wfp");
var Day2_P80 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_2day_precipthreshold_q0800_5yr_imerg_wfp");
var Day2_P90 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_2day_precipthreshold_q0900_10yr_imerg_wfp");
var Day2_P96 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_2day_precipthreshold_q0960_25yr_imerg_wfp");

// Threshold data 3-day rainfall accumulation scenario
var Day3_P50 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_3day_precipthreshold_q0500_2yr_imerg_wfp");
var Day3_P80 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_3day_precipthreshold_q0800_5yr_imerg_wfp");
var Day3_P90 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_3day_precipthreshold_q0900_10yr_imerg_wfp");
var Day3_P96 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_3day_precipthreshold_q0960_25yr_imerg_wfp");

// Threshold data 4-day rainfall accumulation scenario
var Day4_P50 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_4day_precipthreshold_q0500_2yr_imerg_wfp");
var Day4_P80 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_4day_precipthreshold_q0800_5yr_imerg_wfp");
var Day4_P90 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_4day_precipthreshold_q0900_10yr_imerg_wfp");
var Day4_P96 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_4day_precipthreshold_q0960_25yr_imerg_wfp");

// Threshold data 5-day rainfall accumulation scenario
var Day5_P50 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_5day_precipthreshold_q0500_2yr_imerg_wfp");
var Day5_P80 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_5day_precipthreshold_q0800_5yr_imerg_wfp");
var Day5_P90 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_5day_precipthreshold_q0900_10yr_imerg_wfp");
var Day5_P96 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_5day_precipthreshold_q0960_25yr_imerg_wfp");


// Import Slope and Intercept for calculating probability based on focal linear regression between rainfall and historical 
// flood occurrence. Focal (linear) regression between every 5x5 pixels group of cells of two rasters was done using R.
//
// Link to assets https://code.earthengine.google.com/?asset=users/bennyistanto/datasets/raster/extremerainfall/slope
// Slope data for 1-day rainfall accumulation scenario
var Slope_Day1_1 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_01_jan_slope_imerg");
var Slope_Day1_2 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_02_feb_slope_imerg");
var Slope_Day1_3 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_03_mar_slope_imerg");
var Slope_Day1_4 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_04_apr_slope_imerg");
var Slope_Day1_5 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_05_may_slope_imerg");
var Slope_Day1_6 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_06_jun_slope_imerg");
var Slope_Day1_7 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_07_jul_slope_imerg");
var Slope_Day1_8 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_08_aug_slope_imerg");
var Slope_Day1_9 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_09_sep_slope_imerg");
var Slope_Day1_10 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_10_oct_slope_imerg");
var Slope_Day1_11 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_11_nov_slope_imerg");
var Slope_Day1_12 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day1_12_dec_slope_imerg");

// Slope data for 2-days rainfall accumulation scenario
var Slope_Day2_1 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_01_jan_slope_imerg");
var Slope_Day2_2 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_02_feb_slope_imerg");
var Slope_Day2_3 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_03_mar_slope_imerg");
var Slope_Day2_4 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_04_apr_slope_imerg");
var Slope_Day2_5 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_05_may_slope_imerg");
var Slope_Day2_6 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_06_jun_slope_imerg");
var Slope_Day2_7 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_07_jul_slope_imerg");
var Slope_Day2_8 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_08_aug_slope_imerg");
var Slope_Day2_9 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_09_sep_slope_imerg");
var Slope_Day2_10 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_10_oct_slope_imerg");
var Slope_Day2_11 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_11_nov_slope_imerg");
var Slope_Day2_12 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day2_12_dec_slope_imerg");

// Slope data for 3-days rainfall accumulation scenario
var Slope_Day3_1 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_01_jan_slope_imerg");
var Slope_Day3_2 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_02_feb_slope_imerg");
var Slope_Day3_3 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_03_mar_slope_imerg");
var Slope_Day3_4 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_04_apr_slope_imerg");
var Slope_Day3_5 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_05_may_slope_imerg");
var Slope_Day3_6 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_06_jun_slope_imerg");
var Slope_Day3_7 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_07_jul_slope_imerg");
var Slope_Day3_8 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_08_aug_slope_imerg");
var Slope_Day3_9 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_09_sep_slope_imerg");
var Slope_Day3_10 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_10_oct_slope_imerg");
var Slope_Day3_11 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_11_nov_slope_imerg");
var Slope_Day3_12 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day3_12_dec_slope_imerg");

// Slope data for 4-days rainfall accumulation scenario
var Slope_Day4_1 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_01_jan_slope_imerg");
var Slope_Day4_2 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_02_feb_slope_imerg");
var Slope_Day4_3 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_03_mar_slope_imerg");
var Slope_Day4_4 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_04_apr_slope_imerg");
var Slope_Day4_5 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_05_may_slope_imerg");
var Slope_Day4_6 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_06_jun_slope_imerg");
var Slope_Day4_7 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_07_jul_slope_imerg");
var Slope_Day4_8 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_08_aug_slope_imerg");
var Slope_Day4_9 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_09_sep_slope_imerg");
var Slope_Day4_10 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_10_oct_slope_imerg");
var Slope_Day4_11 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_11_nov_slope_imerg");
var Slope_Day4_12 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day4_12_dec_slope_imerg");

// Slope data for 5-days rainfall accumulation scenario
var Slope_Day5_1 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_01_jan_slope_imerg");
var Slope_Day5_2 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_02_feb_slope_imerg");
var Slope_Day5_3 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_03_mar_slope_imerg");
var Slope_Day5_4 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_04_apr_slope_imerg");
var Slope_Day5_5 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_05_may_slope_imerg");
var Slope_Day5_6 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_06_jun_slope_imerg");
var Slope_Day5_7 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_07_jul_slope_imerg");
var Slope_Day5_8 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_08_aug_slope_imerg");
var Slope_Day5_9 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_09_sep_slope_imerg");
var Slope_Day5_10 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_10_oct_slope_imerg");
var Slope_Day5_11 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_11_nov_slope_imerg");
var Slope_Day5_12 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day5_12_dec_slope_imerg");

// Link to assets https://code.earthengine.google.com/?asset=users/bennyistanto/datasets/raster/extremerainfall/intercept
// Intercept data for 1-day rainfall accumulation scenario
var Intercept_Day1_1 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_01_jan_intercept_imerg");
var Intercept_Day1_2 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_02_feb_intercept_imerg");
var Intercept_Day1_3 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_03_mar_intercept_imerg");
var Intercept_Day1_4 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_04_apr_intercept_imerg");
var Intercept_Day1_5 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_05_may_intercept_imerg");
var Intercept_Day1_6 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_06_jun_intercept_imerg");
var Intercept_Day1_7 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_07_jul_intercept_imerg");
var Intercept_Day1_8 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_08_aug_intercept_imerg");
var Intercept_Day1_9 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_09_sep_intercept_imerg");
var Intercept_Day1_10 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_10_oct_intercept_imerg");
var Intercept_Day1_11 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_11_nov_intercept_imerg");
var Intercept_Day1_12 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day1_12_dec_intercept_imerg");

// Intercept data for 2-days rainfall accumulation scenario
var Intercept_Day2_1 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_01_jan_intercept_imerg");
var Intercept_Day2_2 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_02_feb_intercept_imerg");
var Intercept_Day2_3 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_03_mar_intercept_imerg");
var Intercept_Day2_4 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_04_apr_intercept_imerg");
var Intercept_Day2_5 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_05_may_intercept_imerg");
var Intercept_Day2_6 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_06_jun_intercept_imerg");
var Intercept_Day2_7 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_07_jul_intercept_imerg");
var Intercept_Day2_8 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_08_aug_intercept_imerg");
var Intercept_Day2_9 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_09_sep_intercept_imerg");
var Intercept_Day2_10 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_10_oct_intercept_imerg");
var Intercept_Day2_11 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_11_nov_intercept_imerg");
var Intercept_Day2_12 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day2_12_dec_intercept_imerg");

// Intercept data for 3-days rainfall accumulation scenario
var Intercept_Day3_1 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_01_jan_intercept_imerg");
var Intercept_Day3_2 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_02_feb_intercept_imerg");
var Intercept_Day3_3 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_03_mar_intercept_imerg");
var Intercept_Day3_4 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_04_apr_intercept_imerg");
var Intercept_Day3_5 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_05_may_intercept_imerg");
var Intercept_Day3_6 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_06_jun_intercept_imerg");
var Intercept_Day3_7 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_07_jul_intercept_imerg");
var Intercept_Day3_8 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_08_aug_intercept_imerg");
var Intercept_Day3_9 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_09_sep_intercept_imerg");
var Intercept_Day3_10 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_10_oct_intercept_imerg");
var Intercept_Day3_11 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_11_nov_intercept_imerg");
var Intercept_Day3_12 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day3_12_dec_intercept_imerg");

// Intercept data for 4-days rainfall accumulation scenario
var Intercept_Day4_1 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_01_jan_intercept_imerg");
var Intercept_Day4_2 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_02_feb_intercept_imerg");
var Intercept_Day4_3 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_03_mar_intercept_imerg");
var Intercept_Day4_4 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_04_apr_intercept_imerg");
var Intercept_Day4_5 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_05_may_intercept_imerg");
var Intercept_Day4_6 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_06_jun_intercept_imerg");
var Intercept_Day4_7 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_07_jul_intercept_imerg");
var Intercept_Day4_8 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_08_aug_intercept_imerg");
var Intercept_Day4_9 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_09_sep_intercept_imerg");
var Intercept_Day4_10 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_10_oct_intercept_imerg");
var Intercept_Day4_11 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_11_nov_intercept_imerg");
var Intercept_Day4_12 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day4_12_dec_intercept_imerg");

// Intercept data for 5-days rainfall accumulation scenario
var Intercept_Day5_1 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_01_jan_intercept_imerg");
var Intercept_Day5_2 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_02_feb_intercept_imerg");
var Intercept_Day5_3 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_03_mar_intercept_imerg");
var Intercept_Day5_4 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_04_apr_intercept_imerg");
var Intercept_Day5_5 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_05_may_intercept_imerg");
var Intercept_Day5_6 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_06_jun_intercept_imerg");
var Intercept_Day5_7 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_07_jul_intercept_imerg");
var Intercept_Day5_8 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_08_aug_intercept_imerg");
var Intercept_Day5_9 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_09_sep_intercept_imerg");
var Intercept_Day5_10 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_10_oct_intercept_imerg");
var Intercept_Day5_11 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_11_nov_intercept_imerg");
var Intercept_Day5_12 = ee.Image("users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day5_12_dec_intercept_imerg");

```

All of the data required by ERM is available for global coverage, and the focus for ERM is only for Indonesia. Then we need to have a layer as a Masked for Indonesia. The file is available via assets: `users/bennyistanto/datasets/raster/extremerainfall/mask/idn_bnd_imerg_subset`

We will use Masked layer to clip all of the input data:

- IMERG, for near real-time monitoring
- GFS, for forecast simulation
- GHSL, for calculate affected population
- MODIS MCD12Q1, for calculate affected cropland and urban areas.


```js
// MAIN INPUT
//---
// Masking image
function maskImage(image) {
  var imergMask = ee.Image('users/bennyistanto/datasets/raster/extremerainfall/mask/idn_bnd_imerg_subset'); 
  return image.updateMask(imergMask);
}

// Near Real Time data
// Import NASA GPM IMERG 30 minute data and calculate accumulation for 1day.
var imerg = ee.ImageCollection("NASA/GPM_L3/IMERG_V06");
// Get IMERG projection information
var IMERGprojection = ee.Image(imerg.first()).projection();

// Forecast data
// Import GFS data - https://developers.google.com/earth-engine/datasets/catalog/NOAA_GFS0P25
var gfs = ee.ImageCollection('NOAA/GFS0P25');

// Population grid
// Import Global Human Settlement Popluation Density layer (GHSL) data. Resolution: 250. Number of people per cell is given.
// https://developers.google.com/earth-engine/datasets/catalog/JRC_GHSL_P2016_POP_GPW_GLOBE_V1#bands
var ghsl = ee.Image("JRC/GHSL/P2016/POP_GPW_GLOBE_V1").clip(maskImage);
// Get GHSL projection information
var GHSLprojection = ghsl.projection();

// MODIS Global Annual Land Cover 500m, filter image collection by the most up-to-date MODIS Land Cover product 
// Import Crop extent data - https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MCD12Q1#bands
var mcd12q1 = ee.ImageCollection('MODIS/006/MCD12Q1')
  .filterDate('2014-01-01','2019-01-01')
  .sort('system:index',false)
  .select("LC_Type1")
  .first();

```