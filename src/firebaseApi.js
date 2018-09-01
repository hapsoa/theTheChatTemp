const firebaseApi = new function () {
    const provider = new firebase.auth.GoogleAuthProvider();

    let onAuthChangedListener = null;
    this.setOnAuthStateChangedListener = (listener) => {
        onAuthChangedListener = listener;
    };
    let onAuthChangedListenerNoUser = null;
    this.setOnAuthStateChangedListenerNoUser = (listener) => {
        onAuthChangedListenerNoUser = listener;
    };

    const listener = {
        onAuthStateChangedNotHavingUser: null
    };
    this.setListener = (listenerName, listenerFunction) => {
        listener[listenerName] = listenerFunction;
    };

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
            // 더더챗으로 redirect를 시켜준다.
            console.log('yes', onAuthChangedListener);
            if (onAuthChangedListener !== null)
                onAuthChangedListener();

        } else {
            // User is signed out.
            // ...
            if (listener.onAuthStateChangedNotHavingUser !== null)
                listener.onAuthStateChangedNotHavingUser();
        }
    });

    this.signIn = async () => {

        try {
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

            const result = await firebase.auth().signInWithPopup(provider);
            // The signed-in user info.
            const user = result.user;

            const readUser = await firebaseDb.readUser(user.uid);
            if (readUser) {
                // 로그인 한다.
                firebaseDb.updateUser(user);
            } else {
                // 계정을 새로 만든다.
                firebaseDb.createUser(user);
            }
        }
        catch (error) {
            console.log(error.code);
            console.log(error.message);
        }
    };

    let signOutListner = null;
    this.setSignOutListener = (listener) => {
        signOutListner = listener;
    };
    this.signOut = () => {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            if(signOutListner !== null)
                signOutListner();
        }).catch(function(error) {
            // An error happened.
            console.log(error);
        });
    }
};

const firebaseDb = new function () {
    // Initialize Cloud Firestore through Firebase
    const db = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true};
    db.settings(settings);

    this.readUser = async (uid) => {
        const docRef = db.collection("user").doc(uid);
        try {
            const doc = await docRef.get();

            if (doc.exists) {
                console.log("Document data:", doc.data());
                return doc.data();
            } else {
                // doc.data() will be undefined in this case
                console.log("not have user");
                return null;
            }
        } catch (error) {
            console.log("Error getting document:", error);
        }
    };

    this.createUser = (user) => {
        db.collection("user").doc(user.uid).set({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        })
            .then(function () {
                console.log("This user is created");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    };

    this.updateUser = (user) => {
        const userRef = db.collection("user").doc(user.uid);

        return userRef.update({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        })
            .then(function () {
                console.log("This user is updated");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }

};

const firebaseStorage = new function () {

};



