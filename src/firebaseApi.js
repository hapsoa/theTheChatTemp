const firebaseApi = new function () {
    const provider = new firebase.auth.GoogleAuthProvider();

    const listener = {
        onAuthStateChangedHavingUser: null,
        onAuthStateChangedNotHavingUser: null,
        signInHead: null,
        signInTail: null,
        signOut: null
    };
    this.setListener = (listenerName, listenerFunction) => {
        listener[listenerName] = listenerFunction;
    };

    firebase.auth().onAuthStateChanged(function (user) {
        console.log(user);
        if (user) {
            // const userInDatabase = await firebaseDb.readUser(user.uid);

            if (listener.onAuthStateChangedHavingUser !== null)
                listener.onAuthStateChangedHavingUser(user);

        } else {
            // User is signed out.
            if (listener.onAuthStateChangedNotHavingUser !== null)
                listener.onAuthStateChangedNotHavingUser();
        }
    });

    this.signIn = async () => {
        try {
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

            const result = await firebase.auth().signInWithPopup(provider);
            // The signed-in user info.
            if (listener.signInHead !== null)
                listener.signInHead();
            const user = result.user;

            const readUser = await firebaseDb.readUser(user.uid);
            if (readUser) {
                // 로그인 한다.
                await firebaseDb.updateUser(user);
            } else {
                // 계정을 새로 만든다.
                await firebaseDb.createUser(user);
            }
            if (listener.signInTail !== null)
                listener.signInTail();
        }
        catch (error) {
            console.log(error.code);
            console.log(error.message);
        }
    };

    this.signOut = () => {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            if (listener.signOut !== null)
                listener.signOut();
        }).catch(function (error) {
            // An error happened.
            console.log(error);
        });
    };

    this.uploadFile = () => {

    };

    this.readAllChatLogs = (channelName) => {
        // db.collection(channelName).get().then(function(querySnapshot) {
        //     querySnapshot.forEach(function(doc) {
        //         // doc.data() is never undefined for query doc snapshots
        //         console.log(doc.id, " => ", doc.data());
        //     });
        // });

    };

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

    this.createUser = async (user) => {
        try {
            await db.collection("user").doc(user.uid).set({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                lastSignedInDate: new Date(),
                creationDate: new Date()
            });
            console.log("This user is created");
        }
        catch (error) {
            console.error("Error writing document: ", error);
        }
    };

    this.updateUser = (user) => {
        const userRef = db.collection("user").doc(user.uid);

        return userRef.update({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastSignedInDate: new Date()
        })
            .then(function () {
                console.log("This user is updated");
            })
            .catch(function (error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    };

    this.uploadChatLog = (chatData) => {
        db.collection("channelLogs").add(chatData)
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
    };

    this.readAllChatLogs = (channelName) => {
        db.collection(channelName).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        });

    };

};

const firebaseStorage = new function () {

};



