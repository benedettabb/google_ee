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

  
  

