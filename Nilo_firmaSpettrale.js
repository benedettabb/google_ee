var desert = 
    /* color: #ff0000 */
    /* shown: false */
    ee.Feature(
        ee.Geometry.Polygon(
            [[[30.689274096661457, 30.086145103615838],
              [30.68944575803841, 30.070399257306708],
              [30.710560107403644, 30.06549673702397],
              [30.710045123272785, 30.086590704304513]]]),
        {
          "lable": "desert",
          "system:index": "0"
        }),
    vegetation = 
    /* color: #00ff00 */
    /* shown: false */
    ee.Feature(
        ee.Geometry.MultiPolygon(
            [[[[30.998876264924096, 30.27802126074415],
               [30.99475639187722, 30.275612251860164],
               [30.99552886807351, 30.272165413248008],
               [31.000163725251245, 30.27424094347035]]],
             [[[30.93357911837874, 30.29371487956044],
               [30.929931314118488, 30.29315904860269],
               [30.930060060151202, 30.29238087996968],
               [30.933707864411456, 30.29315904860269],
               [30.933536203034503, 30.293455492172182]]],
             [[[30.917185456879718, 30.297605608059758],
               [30.916498811371905, 30.2959752263352],
               [30.91834417117415, 30.294789477146463]]],
             [[[30.906456620820148, 30.29004633702669],
               [30.906242044098956, 30.288119370834195],
               [30.908301980622394, 30.28793408362851],
               [30.909503610261066, 30.290231620242587]]]]),
        {
          "lable": "vegetation",
          "system:index": "0"
        }),
    water = 
    /* color: #0000ff */
    /* shown: false */
    ee.Feature(
        ee.Geometry.MultiPolygon(
            [[[[30.913451821930988, 30.293603713620897],
               [30.91388097537337, 30.28974988315324],
               [30.916756303437335, 30.28656294742932],
               [30.91834417117415, 30.28711881576579],
               [30.915082605012042, 30.29093569327116]]],
             [[[30.948231154206205, 30.2874152775907],
               [30.941450529816557, 30.286525889428248],
               [30.953895979645658, 30.281337631115246],
               [30.954925947907377, 30.281782349720814]]],
             [[[30.965998106720853, 30.24809554626309],
               [30.966684752228666, 30.242015465428025],
               [30.96780055117886, 30.24498140551485]]]]),
        {
          "lable": "water",
          "system:index": "0"
        }),
    roi = 
    /* color: #009999 */
    /* shown: false */
    ee.Geometry.Point([30.755410351655737, 30.212844248074163]),
    urban = 
    /* color: #ff9999 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      }
    ] */
    ee.Feature(
        ee.Geometry.MultiPolygon(
            [[[[30.927126890476497, 30.46857003599208],
               [30.927126890476497, 30.460284135318496],
               [30.938456541355404, 30.460284135318496],
               [30.938456541355404, 30.46857003599208]]],
             [[[30.968840605076107, 30.44282225187047],
               [30.968840605076107, 30.438234289012936],
               [30.973303800876888, 30.438234289012936],
               [30.973303800876888, 30.44282225187047]]],
             [[[30.890734678562435, 30.469161859068564],
               [30.890734678562435, 30.465462905838088],
               [30.891764646824154, 30.465462905838088],
               [30.891764646824154, 30.469161859068564]]],
             [[[30.86464214926556, 30.460728040722312],
               [30.86464214926556, 30.460728040722312],
               [30.86464214926556, 30.460728040722312],
               [30.86464214926556, 30.460728040722312]]],
             [[[30.84661770468548, 30.464131248286147],
               [30.84661770468548, 30.4616158454619],
               [30.848849302585872, 30.4616158454619],
               [30.848849302585872, 30.464131248286147]]]], null, false),
        {
          "system:index": "0",
          "lable": "urban"
        }),
    rec = 
    /* color: #9999ff */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[30.633585935886654, 30.680507829361282],
          [30.633585935886654, 29.750139620221418],
          [30.990641599949154, 29.750139620221418],
          [30.990641599949154, 30.680507829361282]]], null, false);


//come estrarre la firma spettrale dai training sites di un'immagine

//carico il dataset sentinel 2 e prendo l'immagine meno nuvolosa
var s2 = ee.ImageCollection ('COPERNICUS/S2_SR')
  .filterDate ('2020-10-05', '2020-10-06')
  .filterBounds(rec)
  .sort ('CLOUDY_PIXEL_PERCENTAGE')
  .first();
print(s2);

//carico anche l'immagine radar s1
var sentinel1 = ee.ImageCollection("COPERNICUS/S1_GRD")
  .filterMetadata ('resolution_meters', 'equals', 10)
  .filter (ee.Filter.eq ('instrumentMode', 'IW'))
  .filter (ee.Filter.listContains ('transmitterReceiverPolarisation', 'VV'))
  .filter (ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
  .filterDate('2020-09-05', '2020-10-06')
  .filterBounds(roi)
//mosaico la imageCollection in una sola immagine
var s1 = sentinel1.mosaic()
print(s1, 'sentinel 1')

//ritaglio le due immagini nella zona di interesse 
var s2clipped = s2.clip(rec)
var s1clipped = s1.clip(rec)

//imposto i parametri di visualizzazione per l'immagine ottica
var visParams = {min:0, max:5000, bands:['B4','B3','B2']};

//aggiungo le due immagini ritagliate alla mappa 
Map.addLayer (s2clipped, visParams, 'sentinel 2', true);
Map.addLayer (s1clipped, {min:-15, max:10, bands:['VV', 'VH']}, 'sentinel 1', true);

//centro la mappa 
Map.centerObject(roi, 8);

//seleziono le bande dell'immagine ottica
var subset = s2clipped.select ('B[1-7]');

//creo una featureColl con le features create, ciascuna per ogni classe
var samples = ee.FeatureCollection ([desert,vegetation, water, urban]);

//imposto lo stile del grafico
var chartStyle = {
  title: 'S2 firma spettrale',
  hAxis: { title: "Lunghezza d'onda (nm)"},
  vAxis: { title: 'Riflettanza'},
  lineWidth: 1,
  pointSize: 5,
  //i colori non vengono impostati ??
  series: {
    desert: {colour: 'red'},
    vegetation: {colour:'green'},
    water: {colour: ' blue'},
    urban: {colour: 'pink'}
}};

/*trasformo le bande in lunghezze d'onda: 
valori medi in nanometri  per le 7 bande di Sentinel2*/
var Londa = [443, 493, 559.5, 664.7, 703.8, 739.6, 708.8]

//aggiungo il grafico
var grafico = ui.Chart.image.regions ({
  //immagine da cui estrarre le bande:
  image:subset, 
  //regioni da cui estrarre i valori: featureCollection con i training sites
  regions: samples, 
  //come si riducono i valori in ogni training site? facendo la media
  reducer: ee.Reducer.mean(), 
  //scala in metri 
  scale: 10, 
  //Proprietà da utilizzare come etichetta per ciascuna regione nella legenda 
  // inserita in property di ogni feature
  seriesProperty: 'lable', 
  //etichette nel'asse x
  xLabels: Londa 
})
  .setChartType ('ScatterChart')
  .setOptions(chartStyle);
  
print(grafico);

