'use strict';

function loadAndShowPolls(){
    var appUrl = window.location.origin;
    var apiUrl = appUrl + '/api/all_polls';
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var jsonData= JSON.parse(xmlhttp.response);
            for (var i=0; i< jsonData.length; ++i){
                $('#poll_list').append('<a class="list-group-item" href="/p/' + jsonData[i].url + '">' + 
                jsonData[i].question +' </a>');
            }
            $('#poll_loader').remove(); // don't show loading animation anymore
        }
    };
    xmlhttp.open('GET', apiUrl, true);
    xmlhttp.send();
}

(function () {
   utilFunctions.ready(loadAndShowPolls());
})();