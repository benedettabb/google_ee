//----CREATE A IMAGE COLLECTION--------------------------------------
//da due immagini

//stabilisco due punti
var point = ee.Geometry.Point ( 38.6, -4)
var point2 =ee.Geometry.Point ( 38.6, -4.4)

//ricavo due immagini da un dataset
var dataset =ee.ImageCollection("COPERNICUS/S2_SR")
  .filterDate ('2019-01-05', '2019-09-30')
  .filterBounds (point);
print(dataset)
var gennaio = ee.Image ('COPERNICUS/S2_SR/20190106T073301_20190106T073304_T37MDR');
var settembre = ee.Image ('COPERNICUS/S2_SR/20190928T072659_20190928T074134_T37MDR');
print (gennaio, 'gennaio');
print (settembre, 'settembre');
var visParams = {min:0, max:2000, bands: 'B5', palette: ['white', 'pink', 'red']}
Map.addLayer(gennaio, visParams, 'gennaio', 1)
Map.addLayer(settembre, visParams, 'settembre', 1)

//creo la collezione a partire dalla lista delle due immagini
var collection = ee.ImageCollection.fromImages ([gennaio, settembre]);
print (collection, 'collection');

//conto le immagini nella collezione
var count = collection.size();
print('Count: ', count);


//vedo la data delle due immagini
var range = collection.reduceColumns(ee.Reducer.minMax(), ["system:time_start"])
print('Date range: ', ee.Date(range.get('min')), ee.Date(range.get('max')))

//estraggo statiche per una proprietà dell'immagine
var cloudCover = collection.aggregate_stats('CLOUD_COVERAGE_ASSESSMENT');
print('cloud coverage', cloudCover);


//prendo l'immagine con percentuale di pixel classificati come vegetazione più bassa
var lessVeg = collection.sort ('VEGETATION_PERCENTAGE').first()
print('Image with less vegetation pixels', lessVeg)

