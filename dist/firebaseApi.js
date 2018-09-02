"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var firebaseApi = new function () {
    var _this = this;

    var provider = new firebase.auth.GoogleAuthProvider();

    var listener = {
        onAuthStateChangedHavingUser: null,
        onAuthStateChangedNotHavingUser: null,
        signInHead: null,
        signInTail: null,
        signOut: null
    };
    this.setListener = function (listenerName, listenerFunction) {
        listener[listenerName] = listenerFunction;
    };

    firebase.auth().onAuthStateChanged(function (user) {
        console.log(user);
        if (user) {
            // const userInDatabase = await firebaseDb.readUser(user.uid);

            if (listener.onAuthStateChangedHavingUser !== null) listener.onAuthStateChangedHavingUser(user);
        } else {
            // User is signed out.
            if (listener.onAuthStateChangedNotHavingUser !== null) listener.onAuthStateChangedNotHavingUser();
        }
    });

    this.signIn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var result, user, readUser;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

                    case 3:
                        _context.next = 5;
                        return firebase.auth().signInWithPopup(provider);

                    case 5:
                        result = _context.sent;

                        // The signed-in user info.
                        if (listener.signInHead !== null) listener.signInHead();
                        user = result.user;
                        _context.next = 10;
                        return firebaseDb.readUser(user.uid);

                    case 10:
                        readUser = _context.sent;

                        if (!readUser) {
                            _context.next = 16;
                            break;
                        }

                        _context.next = 14;
                        return firebaseDb.updateUser(user);

                    case 14:
                        _context.next = 18;
                        break;

                    case 16:
                        _context.next = 18;
                        return firebaseDb.createUser(user);

                    case 18:
                        if (listener.signInTail !== null) listener.signInTail();
                        _context.next = 25;
                        break;

                    case 21:
                        _context.prev = 21;
                        _context.t0 = _context["catch"](0);

                        console.log(_context.t0.code);
                        console.log(_context.t0.message);

                    case 25:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this, [[0, 21]]);
    }));

    this.signOut = function () {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            if (listener.signOut !== null) listener.signOut();
        }).catch(function (error) {
            // An error happened.
            console.log(error);
        });
    };

    this.uploadFile = function () {};

    this.readAllChatLogs = function (channelName) {
        // db.collection(channelName).get().then(function(querySnapshot) {
        //     querySnapshot.forEach(function(doc) {
        //         // doc.data() is never undefined for query doc snapshots
        //         console.log(doc.id, " => ", doc.data());
        //     });
        // });

    };
}();

var firebaseDb = new function () {
    var _this2 = this;

    // Initialize Cloud Firestore through Firebase
    var db = firebase.firestore();
    var settings = { /* your settings... */timestampsInSnapshots: true };
    db.settings(settings);

    this.readUser = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(uid) {
            var docRef, doc;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            docRef = db.collection("user").doc(uid);
                            _context2.prev = 1;
                            _context2.next = 4;
                            return docRef.get();

                        case 4:
                            doc = _context2.sent;

                            if (!doc.exists) {
                                _context2.next = 10;
                                break;
                            }

                            console.log("Document data:", doc.data());
                            return _context2.abrupt("return", doc.data());

                        case 10:
                            // doc.data() will be undefined in this case
                            console.log("not have user");
                            return _context2.abrupt("return", null);

                        case 12:
                            _context2.next = 17;
                            break;

                        case 14:
                            _context2.prev = 14;
                            _context2.t0 = _context2["catch"](1);

                            console.log("Error getting document:", _context2.t0);

                        case 17:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[1, 14]]);
        }));

        return function (_x) {
            return _ref2.apply(this, arguments);
        };
    }();

    this.createUser = function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(user) {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;
                            _context3.next = 3;
                            return db.collection("user").doc(user.uid).set({
                                uid: user.uid,
                                displayName: user.displayName,
                                email: user.email,
                                photoURL: user.photoURL,
                                lastSignedInDate: new Date(),
                                creationDate: new Date()
                            });

                        case 3:
                            console.log("This user is created");
                            _context3.next = 9;
                            break;

                        case 6:
                            _context3.prev = 6;
                            _context3.t0 = _context3["catch"](0);

                            console.error("Error writing document: ", _context3.t0);

                        case 9:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, _this2, [[0, 6]]);
        }));

        return function (_x2) {
            return _ref3.apply(this, arguments);
        };
    }();

    this.updateUser = function (user) {
        var userRef = db.collection("user").doc(user.uid);

        return userRef.update({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastSignedInDate: new Date()
        }).then(function () {
            console.log("This user is updated");
        }).catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    };

    this.uploadChatLog = function (chatData) {
        db.collection("channelLogs").add(chatData).then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        }).catch(function (error) {
            console.error("Error adding document: ", error);
        });
    };

    this.readAllChatLogs = function (channelName) {
        db.collection(channelName).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
        });
    };
}();

var firebaseStorage = new function () {}();