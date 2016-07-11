'use strict';

function handleNewPollsAndOptions(){
    var appUrl = window.location.origin;

    $("#addOptionButton").on('mousedown', function(){
        var numberOfOptions = $("#options").children().length + 1; // + new one
        console.log(numberOfOptions);
        $("#options").append('<div class="form-group"><label>Option ' + numberOfOptions + ':</label><input type="text" class="form-control"/></div>');
    });
    
    $("#submitPollButton").on('mousedown', function(){
        var optionsHtml =  $("#options").children().children(".form-control").toArray();
        var optionsExtracted = [];
        for (var i=0; i < optionsHtml.length; ++i){
            optionsExtracted.push({count: 0, description: optionsHtml[i].value});
        }
        
        var dummyPoll = {
			author: "dummyUser",
			question: $("#poll_question").val(),
			options: optionsExtracted
		};
		
		var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', appUrl + "/api/new_poll", true);
        xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.onload = function() {
            console.log(this.responseText);
            window.location = appUrl + "/p/" + this.responseText;
        }
        xmlhttp.send(JSON.stringify(dummyPoll));
    });
}


(function () {
   utilFunctions.ready(handleNewPollsAndOptions());
})();