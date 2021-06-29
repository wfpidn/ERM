// GLOBAL VARIABLE (Color, Static Data, Mask and others)
//---
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

// Visualization palette for total precipitation - Color-codes based on Color-Brewer https://colorbrewer2.org/
// Palette with the colors for legend in UI Panel
var paletteRain =['ffffff','cccccc','f9f3d5','dce2a8','a8c58d','77a87d','ace8f8','4cafd9','1d5ede','001bc0','9131f1','e983f3','f6c7ec'];
var paletteAlert =['97D700','FFEDA0','FEB24C','F03B20'];
var paletteImpact =['ffffcc', 'a1dab4', '41b6c4', '225ea8'];
var paletteLikelihood =['f7fcb9','addd8e','31a354'];

// Name of the legend for legend in UI Panel
var namesRain = ['No Rain ~ No color','1 - 3 milimeters','4 - 10','11 - 20','21 - 30','31 - 40','41 - 60','61 - 80','81 - 100','101 - 120','121 - 150','151 - 200','> 200'];
var namesAlert = ['Green Alert','Category 1 - 3','Category 4 - 6','Category 7 - 9'];
var namesImpact = ['Moderate','Heavy','Intense','Extreme'];
var namesLikelihood = ['Low','Moderate','High'];

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
  var d = {
    '1 day' : '1day', // Threshold for 1-day
    '2 days': '2day', // Threshold for 2 consecutive day
    '3 days': '3day', // Threshold for 3 consecutive day
    '4 days': '4day', // Threshold for 4 consecutive day
    '5 days': '5day', // Threshold for 5 consecutive day
  }[numday];
  var path = 'users/bennyistanto/datasets/raster/extremerainfall/threshold/idn_cli_' 
    + d + '_precipthreshold_' 
    + q + '_imerg_wfp';
  return ee.Image(path);
}

// Get Slope Image
function getSlopeImage(month, numday) {
  var m = ['',
    '01_jan','02_feb','03_mar','04_apr','05_may','06_jun',
    '07_jul','08_aug','09_sep','10_oct','11_nov','12_dec'
  ][month];
  var d = {
    '1 day' : 'day1',
    '2 days': 'day2',
    '3 days': 'day3',
    '4 days': 'day4',
    '5 days': 'day5',
  }[numday];
  var path = 'users/bennyistanto/datasets/raster/extremerainfall/slope/idn_cli_' 
    + d + '_' + m + '_slope_imerg';
  return ee.Image(path);
}

// Get Intercept Image
function getInterceptImage(month, numday) {
  var m = ['',
    '01_jan','02_feb','03_mar','04_apr','05_may','06_jun',
    '07_jul','08_aug','09_sep','10_oct','11_nov','12_dec'
  ][month];
  var d = {
    '1 day' : 'day1',
    '2 days': 'day2',
    '3 days': 'day3',
    '4 days': 'day4',
    '5 days': 'day5',
  }[numday];
  var path = 'users/bennyistanto/datasets/raster/extremerainfall/intercept/idn_cli_' 
    + d + '_' + m + '_intercept_imerg';
  return ee.Image(path);
}

// Get near real-time data (IMERG Image)
function getImergImage(dt, numday) {
  var nday = {
    '1 day' : 1, // Scenario for 1 day cumulative rainfall forecast
    '2 days': 2, // Scenario for 2 consecutive day cumulative rainfall forecast
    '3 days': 3, // Scenario for 3 consecutive day cumulative rainfall forecast
    '4 days': 4, // Scenario for 4 consecutive day cumulative rainfall forecast
    '5 days': 5, // Scenario for 5 consecutive day cumulative rainfall forecast
  }[numday];
  var hours = -24 * nday;
  print(hours);
  
  return imerg // ee.ImageCollection('NASA/GPM_L3/IMERG_V06')
    .select('precipitationCal')
    .filterDate(dt.advance(hours,'hour'), dt)
    .map(maskImage)
    .sum().float();
}

// Get forecast data (GFS Image)
function getGfsImage(dt, numday) {
  var nday = {
    '1 day' : 1, // Scenario for 1 day cumulative rainfall forecast
    '2 days': 2, // Scenario for 2 consecutive day cumulative rainfall forecast
    '3 days': 3, // Scenario for 3 consecutive day cumulative rainfall forecast
    '4 days': 4, // Scenario for 4 consecutive day cumulative rainfall forecast
    '5 days': 5, // Scenario for 5 consecutive day cumulative rainfall forecast
  }[numday];
  var hours = [];
  for (var i = 0; i < nday; i++) {
    for (var j = 0; j < 4; j++) {
      var h = (i*24) + ((j+1)*6);
      hours.push(h);
    }
  }
  print(hours);
  
  return gfs // ee.ImageCollection('NOAA/GFS0P25')
    .select('total_precipitation_surface')
    .filterDate(dt, dt.advance(6,'hour'))
    .filter(ee.Filter.inList('forecast_hours', hours))
    .map(maskImage)
    .sum()
    .setDefaultProjection(IMERGprojection)
    .reduceResolution({
      reducer: ee.Reducer.sum().unweighted(),
      maxPixels: 1024
    })
    .reproject({
      crs: IMERGprojection.atScale(11131.949079327358)
    });
}



// NEAR REAL-TIME ANALYSIS
//----
// Get forecast images for rainfall accumulation, extreme rainfall, probability and the alert
function getNRTImage(dt, numday) {
  // Get month information to match data for Threshold, Slope and Intercept
  var month = dt.get('month').getInfo();
  
  // Get data for Threshold, Slope and Intercept based on date
  var P50 = getThresholdImage('P50', numday);
  var P80 = getThresholdImage('P80', numday);
  var P90 = getThresholdImage('P90', numday);
  var P96 = getThresholdImage('P96', numday);
  var imgSlope = getSlopeImage(month, numday);
  var imgIntercept = getInterceptImage(month, numday);
  
  // Mosaic rainfall with threshold images
  var imgImerg = getImergImage(dt, numday);
  var imgNRTImpactSrc = imgImerg
    .addBands(P50)
    .addBands(P80)
    .addBands(P90)
    .addBands(P96);
  
  // Extract a pixel of rainfall exceeding the threshold, called as impact
  var imgNRTImpact = imgNRTImpactSrc.expression(
    'NRTimpact = R>P96?4:(R>P90?3:(R>P80?2:(R>P50?1:R*0)))', {
      'R': imgNRTImpactSrc.select('precipitationCal'),
      'P50': imgNRTImpactSrc.select('b1'),
      'P80': imgNRTImpactSrc.select('b1_1'),
      'P90': imgNRTImpactSrc.select('b1_2'),
      'P96': imgNRTImpactSrc.select('b1_3'),
    });
  
  // Mosaic rainfall with slope and intercepts images    
  var imgNRTProbSrc = imgImerg
    .addBands(imgSlope)
    .addBands(imgIntercept);
  
  // Calculate the likelihood a pixel of rainfall will trigger a flood or not
  var imgNRTProbBase = imgNRTProbSrc.expression(
    'prob_base = 1/(1+(e **(-((S*R)+I))))', {
      'e': Math.E,
      'R': imgNRTProbSrc.select('precipitationCal'),
      'S': imgNRTProbSrc.select('b1'),
      'I': imgNRTProbSrc.select('b1_1'),
    }
  );
  
  // Classify the likelihood
  var imgNRTProb = imgNRTProbBase.expression(
    'NRTprob = V<0.6?0:(V<0.8?1:(V<=1?2:0*V))', {
      'V': imgNRTProbBase.select('prob_base')
    }
  );
  
  // Mosaic impact and likelihood image
  var imgNRTERTFSrc = imgNRTImpact
    .addBands(imgNRTProb);
  
  // Calculate extreme rainfall-triggering flood (ERTF)
  var imgNRTERTFBase = imgNRTERTFSrc.expression(
    'NRTertf = (x*3) + y + 1', {
      'x': imgNRTERTFSrc.select('NRTimpact'),
      'y': imgNRTERTFSrc.select('NRTprob'),
    });
  
  // ERTF matrix 3x4, came from impact and likelihood
  var imgNRTERTF = imgNRTERTFBase.remap([
     1, 2, 3,
     4, 5, 6,
     7, 8, 9,
    10,11,12,
    13,14,15],[
    -1,-1,-1,
     0, 0, 1,
     0, 2, 4,
     3, 5, 7,
     6, 8, 9
    ]
  );
  
  // Final product from single run
  return {
    'NRTertf': imgNRTERTF.updateMask(imgNRTERTF.gte(0)),
    'precipitationCal': imgImerg.updateMask(imgImerg.gt(0)),
    'NRTimpact': imgNRTImpact.updateMask(imgNRTImpact.gt(0)),
    'NRTprob': imgNRTProb.updateMask(imgNRTProb.gt(0))
  };
}


// FORECAST ANALYSIS
//----
// Get forecast images for rainfall accumulation, extreme rainfall, probability and the alert
function getFCTImage(dt, numday) {
  // Get month information to match data for Threshold, Slope and Intercept
  var month = dt.get('month').getInfo();
  
  // Get data for Threshold, Slope and Intercept based on date
  var P50 = getThresholdImage('P50', numday);
  var P80 = getThresholdImage('P80', numday);
  var P90 = getThresholdImage('P90', numday);
  var P96 = getThresholdImage('P96', numday);
  var imgSlope = getSlopeImage(month, numday);
  var imgIntercept = getInterceptImage(month, numday);
  
  // Mosaic rainfall with threshold images
  var imgGfs = getGfsImage(dt, numday);
  var imgFCTImpactSrc = imgGfs
    .addBands(P50)
    .addBands(P80)
    .addBands(P90)
    .addBands(P96);
  
  // Extract a pixel of rainfall exceeding the threshold, called as impact
  var imgFCTImpact = imgFCTImpactSrc.expression(
    'FCTimpact = R>P96?4:(R>P90?3:(R>P80?2:(R>P50?1:R*0)))', {
      'R': imgFCTImpactSrc.select('total_precipitation_surface'),
      'P50': imgFCTImpactSrc.select('b1'),
      'P80': imgFCTImpactSrc.select('b1_1'),
      'P90': imgFCTImpactSrc.select('b1_2'),
      'P96': imgFCTImpactSrc.select('b1_3'),
    });
  
  // Mosaic rainfall with slope and intercepts images    
  var imgFCTProbSrc = imgGfs
    .addBands(imgSlope)
    .addBands(imgIntercept);
  
  // Calculate the likelihood a pixel of rainfall will trigger a flood or not
  var imgFCTProbBase = imgFCTProbSrc.expression(
    'prob_base = 1/(1+(e **(-((S*R)+I))))', {
      'e': Math.E,
      'R': imgFCTProbSrc.select('total_precipitation_surface'),
      'S': imgFCTProbSrc.select('b1'),
      'I': imgFCTProbSrc.select('b1_1'),
    }
  );
  
  // Classify the likelihood
  var imgFCTProb = imgFCTProbBase.expression(
    'FCTprob = V<0.6?0:(V<0.8?1:(V<=1?2:0*V))', {
      'V': imgFCTProbBase.select('prob_base')
    }
  );
  
  // Mosaic impact and likelihood image
  var imgFCTERTFSrc = imgFCTImpact
    .addBands(imgFCTProb);
  
  // Calculate extreme rainfall-triggering flood (ERTF)
  var imgFCTERTFBase = imgFCTERTFSrc.expression(
    'FCTertf = (x*3) + y + 1', {
      'x': imgFCTERTFSrc.select('FCTimpact'),
      'y': imgFCTERTFSrc.select('FCTprob'),
    });
  
  // ERTF matrix 3x4, came from impact and likelihood
  var imgFCTERTF = imgFCTERTFBase.remap([
     1, 2, 3,
     4, 5, 6,
     7, 8, 9,
    10,11,12,
    13,14,15],[
    -1,-1,-1,
     0, 0, 1,
     0, 2, 4,
     3, 5, 7,
     6, 8, 9
    ]
  );
  
  
  // Final product from single run
  return {
    'FCTertf': imgFCTERTF.updateMask(imgFCTERTF.gte(0)),
    'total_precipitation_surface': imgGfs.updateMask(imgGfs.gt(0)),
    'FCTimpact': imgFCTImpact.updateMask(imgFCTImpact.gt(0)),
    'FCTprob': imgFCTProb.updateMask(imgFCTProb.gt(0))
  };
}


// Render map based on DateSlider onChange
function render() {
  var dt = ee.Date(dateSlider.getValue()[0]);
  var numday = daySelect.getValue();
  if (!numday) {
    return;
  }
  var imageNRT = getNRTImage(dt, numday); // Near Real-Time
  var imageFCT = getFCTImage(dt, numday); // Forecast
  // Load layer result as map
  Map.layers().reset();
  Map.addLayer(imageFCT.FCTertf, visFlood,'Forecast - Flood Alert', false);
  Map.addLayer(imageNRT.NRTertf, visFlood,'Near Real-Time - Flood Alert', false);
  Map.addLayer(imageFCT.FCTprob, visLikelihood,'Forecast - Likelihood of Flooding', false);
  Map.addLayer(imageNRT.NRTprob, visLikelihood,'Near Real-Time - Likelihood of Flooding', false);
  Map.addLayer(imageFCT.FCTimpact, visExtreme,'Forecast - Rainfall exceeding Threshold', false);
  Map.addLayer(imageNRT.NRTimpact, visExtreme,'Near Real-Time - Rainfall exceeding Threshold', false);
  Map.addLayer(imageFCT.total_precipitation_surface, visRainfall,'Forecast - Rainfall', true);
  Map.addLayer(imageNRT.precipitationCal, visRainfall,'Near Real-Time - Rainfall', true);
}


// USER INTERFACE WIDGET
//---
// ui.Select widget
var daySelect = ui.Select({
  items: ['1 day', '2 days', '3 days', '4 days', '5 days'],
  onChange: render
});
// ui.Select first load
daySelect.setPlaceholder('Select number of days');


// Center of the map for first load
Map.setControlVisibility(true);
// ERMMap.setCenter(117.7, -2.5, 5.7);


// Setting date
var today = ee.Date(new Date());
var startDate = ee.Date('2019-07-01'); // First GFS data 1 Jul 2015
// GFS Dataset Availability: https://developers.google.com/earth-engine/datasets/catalog/NOAA_GFS0P25#citations
var start_GFS_old = ee.Date('2015-07-01'); // First GFS data 1 Jul 2015
// Until 2019-11-07 06:00:00 precipitation represents the precipitation at surface at the forecasted time
var start_GFS_new = ee.Date('2019-11-07T06:00:00'); 


// ui.DateSlider widget
var dateSlider = ui.DateSlider({
    start: startDate,
    end: today.advance(1, 'day'),
    period: 1, // the unit is day
    style: {width: '300px', padding: '10px'},
    onChange: render
});
dateSlider.setValue(today);

// Add widget to map UI
Map.add(dateSlider);
Map.add(daySelect);



// DATA DOWNLOAD
//---------------------
//////
// Add download button to panel
var download = ui.Button({
  label: 'Downloads the data',
  style: {position: 'bottom-right', color: 'black'},
  onClick: function() {
      
      // As the download request probably takes some time, we need to warn the user, 
      // so they not repeating click the download button
      alert("If you see this message, the download request is started! Please go to Tasks, wait until the download list appear. Click RUN for each data you want to download");
      
      // Downloading data
      // Export the result to Google Drive
      var download_date = ee.Date(dateSlider.getValue()[0]);
      
      // Near Real-Time Precipitation
      Export.image.toDrive({
        image:imageNRT.precipitationCal,
        description:'NRT_Precipitation_last_' + nday + 'day_as_of_' + download_date.format('yyyy-MM-dd').getInfo(),
        scale:IMERGprojection.nominalScale(),
        maxPixels:1e12
      });
      
      // Forecast Precipitation
      Export.image.toDrive({
        image:imageFCT.total_precipitation_surface,
        description:'FCT_Precipitation_' + nday + 'day_ahead_issued_on_' + download_date.format('yyyy-MM-dd').getInfo(),
        scale:IMERGprojection.nominalScale(),
        maxPixels:1e12
      });
      
      // Near Real-Time Extreme Precipitation (exceeding the threshold)
      Export.image.toDrive({
        image:imageNRT.NRTimpact,
        description:'NRT_ExtremePrecip_last_' + nday + 'day_as_of_' + download_date.format('yyyy-MM-dd').getInfo(),
        scale:IMERGprojection.nominalScale(),
        maxPixels:1e12
      });
      
      // Forecast Extreme Precipitation (exceeding the threshold)
      Export.image.toDrive({
        image:imageFCT.FCTimpact,
        description:'FCT_ExtremePrecip_' + nday + 'day_ahead_issued_on_' + download_date.format('yyyy-MM-dd').getInfo(),
        scale:IMERGprojection.nominalScale(),
        maxPixels:1e12
      });

      // Near Real-Time Likelihood of Pixel will be Inundated
      Export.image.toDrive({
        image:imageNRT.NRTprob,
        description:'NRT_Likelihood_last_' + nday + 'day_as_of_' + download_date.format('yyyy-MM-dd').getInfo(),
        scale:IMERGprojection.nominalScale(),
        maxPixels:1e12
      });
      
      // Forecast Likelihood of Pixel will be Inundated
      Export.image.toDrive({
        image:imageFCT.FCTprob,
        description:'FCT_Likelihood_' + nday + 'day_ahead_issued_on_' + download_date.format('yyyy-MM-dd').getInfo(),
        scale:IMERGprojection.nominalScale(),
        maxPixels:1e12
      });

      // Near Real-Time Extreme Rainfall-triggering Flood
      Export.image.toDrive({
        image:imageNRT.NRTertf,
        description:'NRT_FloodAlert_last_' + nday + 'day_as_of_' + download_date.format('yyyy-MM-dd').getInfo(),
        scale:IMERGprojection.nominalScale(),
        maxPixels:1e12
      });
      
      // Forecast Extreme Rainfall-triggering Flood
      Export.image.toDrive({
        image:imageFCT.FCTertf,
        description:'FCT_FloodAlert_' + nday + 'day_ahead_issued_on_' + download_date.format('yyyy-MM-dd').getInfo(),
        scale:IMERGprojection.nominalScale(),
        maxPixels:1e12
      });
      
      print('Data Downloaded!', download_date);
  }
});

// Add the button to the map and the panel to root.
Map.add(download);
