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

    // this.readAllChatLogs = (channelName) => {
    //     firebaseDb.readAllChatLogs(channelName);
    // };

    this.uploadFile = (chatData, file) => {
        firebaseDb.uploadChatLog(chatData);
        firebaseStorage.uploadFile(chatData, file);
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
                // console.log("Document data:", doc.data());
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
        const docName = String(chatData.time);
        db.collection(`_${chatData.channel}`).doc(docName).set(chatData)
            .then(function () {
                console.log("Document successfully written! in database");
            })
            .catch(function (error) {
                console.error("Error writing document: ", error);
            });
    };

    this.readAllChatLogs = async (channelName) => {
        const convertedChannelName = '_' + channelName;
        const chatLogsData = {};
        const querySnapshot = await db.collection(convertedChannelName).get();
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            chatLogsData[doc.id] = doc.data();
        });

        return chatLogsData;
    };


};

const firebaseStorage = new function () {
    const storage = firebase.storage();
    const storageRef = storage.ref();

    this.uploadFile = (chatData, file) => {
        // ref를 설정하고,
        const fileRef = storageRef.child(
            `${chatData.channel}/${chatData.time}/${chatData.fileName}`);

        // 저장을 한다.
        fileRef.put(file).then(function (snapshot) {
            console.log('Uploaded a blob or file!');
        });
    };
};



