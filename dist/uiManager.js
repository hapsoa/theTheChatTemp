'use strict';

var uiManager = new function () {

    var $thetheChatWindow = $('.chat-wrapper');
    var $progressWindow = $('.progress-window');

    firebaseApi.setListener('onAuthStateChangedHavingUser', function () {
        // 처음에는 프로그레스 창 -> 더더챗창으로
        $thetheChatWindow.removeClass('display-none');
        $progressWindow.addClass('display-none');
    });
    firebaseApi.setListener('onAuthStateChangedNotHavingUser', function () {
        window.location.replace("/login");
    });

    firebaseApi.setListener('signOut', function () {
        window.location.replace("/login");
    });

    var $logOutButton = $('#logout-button');
    $logOutButton.on('click', function () {
        console.log('logout');
        firebaseApi.signOut();
    });

    var $chattingBox = $('textarea');
    $chattingBox.on('keyup', function (e) {});
}();