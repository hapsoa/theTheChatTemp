<- uiManager ->
$logOutButton
$chattingZone

<- loginUi ->
$signInButton

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
        photoURL: ""
    },
    uid2: {

    }
}


<- firebaseStorage ->

