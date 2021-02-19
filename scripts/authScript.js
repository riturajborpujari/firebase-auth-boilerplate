/** Replace with your Firebase app config */
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

firebase.initializeApp(firebaseConfig);

function signInWithGoogle() {
    console.log('Signing in with google...');
    let provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider);
}

function showCaptcha() {
    console.log('Loading captcha...');

    let msgContainer = document.getElementById('msg-container');
    msgContainer.innerHTML = "<span class=\"info\">Loading captcha...</span>";

    let recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'normal',
        'callback': function (response) {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log('Capctha solved');
            msgContainer.innerHTML = "";

            signInWithMobile();
        },
        'expired-callback': function () {
            console.log('Resetting capctha...');
            grecaptcha.reset(window.recaptchaWidgetId);
        }
    });

    window.recaptchaVerifier = recaptchaVerifier;

    // render the captcha
    window.recaptchaVerifier.render()
        .then(widgetId => {
            msgContainer.innerHTML = "";
            window.recaptchaWidgetId = widgetId;
        })
}

async function signInWithMobile() {
    console.log('Signing in with mobile...');

    var phoneNumber = document.getElementById('phone').value;
    var appVerifier = window.recaptchaVerifier;

    try {
        window.confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)

        // SMS sent. Prompt user to type the code from the message, then sign the
        console.log('SMS sent. Type in code and click verify');
    }
    catch (error) {
        // Error; SMS not sent
        console.error(error);
    }
}

async function verifyOTP() {
    let code = document.getElementById('otp_code').value;

    try {
        console.log('Confirming OTP...');
        let confirmationResult = window.confirmationResult;

        let credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);
        let data = await firebase.auth().signInWithCredential(credential);

        console.log('OTP confirmation response: ', data);
        // console.log('Linking phone credential with current user');
        // let userCred = await firebase.auth().currentUser.linkWithCredential(credential);

        // console.log('Account linking success', userCred.user);
    }
    catch (err) {
        console.error(err);
    }
}

document.getElementById('email-signup-form').addEventListener('submit', signUpWithEmail);

async function signUpWithEmail(evt) {
    evt.preventDefault();

    try {
        const email = document.getElementById('email-field').value;

        console.log(`Signing up with `, { email });

        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be whitelisted in the Firebase Console.
            url: `http://localhost:8080?email=${email}`,
            // This must be true.
            handleCodeInApp: true,
            // iOS: {
            //     bundleId: 'com.example.ios'
            // },
            // android: {
            //     packageName: 'com.example.android',
            //     installApp: true,
            //     minimumVersion: '12'
            // }
        };

        /**
         * Send One time signin link to email
         */
        await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
        console.log('Sign-in email sent.');
    }

    catch (err) {
        console.log({ code: error.code, message: error.message });
    }
}

document.getElementById('email-signin-form').addEventListener('submit', signInWithEmail);

async function signInWithEmail(evt) {
    evt.preventDefault();

    const email = document.getElementById('signin-email-field').value;
    const password = document.getElementById('signin-password-field').value;
    const emailLink = document.getElementById('signin-email-link').value;

    /** if emailLink is provided sign in with that and set password */
    if (!emailLink) {
        console.log('Signing in with ', { email, password });

        try {
            let userCred = await firebase.auth().signInWithEmailAndPassword(email, password)
            console.log('Email/Pasword Sign in successful ', userCred.user.email);
        }
        catch (error) {
            console.log('Email/Password signin error', { code: error.code, message: error.message });
        }
    }
    else {
        console.log('Signing in with ', { email, emailLink });
        try {
            /**
             * Sign in with email link
             */
            await firebase.auth().signInWithEmailLink(email, emailLink)
            console.log('Email link Sign in successful ', email);

            /**
             * Get currently signed in user
             */
            const u = firebase.auth().currentUser;

            /**
             * Set password for user account
             */
            await u.updatePassword(password);

            console.log('Password set');
        }
        catch (error) {
            console.log('Email link signin error', { code: error.code, message: error.message });
        }
    }
}


function attachShowCaptcha() {
    console.log('Loading captcha...');

    let msgContainer = document.getElementById('attach-msg-container');
    msgContainer.innerHTML = "<span class=\"info\">Loading captcha...</span>";

    let recaptchaVerifier = new firebase.auth.RecaptchaVerifier('attach-recaptcha-container', {
        'size': 'normal',
        'callback': function (response) {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log('Capctha solved');
            msgContainer.innerHTML = "";

            AttachPhoneNumber();
        },
        'expired-callback': function () {
            console.log('Resetting capctha...');
            grecaptcha.reset(window.recaptchaWidgetId);
        }
    });

    window.recaptchaVerifier = recaptchaVerifier;

    // render the captcha
    window.recaptchaVerifier.render()
        .then(widgetId => {
            msgContainer.innerHTML = "";
            window.recaptchaWidgetId = widgetId;
        })
}

async function AttachPhoneNumber() {
    console.log('Signing in with mobile...');

    var phoneNumber = document.getElementById('attach-phone').value;
    var appVerifier = window.recaptchaVerifier;

    try {
        window.confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)

        // SMS sent. Prompt user to type the code from the message, then sign the
        console.log('SMS sent. Type in code and click verify');
    }
    catch (error) {
        // Error; SMS not sent
        console.error(error);
    }
}

async function attachVerifyOTP() {
    let code = document.getElementById('attach-otp_code').value;

    try {
        console.log('Confirming OTP...');
        let confirmationResult = window.confirmationResult;

        /**
         * Create the sign in credential for user mobile
         */
        let credential = firebase.auth.PhoneAuthProvider.credential(confirmationResult.verificationId, code);

        /**
         * Link phone credential with current user
         */
        let userCred = await firebase.auth().currentUser.linkWithCredential(credential);

        console.log('Account linking success', userCred.user.displayName);
    }
    catch (err) {
        console.error(err);
    }
}

function greet(user){
    const el = document.getElementById('welcome-info');
    
    el.innerHTML = `
        <span>Welcome,</span>
        <span class="greeting-user">${user || 'Guest'}.</span>
        ${
            user? 
                '<button onClick="signout()">Signout</button>': 
                '<span>Please Sign in</span>'
        }
    `
}

function signout(){
    firebase.auth().signOut();
}

/**
 * Subscribe to firebase user state change
 *  - SignIn
 *  - SignOut
 */
firebase.auth().onAuthStateChanged(async user => {
    console.log('Firebase auth state changed');

    if (user) {
        /**
         * User has signed in
         */
        greet(user.displayName || user.email);

        console.log('Signed in user: ', user.email);

        if (!user.phoneNumber) {
            document.getElementById('phone-number-attach').style.display = 'block';
        }
        else {
            document.getElementById('phone-number-attach').style.display = 'none';
        }

        console.log('Loading idToken...');
        let idToken = await user.getIdTokenResult(true);

        /**
         * Check if custom Hasura claims exist in the token
         */
        if (!idToken.claims['https://hasura.io/jwt/claims']) {
            console.log('Hasura claims not found in token');
        }
        else {
            console.log('Hasura claims found in token');
        }
    }
    else{
        /**
         * User has signed out or not yet signed in
         */
        greet();
    }
})