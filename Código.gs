/*
**************************POSIBLES MEJORAS******************************
-Añadir un sistema de busqueda, para abstraer al cliente de buscar la ID



************************************************************************

*/
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Cremos nuestro menu spotify, y dentro un submenu para buscar un artista.
  ui.createMenu('Spotify')
      .addItem('Buscar artista', 'myFunction')
      .addToUi();
}

function myFunction() {
  //Accedemos a la hoja
  var ss = SpreadsheetApp.openById("1EUvJ_OyjLaBFmMOOqaS_LpKBjPC8MpKamSqb5bHVwtE");
  var sheet = ss.getSheetByName('Hoja 1');
  
  //Obtenemos id del artista
  var idArtista = Browser.inputBox("Inserta la id del artista:" );
  var correoUser = Browser.inputBox("Inserta tu correo: " );
  
  //Enlace api
  var enlace = 'https://api.spotify.com/v1/artists?ids=';
  
  //Obtenemos enlace tota
  var enlaceArtista = enlace+idArtista;
  
  var response = UrlFetchApp.fetch(enlaceArtista)
  var json = JSON.parse(response.getContentText());
  
  Logger.log(json);
  
 //Insertamos en la fila.
  sheet.getRange("A4").setValue(json.artists[0].name);
  sheet.getRange("B4").setValue(json.artists[0].followers.total);
  sheet.getRange("C4").setValue(json.artists[0].popularity);
  sheet.getRange("D4").setValue(json.artists[0].external_urls.spotify);
  
  /*
  //OTRA OPCION
  //Creo un array para guardar los datos y voy despues en la linea 43 vamos insertando fila a fila y no se solapan, asi podemos insertar mas artistas.
  var stats=[]; 
  
  stats.push(json.artists[0].name);
  stats.push(json.artists[0].followers.total);
  stats.push(json.artists[0].popularity);
  stats.push(json.artists[0].external_urls.spotify);
  
  sheet.appendRow(stats);
  */
  //Enviamos correo al usuario usando esta herramiento como log, sabiendo lo que ha buscado anteriormente
  MailApp.sendEmail(correoUser, "Mini App by @jsalasdev", "Has añadido satisfactoriamente a "+json.artists[0].name+" con los seguidores "+json.artists[0].followers.total+" y la popularidad "+json.artists[0].popularity);  
  
}

