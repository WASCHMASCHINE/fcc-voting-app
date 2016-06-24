'use strict';

function handleNewPollsAndOptions(){
    var appUrl = window.location.origin;
    console.log("we loaded the script!");
    //$("#addOptionButton").removeClass("btn-info");
    $("#addOptionButton").on('mousedown', function(){
        
        var numberOfOptions = $("#options").children().length + 1; // + new one
        console.log(numberOfOptions);
        $("#options").append('<div class="form-group"><label>Option ' + numberOfOptions + ':</label><input type="text" class="form-control"/></div>');
    });
}


(function () {
   utilFunctions.ready(handleNewPollsAndOptions());
})();