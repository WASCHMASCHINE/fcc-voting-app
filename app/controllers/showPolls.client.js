'use strict';


function loadAndShowPolls(){
    var appUrl = window.location.origin;
    var apiUrl = appUrl + '/api/all_polls';
    
    var data;
    var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var jsonData= JSON.parse(xmlhttp.response);
            console.log("logging data", jsonData);
            for (var i=0; i< jsonData.length; ++i){
                $('#poll_list').append('<a class="list-group-item" href="#">' + 
                jsonData[i].question  +' </a>');
            }
            $('#poll_loader').remove(); // don't show loading animation anymore
         }
      };
      xmlhttp.open('GET', apiUrl, true);
      xmlhttp.send();
}


(function () {
  /* function updateClickCount (data) {
      var clicksObject = JSON.parse(data);
      clickNbr.innerHTML = clicksObject.clicks;
   }*/

   utilFunctions.ready(loadAndShowPolls());
})();