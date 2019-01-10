
// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function () {

    var userName = readCookie("username");
    var userEmail = readCookie("useremail");

    if (useremail !== null) {

        $(".areauser").empty();
        $(".areauser").append("<h3>Hi " + userName + ", how are you doing today?</h3>");

    }
    // Initialize Firebase //// MOVE ALL OF THIS TO THE .env file
    var config = {
        apiKey: "AIzaSyAQdQKzg61WjdyOQ3fFTnu5lX5Z6YOsw78",
        authDomain: "educated-guess.firebaseapp.com",
        databaseURL: "https://educated-guess.firebaseio.com",
        projectId: "educated-guess",
        storageBucket: "educated-guess.appspot.com",
        messagingSenderId: "950784072530",
        // Google Oauth client ID and discovery docs
        clientId:
            "950784072530-kr070pd267ccc8lae9iqkb1jv7fpa3og.apps.googleusercontent.com"
    };
    firebase.initializeApp(config);

    // ====================== login start ======================//
    var database = firebase.database();
    // Assign a variable to equal the Firebase pathway to the Interests folder
    var interestRef = database.ref('Interests')
    // Assign a variable to equal the Firebase pathway to the Users folder
    var usersRef = database.ref('Users')
    // Assign a variable to hold the value of whether a user is logged in or not
    var auth = null;
    // Assign a variable to a blank string 'globally' so it can be reassigned when a user is authenticated (logged in)
    var userID = "";


    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');


    $('#googleLogin').on('click', function () {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            console.log("result");
            console.log(result);
            var token = result.credential.accessToken;
            // The signed-in user info.
            var userName = result.user.displayName;
            console.log(user, email)
            var useremail = result.user.email;
            console.log(user, email)

            // Clear the previous cookie by setting it it equal to nothing and its expiration date to a past time
            document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            document.cookie = "customerid=; expires=Thu, 01 Jan 1970 00:00:00 UTC";

            // Store the username as a cookie using "document.cookie"
            document.cookie = "username=" + userName + ";";
            document.cookie = "useremail=" + useremail + ";";
            // Send the POST request.
            var newUser = {
                name: userName,
                email: useremail
            };
            $.ajax("/api/users", {
                type: "POST",
                data: newUser
            }).then(
                function (data) {

                    location.reload();

                });

            // ...


        }).catch(function (error) {
            console.log("error");
            console.log(error);


        });

    });


    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("listener-user")
            console.log(user)
            // User is signed in.
        } else {

            console.log("no logged")
            // No user is signed in.
        }
    });


    // Sign out using built-in Firebase function on click of logout button


    $('#logout').on('click', function (e) {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
        });
    });

    // NOTE: In order to modify cookies, we must access them over a secure connection e.i = https, localhost:
    // Needed to create this function to readCookies. Essentially it splits up the cookie list
    // See the working app at http://cookie-example-rcb.herokuapp.com/ or by opening with Firefox or Safari
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

});


