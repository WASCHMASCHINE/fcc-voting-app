'use strict';

function updateNavbar(){
    var appUrl = window.location.origin;
    var apiUrl = appUrl + '/api/:id';
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
        var data = JSON.parse(this.response);
        if (data.passport){ // add some html
            $("#navbar-name").html(data.passport.user.displayName)
            
            $("#navbar-menu").append('<li><a href="/my_polls"> <span class="glyphicon glyphicon-list"></span> My polls</a></li>');
            $("#navbar-menu").append('<li><a href="/new_poll"> <span class="glyphicon glyphicon-pencil"></span> Create new poll</a></li>');
            $("#navbar-menu").append('<li><a href="/logout"> <span class="glyphicon glyphicon-log-out"></span> Logout</a></li>');
        } else {
            $("#navbar-name").html("Not logged in - Guest");
            $("#navbar-menu").append('<li id="nav-login"><a href="/auth/twitter">Log in</a></li>');
        }
    }
    xmlhttp.open('GET', apiUrl, true);
    xmlhttp.send();
}

(function () {
   utilFunctions.ready(updateNavbar());
})();