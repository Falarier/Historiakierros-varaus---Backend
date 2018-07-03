var moment = Moment.moment;

var VuorotEnum = { ID: 0, DATE: 1, RESERVATIONS: 2};
var VaraajatEnum = { NAME: 0, EMAIL: 1, VUOROID: 2, RESERVATIONS: 3};

moment.locale('fi-FI');

var spreadsheetID = "1QUlhHERRfcZyxzVKFZwkxeqPI384dDZ_BPkU8AwSmOI";


function getFormattedTime(date) {
  date = moment(date);
  return date.format("Do MMM") + "kuuta " + date.format("H:mm") ;
}
// ctrl+space intellisense
function doGet(e) {
    
  //return getVuorotFromSheet();
  
  try{
    //return HtmlService.createHtmlOutput('<b>Hello, worldi!</b>');
    var output = HtmlService.createTemplateFromFile('index');
    var html = output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
    return html;
    
  }
  catch(e){
    return ContentService.createTextOutput(JSON.stringify({
      'error' : e
    })).setMimeType(ContentService.MimeType.JSON);
  }

}

function getVuorotFromSheet(){
  //return {"trackingid: " : 6, "status: " : true };
  var ss = SpreadsheetApp.openById(spreadsheetID);
  var sheet = ss.getSheetByName('Vuorot');
  
  
  var jo = {};
  var dataArray = [];
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  sheet = ss.getSheetByName('Varaajat');
  var varaajaRows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  // go through all vuorot
  for(var i = 0, l = rows.length; i < l; i++){
    var dataRow = rows[i];
    var record = {};
    vuoroID = dataRow[VuorotEnum.ID];
    record['id'] = dataRow[VuorotEnum.ID];
    
    record['begin'] = getFormattedTime(dataRow[VuorotEnum.DATE]);
    //record['end'] = moment(dataRow[2]).format("H:mm");
    record['reservations'] = dataRow[VuorotEnum.RESERVATIONS];
    //record['max'] = dataRow[4];
    
    
    var varaajat = [];
    for(var iVaraaja = 0, lVaraaja = varaajaRows.length; iVaraaja < lVaraaja; iVaraaja++){
      var varaajaRow = varaajaRows[iVaraaja];
      var varaajanVuoroID = varaajaRow[VaraajatEnum.VUOROID];
      if(vuoroID == varaajanVuoroID){
        varaajat.push();
        
      }
    }
    
    dataArray.push(record);
  }
  
  return dataArray;
  
  /*
  jo.vuoro = dataArray;
  var result = JSON.stringify(jo);
  var final = ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  
  return final;
  Logger.log("Hello " + result);
  eeeeeeee
  */
  //return sheet.getS// {"trackingid: " : newId, "status: " : true };
}

function addReservationFail(data) {
  var p = addReservationDeep();
  //Promise.all([p(data)
  /*
    return new cPromisePolyfill.Promise (function ( resolve, reject ) {
      try {
        resolve (addReservationDeep(data));
      }
      
      catch (err) {
        Logger.log(err);
        reject (err);
      }
      
    });*/
}

function addReservation(data) {
  Logger.log(data);
  
  // {name=Falarier, agree=true, email=jukka.jokelainen@gmail.com}
  // Allow access by select addData function and run debug
  var ss = SpreadsheetApp.openById(spreadsheetID);
  var sheetVaraajat = ss.getSheetByName('Varaajat');
  var sheetVuorot = ss.getSheetByName('Vuorot');
  
  var vuoroRows = sheetVuorot.getRange(2, 1, sheetVuorot.getLastRow() - 1, sheetVuorot.getLastColumn()).getValues();
  
  // Get all vuoros
    for(var i = 0, l = vuoroRows.length; i < l; i++){
      var vuoroRow = vuoroRows[i];
      var vuoroId = vuoroRow[VuorotEnum.ID];
      
      // Identify the correct vuoro
      if(vuoroId == data.vuoro) {
        var reservations = parseInt(vuoroRow[VuorotEnum.RESERVATIONS]) || 0;
        //var max = vuoroRow[4];
        
        if(true){ //reservations < max){
          // row, column
          //data.people = parseInt(data.people);
          sheetVuorot.getRange(i + 2,3).setValue(reservations + parseInt(data.people));
        
          var holder = [data.name, data.email, data.vuoro, data.people];
          sheetVaraajat.appendRow(holder);
          
          SpreadsheetApp.flush();
          
          data.begin = getFormattedTime(vuoroRow[VuorotEnum.DATE]); //moment(vuoroRow[Vuorot.DATE]).format("H:mm");
          //data.end = moment(vuoroRow[2]).format("H:mm");
          
          var peopleString;
          if(data.people == 1){
            peopleString = "paikan ";
          }
          else{
            peopleString = data.people + " paikkaa ";
          }
          
          var message = "Olet varannut " + peopleString + "historiakierrokselle Lapinlahden Lähteeseen. Kierros alkaa " + data.begin + ". Iloista aikaa kierrosta odotellessa toivoo Lapinlahden Lähteen väki!";
          MailApp.sendEmail({
            to: data.email,
            subject: "Lapinlahden Lähde historiakierrosvaraus: " + data.begin, 
            htmlBody: message
          });

          /*
          MailApp.sendEmail(data.email, "Saunavaraus Lapinlahden juhannukseen 2018", "Olet varannut vuoron nimellä " + data.name 
                            +". Vuoro alkaa klo " + data.begin + " ja loppuu klo " + data.end 
                            + " Lunasta varaamasi laudepaikka Kahvila Lähteeltä viimeistään tunti ennen varattua aikaa. Kahvila Lähde on auki arkisin kello 11-16, juhannusaattona kello 12-18. Osoite Lapinlahdenpolku 8. http://lapinlahdenlahde.fi/fi/kahvila-lahde" 
                            );
        
          
          
          MailApp.sendEmail("kahvila@lapinlahdenlahde.fi", "Saunavaraus Lapinlahden juhannukseen 2018 - " + data.name, "Uusi varaaja " + data.name 
                            +" Vuoro nro" + vuoroId + ". Vuoro alkaa klo " + data.begin + " ja loppuu klo " + data.end
                            );

          */
          //"Olet varannut itsellesi vuoron klo x-x nimellä y. "
          //Maksathan saunavuorosi 12 € Kahvila Lähteelle 22.6. klo 9 mennessä! Osoite Lapinlahdenpolku 8 http://lapinlahdenlahde.fi/fi/kahvila-lahde/"
          return message;
        }
      }
  }
  
  /*
  var sheet = ss.getSheetByName('Agree');
  var user = Session.getActiveUser().getEmail();
  var createdDate = Date();
  var newId = getRandom();
  var holder = [data.name, data.email, createdDate, newId, data.agree, user];
  */

}


function getRandom(){
  return (new Date().getTime()).toString(36);
}

function fillVuorot(){
  
  var ss = SpreadsheetApp.openById(spreadsheetID);
  var sheet = ss.getSheetByName('Vuorot');
  
  var date = moment([2018, 7, 7]);
  date.add(12, 'hours');
  date.add(30, 'minutes');
  
  var holder = [0, date.format(), 0];
  sheet.appendRow(holder);
  
  holder = [1, date.add(1, 'days').format(), 0];
  sheet.appendRow(holder);
      
  
  if(false) {
    var session_length = 75;
    var pause_length = 10;
    var date = moment([2018, 5, 22]);
    
    var ses_start = date.clone().add(12, 'hours');
    var ses_end;
    var ses_next;
    var end = date.clone().add(20, 'hours');
    
    var i = 0;
    do{
      i++;
      ses_end = ses_start.clone().add(session_length, 'minutes');
      ses_next = ses_end.clone().add(pause_length, 'minutes');
      
      var holder = [i, ses_start.format(), ses_end.format(), 0, 12];
      sheet.appendRow(holder);
      
      ses_start = ses_next;
      
    } while(ses_start.clone().add(session_length, 'minutes').isBefore(end));
  
  }
  //var hours = moment().hours(10);
  
  //Logger.log("Heeei aika on: " + start.format());
  //Logger.log("10 tuntia: " + hours.format());
//  var holder = 
}
