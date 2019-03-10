// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var JSONdb = require('simple-json-db');
var db = new JSONdb(__dirname + '.data/db.json');
var querystring = require('querystring');
var words = require("random-words");



// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.get('/lunch', function(request, response) {
  response.sendFile(__dirname + '/views/lunch.html');
});


app.get('/updateSched', function(request, response) {
  try{
    var jsdb = db.JSON();
    var qs = JSON.parse(decodeURIComponent(request.query.content));
    if(qs.s == null) if(qs.p) qs.f = 1
    
      if(!qs.p || qs.f == 0 || !jsdb[qs.p]) {
          while(!jsdb[qs.p]) {
              qs.p = words(3).join(' ');
              if(!jsdb[qs.p]) jsdb[qs.p] = {s: qs.s}
          }

          if(qs.f == 0) qs.f = 1
      }
  
    if(qs.f == 1 && jsdb[qs.p]) {
        qs.s = jsdb[qs.p].s
        response.send(JSON.stringify({s: jsdb[qs.p].s, p: qs.p}));
    
    }
  
    if(qs.f == 2 && jsdb[qs.p]) {
        jsdb[qs.p].s = JSON.parse(qs.s);
      
        response.send(JSON.stringify({s: jsdb[qs.p].s, p: qs.p}));
      
    }
  
      db.JSON(jsdb);
      db.sync();
  }catch(e) {}
   //console.log(db.JSON()[qs.p].s);
});

app.get('/updateNotes', function(request, response) {
    try {
    var jsdb = db.JSON();
    var qs = JSON.parse(decodeURIComponent(request.query.content));
    if(!qs) return
    if(!qs.p) return
    if(!jsdb[qs.p]) jsdb[qs.p] = {};
    if(!jsdb[qs.p].n) jsdb[qs.p].n = {};
    if(qs.f == 0) {
        response.send({n:jsdb[qs.p].n});
                      
    } else if (qs.f == 1) {
      jsdb[qs.p].n[qs.n] = qs.c
      response.send({n:jsdb[qs.p].n});
      db.JSON(jsdb);
      db.sync();
    }
      console.log('updateNotes - ' + qs.p + '/' + qs.n + ' to ' + qs.c);
       } catch(e){console.log(e)}
});
// listen for requests :)
var listener = app.listen(5560, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
