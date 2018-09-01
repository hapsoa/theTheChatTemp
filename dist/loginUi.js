'use strict';

var loginUiManager = new function () {

    var $signInButton = $('#signInButton');
    var $loginWindow = $('.form-signin');
    var $progressWindow = $('.progress-window');
    $signInButton.on('click', function () {
        console.log('sign in button');

        firebaseApi.signIn();
        $loginWindow.addClass('display-none');
        $progressWindow.removeClass('display-none');
    });

    firebaseApi.setOnAuthStateChangedListener(function () {
        window.location.replace("/jaejong");
    });
}();