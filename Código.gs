function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Cremos nuestro menu spotify, y dentro un submenu para buscar un artista.
  ui.createMenu('Spotify')
      .addItem('Buscar datos de artista', 'buscarArtista')
      .addItem('Mostrar tracks de artista','mostrarTracks')
      .addItem('Mostrar albumes de artista','mostrarAlbumes')
      .addItem('Generar informe de artista','enviarInformeArtista')
      .addItem('Generar informe TOP TRACKS','enviarInformeTracks')
      .addItem('Generar informe TOP ALBUM','enviarInformeAlbumes')
      .addToUi();
}

function setEmail(){
  var correoUser = Browser.inputBox("Inserta tu correo: " );
  return correoUser;  
}

function enviarInformeArtista(){
 
  var ss = SpreadsheetApp.openById("1VMTf583l2r-D5nkdmQ43ATiVmgKNBJLcHu7Oj_q24dI");
  var sheet1 = ss.getSheetByName('Hoja 1');  
  
  var rows = sheet1.getDataRange();
  var numCols = rows.getNumColumns();
  var numRows = rows.getNumRows();
  var string ="";

  for (var i = 1 ; i < numRows; ++i ){
    for(var j = 0 ; j < numCols ; j++){
      if(j==0){
        var name = sheet1.getRange(i+1, j+1).getValue();
      }else if(j==1){
       var followers = sheet1.getRange(i+1, j+1).getValue();
      }else if(j==2){
       var popularity = sheet1.getRange(i+1, j+1).getValue(); 
      }
      
    }
    
    string = "Has buscado a "+name+" con "+followers+" seguidores y "+popularity+" de popularidad. \n Fdo: by @jsalasdev";
    
  }  
  MailApp.sendEmail(setEmail(),"DATOS DE TU ARTISTA",string); 
  
}

function enviarInformeAlbumes(){
  
  var ss = SpreadsheetApp.openById("1VMTf583l2r-D5nkdmQ43ATiVmgKNBJLcHu7Oj_q24dI");
  var sheet1 = ss.getSheetByName('Hoja 2');  
  
  var rows = sheet1.getDataRange();
  var numCols = rows.getNumColumns();
  var numRows = rows.getNumRows();
  var string ="TOP ALBUMES \n";

  for (var i = 2 ; i < numRows; ++i ){
    for(var j = 0 ; j < numCols ; j++){
      if(j==0){
        var nameAlbum = sheet1.getRange(i+1, j+1).getValue();
         string += sheet1.getRange(i+1, j+1).getValue() + "\n";
      }
      
    }
}
  MailApp.sendEmail(setEmail(),"TOP ALBUMES",string); 
}

function enviarInformeTracks(){
  var ss = SpreadsheetApp.openById("1VMTf583l2r-D5nkdmQ43ATiVmgKNBJLcHu7Oj_q24dI");
  var sheet1 = ss.getSheetByName('Hoja 3');  
  
  var rows = sheet1.getDataRange();
  var numCols = rows.getNumColumns();
  var numRows = rows.getNumRows();
  var string ="TOP TRACKS \n";
  
  for (var i = 2 ; i < numRows; ++i ){
    for(var j = 0 ; j < numCols ; j++){
      if(j==0){
        var nameTrack = sheet1.getRange(i+1, j+1).getValue();
      }else if(j==1){
       var popularity = sheet1.getRange(i+1, j+1).getValue();
        string += "Track: "+nameTrack+" Popularidad: "+popularity+" \n ";
      }
      
    }
}
  MailApp.sendEmail(setEmail(),"TOP TRACKS",string); 
  
}

function idArtista(){
  //Accedemos a la hoja
  var ss = SpreadsheetApp.openById("1VMTf583l2r-D5nkdmQ43ATiVmgKNBJLcHu7Oj_q24dI");
  var sheet = ss.getSheetByName('Hoja 1');
  
  //Obtenemos el nombre formado para la consulta
  var cadena="";
  var arrayNombre = splitTest(); 
  for(var i=0;i<arrayNombre.length;i++){
    cadena=cadena+arrayNombre[i]+"+";
  }
  
  cadena = cadena.substr(0,cadena.length-1);
  
  //Enlace api
  var enlace = 'https://api.spotify.com/v1/search?q=';
  
  //Obtenemos enlace total
  var enlaceArtista = enlace+cadena;
  enlaceArtista = enlaceArtista+'&type=artist';

  var response = UrlFetchApp.fetch(enlaceArtista)
  var json = JSON.parse(response.getContentText());  
  var artista = json.artists;
  
  var URL = artista.items[0].external_urls.spotify;
  var arrayURL = URL.split('/');
  var id = arrayURL[arrayURL.length-1];
  
  return id;
  
}

function mostrarTracks(){
  //Accedemos a la hoja
  var ss = SpreadsheetApp.openById("1VMTf583l2r-D5nkdmQ43ATiVmgKNBJLcHu7Oj_q24dI");
  var sheet = ss.getSheetByName('Hoja 3');
  var id = idArtista();
  
  var endpoint = 'https://api.spotify.com/v1/artists/';
  var enlaceTracks = endpoint+id+'/top-tracks?country=ES';
  Logger.log(enlaceTracks);
  var response = UrlFetchApp.fetch(enlaceTracks);
  var json = JSON.parse(response.getContentText());
  
  sheet.clearContents();
  
  Logger.log(json.tracks[1].name);
  Logger.log(json.tracks[1].popularity);
  Logger.log(json.tracks[1].album.images[0].url);
  
  sheet.getRange(0+1,1,1,3).mergeAcross();
  sheet.getRange(1,1).setValue("TOP TRACKS").setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold").setBorder(true, true, true, true, true, true).setFontSize(20).setBackground('#8aff84');
  sheet.getRange(2,1).setValue('TRACK').setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold").setBackground('#d8ffd6');
  sheet.getRange(2,2).setValue('POPULARIDAD').setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold").setBackground('#d8ffd6');
  sheet.getRange(2,3).setValue('CARTEL').setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold").setBackground('#d8ffd6');
  
  var tracks = json.tracks;
  
  for(var i=0;i<tracks.length;i++){
    sheet.getRange(3+i,1).setValue(json.tracks[i].name).setBackground("#cccdce").setBorder(true, true, true, true, true, true).setFontWeight("bold");
    sheet.getRange(3+i,2).setValue(json.tracks[i].popularity).setBackground("#cccdce").setBorder(true, true, true, true, true, true);
    sheet.getRange(3+i,3).setFormula('=image("'+json.tracks[i].album.images[0].url+'")').setBackground("#cccdce").setBorder(true, true, true, true, true, true);
  }
  
}

function mostrarAlbumes(){
 //Accedemos a la hoja
  var ss = SpreadsheetApp.openById("1VMTf583l2r-D5nkdmQ43ATiVmgKNBJLcHu7Oj_q24dI");
  var sheet = ss.getSheetByName('Hoja 2');
  var id = idArtista();
  
  var endpoint = 'https://api.spotify.com/v1/artists/';
  var enlaceAlbumes = endpoint+id+'/albums';
  
  var response = UrlFetchApp.fetch(enlaceAlbumes);
  var json = JSON.parse(response.getContentText());
  
  sheet.clearContents();
  
  sheet.getRange(0+1,1,1,2).mergeAcross();
  sheet.getRange(1,1).setValue("TOP ALBUMES").setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold").setBorder(true, true, true, true, true, true).setFontSize(20).setBackground('#8aff84');
  sheet.getRange(2,1).setValue('ALBUM').setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold").setBackground('#d8ffd6');
  sheet.getRange(2,2).setValue('CARTEL').setHorizontalAlignment("center").setVerticalAlignment("middle").setFontWeight("bold").setBackground('#d8ffd6');
  
   var items = json.items;
  
  for(var i=0;i<items.length;i++){
    sheet.getRange(3+i,1).setValue(json.items[i].name).setBackground("#cccdce").setBorder(true, true, true, true, true, true).setFontWeight("bold");
    sheet.getRange(3+i,2).setFormula('=image("'+json.items[i].images[0].url+'")').setBackground("#cccdce").setBorder(true, true, true, true, true, true);
  }
  
}

function buscarArtista() {
  //Accedemos a la hoja
  var ss = SpreadsheetApp.openById("1VMTf583l2r-D5nkdmQ43ATiVmgKNBJLcHu7Oj_q24dI");
  var sheet = ss.getSheetByName('Hoja 1');
  
  //Obtenemos el nombre formado para la consulta
  var cadena="";
  var arrayNombre = splitTest(); 
  for(var i=0;i<arrayNombre.length;i++){
    cadena=cadena+arrayNombre[i]+"+";
  }
  
  cadena = cadena.substr(0,cadena.length-1);
  
  //Enlace api
  var enlace = 'https://api.spotify.com/v1/search?q=';
  
  //Obtenemos enlace total
  var enlaceArtista = enlace+cadena;
  enlaceArtista = enlaceArtista+'&type=artist';

  var response = UrlFetchApp.fetch(enlaceArtista)
  var json = JSON.parse(response.getContentText());  
  var artista = json.artists;
  
  Logger.log(artista.items[0].name);
  
  sheet.clearContents();
  
  var tr=[];
  
  tr.push("Nombre artista");
  tr.push("Followers");
  tr.push("Popularidad");
  tr.push("Enlace");
  
  sheet.appendRow(tr); 
  
  var stats=[]; 
  stats.push(artista.items[0].name);
  stats.push(artista.items[0].followers.total);
  stats.push(artista.items[0].popularity);
  stats.push(artista.items[0].external_urls.spotify);

  sheet.appendRow(stats);
  
  
  
}

function splitTest() {
  var array = [{}];
  var nombreArtista = Browser.inputBox("Inserta el nombre del artista: ");
  array = nombreArtista.split(" ");
  return array
}

