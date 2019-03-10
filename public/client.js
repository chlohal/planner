var thisWeek,
    classesAutoComplete,
    schedPhrase = '';

function loadFunction() {
  classesAutoComplete = new autoComplete({selector: '#AclassInput', source: autoCompleteFunction, onSelect: autoCompleteSelect, minChars: 1});
  classesAutoComplete = new autoComplete({selector: '#BclassInput', source: autoCompleteFunction, onSelect: autoCompleteSelect, minChars: 1});
  classesAutoComplete = new autoComplete({selector: '#CclassInput', source: autoCompleteFunction, onSelect: autoCompleteSelect, minChars: 1});
  classesAutoComplete = new autoComplete({selector: '#DclassInput', source: autoCompleteFunction, onSelect: autoCompleteSelect, minChars: 1});
  classesAutoComplete = new autoComplete({selector: '#EclassInput', source: autoCompleteFunction, onSelect: autoCompleteSelect, minChars: 1});
  classesAutoComplete = new autoComplete({selector: '#FclassInput', source: autoCompleteFunction, onSelect: autoCompleteSelect, minChars: 1});
  classesAutoComplete = new autoComplete({selector: '#GclassInput', source: autoCompleteFunction, onSelect: autoCompleteSelect, minChars: 1});
  
	window.autoCompleteSelect = function(evt, term, item) {
	    if(class_data[term] !== undefined) evt.target.value = term
    }
  
  thisWeek = Date.today().add({days:1}).last().monday()

  setWeek();

  if(!localStorage.getItem('notes')) localStorage.setItem('notes', '{}')
  
  if(localStorage.getItem('schedPhrase') != null) {
      schedPhrase = localStorage.getItem('schedPhrase')
      sendSchedToServer({p: schedPhrase, f: 1, s: localStorage.getItem('sched')});
      
      etNotes({p: schedPhrase, f: 0});
  }
  else sendSchedToServer({p: null, f: 0, s: localStorage.getItem('sched')});
  
}


function saveClasses() {
    
    try {  
  
    var oldSched = localStorage.getItem('sched');
    var inputs = document.getElementsByClassName('classInput');
    var inputParsed = [];
    for(var i = 0; i < inputs.length; i++) {
      try {
        if(class_data[inputs[i].value] !== undefined) {
            inputParsed.push({p:inputs[i].id.substring(0,1), c: inputs[i].value, i: class_data[inputs[i].value], r: inputs[i].nextElementSibling.nextElementSibling.value, b: inputs[i].nextElementSibling.nextElementSibling.nextElementSibling.value});
        } else inputParsed.push({p:inputs[i].id.substring(0,1), c: inputs[i].value, r: inputs[i].nextElementSibling.nextElementSibling.value, b: inputs[i].nextElementSibling.nextElementSibling.nextElementSibling.value})
      } catch (e) {}
    }
    if(inputParsed.length != 0) {
    localStorage.setItem('sched',JSON.stringify(inputParsed));
    }
  
    } catch(e) {}
      
    if(document.getElementById('schedPhraseBox').value != schedPhrase && document.getElementById('schedPhraseBox').value != null) {
        schedPhrase = document.getElementById('schedPhraseBox').value;
        localStorage.setItem('schedPhrase', document.getElementById('schedPhraseBox').value);
      sendSchedToServer({p: schedPhrase, f: 1, s: JSON.stringify(localStorage.getItem('sched'))});
    } else sendSchedToServer({p: schedPhrase, f: 2, s: JSON.stringify(localStorage.getItem('sched'))});
    if(!document.getElementById('backupScheduleCheckbox').checked) { localStorage.setItem('doNotSync', true); }
    else { localStorage.setItem('doNotSync', false); localStorage.removeItem('doNotSync'); }

    if(!document.getElementById('backupNotesCheckbox').checked) { localStorage.setItem('doNotSync_Notes', true); }
    else { localStorage.setItem('doNotSync_Notes', false); localStorage.removeItem('doNotSync_Notes'); }
  
    if(localStorage.getItem('sched') == null) {
      sendSchedToServer({p: schedPhrase, f: 1, s: JSON.stringify(localStorage.getItem('sched'))});
    }
  

  
  setWeek(thisWeek);
}
function loadClasses() {
  
  document.getElementById('schedPhraseBox').value = schedPhrase
  document.getElementById('backupScheduleCheckbox').checked = !JSON.parse(localStorage.getItem('doNotSync'))
  document.getElementById('backupNotesCheckbox').checked = !JSON.parse(localStorage.getItem('doNotSync_Notes'))
  
    var inputs = document.getElementsByClassName('classInput');
    if(localStorage.getItem('sched') == null) return
    if(localStorage.getItem('sched').length == 0) return
    
    var data = JSON.parse(localStorage.getItem('sched'));
    for(var i = 0; i < inputs.length; i++) {
      if(data[i]) {
        inputs[i].value = data[i].c
        inputs[i].nextElementSibling.nextElementSibling.value = data[i].r
        inputs[i].nextElementSibling.nextElementSibling.nextElementSibling.jscolor.fromString(data[i].b);
      }
    }


}

function autoCompleteSelect(evt, term, item) {
	    if(class_data[term] !== undefined) evt.target.value = term
    }
function autoCompleteFunction(term, suggest) {
	var match = classArray.filter(x => x.toLowerCase().indexOf(term.toLowerCase()) != -1);
	suggest(match);
}

function setWeek(e) {
  if(e === undefined) thisWeek = Date.today().add({days:1}).last().monday();
  else if(e !== undefined && thisWeek === undefined) thisWeek = e
  if(thisWeek.getTime() == Date.today().add({days:1}).last().monday().getTime()) {
    document.getElementById('weekDispTxt').value = "This Week"
  } else {
      if(thisWeek.getDate().toString().length == 1) { var date = thisWeek.getDate() + ' '; }
      else { var date = thisWeek.getDate(); }
      document.getElementById('weekDispTxt').value = ( thisWeek.getMonth() + 1 ) + '/' + date
  }
  //thisWeek = thisWeek.add({days: 7});
  
  for(var i = 0, e = document.querySelectorAll('th'); i < e.length; i++) {
      e[i].classList.remove("noclass");
  }
  for(var i = 0, e = document.querySelectorAll('td'); i < e.length; i++) {
      e[i].innerHTML = ''
      e[i].style.background = ''
  }
  
  //Fill day names in the header, mark non-school days as such
  for(var i = 0, e = document.querySelectorAll('main > table > tbody > tr#tabletop > th > div'), days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; i < 7; i++) {
     var thatDate = new Date((thisWeek.getTime() + 86400000 * i));
     e[i].innerHTML = days[i] + ' ' + ( thatDate.getMonth() + 1 ) + '/' + thatDate.getDate() 
     if(!day_data[(thatDate.getMonth() + 1) + '-' + thatDate.getDate()]) {
         e[i].parentElement.classList.add('noclass');
     }
  }
  var dayStuff = {
      "0": ['A','B','C','D','E'],
      "1": ['F','G','A','B','C'],
      "2": ['D','E','F','G','A'],
      "3": ['B','C','D','E','F'],
      "4": ['G','A','B','C','D'],
      "5": ['E','F','G','A','B'],
      "6": ['C','D','E','F','G']
  };
  var timeStuff = [
      '8:00-9:30',
      '9:50-11:20',
      ['11:25-12:45'],
      '12:50-1:40',
      '1:45-2:35'
  ]
  //fill block names according to the data
  for(var iz = 0, es = document.querySelectorAll('main > table > tbody > tr:not(#tabletop):not(:nth-child(3))'); iz < es.length; iz++) {

    for(var i = 0; i < 7; i++) {
        var thatDate = new Date((thisWeek.getTime() + 86400000 * i));
        var dayState = day_data[(thatDate.getMonth() + 1) + '-' + thatDate.getDate()] - 1;
             console.log('%c['+'%cDayFormatter'+'%c] ' + dayStuff[dayState],'color:initial','color:purple','color:initial');

        if(dayState>-1) {
            //if(i == 3) var time = dayStuff[dayState][iz]
            es[iz].querySelectorAll('td')[i].innerHTML = '<div class="topinfo">' + timeStuff[iz] + '</div> <div style="position:absolute;bottom:50%;top:50%;left:0px;z-index:3;cursor:pointer;"><a href="javascript:" onmousedown="event.stopPropagation()" onclick="openNotes([\''+ dayStuff[dayState][iz] + '\',\''+ i + '\',\'' + thisWeek.getTime() + '\'])">✎</a></div>\n <div class="letterContainer" id="' + dayStuff[dayState][iz] + '_'+ i + '_' + thisWeek.getTime() + '"><a class="classLetter" onmousedown="event.stopPropagation()" onclick="openNotes([\''+ dayStuff[dayState][iz] + '\',\''+ i + '\',\'' + thisWeek.getTime() + '\'])" >' + dayStuff[dayState][iz] + '</a></div><div class="cellsizer"></div>'
        } //else es[iz].querySelectorAll('td')[i].style.background = '#B6B3BC'
    }
  }
  //put in homeroom row
      var lunchPeriods = document.getElementById('homeroomRow').children;
      var tableHeads = document.getElementById('tabletop').children;
      for(var i = 0; i < lunchPeriods.length; i++) {
          
          if(!tableHeads[i].classList.contains('noclass')) {
              lunchPeriods[i].innerHTML = '<div class="topinfo">Homeroom</div><div style="min-height:0.25in"></div>'
          }
      }
  if(!localStorage.getItem('sched')) return
  try {
  //Highlight blocks with classes
  var sched = localStorage.getItem('sched');
  var divs = document.getElementsByClassName('classLetter');
  if(sched !== undefined) {
    sched = JSON.parse(sched);
      try {
      for(var i = 0; i < divs.length; i++) {
        try {
          try {
          var parent = divs[i].parentElement;
          var td = parent.parentElement;
          var schedDat = sched.filter(x => x.p == divs[i].innerHTML)[0];
          } catch(e) {}
          //sched.filter(x => x.p = divs[i].innerHTML.toLowerCase())[0].style.background = '#000'
          try {
          td.innerHTML = td.innerHTML + '<div class="bottominfo">'+ schedDat.c +'</div>'
          } catch(E) {}
          try {
          td.style.background = '#' + schedDat.b
          } catch (e) {}
        } catch(err) {}
      }
      } catch(E) {}
  
    }
  } catch(e) {}
}

function sendSchedToServer(content) {
  
if(JSON.parse(localStorage.getItem('doNotSync'))) return false
  
var xhr = new XMLHttpRequest(),
    method = "GET",
    content = encodeURIComponent(JSON.stringify(content));

xhr.open(method, '/updateSched?content=' + content, true);
xhr.onreadystatechange = function () {
  if(xhr.readyState === 4 && xhr.status === 200) {
    var respDat = JSON.parse(xhr.responseText);
    topAlert(respDat.p);
    //here's where i do stuff with response.send(json whatever)
    localStorage.setItem('schedPhrase', respDat.p);
    schedPhrase = respDat.p
    
    var _sched = localStorage.getItem('sched');
    
    if(respDat.s) localStorage.setItem('sched', respDat.s);
    
    if(_sched != localStorage.getItem('sched')) setWeek(thisWeek);
  }
};
xhr.send(); 
}

function topAlert(x) {console.log(x)}

function changeCSS(cssFile) {

    var style = document.getElementById('stylesheet');

    var _style = document.createElement("link");
    _style.setAttribute("rel", "stylesheet");
    _style.setAttribute("type", "text/css");
    _style.setAttribute("href", cssFile);
    _style.setAttribute("id", 'stylesheet');
   
    document.getElementsByTagName("head")[0].replaceChild(_style, style);
}

var currentlyOpenNote;
function openNotes(noteArray) {
  
  if(!localStorage.getItem('sched')) return
    currentlyOpenNote = noteArray
    
    
    var thatDay = new Date(parseInt(noteArray[2]) + ( 86400000 * parseInt(noteArray[1]) ) )
    var noteHeading = document.getElementById('notesTitle');
    var noteContent = document.getElementById('notesArea');
    var notes = JSON.parse(localStorage.getItem('notes'));
    
    if(notes[currentlyOpenNote.join('_')]) noteContent.value = notes[currentlyOpenNote.join('_')]

  
    noteHeading.innerHTML = 'Notes for ' + ( thatDay.getMonth() + 1 ) + '/' + thatDay.getDate() + ', period ' + noteArray[0] + ' (' + JSON.parse(localStorage.getItem('sched')).filter(x => x.p == noteArray[0])[0].c + ')'
    
    
    
    document.getElementById('noteContainer').hidden = false
}

function closeNote() {

if(!currentlyOpenNote) return console.log('No Open Note!');

    var notes = JSON.parse(localStorage.getItem('notes'));
    if(notes) { notes[currentlyOpenNote.join('_')] = document.getElementById('notesArea').value; }
    localStorage.setItem('notes', JSON.stringify(notes));
                         
    
    document.getElementById('noteContainer').hidden = true
    etNotes({f:1,n:currentlyOpenNote.join('_'),p:schedPhrase,c:document.getElementById('notesArea').value});
  
  
    document.getElementById('notesArea').value = ''
    currentlyOpenNote = null
}

function etNotes(d) {
  
if(JSON.parse(localStorage.getItem('doNotSync_Notes'))) return false
  
var xhr = new XMLHttpRequest(),
    method = "GET",
    content = encodeURIComponent(JSON.stringify(d));

xhr.open(method, '/updateNotes?content=' + content, true);
xhr.onreadystatechange = function () {
  if(xhr.readyState === 4 && xhr.status === 200) {
    var respDat = JSON.parse(xhr.responseText);
    
    
    if(respDat) { localStorage.setItem('notes', JSON.stringify(respDat.n) ) }
    
    
  }
};
xhr.send(); 
}
/*
Obfusticated code:

var _0x86a6=['#AclassInput','#BclassInput','#CclassInput','#DclassInput','#FclassInput','#GclassInput','autoCompleteSelect','target','value','today','last','monday','schedPhrase','getItem','sched','getElementsByClassName','classInput','push','substring','nextElementSibling','length','setItem','stringify','getElementById','schedPhraseBox','backupScheduleCheckbox','doNotSync','removeItem','checked','parse','jscolor','fromString','indexOf','toLowerCase','getTime','innerHTML','This\x20Week','getDate','toString','weekDisp','getMonth','querySelectorAll','classList','style','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','parentElement','noclass','8:00-9:30','9:50-11:20','11:25-12:45','main\x20>\x20table\x20>\x20tbody\x20>\x20tr:not(#tabletop):not(:nth-child(3))','<div\x20class=\x22topinfo\x22>','</div>\x0a','<div\x20class=\x22letterContainer\x22><span\x20class=\x22classLetter\x22\x20onmousedown=\x22event.stopPropagation()\x22>','</span></div><div\x20class=\x22cellsizer\x22></div>','children','tabletop','<div\x20class=\x22topinfo\x22>Homeroom</div><div\x20style=\x22min-height:0.25in\x22></div>','classLetter','filter','<div\x20class=\x22bottominfo\x22>','</div>','lunchRow','querySelector','.classLetter','<div\x20class=\x22lunchDisp\x20two\x22>Lunch\x202</div>','<div\x20class=\x22lunchDisp\x20one\x22>Lunch\x201</div>','open','/updateSched?content=','onreadystatechange','readyState','status','responseText'];(function(_0x409baa,_0x12eefb){var _0x180553=function(_0x3ff6b5){while(--_0x3ff6b5){_0x409baa['push'](_0x409baa['shift']());}};_0x180553(++_0x12eefb);}(_0x86a6,0x1d4));var _0x5364=function(_0x5440e5,_0x597141){_0x5440e5=_0x5440e5-0x0;var _0x5da7f2=_0x86a6[_0x5440e5];return _0x5da7f2;};var thisWeek,classesAutoComplete,schedPhrase='';function loadFunction(){classesAutoComplete=new autoComplete({'selector':_0x5364('0x0'),'source':autoCompleteFunction,'onSelect':autoCompleteSelect,'minChars':0x1});classesAutoComplete=new autoComplete({'selector':_0x5364('0x1'),'source':autoCompleteFunction,'onSelect':autoCompleteSelect,'minChars':0x1});classesAutoComplete=new autoComplete({'selector':_0x5364('0x2'),'source':autoCompleteFunction,'onSelect':autoCompleteSelect,'minChars':0x1});classesAutoComplete=new autoComplete({'selector':_0x5364('0x3'),'source':autoCompleteFunction,'onSelect':autoCompleteSelect,'minChars':0x1});classesAutoComplete=new autoComplete({'selector':'#EclassInput','source':autoCompleteFunction,'onSelect':autoCompleteSelect,'minChars':0x1});classesAutoComplete=new autoComplete({'selector':_0x5364('0x4'),'source':autoCompleteFunction,'onSelect':autoCompleteSelect,'minChars':0x1});classesAutoComplete=new autoComplete({'selector':_0x5364('0x5'),'source':autoCompleteFunction,'onSelect':autoCompleteSelect,'minChars':0x1});window[_0x5364('0x6')]=function(_0x4c1135,_0x142d26,_0x5e7831){if(class_data[_0x142d26]!==undefined)_0x4c1135[_0x5364('0x7')][_0x5364('0x8')]=_0x142d26;};thisWeek=Date[_0x5364('0x9')]()[_0x5364('0xa')]()[_0x5364('0xb')]();setWeek();if(localStorage['getItem'](_0x5364('0xc'))!=null){schedPhrase=localStorage[_0x5364('0xd')](_0x5364('0xc'));sendSchedToServer({'p':schedPhrase,'f':0x1,'s':localStorage[_0x5364('0xd')](_0x5364('0xe'))});}else sendSchedToServer({'p':null,'f':0x0,'s':localStorage[_0x5364('0xd')](_0x5364('0xe'))});}function saveClasses(){try{var _0x12db82=localStorage[_0x5364('0xd')](_0x5364('0xe'));var _0x1d7121=document[_0x5364('0xf')](_0x5364('0x10'));var _0xecaa6f=[];for(var _0x3287f5=0x0;_0x3287f5<_0x1d7121['length'];_0x3287f5++){if(class_data[_0x1d7121[_0x3287f5]['value']]!==undefined){_0xecaa6f[_0x5364('0x11')]({'p':_0x1d7121[_0x3287f5]['id'][_0x5364('0x12')](0x0,0x1),'c':_0x1d7121[_0x3287f5][_0x5364('0x8')],'i':class_data[_0x1d7121[_0x3287f5][_0x5364('0x8')]],'r':_0x1d7121[_0x3287f5]['nextElementSibling'][_0x5364('0x13')][_0x5364('0x8')],'b':_0x1d7121[_0x3287f5][_0x5364('0x13')]['nextElementSibling'][_0x5364('0x13')][_0x5364('0x8')]});}}if(_0xecaa6f[_0x5364('0x14')]!=0x0){localStorage[_0x5364('0x15')](_0x5364('0xe'),JSON[_0x5364('0x16')](_0xecaa6f));}}catch(_0x4e5d74){}if(document[_0x5364('0x17')](_0x5364('0x18'))[_0x5364('0x8')]!=schedPhrase&&document[_0x5364('0x17')](_0x5364('0x18'))[_0x5364('0x8')]!=null){schedPhrase=document[_0x5364('0x17')]('schedPhraseBox')[_0x5364('0x8')];localStorage['setItem'](_0x5364('0xc'),document[_0x5364('0x17')](_0x5364('0x18'))[_0x5364('0x8')]);sendSchedToServer({'p':schedPhrase,'f':0x1,'s':JSON[_0x5364('0x16')](localStorage['getItem'](_0x5364('0xe')))});}else sendSchedToServer({'p':schedPhrase,'f':0x2,'s':JSON[_0x5364('0x16')](localStorage[_0x5364('0xd')](_0x5364('0xe')))});if(!document[_0x5364('0x17')](_0x5364('0x19'))['checked']){localStorage['setItem']('doNotSync',!![]);}else{localStorage['setItem'](_0x5364('0x1a'),![]);localStorage[_0x5364('0x1b')](_0x5364('0x1a'));}if(localStorage[_0x5364('0xd')](_0x5364('0xe'))==null){sendSchedToServer({'p':schedPhrase,'f':0x1,'s':JSON[_0x5364('0x16')](localStorage[_0x5364('0xd')](_0x5364('0xe')))});}setWeek(thisWeek);}function loadClasses(){document[_0x5364('0x17')](_0x5364('0x18'))[_0x5364('0x8')]=schedPhrase;document[_0x5364('0x17')](_0x5364('0x19'))[_0x5364('0x1c')]=!JSON[_0x5364('0x1d')](localStorage[_0x5364('0xd')]('doNotSync'));var _0x3c096f=document[_0x5364('0xf')](_0x5364('0x10'));if(localStorage[_0x5364('0xd')](_0x5364('0xe'))==null)return;if(localStorage[_0x5364('0xd')](_0x5364('0xe'))['length']==0x0)return;var _0x31d21a=JSON[_0x5364('0x1d')](localStorage[_0x5364('0xd')]('sched'));for(var _0x58f42b=0x0;_0x58f42b<_0x3c096f[_0x5364('0x14')];_0x58f42b++){if(_0x31d21a[_0x58f42b]){_0x3c096f[_0x58f42b][_0x5364('0x8')]=_0x31d21a[_0x58f42b]['c'];_0x3c096f[_0x58f42b]['nextElementSibling']['nextElementSibling'][_0x5364('0x8')]=_0x31d21a[_0x58f42b]['r'];_0x3c096f[_0x58f42b][_0x5364('0x13')]['nextElementSibling'][_0x5364('0x13')][_0x5364('0x1e')][_0x5364('0x1f')](_0x31d21a[_0x58f42b]['b']);}}}function autoCompleteSelect(_0x36c7f8,_0x2c8f27,_0x250852){if(class_data[_0x2c8f27]!==undefined)_0x36c7f8[_0x5364('0x7')][_0x5364('0x8')]=_0x2c8f27;}function autoCompleteFunction(_0x3d6594,_0x3e73b1){var _0x2a2917=classArray['filter'](_0x4ca706=>_0x4ca706['toLowerCase']()[_0x5364('0x20')](_0x3d6594[_0x5364('0x21')]())!=-0x1);_0x3e73b1(_0x2a2917);}function setWeek(_0x5f301e){if(_0x5f301e===undefined)thisWeek=Date[_0x5364('0x9')]()[_0x5364('0xa')]()[_0x5364('0xb')]();else if(_0x5f301e!==undefined&&thisWeek===undefined)thisWeek=_0x5f301e;if(thisWeek[_0x5364('0x22')]()==Date[_0x5364('0x9')]()[_0x5364('0xa')]()[_0x5364('0xb')]()['getTime']()){document[_0x5364('0x17')]('weekDisp')[_0x5364('0x23')]=_0x5364('0x24');}else{if(thisWeek[_0x5364('0x25')]()[_0x5364('0x26')]()[_0x5364('0x14')]==0x1){var _0x997136=thisWeek[_0x5364('0x25')]()+'\x20';}else{var _0x997136=thisWeek[_0x5364('0x25')]();}document[_0x5364('0x17')](_0x5364('0x27'))[_0x5364('0x23')]=thisWeek[_0x5364('0x28')]()+0x1+'/'+_0x997136;}for(var _0x37e644=0x0,_0x5f301e=document[_0x5364('0x29')]('th');_0x37e644<_0x5f301e[_0x5364('0x14')];_0x37e644++){_0x5f301e[_0x37e644][_0x5364('0x2a')]['remove']('noclass');}for(var _0x37e644=0x0,_0x5f301e=document[_0x5364('0x29')]('td');_0x37e644<_0x5f301e[_0x5364('0x14')];_0x37e644++){_0x5f301e[_0x37e644][_0x5364('0x23')]='';_0x5f301e[_0x37e644][_0x5364('0x2b')]['background']='';}for(var _0x37e644=0x0,_0x5f301e=document[_0x5364('0x29')]('main\x20>\x20table\x20>\x20tbody\x20>\x20tr#tabletop\x20>\x20th\x20>\x20div'),_0x4fe0bd=['Monday',_0x5364('0x2c'),_0x5364('0x2d'),_0x5364('0x2e'),_0x5364('0x2f'),_0x5364('0x30'),_0x5364('0x31')];_0x37e644<0x7;_0x37e644++){var _0x20584a=new Date(thisWeek['getTime']()+0x5265c00*_0x37e644);_0x5f301e[_0x37e644][_0x5364('0x23')]=_0x4fe0bd[_0x37e644]+'\x20'+(_0x20584a[_0x5364('0x28')]()+0x1)+'/'+_0x20584a[_0x5364('0x25')]();if(day_data[_0x20584a['getMonth']()+0x1+'-'+_0x20584a[_0x5364('0x25')]()]===undefined){_0x5f301e[_0x37e644][_0x5364('0x32')][_0x5364('0x2a')]['add'](_0x5364('0x33'));}}var _0x7a37ae={'1':['A','B','C','D','E'],'2':['F','G','A','B','C'],'3':['D','E','F','G','A'],'4':['B','C','D','E','F'],'5':['G','A','B','C','D'],'6':['E','F','G','A','B'],'7':['C','D','E','F','G']};var _0x14c138=[_0x5364('0x34'),_0x5364('0x35'),[_0x5364('0x36')],'12:50-1:40','1:45-2:35'];for(var _0x392e7a=0x0,_0x568027=document[_0x5364('0x29')](_0x5364('0x37'));_0x392e7a<_0x568027['length'];_0x392e7a++){for(var _0x37e644=0x0;_0x37e644<0x7;_0x37e644++){var _0x20584a=new Date(thisWeek[_0x5364('0x22')]()+0x5265c00*_0x37e644);var _0x41d986=day_data[_0x20584a[_0x5364('0x28')]()+0x1+'-'+_0x20584a[_0x5364('0x25')]()];if(_0x41d986!==undefined){_0x568027[_0x392e7a][_0x5364('0x29')]('td')[_0x37e644]['innerHTML']=_0x5364('0x38')+_0x14c138[_0x392e7a]+_0x5364('0x39')+_0x5364('0x3a')+_0x7a37ae[_0x41d986][_0x392e7a]+_0x5364('0x3b');}}}var _0x10cbd6=document[_0x5364('0x17')]('homeroomRow')[_0x5364('0x3c')];var _0x3a6b97=document[_0x5364('0x17')](_0x5364('0x3d'))['children'];for(var _0x37e644=0x0;_0x37e644<_0x10cbd6[_0x5364('0x14')];_0x37e644++){if(!_0x3a6b97[_0x37e644][_0x5364('0x2a')]['contains'](_0x5364('0x33'))){_0x10cbd6[_0x37e644][_0x5364('0x23')]=_0x5364('0x3e');}}if(!localStorage[_0x5364('0xd')](_0x5364('0xe')))return;var _0x504104=localStorage[_0x5364('0xd')](_0x5364('0xe'));var _0x4048b6=document[_0x5364('0xf')](_0x5364('0x3f'));if(_0x504104!==undefined){_0x504104=JSON['parse'](_0x504104);for(var _0x37e644=0x0;_0x37e644<_0x4048b6[_0x5364('0x14')];_0x37e644++){try{var _0x415772=_0x4048b6[_0x37e644][_0x5364('0x32')];var _0x31d067=_0x415772[_0x5364('0x32')];var _0x565a49=_0x504104[_0x5364('0x40')](_0x396ffd=>_0x396ffd['p']==_0x4048b6[_0x37e644][_0x5364('0x23')])[0x0];_0x31d067[_0x5364('0x23')]=_0x31d067[_0x5364('0x23')]+_0x5364('0x41')+_0x565a49['c']+_0x5364('0x42');_0x31d067[_0x5364('0x2b')]['background']='#'+_0x565a49['b'];}catch(_0x4fa5a9){}}var _0x10cbd6=document[_0x5364('0x17')](_0x5364('0x43'))[_0x5364('0x3c')];for(var _0x37e644=0x0;_0x37e644<_0x10cbd6[_0x5364('0x14')];_0x37e644++){var _0x1d1b5c=_0x10cbd6[_0x37e644][_0x5364('0x44')](_0x5364('0x45'));if(_0x1d1b5c!==null){var _0x565a49=_0x504104[_0x5364('0x40')](_0x17ffeb=>_0x17ffeb['p']==_0x1d1b5c[_0x5364('0x23')])[0x0];if(_0x565a49!=null){if(_0x565a49['i']['substring'](0x0,0x1)=='1'||_0x565a49['i']['substring'](0x0,0x1)=='0'||_0x565a49['i'][_0x5364('0x12')](0x0,0x2)=='86'){_0x10cbd6[_0x37e644][_0x5364('0x23')]=_0x10cbd6[_0x37e644][_0x5364('0x23')]+'<div\x20class=\x22lunchDisp\x20three\x22>Lunch\x203</div>';}else if(_0x565a49['i'][_0x5364('0x12')](0x0,0x1)=='3'||_0x565a49['i'][_0x5364('0x12')](0x0,0x1)=='8'&&_0x565a49['i'][_0x5364('0x12')](0x0,0x2)!='86'){_0x10cbd6[_0x37e644][_0x5364('0x23')]=_0x10cbd6[_0x37e644][_0x5364('0x23')]+_0x5364('0x46');}else if(_0x565a49['i'][_0x5364('0x12')](0x0,0x1)=='4'||_0x565a49['i'][_0x5364('0x12')](0x0,0x1)=='2'||_0x565a49['i'][_0x5364('0x12')](0x0,0x1)=='7'||_0x565a49['i'][_0x5364('0x12')](0x0,0x1)=='8'&&_0x565a49>0x2008){_0x10cbd6[_0x37e644]['innerHTML']=_0x10cbd6[_0x37e644][_0x5364('0x23')]+_0x5364('0x47');}}}}}}function sendSchedToServer(_0x32a4ed){if(JSON[_0x5364('0x1d')](localStorage[_0x5364('0xd')]('doNotSync')))return![];var _0x428d57=new XMLHttpRequest(),_0x140673='GET',_0x32a4ed=encodeURIComponent(JSON[_0x5364('0x16')](_0x32a4ed));_0x428d57[_0x5364('0x48')](_0x140673,_0x5364('0x49')+_0x32a4ed,!![]);_0x428d57[_0x5364('0x4a')]=function(){if(_0x428d57[_0x5364('0x4b')]===0x4&&_0x428d57[_0x5364('0x4c')]===0xc8){var _0x5ed59c=JSON[_0x5364('0x1d')](_0x428d57[_0x5364('0x4d')]);topAlert(_0x5ed59c['p']);localStorage[_0x5364('0x15')]('schedPhrase',_0x5ed59c['p']);schedPhrase=_0x5ed59c['p'];var _0x3984dd=localStorage[_0x5364('0xd')]('sched');if(_0x5ed59c['s'])localStorage[_0x5364('0x15')](_0x5364('0xe'),_0x5ed59c['s']);if(_0x3984dd!=localStorage[_0x5364('0xd')](_0x5364('0xe')))setWeek(thisWeek);}};_0x428d57['send']();}function topAlert(_0x12e040){console['log'](_0x12e040);}
*/

function selectText(D) {
if (document.selection) {
var div = document.body.createTextRange();

div.moveToElementText(D);
div.select();
} else {
var div = document.createRange();

div.setStartBefore(D);
div.setEndAfter(D) ;

window.getSelection().addRange(div);
}

}