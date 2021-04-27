//estrarre la firma spettrale delle diverse classi

var rec = ee.Geometry.Rectangle (31, 29, 32, 30)

//carico il dataset sentinel 2 e prendo l'immagine meno nuvola
var image = ee.ImageCollection ('COPERNICUS/S2_SR')
  .filterDate ('2020-10-05', '2020-10-06')
  .filterBounds(rec)
  .sort ('CLOUDY_PIXEL_PERCENTAGE')
  .first();
print(image);

var visParams = {min:0, max:5000, bands:['B4','B3','B2']};
Map.addLayer (image, visParams, 'sentinel 2', true);
Map.centerObject(image, 10);

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

//var sentinel1 = ee.ImageCollection()
