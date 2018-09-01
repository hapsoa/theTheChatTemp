'use strict';

var uiManager = new function () {

    var $thetheChatWindow = $('.chat-wrapper');
    var $progressWindow = $('.progress-window');
    firebaseApi.setOnAuthStateChangedListener(function () {
        // 처음에는 프로그레스 창 -> 더더챗창으로
        $thetheChatWindow.removeClass('display-none');
        $progressWindow.addClass('display-none');
    });

    firebaseApi.setSignOutListener(function () {
        window.location.replace("/login");
    });
    firebaseApi.setListener('onAuthStateChangedNotHavingUser', function () {
        window.location.replace("/login");
    });

    var $logOutButton = $('#logout-button');
    $logOutButton.on('click', function () {
        console.log('logout');
        firebaseApi.signOut();
    });
}();