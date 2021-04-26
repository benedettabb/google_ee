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
