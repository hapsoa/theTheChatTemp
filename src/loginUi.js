const loginUiManager = new function() {

    const $signInButton = $('#signInButton');
    const $loginWindow = $('.form-signin');
    const $progressWindow = $('.progress-window');
    $signInButton.on('click', function() {
        console.log('sign in button');


        firebaseApi.signIn();
        $loginWindow.addClass('display-none');
        $progressWindow.removeClass('display-none');
    });

    firebaseApi.setListener('onAuthStateChangedHavingUser', () => {
        window.location.replace("/jaejong");
    });
};
