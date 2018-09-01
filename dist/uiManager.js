'use strict';

var uiManager = new function () {

    var $thetheChatWindow = $('.chat-wrapper');
    var $progressWindow = $('.progress-window');
    var chatLogs = [];

    firebaseApi.setListener('onAuthStateChangedHavingUser', function (user) {
        // 프로그레스 창 -> 더더챗창 으로
        $thetheChatWindow.removeClass('display-none');
        $progressWindow.addClass('display-none');

        // 사이드바 header 이미지 이니셜 텍스트
        var userInitialName = getUserInitial(user.displayName);
        $thetheChatWindow.find('.header-image').text(userInitialName);

        // 사이드바 header 이름 텍스트
        var userName = getUserName(user.displayName);
        $thetheChatWindow.find('.header-name').text(userName);
    });

    firebaseApi.setListener('onAuthStateChangedNotHavingUser', function () {
        window.location.replace("/login");
    });
    firebaseApi.setListener('signOut', function () {
        window.location.replace("/login");
    });

    var getUserInitial = function getUserInitial(userDisplayName) {
        var initialArray = _.map(userDisplayName.split(' '), function (element) {
            return element[0].toUpperCase();
        });
        return initialArray[0] + initialArray[1];
    };
    // 사이드바 header 이름 텍스트, 채팅 이름
    var getUserName = function getUserName(userDisplayName) {
        return userDisplayName.replace(' ', '.').toLowerCase();
    };

    /**
     * Logout Button
     */
    var $logOutButton = $('#logout-button');
    $logOutButton.on('click', function () {
        console.log('logout');
        firebaseApi.signOut();
    });

    /**
     * 채팅 입력 창
     */
    var $chatInputBox = $('textarea');
    $chatInputBox.on('keyup', function (e) {
        if (e.keyCode === 13) {
            // 채팅이 입력이 된다.
            chatLogs.push(new ChatLog($chatInputBox.val()));

            $chatInputBox.val('');
        }
    });

    var ChatLog = function ChatLog(chatContent) {
        var $chatLogsZone = $('.main-chatting');
        var date = new Date();

        if (chatLogs.length > 0) console.log(chatLogs[chatLogs.length - 1].getMinutes());
        console.log(date.getMinutes());
        // 이전 채팅과 1분이상 차이가 났을 때, 이니셜과 이름을 입력해 준다
        // if()

        var currentUser = firebase.auth().currentUser;
        var userInitial = getUserInitial(currentUser.displayName);
        var userName = getUserName(currentUser.displayName);
        var displayTime = date.getHours() + '시 ' + date.getMinutes() + '분';

        var $template = $('\n        <div class="chat-content">\n            <div class="chat-image-zone">\n                <div class="chat-image">' + userInitial + '</div>\n                <div class="i fas fa-cog display-none"></div>\n            </div>\n            <div class="chat">\n                <div class="chat-profile-content">\n                    <div class="profile-name">' + userName + '</div>\n                    <div class="profile-owner-content">\n                        <div class="owner-text admin"></div>\n                        <div class="owner-text owner"></div>\n                    </div>\n                    <div class="profile-date">' + displayTime + '</div>\n                    <div class="i fas fa-cog"></div>\n                </div>\n                <div class="chat-text-content">' + chatContent + '</div>\n            </div>\n        </div>\n        ');

        $chatLogsZone.append($template);

        this.getMinutes = function () {
            return date.getMinutes();
        };
    };
}();