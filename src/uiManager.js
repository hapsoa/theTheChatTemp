const uiManager = new function() {

    const $thetheChatWindow = $('.chat-wrapper');
    const $progressWindow = $('.progress-window');
    firebaseApi.setOnAuthStateChangedListener(() => {
        // 처음에는 프로그레스 창 -> 더더챗창으로
        $thetheChatWindow.removeClass('display-none');
        $progressWindow.addClass('display-none');
    });

    firebaseApi.setSignOutListener(() => {
        window.location.replace("/login");
    });
    firebaseApi.setListener('onAuthStateChangedNotHavingUser', () => {
        window.location.replace("/login");
    });

    const $logOutButton = $('#logout-button');
    $logOutButton.on('click', function() {
        console.log('logout');
        firebaseApi.signOut();

    });
};
