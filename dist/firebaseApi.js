"use strict";

var firebaseApi = new function () {
    firebase.auth().onAuthStateChanged(function (user) {
        console.log(user);
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // ...
        } else {
                // User is signed out.
                // ...
            }
    });
}();

var firebaseDB = new function () {}();

var firebaseStorage = new function () {}();