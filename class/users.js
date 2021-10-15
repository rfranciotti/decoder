module.exports = class Users {
    _username;
    _email;
    _password;

    constructor(username, email, password) {
        this._username = username;
        this._email = email;
        this._password = password;
    }


    get username() {
        return _username

    }
    get email() {
        return _email
    }
    get password() {
        return _password
    }




}