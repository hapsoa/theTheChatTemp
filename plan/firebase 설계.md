<- uiManager ->
$logOutButton
$chattingBox
ChatLog

<- loginUi ->
$signInButton
ChatLog(logData)

<- firebaseApi ->
onAuthStateChanged()
signIn()
signOut()

listener
setListener()

<- firebaseDB ->
getUser()
updateUser()

user: {
    uid1: {
        uid: "",
        displayName: "",
        email: "",
        photoURL: "",
        lastSignedInDate: "",
        channels: {
            channelName1: "",
            channelName2: ""
        },
        personalRoom: "",
        creationDate: ""
    },
    uid2: {

    }
}

channel_1: {
    millisecondsTime_1: {
        channel: "",
        uid: "",
        userInitial: "",
        userName: "",
        time: "",
        type: "file/image" or "message",
        content: ""
    },
    millisecondsTime_2: {
        channel: "",
        uid: "",
        userInitial: "",
        userName: "",
        time: "",
        type: "file/image" or "message",
        fileName: "",
        content: ""
    }
}

<- firebaseStorage ->

channel_1 : {
    millisecondsTime1: fileName,
    millisecondsTime2: fileName
},
channel_2 : {
    millisecondsTime1: fileName,
    millisecondsTime2: fileName
}
