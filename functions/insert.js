function insert_user(u_name, u_username, u_email, u_age, u_gender, u_sp, u_bio){
    src = '../config/connection.js';
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var myobj = {name: u_name, username: u_username, email: u_email, age: u_age, gender: u_gender, sp: u_sp, bio: u_bio};
        dbo.collection("users").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 Document inserted");
            db.close;
    });
});
}