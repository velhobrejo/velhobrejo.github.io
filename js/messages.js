  

    //****************** Messages ************************
    var messagesRef;

    function startChat() {
        $('#div-chat').show();
        $('#button-send').click(function () {
            sendMessage();
        });
        $(document).keypress(function (e) {
            if (e.which == 13)
                sendMessage();
        });

        if (messagesRef != undefined)
            return;

        setSendEnabled(true);
        // return;

        function addMessage(key, message) {
            if ($('#li-message-' + key).length) return;
            var template = $('#message-template').html();
            template = template.replace('{key}', key);
            template = template.replace('{user-name}', message.userDisplayName);
            template = template.replace('{photo-url}', message.userPhotoUrl);
            template = template.replace('{body}', message.body);
            $('#ul-messages').prepend(template);
            $('#div-loading').hide();
        }

        function delMessage(key) {
            $('#li-message-' + key).hide(1000);
        }

        messagesRef = firebase.database().ref('messages/');

        messagesRef.limitToFirst(1).on('value', function (snapshot) {
            console.log('messagesRef.limitToFirst(1).on > value', snapshot.val());
        });

        messagesRef.on('child_added', function (data) {
            console.log('messagesRef.on > child_added', data.val());
            addMessage(data.key, data.val());
        });
        messagesRef.on('child_removed', function (data) {
            console.log('messagesRef.on > child_removed', data);
            delMessage(data.key);
        });
    }

    function sendMessage() {
        var message = $('#input-message').val();
        if (message.trim() == '') return;
        $('#input-message').attr("disabled", true);
        var data = {
            userDisplayName: loggedUser.displayName,
            userPhotoUrl: loggedUser.photoURL,
            uid: loggedUser.uid,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            body: message
        };
        var newMessageKey = firebase.database().ref('messages/').push(data, function (data) {
            console.log('database.ref.push >', data);
        });
        $('#input-message').attr("disabled", false);
        $('#input-message').val('');
        $('#input-message').focus();
    }


    function setSendEnabled(enabled) {
        $('#div-send').show(200);
        $('#input-message').attr("disabled", !enabled);
        $('#button-send').attr("disabled", !enabled);
    }
