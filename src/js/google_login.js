function getById(id) {
    return document.getElementById(id);
}

function waitPasswordAndSignIn(password) {
    if(!getById('Passwd')) {
        setTimeout(function() {
            waitPasswordAndSignIn(password);
        }, 300);
        return;
    }
    getById('Passwd').value = password;
    getById('signIn').click();
}

function doGoogleLogin(user, password) {
    if(getById('Email')) {
        getById('Email').value = user;
    }

    if(getById('next')) {
        setTimeout(function() {
            waitPasswordAndSignIn(password);
        }, 300);
        getById('next').click();
    }
}
