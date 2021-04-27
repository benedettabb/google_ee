//estrarre la firma spettrale delle diverse classi

var rec = ee.Geometry.Rectangle (31, 29, 32, 30)

//carico il dataset sentinel 2 e prendo l'immagine meno nuvola
var image = ee.ImageCollection ('COPERNICUS/S2_SR')
  .filterDate ('2020-10-05', '2020-10-06')
  .filterBounds(rec)
  .sort ('CLOUDY_PIXEL_PERCENTAGE')
  .first();
print(image);


var sentinel1 = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterMetadata ('resolution_meters', 'equals', 10)
  .filter (ee.Filter.eq ('instrumentMode', 'IW'))
  .filter (ee.Filter.listContains ('transmitterReceiverPolarisation', 'VV'))
  .filter (ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
  .filterDate('2020-09-05', '2020-10-06')
  .filterBounds(roi)
print(sentinel1, 'sentinel 1')
var s1 = sentinel1.mosaic()

var visParams = {min:0, max:5000, bands:['B4','B3','B2']};
Map.addLayer (image, visParams, 'sentinel 2', true);
Map.addLayer (s1, {min:-15, max:10, bands:['VV', 'VH']}, 'sentinel 1', true);
Map.centerObject(roi, 8);


/*var clipped2 = image.clipToBoundsAndScale(rec);
var clipped1 = sentinel1.clipToBoundsAndScale (rec);
Map.addLayer (clipped2, visParams, 'sentinel 2 clipped', 1);*/


var subset = image.select ('B[1-7]');
var samples = ee.FeatureCollection ([desert,vegetation, water, urban]);

var chartStyle = {
  title: 'S2 firma spettrale',
  hAxis: { title: "Lunghezza d'onda"},
  vAxis: { title: 'Riflettanza'},
  lineWidth: 3,
  pointSize: 7,
  series: {
    0: {colour: 'orange'},
    1: {colour: 'green'},
    2: {colour: 'blue'},
    3: {colour: 'yellow'},
}};



//trasformare le bande in lunghezze d'onda: valori medi per le 7 bande di Sentinel
var Londa = [443, 493, 559.5, 664.7, 703.8, 739.6, 708.8]

var grafico = ui.Chart.image.regions (
  subset, samples, ee.Reducer.mean(), 10, 'lable', Londa)
  .setChartType ('ScatterChart')
  .setOptions(chartStyle);
  
print(grafico);

