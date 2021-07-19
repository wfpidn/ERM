# Google Earth Engine

Below is the example on how we translate all the process in GEE platform.

## Global variable

First we need to declare the global variable like basemap and color codes. As the ERM result is colorful, it's better to use Grey Style basemap so the map result will clearly visible.

ERM will produce 5 outputs:

- Rainfall
- Rainfall exceeding the threshold
- Likelihood of triggering flood
- Extreme rainfall triggering a flood (Flood Alert)
- Number of affected population per alert category

And each output will visualize with different classification.

``` js
// GLOBAL VARIABLE (Basemap, Color, Static Data, Mask and others)
//---
// ui Map and Panel configuration
var mainMap = ui.Map();
var uiComponents = {};

// MAP STYLE
//--
// Grey style from Gennadii
function mapStyle() {
  return [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161",
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5",
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ];
}


// Grey basemap from gena
mainMap.style().set('cursor', 'crosshair');
mainMap.setOptions('Grey', {Grey: mapStyle()});

// SYMBOLOGY
// Visualization palette, Color-codes based on Color-Brewer https://colorbrewer2.org/
// Standard symbology for rainfall
var visRainfall = {min: 1, max: 100, opacity: 1, palette: [
    'cccccc','f9f3d5','dce2a8','a8c58d','77a87d','ace8f8',
    '4cafd9','1d5ede','001bc0','9131f1','e983f3','f6c7ec'
  ]};
// Standard symbology for extreme rainfall class
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
// Standard symbology for population exposed
var visPopulation = {min: 0, max: 50.0, opacity:1, 
  palette: ['yellow', 'orange', 'red'],
  };

// Define an SLD style of discrete intervals to apply to the image.
// Notes: SLD visualisation will make the data rendered as RGB during point inspector into a pixel.
var visRainfallSLD =
  '<RasterSymbolizer>' +
    '<ColorMap  type="ramp" extended="false" >' +
      '<ColorMapEntry color="#ffffff" opacity="0.0" quantity="1" label="No Rain" />' +
      '<ColorMapEntry color="#cccccc" opacity="1.0" quantity="3" label="1-3" />' +
      '<ColorMapEntry color="#f9f3d5" opacity="1.0" quantity="10" label="4-10" />' +
      '<ColorMapEntry color="#dce2a8" opacity="1.0" quantity="20" label="11-20" />' +
      '<ColorMapEntry color="#a8c58d" opacity="1.0" quantity="30" label="21-30" />' +
      '<ColorMapEntry color="#77a87d" opacity="1.0" quantity="40" label="31-40" />' +
      '<ColorMapEntry color="#ace8f8" opacity="1.0" quantity="60" label="41-60" />' +
      '<ColorMapEntry color="#4cafd9" opacity="1.0" quantity="80" label="61-80" />' +
      '<ColorMapEntry color="#1d5ede" opacity="1.0" quantity="100" label="81-100" />' +
      '<ColorMapEntry color="#001bc0" opacity="1.0" quantity="120" label="101-120" />' +
      '<ColorMapEntry color="#9131f1" opacity="1.0" quantity="150" label="121-150" />' +
      '<ColorMapEntry color="#e983f3" opacity="1.0" quantity="200" label="151-200" />' +
      '<ColorMapEntry color="#f6c7ec" opacity="1.0" quantity="1000" label="&gt; 200" />' +
    '</ColorMap>' +
  '</RasterSymbolizer>'; 
  
 
```

## Main input

All of the data required by ERM is available for global coverage, and the focus for ERM is only for Indonesia. Then we need to have a layer as a Masked for Indonesia. The file is available via assets: `users/bennyistanto/datasets/raster/extremerainfall/mask/idn_bnd_imerg_subset`

We will use Masked layer to clip all of the main input data:

- IMERG, for near real-time monitoring
- GFS, for forecast simulation
- GHSL, for calculate affected population
- MODIS MCD12Q1, for calculate affected cropland and urban areas.

Currently ERM use GHSL population data to calculate the affected population due to flood. There is a plan to extend the analysis using Facebook HRSL data, so we can get breakdown affected population by age, the we could get number of vulnerable population.

``` js
// MAIN INPUT
//---
// Masking image
function maskImage(image) {
  var imergMask = ee.Image('users/bennyistanto/datasets/raster/extremerainfall/mask/idn_bnd_imerg_subset'); 
  return image.updateMask(imergMask);
}
var idnMask = ee.Image('users/bennyistanto/datasets/raster/extremerainfall/mask/idn_bnd_imerg_subset');
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
var ghsl_raw = maskImage(ee.Image(ee.ImageCollection("JRC/GHSL/P2016/POP_GPW_GLOBE_V1").first()).select('population_count'));
var ghsl = ghsl_raw.updateMask(ghsl_raw.gt(0));
// Get GHSL projection information
var GHSLprojection = ghsl.projection();

// Facebook HRSL
var HRSL_P = maskImage(ee.Image(ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrslpop").median()));
var imgHRSL_P = HRSL_P.updateMask(HRSL_P.gt(0));
var HRSL_M = maskImage(ee.Image(ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrsl_men").median()));
var imgHRSL_M = HRSL_M.updateMask(HRSL_M.gt(0));
var HRSL_W = maskImage(ee.Image(ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrsl_women").median()));
var imgHRSL_W = HRSL_W.updateMask(HRSL_W.gt(0));
var HRSL_Y1524 = maskImage(ee.Image(ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrsl_youth").median()));
var imgHRSL_Y1524 = HRSL_Y1524.updateMask(HRSL_Y1524.gt(0));
var HRSL_CU5 = maskImage(ee.Image(ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrsl_children_under_five").median()));
var imgHRSL_CU5 = HRSL_CU5.updateMask(HRSL_CU5.gt(0));
var HRSL_WR1549 = maskImage(ee.Image(ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrsl_women_reproductive_age").median()));
var imgHRSL_WR1549 = HRSL_WR1549.updateMask(HRSL_WR1549.gt(0));
var HRSL_E60P = maskImage(ee.Image(ee.ImageCollection("projects/sat-io/open-datasets/hrsl/hrsl_elderly_over_sixty").median()));
var imgHRSL_E60P = HRSL_E60P.updateMask(HRSL_E60P.gt(0));

// MODIS Global Annual Land Cover 500m - year 2019, filter image collection by the most up-to-date MODIS Land Cover product 
// Import Crop extent data - https://developers.google.com/earth-engine/datasets/catalog/MODIS_006_MCD12Q1#bands
// LC_Type1 using Annual International Geosphere-Biosphere Programme (IGBP) classification
var mcd12q1_raw = ee.Image('MODIS/006/MCD12Q1/2019_01_01').select("LC_Type1"); 
var mcd12q1 = mcd12q1_raw.updateMask(mcd12q1_raw.gt(0));
// Get MODIS projection information
var MODISprojection = mcd12q1_raw.projection();

```

## Calling the assets

ERM required some of input (threshold, slope and intercept layer) that already prepared via different platform: ArcGIS Pro, R Statistics, and Excel. All the layer uploaded as GEE assets.

``` js
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

As alternative, we could simplify above script to read the assets by write the function for each category. 

``` js
// FUNCTION
//---
// Get Threshold Image
function getThresholdImage(p, numday) {
  var q = {
    'P50': 'q0500_2yr', // Percentile 50, 2-year return period
    'P80': 'q0800_5yr', // Percentile 80, 5-year return period
    'P90': 'q0900_10yr', // Percentile 90, 10-year return period
    'P96': 'q0960_25yr' // Percentile 96, 25-year return period
  }[p];
  var path = 'users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_' 
    + numday + 'day_precipthreshold_' 
    + q + '_imerg_wfp';
  return ee.Image(path);
}

// Get Slope Image
function getSlopeImage(month, numday) {
  var m = ['',
    '01_jan','02_feb','03_mar','04_apr','05_may','06_jun',
    '07_jul','08_aug','09_sep','10_oct','11_nov','12_dec'
  ][month];
  var path = 'users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_day' 
    + numday + '_' + m + '_slope_imerg';
  return ee.Image(path);
}

// Get Intercept Image
function getInterceptImage(month, numday) {
  var m = ['',
    '01_jan','02_feb','03_mar','04_apr','05_may','06_jun',
    '07_jul','08_aug','09_sep','10_oct','11_nov','12_dec'
  ][month];
  var path = 'users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_day' 
    + numday + '_' + m + '_intercept_imerg';
  return ee.Image(path);
}

```

## Function to grab rainfall data

Next is creating function to get near real-time data using IMERG and forecast data using GFS. We will have scenario from last 5-days and up to 5-days ahead based on selected date. So we need to prepare rainfall accumulation for both scenario.

Below is a  function to get near real-time

``` js
// Get near real-time data (IMERG Image)
function getImergImage(dt, numday) {
  var hours = -24 * numday;
  
  return imerg // ee.ImageCollection('NASA/GPM_L3/IMERG_V06')
    .select('precipitationCal')
    .filterDate(dt.advance(hours,'hour'), dt)
    .map(maskImage)
    .sum().float();
}
```

And this is a function to get a forecast data

``` js
// Get forecast data (GFS Image)
function getGfsImage(dt, numday) {
  var hours = [];
  for (var i = 0; i < numday; i++) {
    for (var j = 0; j < 4; j++) {
      var h = (i * 24) + ((j + 1) * 6);
      hours.push(h);
    }
  }
  
  return gfs // ee.ImageCollection('NOAA/GFS0P25')
    .select('total_precipitation_surface')
    .filterDate(dt, dt.advance(6,'hour'))
    .filter(ee.Filter.inList('forecast_hours', hours))
    .map(maskImage)
    .sum()
    // .resample('bicubic') // One of 'bilinear' or 'bicubic'
    .reproject({
      crs: IMERGprojection.atScale(11131.949079327358)
    });
}

```

## Extreme rainfall analysis

And the next script is the main analysis, computing extreme rainfall. It consist of many sub analysis:

- Getting all input together
- Extract a pixel of rainfall exceeding the threshold, called as impact
- Calculate the likelihood a pixel of rainfall will trigger a flood or not
- Classify the likelihood: Low 0 - 0.6, Moderate 0.6 - 0.8, High 0.8 - 1
- Calculate extreme rainfall-triggering flood (ERTF)
- Creating matrix 3x4, the source came from impact and likelihood
- Re class matrix into 3 class
- Final product from single run

``` js
// EXTREME RAINFALL ANALYSIS
//----
// Get images for rainfall accumulation, extreme rainfall, probability and the alert
// Base image can be from IMERG or GFS
function getRainfallExtremeImage(params) {
  var dt = params.date;
  var numday = params.numday;
  var imgBase = params.imgBase;
  var rainfallColumn = params.rainfallColumn;
  // Get month information to match data for Threshold, Slope and Intercept
  var month = dt.get('month').getInfo();

  // Get data for Threshold, Slope and Intercept based on date
  // Threshold
  var P50 = getThresholdImage('P50', numday); // Percentile 50, 2-year return period
  var P80 = getThresholdImage('P80', numday); // Percentile 80, 5-year return period
  var P90 = getThresholdImage('P90', numday); // Percentile 90, 10-year return period
  var P96 = getThresholdImage('P96', numday); // Percentile 96, 25-year return period
  // Slope
  var imgSlope = getSlopeImage(month, numday);
  // Intercept
  var imgIntercept = getInterceptImage(month, numday);

  // Mosaic rainfall with threshold images
  var imgImpactSrc = imgBase
    .addBands(P50)
    .addBands(P80)
    .addBands(P90)
    .addBands(P96);

  // Extract a pixel of rainfall exceeding the threshold, called as impact
  var imgImpact = imgImpactSrc.expression(
    'impact = R>P96?4:(R>P90?3:(R>P80?2:(R>P50?1:R*0)))', {
    'R': imgImpactSrc.select(rainfallColumn),
    'P50': imgImpactSrc.select('b1'),
    'P80': imgImpactSrc.select('b1_1'),
    'P90': imgImpactSrc.select('b1_2'),
    'P96': imgImpactSrc.select('b1_3'),
  });

  // Mosaic rainfall with slope and intercepts images
  var imgProbSrc = imgBase
    .addBands(imgSlope)
    .addBands(imgIntercept);

  // Calculate the likelihood a pixel of rainfall will trigger a flood or not
  var imgProbBase = imgProbSrc.expression(
    'prob_base = 1/(1+(e **(-((S*R)+I))))', {
    'e': Math.E,
    'R': imgProbSrc.select(rainfallColumn),
    'S': imgProbSrc.select('b1'),
    'I': imgProbSrc.select('b1_1'),
  });

  // Classify the likelihood: Low 0 - 0.6, Moderate 0.6 - 0.8, High 0.8 - 1
  var imgProb = imgProbBase.expression(
    'prob = V<0.6?0:(V<0.8?1:(V<=1?2:0*V))', {
    'V': imgProbBase.select('prob_base')
  });

  // Mosaic impact and likelihood image
  var imgReSrc = imgImpact
    .addBands(imgProb);

  // Calculate extreme rainfall-triggering flood (ERTF)
  var imgReBase = imgReSrc.expression(
    'ertf = (x*3) + y + 1', {
    'x': imgReSrc.select('impact'),
    'y': imgReSrc.select('prob'),
  });

  // ERTF matrix 3x4, came from impact and likelihood
  var imgRe = imgReBase.remap([
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    10, 11, 12,
    13, 14, 15], [
    -1, -1, -1,
    0, 0, 1,
    0, 2, 4,
    3, 5, 7,
    6, 8, 9
  ]
  );

  // Re class matrix into 3 class
  var imgReClass = imgReBase.remap([
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    10, 11, 12,
    13, 14, 15], [
    -1, -1, -1,
    0, 0, 1,
    0, 1, 2,
    1, 2, 3,
    2, 3, 3
  ]);

  // Final product from single run
  return {
    're': imgRe.updateMask(imgRe.gte(0)),
    'reClass': imgReClass.updateMask(imgReClass.gte(0)),
    'rainfall': imgBase.updateMask(imgBase.gt(0)),
    'impact': imgImpact.updateMask(imgImpact.gt(0)),
    'prob': imgProb.updateMask(imgProb.gt(0))
  };
}

```

## Rendering process

As a trigger for ERM to do the analysis, user must select the date and number of days of simulation, then GEE will do the rendering process. ui.DateSlider onChange argument will use to start the simulation.


``` js
// Render map based on DateSlider onChange
function render() {
  // Date Slider
  var dt = ee.Date(uiComponents.dateSlider.getValue()[0]);
  // Day of simulation combobox
  var _numday = uiComponents.daySelect.getValue();
  if (!_numday) {
    return;
  }
  // Render button
  uiComponents.renderButton.setDisabled(true);
  uiComponents.NRTaffectedPops.widgets().reset([
    ui.Label({ value: 'Loading...' })
  ]);
  uiComponents.FCTaffectedPops.widgets().reset([
    ui.Label({ value: 'Loading...' })
  ]);
  // wait counter for ntr affected pops and ftc affected pops
  uiComponents.loadingCounter = 2;
  // Day of simulation
  var numday = {
    '1 day': 1,
    '2 days': 2,
    '3 days': 3,
    '4 days': 4,
    '5 days': 5
  }[_numday];
  
  // Get all layer result
  // Near Real Time Result
  var imageNRT = getRainfallExtremeImage({
    date: dt,
    numday: numday,
    imgBase: getImergImage(dt, numday),
    rainfallColumn: 'precipitationCal'
  });
  // Forecast Result
  var imageFCT = getRainfallExtremeImage({
    date: dt,
    numday: numday,
    imgBase: getGfsImage(dt, numday),
    rainfallColumn: 'total_precipitation_surface'
  });
  
  // Load layer result as map
  mainMap.layers().reset();
  mainMap.addLayer(imageFCT.re, visFlood,'Forecast - Flood Alert', false);
  mainMap.addLayer(imageNRT.re, visFlood,'Near Real-Time - Flood Alert', false);
  mainMap.addLayer(imageFCT.prob, visLikelihood,'Forecast - Likelihood of Flooding', false);
  mainMap.addLayer(imageNRT.prob, visLikelihood,'Near Real-Time - Likelihood of Flooding', false);
  mainMap.addLayer(imageFCT.impact, visExtreme,'Forecast - Rainfall exceeding Threshold', false);
  mainMap.addLayer(imageNRT.impact, visExtreme,'Near Real-Time - Rainfall exceeding Threshold', false);
  mainMap.addLayer(imageFCT.rainfall.sldStyle(visRainfallSLD),{},'Forecast - Rainfall', true);
  mainMap.addLayer(imageNRT.rainfall.sldStyle(visRainfallSLD),{},'Near Real-Time - Rainfall', true);
  
  // Rendering population information
  renderPopulationInfo(imageNRT.reClass, uiComponents.NRTaffectedPops);
  renderPopulationInfo(imageFCT.reClass, uiComponents.FCTaffectedPops);
}

```


**Notes**

The GEE script is written by Benny Istanto and Ridwan Mulyadi. Both are working as Climate Analyst and System Developer at VAM unit, UN WFP Indonesia.
