function getById(id) {
	return document.getElementById(id);	
}

function doGoogleLogin(user, password) {	
	if(getById('Email')) {
		getById('Email').value = user;
	}	
	getById('Passwd').value = password;
	
	getById('signIn').click();
}

