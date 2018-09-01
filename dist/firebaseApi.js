"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var firebaseApi = new function () {
    var _this = this;

    var provider = new firebase.auth.GoogleAuthProvider();

    var onAuthChangedListener = null;
    this.setOnAuthStateChangedListener = function (listener) {
        onAuthChangedListener = listener;
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
            if (onAuthChangedListener !== null) onAuthChangedListener();
        } else {
            // User is signed out.
            // ...
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
                        user = result.user;
                        _context.next = 9;
                        return firebaseDb.readUser(user.uid);

                    case 9:
                        readUser = _context.sent;

                        if (readUser) {
                            // 로그인 한다.
                            firebaseDb.updateUser(user);
                        } else {
                            // 계정을 새로 만든다.
                            firebaseDb.createUser(user);
                        }
                        _context.next = 17;
                        break;

                    case 13:
                        _context.prev = 13;
                        _context.t0 = _context["catch"](0);

                        console.log(_context.t0.code);
                        console.log(_context.t0.message);

                    case 17:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, _this, [[0, 13]]);
    }));
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

    this.createUser = function (user) {
        db.collection("user").doc(user.uid).set({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        }).then(function () {
            console.log("This user is created");
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });
    };

    this.updateUser = function (user) {
        var userRef = db.collection("user").doc(user.uid);

        return userRef.update({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        }).then(function () {
            console.log("This user is updated");
        }).catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    };
}();

var firebaseStorage = new function () {}();