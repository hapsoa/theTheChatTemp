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

channelLogs: {
    randomDocName1: {
        userInitial: "",
        userName: "",
        time: "",
        type: "file/image" or "message",
        content: ""
    },
    randomDocName1 {

    }
}

<- firebaseStorage ->

