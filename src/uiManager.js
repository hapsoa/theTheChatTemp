const uiManager = new function() {

    const $thetheChatWindow = $('.chat-wrapper');
    const $progressWindow = $('.progress-window');
    const chatLogs = [];

    firebaseApi.setListener('onAuthStateChangedHavingUser', (user) => {
        // 프로그레스 창 -> 더더챗창 으로
        $thetheChatWindow.removeClass('display-none');
        $progressWindow.addClass('display-none');

        // 사이드바 header 이미지 이니셜 텍스트
        const userInitialName = getUserInitial(user.displayName);
        $thetheChatWindow.find('.header-image').text(userInitialName);

        // 사이드바 header 이름 텍스트
        const userName = getUserName(user.displayName);
        $thetheChatWindow.find('.header-name').text(userName);

    });

    firebaseApi.setListener('onAuthStateChangedNotHavingUser', () => {
        window.location.replace("/login");
    });
    firebaseApi.setListener('signOut', () => {
        window.location.replace("/login");
    });

    const getUserInitial = (userDisplayName) => {
        const initialArray = _.map(userDisplayName.split(' '), (element) => {
            return element[0].toUpperCase();
        });
        return initialArray[0] + initialArray[1];
    };
    // 사이드바 header 이름 텍스트, 채팅 이름
    const getUserName = (userDisplayName) => {
        return userDisplayName.replace(' ', '.').toLowerCase();
    };

    /**
     * Logout Button
     */
    const $logOutButton = $('#logout-button');
    $logOutButton.on('click', function() {
        console.log('logout');
        firebaseApi.signOut();
    });

    /**
     * 채팅 입력 창
     */
    const $chatInputBox = $('textarea');
    $chatInputBox.on('keyup', function(e) {
        if (e.keyCode === 13) {
            // 채팅이 입력이 된다.
            chatLogs.push(new ChatLog($chatInputBox.val()));

            $chatInputBox.val('');
        }
    });


    const ChatLog = function (chatContent) {
        const $chatLogsZone = $('.main-chatting');
        const date = new Date();

        if (chatLogs.length > 0)
            console.log(chatLogs[chatLogs.length - 1].getMinutes());
        console.log(date.getMinutes());
        // 이전 채팅과 1분이상 차이가 났을 때, 이니셜과 이름을 입력해 준다
        // if()

        const currentUser = firebase.auth().currentUser;
        const userInitial = getUserInitial(currentUser.displayName);
        const userName = getUserName(currentUser.displayName);
        const displayTime = date.getHours() + '시 ' + date.getMinutes() + '분';

        const $template = $(`
        <div class="chat-content">
            <div class="chat-image-zone">
                <div class="chat-image">${userInitial}</div>
                <div class="i fas fa-cog display-none"></div>
            </div>
            <div class="chat">
                <div class="chat-profile-content">
                    <div class="profile-name">${userName}</div>
                    <div class="profile-owner-content">
                        <div class="owner-text admin"></div>
                        <div class="owner-text owner"></div>
                    </div>
                    <div class="profile-date">${displayTime}</div>
                    <div class="i fas fa-cog"></div>
                </div>
                <div class="chat-text-content">${chatContent}</div>
            </div>
        </div>
        `);




        $chatLogsZone.append($template);


        this.getMinutes = () => {
            return date.getMinutes();
        };
    };


};


