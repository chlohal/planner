var thisWeek,
    classesAutoComplete,
    schedPhrase = '';

function loadFunction() {

  
  thisWeek = Date.today().add({days:1}).last().monday()

  setWeek();


  
}

function setWeek(e) {
  if(e === undefined) thisWeek = Date.today().add({days:1}).last().monday();
  else if(e !== undefined && thisWeek === undefined) thisWeek = e
  if(thisWeek.getTime() == Date.today().add({days:1}).last().monday().getTime()) {
    document.getElementById('weekDisp').innerHTML = "This Week"
  } else {
      if(thisWeek.getDate().toString().length == 1) { var date = thisWeek.getDate() + ' '; }
      else { var date = thisWeek.getDate(); }
      document.getElementById('weekDisp').innerHTML = ( thisWeek.getMonth() + 1 ) + '/' + date
  }
  //thisWeek = thisWeek.add({days: 7});
  
  for(var i = 0, e = document.querySelectorAll('th'); i < e.length; i++) {
      e[i].classList.remove("noclass");
  }
  for(var i = 0, e = document.querySelectorAll('td'); i < e.length; i++) {
      e[i].innerHTML = ''
      e[i].style.background = ''
  }
  

  var dayStuff = {
      "1": 'C',
      "2": 'A',
      "3": 'F',
      "4": 'D',
      "5": 'B',
      "6": 'G',
      "7": 'E',
      'undefined': 'No'
  };
  var timeStuff = [
      '8:00-9:30',
      '9:50-11:20',
      ['11:25-12:45'],
      '12:50-1:40',
      '1:45-2:35'
  ];
  
  //Fill day names in the header, mark non-school days as such
  for(var i = 0, e = document.querySelectorAll('th > div'), days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; i < 5; i++) {
     var thatDate = new Date((thisWeek.getTime() + 86400000 * i));
     e[i].innerHTML = days[i] + ' ' + ( thatDate.getMonth() + 1 ) + '/' + thatDate.getDate() + ' | '+ dayStuff[day_data[(thatDate.getMonth() + 1) + '-' + new Date((thisWeek.getTime() + 86400000 * i)).getDate()]] + ' Lunch'
     if(day_data[(thatDate.getMonth() + 1) + '-' + thatDate.getDate()] === undefined) {
         e[i].parentElement.classList.add('noclass');
     }
  }
  
  //fill lists
  for(var iz = 0, es = document.querySelectorAll('main > table > tbody > tr:not(#tabletop)'); iz < es.length; iz++) {

    for(var i = 0; i < 5; i++) {
        var thatDate = new Date((thisWeek.getTime() + 86400000 * i));
        var dayState = day_data[(thatDate.getMonth() + 1) + '-' + thatDate.getDate()];
        if(dayState !== undefined) {
            dayState = dayStuff[dayState].toLowerCase();
            var peopleWhoQualify = [[],[],[]];

          
          
            for(var ii = 0, en = Object.entries(peopleData); ii < en.length; ii++) {
              var schedDat = en[ii][1].c1[dayState];
              console.log(schedDat);
              if(schedDat.i) {
              if(schedDat.i.substring(0,1) == '1' || schedDat.i.substring(0,1) == '0' || schedDat.i.substring(0,2) == '86') {
                peopleWhoQualify[2].push(en[ii][0]);
              } else if (schedDat.i.substring(0,1) == '3' || ( schedDat.i.substring(0,1) == '8' && schedDat.i.substring(0,2) != '86')) {
                  peopleWhoQualify[1].push(en[ii][0]);
              } else if (schedDat.i.substring(0,1) == '4' || schedDat.i.substring(0,1) == '2' || schedDat.i.substring(0,1) == '7' || ( schedDat.i.substring(0,1) == '8' && schedDat > 8200) ) {
                  peopleWhoQualify[0].push(en[ii][0]);
              }
              }
            }
            console.log(peopleWhoQualify[iz]);
            es[iz].querySelectorAll('td')[i].innerHTML = 'Lunch ' + (iz + 1) + ': '+ peopleWhoQualify[iz].join(', ').replace(/_/g,' ');

        } 
      
    }
  }
  if(!localStorage.getItem('sched')) return
   for(var i = 0, e = document.querySelectorAll('tr'); i < e.length; i++) {

   
   }
}

