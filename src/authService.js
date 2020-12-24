// ένα αντικείμενο για τη διαχείριση της διαδικασίας του authentication 
const AuthService = {

    storeId: 0,
    loginCb: null,

    //χτυπάει το controller action του register για την εγγραφή ενός νέου καταστήματος
    register(data, cb) {
        fetch(window.$baseUrl + '/Store/Register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => res.text())
            .then((data) => {
                // Αν ο server δεν επιστρέψει κάτι, το register απέτυχε 
                if (isNaN(data)) {
                    cb(false, data);
                } else { //αλλιώς αποθηκεύεται το id του καταστήματος σε μια μεταβλητή και στο Local storage ώστε να ειναι διαθεσιμο σε περιπτωση που η σελίδα γίνει refresh
                    var storeId = parseInt(data);
                    AuthService.storeId = storeId;
                    localStorage.setItem("storeId", AuthService.storeId);
                    AuthService.loginCb(AuthService.storeId);
                    cb(true);
                }
            })
            .catch(console.log);
    },

    // TODO να γράψω το if οπως απο πανω
    //χτυπάει το controller action του Authenticate για τον έλεγχος των στοιχείων του χρήστη
    authenticate(username, password, cb) {
        fetch(window.$baseUrl + '/Store/Authenticate/' + username + "/" + password)
            .then(res => res.json())
            .then((data) => {
                if (data > 0) {
                    AuthService.storeId = data;
                    localStorage.setItem("storeId", AuthService.storeId);
                    AuthService.loginCb(AuthService.storeId);
                    cb(true);
                } else {
                    cb(false);
                }
            })
            .catch(console.log);
    },
    
    //καλείται μόλις φορτώσει η σελίδα και ελέγχει αν υπάρχει στο Local storage το id του καταστήματος
    // αν υπάρχει καλεί το controller action του Login ώστε να γίνει login αυτόματα ο χρήστης
    autoLogin() {
        var data = localStorage.getItem("storeId");
        if (data == null) {
            return;
        }

        var storeId = parseInt(data);
        if (isNaN(storeId)) {
            return;
        }

        AuthService.storeId = storeId;
        AuthService.loginCb(AuthService.storeId);
    },

    logout() {
        localStorage.clear();
        AuthService.storeId = null;
    },

    onLogin(cb) {
        AuthService.loginCb = cb;
    },

    isAuthenticated() {
        return AuthService.storeId > 0;
    }

    /*signout(cb) {
        setTimeout(cb, 100)
    },*/
}

export default AuthService;
