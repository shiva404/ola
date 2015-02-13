var express = require('express'), stylus = require('stylus'), nib = require('nib');
var mysql = require('mysql2');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'shiva',
    password : 'password123',
    database : 'ola'
});

connection.connect();

var app = express();

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
    { src: __dirname + '/public'
        , compile: compile
    }
));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    var txtWebMsg = req.param('txtweb-message');
    var phoneHash = req.param('txtweb-mobile');

   

    if(/reg .*/g.test(txtWebMsg)){
        var user = extractUserFromMsg(txtWebMsg);
        createUser(user, phoneHash, function(err, result){
            if(err){
                console.log(err)
                res.render('error_message')
            } else {
                res.render('booking_request')
            }
        });
    }
    else if (/req .*/g.test(txtWebMsg)){
        getUserDetails(phoneHash, function(err, rows){

            if(err) {
                res.render('error_message');
            } else {
                if(rows.length > 0){
                    var user = rows[0];
                    var bookingDeatils = extractBookingDetails(txtWebMsg);
                    bookCab(user, bookingDeatils, function(err, data){
                        if(err){
                            console.log(err)
                            res.render('error_message')
                        } else {
                            res.render('confirmation', {name:data.name, phone:data.phone, rno:data.rno, from:data.from, to:data.to, date:data.date, time:data.time})
                        }
                    });
                } else {
                    res.render('registration');    
                }
            }
        });
    }
    else {
        checkUserExists(phoneHash, function(err, rows){
            if(err){
                console.log(err)
                res.render('error_message')
            } else {
                var b = rows[0].count > 0;
                console.log("received:" + b);
                if(b){
                    checkUserRegistered(phoneHash, function(error, data_rows){
                        if(error){
                            console.log(err)
                            res.render('error_message')
                        } else {
                            if(data_rows[0].count > 0){
                                res.render('booking_request')    
                            } else {
                                res.render('registration');
                            }
                        }
                    });
                } else {
                        savePhoneHash(phoneHash, function(err, result){
                        if(err){
                            console.log(err)
                            res.render('error_message')      
                        } else {
                            res.render('first_time')
                        }
                        });
                    }
            }
        });
    }
});

function bookCab(user, bookingDetils, cb) {
    
    cb(false, {name:user.name, phone:user.phone, from:getLocalityFromPin(bookingDetils.fromPin), 
        to:getLocalityFromPin(bookingDetils.toPin), date:bookingDetils.date, time:bookingDetils.time, rno:"00002345ka456"})
}

function getUserDetails(phoneHash, cb) {
    connection.query('SELECT * from users where phone_hash="' + phoneHash + '"', function(err, rows) {
        cb(err, rows)
    });
}

function savePhoneHash(phoneHash, cb) {
    var post  = {phone_hash: phoneHash, reg_req:0 };
    var query = connection.query('INSERT INTO users SET ?', post, function(err, result) {
        cb(err,result);
    });
    console.log(query.sql);
}

function checkUserRegistered(phoneHash, cb) {
    connection.query('SELECT count(*) from users where phone_hash="' + phoneHash + '" and reg_req = 1', function(err, rows) {
        cb(err, rows);
    });
}

function checkUserExists(phoneHash, cb){
    connection.query('SELECT count(*) as count from users where phone_hash="' + phoneHash + '"', function(err, rows) {
           cb(err, rows)
    });
}

function createUser(user, phoneHash, cb){
    console.log("Saving user :" + user.name + user.phone + user.email)
    var query = connection.query('Update users SET name = ?, phone_no = ?, email = ? where phone_hash = ?', [user.name, user.phone, user.email, phoneHash], 
        function(err, result) {
       cb(err, result);
    });
    console.log(query.sql);
}

function getLocalityFromPin(pinCode){
    if(pinCode == "500022")
        return "Yeshwanthpura";
    else if(pinCode == "500103")
        return "Bellandur";
}

function extractUserFromMsg(txtWebMsg) {
    console.log("received message:" + txtWebMsg);
    var data = /reg email:(.*)\s+phone:(.*)\s+name:(.*)/g.exec(txtWebMsg);
    return {email:data[1], phone:data[2], name:data[3]}
}

function extractBookingDetails(txtWebMsg) {
    console.log("received message:" + txtWebMsg);
    //req frmPin:500022 toPin:5000103 frmLndmrk:Metro date(dd/mm/yy):22/02/14 time:3am
    var data = /req frmPin:(.*)\s+toPin:(.*)\s+frmLndmrk:(.*)\s+date\(dd\/mm\/yy\):(.*)\s+time:(.*)/g.exec(txtWebMsg);
    return {fromPin:data[1], toPin:data[2], fromLandmark:data[3], date:data[4], time:data[5]}
}

app.listen(8080);
