'use strict';

function loadAndShowMyPolls(){
    var appUrl = window.location.origin;
    var apiUrl = appUrl + '/api/my_polls';
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            console.log(xmlhttp.response);
            var jsonData= JSON.parse(xmlhttp.response);
            for (var i=0; i< jsonData.length; ++i){
                $("#poll_list").append('<li class="list-group-item"><a href="/p/' + jsonData[i].url + '">' +  
                jsonData[i].question +'</a><a href="/api/delete_poll/' + jsonData[i].url + '" class="icon pull-right btn btn-danger">' +
              '<span class="glyphicon glyphicon glyphicon-remove"></span></a></li>');
            //    $('#poll_list').append('<a class="list-group-item" href="/p/' + jsonData[i].url + '">' + 
            //    jsonData[i].question +' </a>');
            }
            $('#poll_loader').remove(); // don't show loading animation anymore
        }
    };
    xmlhttp.open('GET', apiUrl, true);
    xmlhttp.send();
}

(function () {
   utilFunctions.ready(loadAndShowMyPolls());
})();