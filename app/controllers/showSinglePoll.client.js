'use strict';

function addOptionOnServer(){
    var appUrl = window.location.origin;
    var id = window.location.pathname.substr(3);
    var apiUrl = appUrl + '/api/add_option/' + id + '?newOption=' + encodeURIComponent($("#addOptionForm").val());
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function () {
        if (this.response == "OK"){
            window.location = window.location;
        } else {
            console.log("here");
            $("#addOptionForm").val("...Please login first to add an option...");
        }
    };
    xmlhttp.open('GET', apiUrl, true);
    xmlhttp.send();
}

function addAnswerToPage(count, totalVoteCount, answerObject){
    var colorId = count % 8;
    var percentageString = "";
    var percentage = (answerObject.count / totalVoteCount * 100).toFixed(1);
    if (!isNaN(percentage)){
        percentageString = ""+percentage +"% ";    
    }
    var id = window.location.pathname.substr(3);
    $('#answersDiv').append('<a class="btn color' + colorId + '" href="../api/vote/' + id + '?answer='+ encodeURIComponent(answerObject.description) + '">Vote</a><p class="answerText answerPercent">'+ percentageString + '</p><p class="answerText">' + answerObject.description + '</p><br>');
    if (totalVoteCount > 0){
        $('#answersVizDiv').append('<div class="progress-bar color' + colorId + '" role="progressbar" style="width:' + percentage + '%">' + percentageString + answerObject.description + '</div>');
    }
    console.log(totalVoteCount);
}

function loadAndShowPoll(){
    console.log("loading single poll...");
    var appUrl = window.location.origin;
    var id = window.location.pathname.substr(3);
    var apiUrl = appUrl + '/api/single_poll/' + id;
    
    $("#addOptionButton").on('mousedown', function(){
        addOptionOnServer();
    });
    
    $('#customTweetButton').attr('href', 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(""+window.location));
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var jsonData= JSON.parse(xmlhttp.response)[0]; //only 1 entry
            console.log(jsonData);
            $('#question').text(jsonData.question);
            var totalCountSum = 0;
            for (var i=0; i< jsonData.options.length; ++i){
                totalCountSum += jsonData.options[i].count;
            }
            for (var i=0; i< jsonData.options.length; ++i){
                addAnswerToPage(i, totalCountSum, jsonData.options[i]);
            }
            $('#poll_loader').remove(); // don't show loading animation anymore
        }
    };
    xmlhttp.open('GET', apiUrl, true);
    xmlhttp.send();
}

(function () {
   utilFunctions.ready(loadAndShowPoll());
})();