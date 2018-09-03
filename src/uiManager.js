const uiManager = new function () {

    const $thetheChatWindow = $('.chat-wrapper');
    const $progressWindow = $('.progress-window');
    // 모든 채팅 메세지 로그들
    const chatLogs = [];
    // 유저 initial, name
    let userData = null;

    /**
     * firebaseApi Listeners
     */
    firebaseApi.setListener('onAuthStateChangedHavingUser', async (user) => {
        // 유저 정보를 가져오고, 데이터베이스에 있으면 아래 로직
        // 없으면 login 화면으로 이동
        const userInDatabase = await firebaseDb.readUser(user.uid);
        // console.log(user);
        if (user) {
            // 프로그레스 창 -> 더더챗창 으로
            $thetheChatWindow.removeClass('display-none');
            $progressWindow.addClass('display-none');

            userData = {
                userInitial: getUserInitial(userInDatabase.displayName),
                userName: getUserName(userInDatabase.displayName)
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

        let initial = '';
        _.forEach(initialArray, (element) => {
            initial += element[0];
        });

        return initial;
    };
    // 사이드바 header 이름 텍스트, 채팅 이름
    const getUserName = (userDisplayName) => {
        return userDisplayName.replace(' ', '.').toLowerCase();
    };
    // 채팅 로그 시간 구하기
    const getChatLogTime = (date) => {
        let displayTime;

        // const date = new Date(millisecondsTime);
        let hours = date.getHours();

        if (hours <= 12) { // 0 ~ 12시
            displayTime = '오전 ' + hours + '시 ' + date.getMinutes() + '분';
        } else { // 13 ~ 24시
            hours -= 12;
            displayTime = '오후 ' + hours + '시 ' + date.getMinutes() + '분';
        }

        return displayTime;
    };

    /**
     * Initialize Chat logs
     */
    // 데이터베이스에서 채팅로그들을 모두읽어와서, 업데이트 한다.
    const initializeChatLogs = async () => {
        const chatLogsData = await firebaseDb.readAllChatLogs('channelLogs');
        // console.log(chatLogsData);

        _.forOwn(chatLogsData, (value, key) => {
            console.log(value);
            chatLogs.push(new ChatLog(value));
        })

    };
    initializeChatLogs();

    /**
     * Logout Button
     */
    const $logOutButton = $('#logout-button');
    $logOutButton.on('click', function () {
        console.log('logout');
        firebaseApi.signOut();
    });

    /**
     * 채팅 입력 창
     */
    const $chatInputBox = $('textarea');
    $chatInputBox.on('keyup', function (e) {
        if (e.keyCode === 13) {
            if ($chatInputBox.val().trim().length !== 0) {
                // 채팅이 입력이 된다.
                const date = new Date().getTime();
                const chatData = {
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
            $chatInputBox.val('');
        }
    });

    /**
     * 채팅 한줄 로그
     * @param chatData : json 오브젝트
     */
    const ChatLog = function (chatData) {
        const $chatLogsZone = $('.main-chatting');

        const date = new Date(chatData.date);

        if (chatLogs.length > 0)
            console.log(chatLogs[chatLogs.length - 1].getMinutes());
        console.log(date.getMinutes());
        // 이전 채팅과 1분이상 차이가 났을 때, 이니셜과 이름을 입력해 준다
        if () {

        }

        const currentUser = firebase.auth().currentUser;
        const userInitial = getUserInitial(currentUser.displayName);
        const userName = getUserName(currentUser.displayName);
        const displayTime = getChatLogTime(date);

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
                <div class="chat-text-content">${chatData.content}</div>
            </div>
        </div>
        `);


        $chatLogsZone.append($template);


        this.getMinutes = () => {
            return date.getMinutes();
        };
        this.getUser

    };


};


