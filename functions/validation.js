function CheckPassword(pass) 
{ 
    var password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(pass.value.match(password)) {
        return true;
    }
    else{ 
        return false;
    }
}
