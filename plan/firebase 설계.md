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
readUser(uid)
createUser(user)
updateUser(user)
uploadChatLog(chatData)
readAllChatLogs(channelName)

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
channel : {
    channelName_1: {
        messages: {
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
                
            }
        }
        
    },
    channelName_2: {

    }
}

channel: {
    channelName_1: {
        messages: {
            millisecondsTime_1: {
                channel: "",
                uid: "",
                userInitial: "",
                userName: "",
                time: "",
                type: "file/image" or "message",
                content: ""
            },
            millisecondsTime_2
        }
    },
    channelName_2
}


<- firebaseStorage ->

channel_1 : {
    millisecondsTime1: fileName,
    millisecondsTime2: fileName
},
channel_2 : {
   
}
