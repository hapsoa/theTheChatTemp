const uiManager = new function() {

    const $thetheChatWindow = $('.chat-wrapper');
    const $progressWindow = $('.progress-window');
    firebaseApi.setOnAuthStateChangedListener(() => {
        // 처음에는 프로그레스 창 -> 더더챗창으로
        $thetheChatWindow.removeClass('display-none');
        $progressWindow.addClass('display-none');
    });

};
