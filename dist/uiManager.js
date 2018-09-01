'use strict';

var uiManager = new function () {

    var $thetheChatWindow = $('.chat-wrapper');
    var $progressWindow = $('.progress-window');
    firebaseApi.setOnAuthStateChangedListener(function () {
        // 처음에는 프로그레스 창 -> 더더챗창으로
        $thetheChatWindow.removeClass('display-none');
        $progressWindow.addClass('display-none');
    });
}();