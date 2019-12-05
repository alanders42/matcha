module.exports = {
    checkPassword: function (pass) 
    { 
        var password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if(pass.match(password)) {
            return true;
        }
        else{ 
            return false;
        }
    }  
}
