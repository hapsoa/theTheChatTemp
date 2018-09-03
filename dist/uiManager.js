'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var uiManager = new function () {
    var _this = this;

    var $thetheChatWindow = $('.chat-wrapper');
    var $progressWindow = $('.progress-window');
    // 모든 채팅 메세지 로그들
    var chatLogs = [];
    // 유저 initial, name
    var userData = null;

    /**
     * firebaseApi Listeners
     */
    firebaseApi.setListener('onAuthStateChangedHavingUser', function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(user) {
            var userInDatabase;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return firebaseDb.readUser(user.uid);

                        case 2:
                            userInDatabase = _context.sent;

                            // console.log(user);
                            if (user) {
                                // 프로그레스 창 -> 더더챗창 으로
                                $thetheChatWindow.removeClass('display-none');
                                $progressWindow.addClass('display-none');

                                userData = {
                                    uid: user.uid,
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

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }());

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

        var initial = '';
        _.forEach(initialArray, function (element) {
            initial += element[0];
        });

        return initial;
    };
    // 사이드바 header 이름 텍스트, 채팅 이름
    var getUserName = function getUserName(userDisplayName) {
        return userDisplayName.replace(' ', '.').toLowerCase();
    };
    // 채팅 로그 시간 구하기
    var getChatLogTime = function getChatLogTime(date) {
        var displayTime = void 0;

        // const date = new Date(millisecondsTime);
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
    var initializeChatLogs = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var chatLogsData;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return firebaseDb.readAllChatLogs('channelLogs');

                        case 2:
                            chatLogsData = _context2.sent;

                            // console.log(chatLogsData);

                            _.forOwn(chatLogsData, function (value, key) {
                                console.log(value);
                                chatLogs.push(new ChatLog(value));
                            });

                        case 4:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this);
        }));

        return function initializeChatLogs() {
            return _ref2.apply(this, arguments);
        };
    }();
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
            if ($chatInputBox.val().trim().length !== 0) {
                // 채팅이 입력이 된다.
                var time = new Date().getTime();
                var chatData = {
                    uid: userData.uid,
                    userInitial: userData.userInitial,
                    userName: userData.userName,
                    time: time,
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
    var ChatLog = function ChatLog(chatData) {
        var $chatLogsZone = $('.main-chatting');

        var date = new Date(chatData.time);
        var displayTime = getChatLogTime(date);

        var $template = $('\n        <div class="chat-content">\n            <div class="chat-image-zone">\n                <div class="chat-image orange">' + chatData.userInitial + '</div>\n                <div class="i fas fa-cog display-none"></div>\n            </div>\n            <div class="chat">\n                <div class="chat-profile-content">\n                    <div class="profile-name">' + chatData.userName + '</div>\n                    <div class="profile-owner-content">\n                        <div class="owner-text admin"></div>\n                        <div class="owner-text owner"></div>\n                    </div>\n                    <div class="profile-date">' + displayTime + '</div>\n                    <div class="i fas fa-cog"></div>\n                </div>\n                <div class="chat-text-content">' + chatData.content + '</div>\n            </div>\n        </div>\n        ');

        if (chatLogs.length > 0) console.log(chatLogs[chatLogs.length - 1].getMinutes());
        console.log(date.getMinutes());
        // 같은 유저의 채팅로그이고, 시간이 같을 때, 프로필 정보들을 지워주고 화면에 보여준다.

        if (chatLogs.length > 0) {
            var frontChatLog = chatLogs[chatLogs.length - 1];

            if (chatData.uid === frontChatLog.getUser() && date.getMinutes() - frontChatLog.getMinutes() === 0) {
                console.log(true);
                $template.find('.chat-image').text('');
                $template.find('.profile-name').text('');
                $template.find('.profile-date').text('');
                $template.find('.chat-image-zone > .fa-cog').removeClass('display-none');
                $template.find('.chat-profile-content > .fa-cog').remove();
            }
        }

        $chatLogsZone.append($template);

        this.getMinutes = function () {
            return date.getMinutes();
        };
        this.getUser = function () {
            return chatData.uid;
        };
    };

    /**
     * Upload File Button
     */
    var $uploadFileButton = $('#upload-file-button');
    var $hiddenUploadButton = $('#hidden-upload-button');
    $uploadFileButton.on('click', function () {
        $hiddenUploadButton.trigger('click');
    });

    $hiddenUploadButton.on('click', function (e) {
        e.stopPropagation();
    });
    $hiddenUploadButton.on('change', function () {
        var time = new Date().getTime();
        var chatData = {
            uid: userData.uid,
            userInitial: userData.userInitial,
            userName: userData.userName,
            time: time,
            type: "",
            fileName: "",
            content: ""
        };

        var selectedFiles = document.getElementById('hidden-upload-button').files;
        _.forEach(selectedFiles, function (file) {
            // 파일들을 데이터베이스에 저장한다.
            // 파일들을 클라우드 저장소에 저장한다.
            chatData.type = file.type;
            chatData.fileName = file.name;

            firebaseApi.uploadFile(chatData, file);
            cardManager.cardList.push(new Card(file));
        });
    });

    // /**
    //  * File upload button
    //  */
    // $uploadButton.on('click', function () {
    //     $('input[type="file"]').trigger('click');
    // });
    // const $internalUploadButton = $('input[type="file"]');
    // $internalUploadButton.on('click', function (e) {
    //     e.stopPropagation();
    // });
    // $internalUploadButton.on('change', function () {
    //     const currentUser = firebase.auth().currentUser;
    //     const selectedFiles = document.getElementById('hiddenUploadButton').files;
    //
    //     _.forEach(selectedFiles, function (file) {
    //         // 파일들을 데이터베이스에 저장한다.
    //         // 파일들을 클라우드 저장소에 저장한다.
    //         firebaseApi.writeFile(currentUser, file);
    //         cardManager.cardList.push(new Card(file));
    //     });
    //
    // });

}();