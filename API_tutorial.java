//STRINGA

var stringa = 'stringa'
print (stringa)
print (typeof(stringa))

//NUMERO

//numero (non c'è distinzione tra integer e float)
var num = 10.8
print (num)
print(typeof(num))


//LISTA

//lista di oggetti
var list = [4,5, 'thrj', 5434, 'kdjkss4']
print (list)
//seleziono solo un elemento
print (list[2])
//il tipo è:oggetto
print(typeof(list))

//DIZIONARIO

// creo un oggetto con dentro coppie di valori
var object = {
  foo: 'bar',
  baz: 13,
  stuff: ['this', 'that', 'the other thing']
};
print('Dictionary:', object);
// stampo un solo elemento del dizionario
print('Print foo:', object['foo']);
// lo stesso usando il punto.
print('Print stuff:', object.stuff);

//FUNZIONE

/*quesa funzione ha un parametro, che si chiama element
e ritorno l'elemento stesso. Non ci sono altri argomenti*/
var specchio = function(element) {
  return element;
};
print(specchio('sono una funzione'));

//-----EARTH ENGINE OBJECT------------------------------------------------------------------------------------------------------------------------------

//STRINGA

//definisco un stringa
var astring = 'STRINGA'
//mando la stringa sul server con la funzione di gee
var estring = ee.String (astring)
//il tipo di astring è stringa
print(typeof(astring))
//il tipo di estring è un oggetto, perchè creato con la funzione di gee
print(typeof(estring))


//posso anche definirla direttamente nel server
var server_string =eeString ('stringa nel cloud')
print (server_string)

//NUMERO

//prendo un numero dal server con Math.E
var serverNumber = ee.Number(Math.E);
print('e=', serverNumber);
/*questo numero è stato creato con una funzione del server quindi
esiste solo nel cloud! il tipo è un oggetto
se voglio farci qualcosa devo utilizzare altr funzioni del server 
di google earth engine,ad esempio .log*/
var logE = serverNumber.log();
print('log(e)=', logE);

/* utilizzo una funzione di java avrò NaN come risultato
perchè l'oggetto è stato creato con una funzione di gee*/
var logE = Math.log(serverNumber)
print (logE)


//LISTA

//creo una lista lato client
var lista_client = ['6','7',19, 9]
//posso estrapolare un elemento dalla lista
print(lista_client[0])
//la lista è un tipo oggetto
print(typeof(lista_client))

//creo una lista sul server
var lista_server = ee.List (['r','l','i'])
print (lista_server)
//su Docs ci sono le funzioni applicabili alla lista, ad esempio sequence
var sequence = ee.List.sequence (4,10,1)
print(sequence)

// per estrarre un valore da una ee.List uso get
var value = lista_server.get(0)
print(value)
var value2 = sequence.get(2);
print('Value at index 2:', value2);

/*per aggiungere un valore ad una lista si usa .add
ma questo da degli errori perche gee non distringue i tipi di oggetti
da una lista*/
//print (value2.add(12)) --errore
//per correggere l'errore si usa ee.Number
print (ee.Number(value2).add(12))
//in questo caso conta i numeri da 4 a 10 e aggiunge 12.
//come si aggiugne un numero alla lista quindi?

//DIZIONARIO

//anche il dizionario può essere creato sul server con una funzione
var dizionario = ee.Dictionary ({
  cosa0:0,
  cosa1:1,
  cosa2:2,
  cosa3:3,
})

print (dizionario)

//altro esempio
var dictionary = ee.Dictionary({
  e: Math.E,
  pi: Math.PI,
  phi: (1 + Math.sqrt(5)) / 2
});

// prendere e stampare un valore dal dizionario
print('Euler:', dictionary.get('e'));
print('Pi:', dictionary.get('pi'));
print('Golden ratio:', dictionary.get('phi'));

// prendere tutte le key del dizionario
print('Keys: ', dictionary.keys());

/*una volta che si usa la funzione ee.Dictionary bisogna usare metodi di gee
e non di java script dictionary*/

//il tipo di oggetto è un oggetto, non un numero
print (typeof(dictionary.get('e')))
//per farci qualsiasi cosa devo estrarlo con .getInfo
var estraggo_num = dictionary.get('e').getInfo()
print (estraggo_num2)
print(typeof(estraggo_num2))

// DATA

//la data può essere definita direttamente con gee
var date = ee.Date('2015-12-31');
print('Date:', date);

//posso definirla anche a partire da Java
var now = Date.now();
print('Milliseconds since January 1, 1970', now);
//e poi spedirla al server con ee.Date
var eeNow = ee.Date(now);
print('Now:', eeNow);

//posso scegliere l'ordine
var aDate = ee.Date.fromYMD(2017, 1, 13);
print('aDate:', aDate);

//su Docs c'è la funzione ee.Date.fromYDM con i nomi dei parametri da inserire
var theDate = ee.Date.fromYMD({
  day: 13,
  month: 1,
  year: 2017
});
print('theDate:', theDate);



//-----CLIENT VS. SERVER-------------------------------------------------------------------------------------------------------------------------------
//stringa lato client
var clientString = 'I am a String';
print(typeof clientString);  
//stringa lato server
var serverString = ee.String('I am not a String!');
print(typeof serverString);  
//non è una stringa ma un oggetto!
print(serverString instanceof ee.ComputedObject)
/* è un ee.ComputedObject, cioè il contenitore (proxy object) di qualcosa che
è nel server. 
posso scoprire che c'è nel contenitore stampando*/
print(serverString);
//oppure posso vedere com'è il contenitore stesso
print (serverString.toString())

//se voglio manipolare lato client quello che sta dentro il contenitore
var cheStringa = serverString.getInfo()
print (cheStringa)
//torna ad essere una stringa!!!!!!!!!!!
print(typeof(cheStringa))
  
/*get.Info è una cosa molto potente perchè apre il proxy object!! se ci sono molte cose dentro
può creare problemi. è sempre meglio FARE TUTTO SUL SERVER*/
 
  
//LOOPING
  
/*tutte le cose sul cliente sono fatte dalla CPU del mio pc
le cose server si connettono in qualche modo a gee, quindi è meglio per grandi calcoli
questa è una lista lato client. sconsigliata..
prima si crea una variabile vuota*/
var clientList = [];
//si usa un ciclo for
for(var i = 0; i < 8; i++) {
  clientList.push(i + 1);
}
print(clientList);

//la stessa lista può essere fatta sul server
//creo una lista che va da 0 a 7 compresi
var serverList = ee.List.sequence (0,7);
/*creo una funzione. per applicare questa funzione (parametro n) 
ad ogni oggetto della lista uso .map*/
serverList = serverList.map(function(n){
  return ee.Number(n).add(1)
})
//qui non posso utilizzare  i + 1 - devo usare una funzione server
print(serverList)
//n è una cosa che esiste sono nel server, quindi il print non funziona
//print(n) --errore

//ovviamente la stessa lista avrei potuto crearla semplicemente:
var serverListSimple = ee.List.sequence(1,8);

//la lista client può essere convertira in server
var convertedList = ee.List(clientList);
print (convertedList)
  
//CONDITIONALS
 
//creo una variabile boleana lato server
var myList = ee.List([1, 2, 3]);
var serverBoolean = myList.contains(5);
print(serverBoolean)
//con il print apro il contenitore ma comunque è un oggetto lato server

//lato client
var clientConditional;
//se serverBoolean è vero scrivi vero se è falso scrivi falso
if (serverBoolean) {
  clientConditional = true;
} else {
  clientConditional = false;
}
print(clientConditional); 
//mi dice che è lato client ma non è vero??
 
//lato server
var serverConditional = ee.Algorithms.If(serverBoolean, 'True!', 'False!');
print(serverConditional); 
//mi dice che è lato server infatti è corretto



//----FOR LOOPS----------------------------------------------------------------------------------------------------------------------------------------------

//invece di usare i loop con for si utilizza la funzione map
// creo un lista con numeri da 1 a 10
var mylist = ee.List.sequence (1,10)
print (mylist)

// creo una funzione che da per risultato il quadrato di ogni numero
var funzione = function (n){
  return ee.Number(n).pow(2);
}

//utilizzo map per applicare quella funzione ad ogni elemento della lista
//.map si attacca ad ogni elemento della lista e dentro le parentesi 
//ci va la funzione
var squares = mylist.map (funzione)
print (squares)
  
  
//-----IF ELSE CONDITION-----------------------------------------------------------------------------------------------------------------------------------------------

//invece di usare if else si utilizza la funzione map

//se voglio elevare al quadrato i numeri dispari nella lista
var mylist = ee.List.sequence (1,10)

var numeri_dispari = function(n) {
  n = ee.Number(n) //necessario esplicitarlo per usare mod
  //mod(2) restituisce 0 se il numero è paro e uno se è disparo (divide per 2)
  var remainder = n.mod(2)
  return n.multiply (remainder);
}


//creo una lista con i numeri dispari e i numeri pari (messi a 0)
var newlist = mylist.map(numeri_dispari)
print(newlist)

//cancello i numeri 0 con la funzione removeAll
var disparilist = newlist.removeAll([0])
print (disparilist)

//creo la funzione per elevare al quadrato i numeri
var potenza = function (n){
  return ee.Number(n).pow(2);
}

var list_potenza = disparilist.map (potenza)
print (list_potenza)

 //-------------------- ---------------------- ---------------------
  
//come fare se voglio applicare un algoritmo solo alla parte del dataset
//che soddisfa certe condizioni?
//carico landast8collection
var collection = ee.ImageCollection ("LANDSAT/LC08/C01/T1_TOA");

//filtro la collezione per valori <40 su sun elevation
var under = collection.filter(ee.Filter.lt('SUN_ELEVATION', 40 ))
//filtro la collezione per valori >= 40 su sun elevation
var above = collection.filter(ee.Filter.gte('SUN_ELEVATION', 40))


//creo la funzione applicata a under in tutti gli elementi
var processed1 = under.map(function(image){
  return image.multiply(2)
})

var processed2 = above

//unisci le collezioni in un'unica collezione
var final = processed1.merge(processed2)

print(final)

//-----------CUMULATIVE INTERACTIONS--------------------------------------------------------------------------------------------
 
/*per fare un'operazione sequenziale, in cui il risultato viene utilizzato per l'operazione seguente
si usa iterate(). visto che sono operazioni sequenziali impiegano più tempo. se è possibile è meglio usare map()

//crea una serie di fibonacci con una funzione
var algorithm = function(current, previous) {
  previous = ee.List(previous);
  var n1 = ee.Number(previous.get(-1));
  var n2 = ee.Number(previous.get(-2));
  return previous.add(n1.add(n2));
};

// Compute 10 iterations.
var numIteration = ee.List.repeat(1, 10);
var start = [0, 1];
var sequence = numIteration.iterate(algorithm, start);
print(sequence);  // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]


//------------API -----------------------------------------------------------------------------------------------------------------------

//inserire un immagine nella mappa
//carico un immagine dal dataset:SRTM digital elevation, della NASA, pixel size 90m
//ee.Image è un costrutture di immagini - l'argomento è il nome stringa del dataset
var SRTM = ee.Image("CGIAR/SRTM90_V4")
Map.setCenter (-110, 38, 6)
Map.addLayer (SRTM, {min: 0, max: 4500}, 'SRTM', 1)
/*se nn si specificano i valori di stretching gee inserisce numeri di default che
in questo caso sarebbero [-32768, 32767] perchè l'immagine è a 16bit (anche se effettivamente)
i valori vanno da -444 a 8806*/
print (SRTM, 'srtm')
/*sulla console c'è scritto che l'unica banda si chiama
elevation ed è signed int16. se fosse stata float i valori sarebbero
visualizzati per defult da 0 a 1, se fosse stata byte da 0 a 225*/

//definisco dei parametri di visualizzazione
//la palette è una lista di elementi stringa, dal massimo al minimo valore (con stretching lineare)
var palette= {min:0, max: 3000, palette: ['red','yellow','green']}
//aggiugno un nuovo layer con quei paramentri
Map.addLayer (SRTM, palette, 'SRTM palette', 1)

  
//fare calcoli con un'immagine a una banda
  
//inserisco il dataset SRTM 90m
var dataset = ee.Image ('CGIAR/SRTM90_V4')

//applico una funzione per calcolare la pendenza in percentuale. per ogni pixel si usano i 4 pixel vicini
var slope = ee.Terrain.slope (dataset)
//definisco una palette
var palette = ['red', 'pink', 'yellow', 'green']
//definisco i parametri di visualizzazione
var visPar = {min:0, max: 1, palette: palette}
//aggiungo l'immaagine alla mappa
Map.addLayer (slope, visPar, 'slope', true)
Map.setCenter (36.6, -3.3, 7)
  
-----------------------------------------------------------------------------------------------------
//inserisco il dataset SRTM 90m
var dataset = ee.Image ('CGIAR/SRTM90_V4')

//utilizzo la funzione ee.Terrain.aspect per ottenere l'aspect in gradi
var aspect = ee.Terrain.aspect (dataset)
print (aspect)

//converto da gradi in radianti (diviso 180 per pigreco) 
var radianti = aspect.multiply(Math.PI).divide (180)
//divido per il seno
var sin = radianti.sin()

//aggiungo l'immaagine alla mappa
Map.addLayer (sin, {min:-1, max:1}, 'sinImage', 1)
Map.setCenter (36.6, -3.3, 7)

-------------------------------------------------------------------------------------------------------
//ora voglio calcolare l'elevazione media in un zona
//inserisco il dataset SRTM 90m
var dataset = ee.Image ('CGIAR/SRTM90_V4')
print(typeof(dataset))

//utilizzo il metodo reduceRegion che è disponibile per le immagin (object)
var media_elev = dataset.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: geometry,
  //è importante definire la scala: dimensione in pixel in m da utilizzare
  scale: 90
})
//in teoria media_elev è un dizionario dal quale estrarre l'elevazione
print(media_elev)
var elevazione_media = media_elev.get('elevation')
print (elevazione_media)

//calcolo la pendenza
var slope = ee.Terrain.slope(dataset)
//calcolo la pendenza media nello stesso modo
var media_slope = slope.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: geometry,
  scale: 90
})
print(media_slope)

//per vedere la scala in metri di un dataset
var scale = dataset.projection().nominalScale();
print('SRTM scale in meters', scale);



//--------IMAGE COLLECTION------------------------------------------------------------------------------------------------------

//inserisco una collezione di imamgini
//importo i dati landsat8 OLI, Toa = top-of-atmosphere (TOA) reflectance
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');

//aggiungo una variabile filtro spaziale
var filtroSpaziale = l8.filterBounds (point);
//aggiungo una variabile filtro temporale (applicata sull'immagine filtrata sul point)
var filtroTemporale = filtroSpaziale.filterDate ('2017-06-17', '2017-07-17');

print (filtroTemporale)

  
//AGGIUNGO UN'IMMAGINE ALLA MAPPA
  
// carico il dataset L8 toa filtrato per il punto e per data: ad es l'estate del 2017
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  .filterBounds (point)
  .filterDate ('2017-06-01', '2017-09-01')
print(l8)

//gli dico di prendere tra le proprietà il cloud cover
var sorted = l8.sort('CLOUD_COVER')
print (sorted, 'sorted by cloud')

//e di scegliere l'immagine meno nuvolosa
var l8_sorted = sorted.first ()
print (l8_sorted, "immagine meno nuvolosa dell'estate 2017")

/*definisco i PARAMTRI DI VISUALIZZAZIONE - meglio creare una variabile apposta così posso riutilizzarla
le bande sono float: se non inserisco i parametri min e max 
di default lo stretching applicato sarà da 0 a 1
Devo specificare le bande altrimenti di defult vengono inserite nei tre canali RGB le
prime tre bande*/
var visParams_trueColour = {bands: ['B4','B3','B2' ], min:0, max:0.3}
var visParams_infraRed = {bands: ['B5','B4','B3' ], min:0, max:0.3}
var visParams_654 = {bands: ['B6','B5','B4' ], min:0, max:0.3}
var visParams_764 = {bands: ['B7','B6','B4' ], min:0, max:0.3}
var visParams_753 = {bands: ['B7','B5','B3' ], min:0, max:0.3}


//inserisco le immagini
Map.addLayer (l8_sorted,visParams_trueColour, 'L8 2017 true colour',1)
Map.addLayer (l8_sorted,visParams_infraRed, 'L8 2017 infra red',1)
Map.addLayer (l8_sorted,visParams_654, 'L8 2017 654',1)
Map.addLayer (l8_sorted,visParams_764, 'L8 2017 764',1)
Map.addLayer (l8_sorted,visParams_753, 'L8 2017 753',1)

//con centerObject non devo inserire lat e long ma una geometria o l'immagine stessa 
Map.centerObject (l8_sorted, 10)

  
//AGGIUNGO UNA COLLEZIONE DI IMMAGINI ALLA MAPPA

//// carico il dataset L8 toa filtrato per il punto e per data: ad es l'estate del 2017
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  .filterBounds (point)
  .filterDate ('2017-06-01', '2017-09-01')//.mosaic (se lo aggiungo le diverse immagini vengono composte in un'unica immagine - prende i valori più recenti x ogni pixel)
print(l8)

var visParams_trueColour = {bands: ['B4','B3','B2' ], min:0, max:0.3}
var visParams_infraRed = {bands: ['B5','B4','B3' ], min:0, max:0.3}

//inserisco le immagini
Map.addLayer (l8,visParams_trueColour, 'L8 2017 true colour',1)
Map.addLayer (l8,visParams_infraRed, 'L8 2017 infra red',1)

//con centerObject non devo inserire lat e long ma una geometria o l'immagine stessa 
Map.centerObject (l8, 10)
  
//quando carico un dataset vengono visualizzati i pixel più recenti. per questo vedo una discontinuità tra le immagini

//COMPOSIT CON MEDIAN REDUCER
// carico il dataset L8 toa filtrato per il punto e per data: ad es l'estate del 2017
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA')
  .filterBounds (point)
  .filterDate ('2017-06-01', '2017-09-01').median()
print(l8)

/*con.median (dopo la data sempre!!!)invece di prendere l'ultimo pixel disponibile gee 
prende un valore medio nel tempo per ogni pixel. questo ha l'effetto di rimuovere
le nuvole, che hanno un valore alto,
e le ombre, che hanno un valore basso*/

var visParams_trueColour = {bands: ['B4','B3','B2' ], min:0, max:0.3}
var visParams_infraRed = {bands: ['B5','B4','B3' ], min:0, max:0.3}
Map.addLayer (l8,visParams_trueColour, 'median true colour',1)
Map.addLayer (l8,visParams_infraRed, 'median infra red',0)
Map.centerObject (point, 10)
  
  
  
//MASKING
  
//voglio caricare una maschera per l'acqua --> uso .select, .eq e .updateMask
//carico il dataset global forest change. 
var hansen = ee.Image("UMD/hansen/global_forest_change_2015")
print(hansen)

//la banda datamask ha 2= acqua e 1=land o Nan
var water = hansen.select('datamask')

/*equal da come risultato 1 se il primo valore (quello in water)
è uguale al secondo (l'argometno tra parentesi, 1). tutto il resto viene messo a 0. in questo caso land = 1, water = 0*/
var mask = water.eq(1)

/*con updateMask la maschera (che è l'argomento tra parentesi)
viene applicata all'immagine (water). la maschera deve avere valori che vanno
da 0 a 1 e viene applicata a tutte le bande (in questo caso solo una)
Tutti i pixel che nella immagine/maschera hanno valore 0 diventano trasparenti, NODATA, nella prima immagine*/
var masked = water.updateMask(mask)

print (masked, 'masked image')
Map.addLayer (masked, {palette: ['green']},'masked',1)
Map.centerObject (point, 4)
  
  
//MOSAIC
  
//voglio un'immagine true color nella terra e con valori blu nel mare
//carico i due dataset
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2015');
var l8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA")
  .filterBounds(roi)
var median = l8.filterDate('2017-06-01', '2018-06-01').median();

//stabilisco i paramtri di visualizzazione a colori naturali
var visParams = {bands: ['B4', 'B3', 'B2'], max: 0.3};

//creo un'immagine mascherata in cui: acqua = 0,  land=1
var hansen = hansenImage.select('datamask');
var mask = hansen.eq(1);
var maskedWater = hansen.updateMask(mask);

/*uso .not per invertire tutti i valori. questa funzione ritorna un'immagine
con valori 0 nei valori 1 della prima immagine e vicevera*/
var water1_land0 = mask.not()
/*water è un'immagine in cui l'acqua ha valore 1 e la terra ha valore 0.
Per impostare land = nodata applico all'acqua la maschera di se stessa*/
var water1_landNO = water1_land0.mask(water1_land0)


//visualizzo tutte le immagini nella mappa
//mask ha water= 0 (white), land=1 (green)
Map.addLayer(mask, {palette: ['white','green']}, 'mask',0)
//water1_land0 ha land = 0 (white), water = 1 (blue)
Map.addLayer (water1_land0, {palette: ['white','blue']}, 'water1_land0',0)
//water1_landNO ha water=1 (blue), land= MASCHERATO
Map.addLayer (water1_landNO, {palette: ['white','blue']}, 'water1_landNO',0)
//l8 median e centro la mappa
Map.addLayer (median, visParams, 'L8 median',0)
Map.centerObject(roi,7)

//uso mosaic per comporre le due immagini, ma mosaic funziona solo con collezioni di imamgini!
/*ee.ImageCollection costruisce una collezione di immagini - qui le immagini
le inserisco con .visualize - questo trasforma le immagini in immagini a 3 bande, 8bit 
e in relazione ai parametri di visualizzazione impostati */
var mosaic = ee.ImageCollection ([
  median.visualize(visParams),
  water1_landNO.visualize ({palette:'blue'}),
]).mosaic()

Map.addLayer(mosaic, {}, 'custom mosaic', 0);


//-----NDVI---------------------------------------------------------------------------------------------------------------------

