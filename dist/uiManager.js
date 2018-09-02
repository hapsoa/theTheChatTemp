'use strict';

var uiManager = new function () {

    var $thetheChatWindow = $('.chat-wrapper');
    var $progressWindow = $('.progress-window');
    // 모든 채팅 메세지 로그들
    var chatLogs = [];
    // 유저 initial, name
    var userData = null;

    /**
     * firebaseApi Listeners
     */
    firebaseApi.setListener('onAuthStateChangedHavingUser', function (user) {
        // 유저 정보를 가져오고, 데이터베이스에 있으면 아래 로직
        // 없으면 login 화면으로 이동
        console.log(user);
        if (user) {
            // 프로그레스 창 -> 더더챗창 으로
            $thetheChatWindow.removeClass('display-none');
            $progressWindow.addClass('display-none');

            userData = {
                userInitial: getUserInitial(user.displayName),
                userName: getUserName(user.displayName)
            };
            // 사이드바 header 이미지 이니셜 텍스트
            $thetheChatWindow.find('.header-image').text(userData.userInitial);
            // const userInitialName = getUserInitial(user.displayName);
            // $thetheChatWindow.find('.header-image').text(userInitialName);

            // 사이드바 header 이름 텍스트
            $thetheChatWindow.find('.header-name').text(userData.userName);
            // const userName = getUserName(user.displayName);
            // $thetheChatWindow.find('.header-name').text(userName);
        } else {
            window.location.replace("/login");
        }
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
    // 채팅 로그 시간 구하기
    var getChatLogTime = function getChatLogTime(date) {
        var displayTime = void 0;
        var hours = date.getHours();

        if (hours <= 12) {
            // 0 ~ 12시
            displayTime = '오전 ' + hours + '시 ' + date.getMinutes() + '분';
        } else {
            // 13 ~ 24시
            hours -= 12;
            displayTime = '오후 ' + hours + '시 ' + date.getMinutes() + '분';
        }

        return displayTime;
    };

    /**
     * Initialize Chat logs
     */
    // 데이터베이스에서 채팅로그들을 모두읽어와서, 업데이트 한다.
    var initializeChatLogs = function initializeChatLogs() {
        var chatLogsData = firebaseApi.readAllChatLogs('channelLogs');
    };
    initializeChatLogs();

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
            var date = new Date();
            var chatData = {
                userInitial: userData.userInitial,
                userName: userData.userName,
                date: date,
                type: "message",
                content: $chatInputBox.val()
            };

            chatLogs.push(new ChatLog(chatData));
            $chatInputBox.val('');

            // 데이터베이스에 채팅입력정보를 보낸다
            firebaseDb.uploadChatLog(chatData);
        }
    });

    var ChatLog = function ChatLog(chatData) {
        var $chatLogsZone = $('.main-chatting');

        if (chatLogs.length > 0) console.log(chatLogs[chatLogs.length - 1].getMinutes());
        console.log(chatData.date.getMinutes());
        // 이전 채팅과 1분이상 차이가 났을 때, 이니셜과 이름을 입력해 준다
        // if()

        var currentUser = firebase.auth().currentUser;
        var userInitial = getUserInitial(currentUser.displayName);
        var userName = getUserName(currentUser.displayName);
        var displayTime = getChatLogTime(chatData.date);

        var $template = $('\n        <div class="chat-content">\n            <div class="chat-image-zone">\n                <div class="chat-image">' + userInitial + '</div>\n                <div class="i fas fa-cog display-none"></div>\n            </div>\n            <div class="chat">\n                <div class="chat-profile-content">\n                    <div class="profile-name">' + userName + '</div>\n                    <div class="profile-owner-content">\n                        <div class="owner-text admin"></div>\n                        <div class="owner-text owner"></div>\n                    </div>\n                    <div class="profile-date">' + displayTime + '</div>\n                    <div class="i fas fa-cog"></div>\n                </div>\n                <div class="chat-text-content">' + chatData.content + '</div>\n            </div>\n        </div>\n        ');

        $chatLogsZone.append($template);

        this.getMinutes = function () {
            return chatData.date.getMinutes();
        };
    };
}();