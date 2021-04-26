//--------------IMAGE-------------------------------------------------------------------------------------------------------

//prendere un'immagine da una collezione di immagini S2 -surface reflectance
//definisco il punto di interesse
var point = ee.Geometry.Point (-68, -46);


var dataset = ee.ImageCollection("COPERNICUS/S2_SR")
//filtro per regione di interesse 
  .filterBounds (point)
//filtro per data
  .filterDate ('2020-03-03','2020-10-03')
/*.sort ordina una collezione secondo una proprietà specifica
immagine.sort (proprietà, default:ascending (dal più piccolo al più grande))
SORT VA DOPO I FILTRI, altrimenti si ordina tutta la colleizone */ 
  .sort ('CLOUDY_PIXEL_PERCENTAGE')
//prende la prima immagine di una collezione
  .first();
  
//così ottengo l'ID dell'immagine con granule-specific cloudy pixel percentage più bassa, nella data e zona definite
print (dataset)

var visParams = {min:0, max: 2000, bands:['B4','B3','B2']}
Map.addLayer (dataset, visParams, 'RGB', true)
Map.setCenter (-68, -46, 8)


-----------------------------------------
 
  
//come unisco due o più immagini vicine? creando una nnuova imageCollection ([])
//definisco due punti
var point1 = ee.Geometry.Point (-68, -46);
var point2 = ee.Geometry.Point (-68, -45);

//seleziono due immagini adiacenti dello stesso perido
var dataset1 = ee.ImageCollection ('COPERNICUS/S2_SR')
  .filterDate ('2020-05-01', '2020-06-20')
  .filterBounds (point1)
  .sort ('CLOUDY_PIXEL_PERCENTAGE')
  .first();
  
print(dataset1,'S2_sud');

var dataset2 = ee.ImageCollection ('COPERNICUS/S2_SR')
  .filterDate ('2020-05-01', '2020-06-20')
  .filterBounds (point2)
  .sort ('CLOUDY_PIXEL_PERCENTAGE')
  .first()
print(dataset2,'S2_nord');

//definisco i parametri di visualizzazione RGB
var visParams = {max:2000, bands:['B4', 'B3','B2']};

Map.setCenter (-68, -45.5)
Map.addLayer (dataset1, visParams, 'sentinel2 sud', 0);
Map.addLayer (dataset2, visParams, 'sentinel2 nord', 0);

//creo una collezione di immagini che le comprende entrambe. 
var S2 = ee.ImageCollection ([dataset1, dataset2]);
print (S2, 'S2')
Map.addLayer (S2, visParams, 's2', 1);

//voglio rinominarne le bande
var renameBands = S2.select (
  ['B4','B3', 'B2'],
  ['rosso', 'verde', 'blue']
);
//add layer con nuovi parametri di visualizzazione
Map.addLayer (renameBands, {max:2000, bands:['rosso', 'verde','blue']}, 's2 renamed', 1);

//creo una funzione che calcola l'NDVI e lo aggiunge come banda alla imageCollection
var funzione = function(image){
  var ndvi = image.normalizedDifference(['B5','B4']).rename('ndvi');
  return image.addBands(ndvi)
};
var withNDVI = S2.map (funzione);

//aggiungo l'ndvi alla mappa
var ndviVis = {min:0, max: 0.3, bands: 'ndvi',palette: ['07fffc', 'f5ff2e', '05940e']};
Map.addLayer (withNDVI, ndviVis, 'ndvi',1)

//creo una funzione che maschera i valori di ndvi <0.1
var funzioneMask = function (image){
  //.gte da come risultato 1 se il valore di ndvi (primo valore) è più grande di 0.1 (secondo valore)
  var mask = image.select('ndvi').gt(0.1);
  return image.updateMask(mask)
}

//applico la funzione maschera ad entrambe le immagini
var maskedNDVI = withNDVI.map (funzioneMask)
print (maskedNDVI)
//ho messo 4 colori nella palette perchè i valori vanno da 0.2 a 1 (8 valori di NDVI)
Map.addLayer (maskedNDVI, {min:0, max:1, bands: 'ndvi', palette: ['ff7dcd','ff09cd','ff0000','8c0101']}, 'ndvi mask', 1)


//---------convertire le immagini in 8bit per esportarle, RGB o grey scale----------------------------
//si usa image.visualize -- funziona nelle immagini, non nelle image collection
var S2_sudRGB = dataset1.visualize ({
  bands: ['B4', 'B3', 'B2'],
  min: 0, 
  max: 2000
})

print(S2_sudRGB)


//però io voglio farlo in un'imageCollection. 
//allora definisco una funzione e la applico ad ogni immagine con  .map()
//prima definisco i parametri di visualizzazione
//per RGB:
var bit8RGBVis = {bands: ['B4', 'B3', 'B2'], min: 0, max: 2000};
//per masked ndvi
var bit8NDVIVis = {bands: 'ndvi', min:0.2, max: 1, palette: ['ff7dcd','ff09cd','ff0000','8c0101']}

//definisco la funzione per RGB
var funzione8bit = function (image) {
  return image.visualize (bit8RGBVis)
};

//applico la funzione a S2
var S28bit = S2.map(funzione8bit)
// ottengo un'immagine con 2 elementi, ciascuno con 3 bande
print(S28bit, '8 bit Sentinel 2');


//definisco la funzione per masked ndvi 
var funzione8bit = function (image) {
  return image.visualize (bit8NDVIVis)
};

//applico laa funzione a masked ndvi
var maskedNDVI8bit = maskedNDVI.map(funzione8bit)
// ottengo un'immagine con 2 elementi, ciascuno con 3 bande
print(maskedNDVI8bit, '8 bit NDVI masked');
