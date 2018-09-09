$(document).ready(function () {
   

    //****************** Auth ******************

    var loggedUser;

    firebase.auth().onAuthStateChanged(function (user) {
        loggedUser = user;
        console.log('firebase.auth.onAuthStateChanged > user', user);
        if (user == null) {
            $('#div-must-auth').show(400);
        } else {
            $('#div-must-auth').hide(200);
            loggedIn(user);
        }
    });

    $('#buttton-auth').click(function () {
        var provider = new firebase.auth.FacebookAuthProvider(); // Possível configuração para github
        //var provider = new firebase.auth.GithubAuthProvider(); // Possível configuração para github
        provider.addScope('public_profile');
        firebase.auth().signInWithPopup(provider).then(function (result) {
            console.log('firebase.auth.signInWithPopup > user', result.user);
            loggedIn(result.user);
        }).catch(function (error) {
            console.log('error', error);
            alert(error.message);
        });
    });


    function loggedIn(user) {
        writeUserData(user.uid, user.displayName, user.photoURL);
        startChat();
        setPresence(user);
    }

    function writeUserData(userId, displayName, photoUrl) {
        firebase.database().ref('users/' + userId).set({
            displayName: displayName,
            photoUrl: photoUrl
        });
    }

    function setPresence(user) {
        var presenceRef = firebase.database().ref('users/' + user.uid + '/connections');
        var lastOnlineRef = firebase.database().ref('users/' + user.uid + '/lastOnline');
        var connectedRef = firebase.database().ref('.info/connected');

        connectedRef.on('value', function (snap) {
            //setSendEnabled(snap.val() === true);
            setSendEnabled(true);
            if (snap.val() === true) {
                console.log('connectedRef.on > value', 'conected');
                var con = presenceRef.push(true);
                con.onDisconnect().remove();
                lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
            } else if (snap.val() === false) {
                console.log('connectedRef.on > value', 'disconected');
            }
        });

        $('#button-users').show();
        $('#button-users').click(function () {
            if (usersRef == undefined)
                listenUsers();
            $('#div-users').toggle(200);
            $('#div-chat').toggle(200);
        });
    }

  


});