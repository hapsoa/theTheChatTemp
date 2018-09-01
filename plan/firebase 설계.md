<- uiManager ->
logOutButton


<- loginUi ->
signInButton

<- firebaseApi ->
onAuthStateChanged()
signIn()
signOut()

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

