
   

    //****************** Users ************************
    
    var usersRef;

    function listenUsers() {

        function addUser(key, user) {
            var template = $('#user-template').html();
            template = template.replace('{key}', key);
            template = template.replace('{class}', '');
            template = template.replace('{user-name}', user.displayName);
            template = template.replace('{photo-url}', user.photoUrl);
            $('#ul-users-online').prepend(template);
            setUserStatus(key, user);
        }

        function setUserStatus(key, user) {
            if (user.lastOnline != undefined) {
                $('#li-user-' + key).removeClass('online').addClass('offline');
            } else {
                $('#li-user-' + key).removeClass('offline').addClass('online');
            }
        }

        usersRef = firebase.database().ref('users/');

        usersRef.on('child_added', function (data) {
            console.log('usersRef.on > child_added', data.val());
            addUser(data.key, data.val());
        });
        usersRef.on('child_changed', function (data) {
            console.log('usersRef.on > child_changed', data.val());
            setUserStatus(data.key, data.val());
        });
    }


