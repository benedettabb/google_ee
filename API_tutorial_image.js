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


//-----------------MOSAIC--------------------------------------------------------------------------------------------------

//definisco il punto di interesse
var point = ee.Geometry.Point (-7, 52.3)

//carico la collezione
var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
  .filterBounds(point)
  .filterDate ('2020-04-01', '2020-08-01')
  .sort('CLOUD_COVER')
  .first();
print(L8,'L8')

//calcolo l'ndvi
var ndvi = L8.normalizedDifference (['B5','B4']).rename('ndvi');
var withNDVI = L8.addBands (ndvi);
print (withNDVI, 'with ndvi');

//creo una maschera per i valori di NDVI < 0.5 (cioè elimina i valori < di 0.5)
var mask = ndvi.gt(0.5);
var maskedNDVI = ndvi.updateMask(mask)

Map.addLayer (maskedNDVI, {min:0.6, max:1, palette: ['ffffff','ff0000']}, 'maskedNDVI',1)

//creo due immagini a 8bit
var bit8RGB = withNDVI. visualize ({
  bands: ['B4','B3','B2'],
  min:0,
  max: 2000,
});
var bit8NDVI = maskedNDVI. visualize ({
  bands:'ndvi',
  min:0.6,
  max:1,
  palette:['ffffff','ff0000']
});
print (bit8RGB, 'RGB')
print (bit8NDVI, 'NDVI')

//metto insieme le due immagini in una collezione con mosaic
var mosaic = ee.ImageCollection ([bit8RGB, bit8NDVI]).mosaic();
//in questo modo prima ha caricato RGB e poi la maschera per l'ndvi (quindi rgb è nascosto)
print(mosaic, 'mosaic')
Map.addLayer (mosaic, {}, 'mosaic',1);
Map.setCenter (-7, 52.3, 9)

//CLIP --funziona su image e non su imageCollection

var buffer = ee.Geometry.Point ([-7, 52.2]).buffer (10000);
//clip da come output un'immagine uguale a quella in input per numero di bande
//escludendo tutto ciò che non rientra nella geometria (buffer)
Map.addLayer (mosaic.clip(buffer), {}, 'buffer', 1);
Map.centerObject (buffer, 10);

//crea il link all'immagine
var URL = buffer_mosaic.getThumbURL({
  min: 0,
  max: 200,
  dimensions: 1000,
});
print(URL)



//--------------MATH------------------------------------------------------

//voglio sottrarre i valori di ogni pixel nelle rispettive bande in due immagini successive
//definisco il punto di interesse
var point = ee.Geometry.Point (89.6, 27.5)

//carico la collezione landsat 8 giugno 2020
var g2020 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
  .filterBounds(point)
  .filterDate ('2020-01-01', '2020-01-31')
  .sort('CLOUD_COVER')
  .first();
print(g2020,'g2020');

//carico la collezione landsat 8 gennaio 2021
var g2021 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR")
  .filterBounds(point)
  .filterDate ('2021-01-01', '2021-01-31')
  .sort('CLOUD_COVER')
  .first();
print(g2021,'g2021');


//definisco i parametri di visualizzazione
var visParams = {min:0, max: 500, bands: ['B4', 'B3', 'B2']}
Map.centerObject(point, 9)

//aggiungo le immagini alla mappa
Map.addLayer (g2020, visParams, 'giungo2020',0);
Map.addLayer (g2021, visParams, 'gennaio2021',0);


//faccio la differenza per ogni pixel in ogni bande - le bande vengono individuate automaticamente
var diff = g2021.subtract(g2020)
print (diff)
Map.addLayer(diff, visParams, 'difference',0);

//elevo la differenza alla seconda
var squaredDifference = diff.pow(2)
Map.addLayer(squaredDifference, visParams, 'squared Difference',0);


//espressione per calcolare EVI
var evi = g2021.expression (
  '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
      'NIR': g2021.select('B5'),
      'RED': g2021.select('B4'),
      'BLUE': g2021.select('B2')
});
Map.addLayer(evi, {min: -1, max: 1, palette: ['FF0000', '00FF00']}, 'evi',1);



//-----------------OPERATORI RELAZIONALI-------------OPERATORI BOOLEANI---------------------------------------------------
//------ .eq(), .gt(), .gte(), .lt(), .lte()----------and(),or(),not()---------------------------------------------------


var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');


//definisco NDVI e NDWI
var ndvi = image.normalizedDifference (['B5','B4']);
var ndwi = image.normalizedDifference (['B3','B5']);
//lt da 1 se il primo valore è minore del secondo
//quindi si ha 1 se il valore di ndvi è minore di 0.2 e l'ndwi è minore di 0. 
//1 = suoloNudo.
var suoloNudo = ndvi.lt(0.2).and(ndwi.lt(0));
//maschero il suolo nudo con se stesso per ottenere nan invece che 0
var suoloNudoMasked = suoloNudo.updateMask(suoloNudo);
Map.addLayer (suoloNudoMasked, {}, 'suolo nudo' );
Map.setCenter(-122.3578, 37.7726, 12);
Map.setOptions ('SATELLITE');
//in bianco i valori = 1 = basso ndvi e basso ndwi


----------------------------------------------------------------

// carico un'immagine nightlights del 2012.
var nl2012 = ee.Image('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182012');
//seleziona la banda stable_lights
var lights = nl2012.select('stable_lights');

/*.gt da 1 se il primo valore è > del secondo:
tutti i pixel con valori di stable_lights >30 avranno valore 1,
tutti i pixel con valori di stable_lights > 55 avranno valore 1+1=2
tutti i pixel con valori di stable_lights > 62 avranno valore 1+1+1=3*/
var zones = lights.gt(30).add(lights.gt(55)).add(lights.gt(62));

// quindi i pixel dell'imamgine hanno 4 possibili valori 0 1 2 3, ad ognuno si da un colore
var palette = ['000000', '0000FF', '00FF00', 'FF0000'];
Map.setCenter(2.373, 48.8683, 8);
Map.addLayer(zones, {min: 0, max: 3, palette: palette}, 'development zones');


//--------CONDITIONALS---------------------------------------------------------------------------------------------------------------
// in expression() si possono usare ii ternary operator = a?b:c --> se a è vero ho come output b; se a è falso ho come output c
// anche where() può essere usato come un conditionals

//voglio rimpiazzare tutti i pixel nuvolosi in un'immagine con pixel di un'immagine senza nuvole!!!!!!!!!!

//carico un'immagine con dei pixel 'nuvolosi'
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20130603');
Map.addLayer(image, {bands: ['B5', 'B4', 'B3'], min: 0, max: 0.5},'original image',0);
Map.centerObject (image,9)

// carico un'altra immagine per rimpiazzare quei pixel nuvolosi
var replacement = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20130416');

//uso l'algoritmo di landsat per creare una banda in cui si stima la nuvolosità per ogni pixel in percentuale
var cloudscore = ee.Algorithms.Landsat.simpleCloudScore (image);
//seleziono la banda cloud
var cloud = cloudscore. select ('cloud');
print (cloud, 'cloud');

//definisco una variabile test. test ha 1 se il valore di cloud è >10, e 0 se il valore è <10
//quindi mi crea una maschera in cui i pixel nuvolosi hanno valore 1 e i non nuvolosi hanno 0
var test = cloud.gt(10);
/*rimpiazzo i pixel che hanno nuvolosità > 10 con i pixel dell'immagine replacement.
Con where per ogni pixel in ogni banda dell'immagine di input, se il pixel nel test non è 0(è a 1, quindi nuvola), 
l'output sarà il valore del corrispondente pixel in value(replacement).
Invece se il valore del test è 0 (non nuvoloso) l'output sarà il valore del pixel in input */
var replaced = image.where (test,replacement);

Map.centerObject(image, 9);
Map.addLayer(replaced, {bands: ['B5', 'B4', 'B3'], min: 0, max: 0.5}, 'clouds replaced');


//-----CONVOLUTIONS FILTERS----------------------------------------------------------------------

//Combinare insieme immagini in maniera lineare - si usa image.convolve (kernel)
//ogni banda viene "combinata" con il valore del kernel Load and display an image.
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');
Map.setCenter(-121.9785, 37.8694, 11);
Map.addLayer(image, {bands: ['B5', 'B4', 'B3'], max: 0.5}, 'input image');

// definisco un kernel che fa passare le basse frequenze 
var boxcar = ee.Kernel.square({
  //definisco il raggio, la dimensione del kernel -- dimensione più grande = maggiore sfocatura finale 
  radius: 5, 
  //definisco l'unità di misura per misurare la grandezza del kernel. è consigliabile pixel altrimenti
  //con mentri quando cambia lo zoom cambia anche la sua dimensione
  units: 'pixels', 
  //se normalize è impostato su true i coefficienti del kernel danno somma uno 
  normalize: true, 
  // i coefficienti vengono moltiplicati per la magnitude
  magnitude: 1
});

// Smooth the image .
//l'output di convolve è la combinazione lineare del valore del kernel e dei pixel dell'immagine originale
var smooth = image.convolve(boxcar);
Map.addLayer(smooth, {bands: ['B5', 'B4', 'B3'], max: 0.5}, 'smoothed');


//si può applciare un laplacian kernel --è un filtro che fa passare le alte frequenze https://homepages.inf.ed.ac.uk/rbf/HIPR2/log.htm
//definisco un  kernel laplaciano 
var laplacian = ee.Kernel.laplacian8({ normalize: false });

// Apply the edge-detection kernel.
var edgy = image.convolve(laplacian);
Map.addLayer(edgy,
             {bands: ['B5', 'B4', 'B3'], max: 0.5, format: 'png'},
             'edges');

// con Kernel.fixe di può creare un kernel di varie forme e pesi
// si definisce una lista di pesi da inserire nella prima riga
var row = [1, 1, 1, 1, 1, 1, 1, 1, 1];
// La riga centrale ha uno zero in mezzo.
var centerRow = [1, 1, 1, 1, 0, 1, 1, 1, 1];
// Si assemblano le righe facendo una lista di liste: il kernel è una matrice 2D 9x9
var rows = [row, row, row, row, centerRow, row, row, row, row];
// si crea il kernel inserendo: larghezza, altezza, pesi (le righe del kernel), la posizione del filtro e normalize
var kernel = ee.Kernel.fixed(9, 9, rows, -4, -4, false);
print(kernel);


var newKernel = image.convolve(kernel)
Map.addLayer(newKernel, {bands: ['B5', 'B4', 'B3'], max: 50 },'new');


//--------------OPERATORI MORFOLOGICI-------------------------------------------------------------------------------------------
// focal_max(), focal_min(), focal_median(), focal_mode()
//?????


//------------------GRADIENTS????---------------------------------------------------------------------------

//----------EDGE DETECTION----------------------------------------------------------------------------------------------------------
/*oltre all'utilizzo dei kernel è possibile applicare dei filtri appositi per individuare i contorni. l'algoritmo Canny edge detection algorithm
utilizza quattro filtri separati per inidividuare i contorni diagonali, verticali e orizzontali */
// Load a Landsat 8 image, select the panchromatic band.
var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318').select('B8');

// Perform Canny edge detection and display the result.
var canny = ee.Algorithms.CannyEdgeDetector({
  /*threshold -- il pixel è considerato nel calcolo solo se la mgnitude è >10
  //signma si riferisce alla deviazione standar del filtro gaussiano applicato prima della edge detection.
  applicato epr eliminare rumore ad alta frequenza*/
  image: image, threshold: 10, sigma: 1
});
//l'output è un'immagine che ha le stesse bande dell'immagine di input, in cui i valori diversi da 0 indicano i bordi 
Map.setCenter(-122.054, 37.7295, 10);
Map.addLayer(canny, {}, 'canny');

//Hough transform estrae le linee dall'immagine precedente
var hough = ee.Algorithms.HoughTransform(canny, 256, 600, 100);
Map.addLayer(hough, {}, 'hough');



//zeroCrossing() è un altro algoritmo utilizzato per la edge detection


//----------------PAN SHARPENING----------------------------------------------------------------------------------------------------------------------------------------------
// Load a Landsat 8 top-of-atmosphere reflectance image.
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_044034_20140318');
Map.addLayer( image, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.25, gamma: [1.1, 1.1, 1]}, 'rgb');
print(image, 'imgage');

// trasforma le bande RGB in HSV color space.
var hsv = image.select(['B4', 'B3', 'B2']).rgbToHsv();
//in questo modo di ottengono le bande hue(tonalità), saturazione e value
print (hsv)
Map.addLayer (hsv, {}, 'hsv',1);

// aggiungo la banda 8, che è la pancromatica con 15m di ris geometrica (rispetto alle altre che ne hanno 30m)
var sharpened = ee.Image.cat([
  hsv.select('hue'), hsv.select('saturation'), image.select('B8')
  //trasformo di nuovo in RGB
]).hsvToRgb();

// mostro il risultato
Map.setCenter(-122.44829, 37.76664, 13);
Map.addLayer(sharpened, {min: 0, max: 0.25, gamma: [1.3, 1.3, 1.3]}, 'pan-sharpened');



//-----------------------UNMIXING---------------------------------------------------------------------------------

// un-mix 7 bande dall'immagine Landsat5
var bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'];
var image = ee.Image('LANDSAT/LT05/C01/T1/LT05_044034_20080214')
  .select(bands);
Map.setCenter(-122.1899, 37.5010, 10); // San Francisco Bay
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], min: 0, max: 128}, 'image');

// Define spectral endmembers -valori di riflettanza in ogni banda. come si definiscono?
//ad esempio a partire da un pixel puro https://www.sciencedirect.com/topics/engineering/endmembers
var urban = [88, 42, 48, 38, 86, 115, 59];
var veg = [50, 21, 20, 35, 50, 110, 23];
var water = [51, 20, 14, 9, 7, 116, 4];

// applico l'algoritmo unmix - l'output è un'immagine con tre bande (perchè si sono scelti tre endembers)
var fractions = image.unmix([urban, veg, water]);
Map.addLayer(fractions, {}, 'unmixed');


  
