var express = require('express'), stylus = require('stylus'), nib = require('nib');
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


    if(/reg .*/g.test(txtWebMsg)){
        //todo process regestration
        var user = extractUserFromMsg(txtWebMsg);
        createUser(user)
        res.render('home',
            { title : 'Home' }
        )
    }
    else if (/req .*/g.test(txtWebMsg)){
        
        //todo: process booking request 
    }
    else {
        res.render('home',
            { title : 'Home' }
        );
        
    }
});

function checkUserExists(phoneHash){

}

function createUser(user){
    
}

function getLocalityFromPin(pinCode){

}

function extractUserFromMsg(txtWebMsg) {
    var data = /reg email:(.*)\s+phone:(.*)\s+name:(.*)/g.exec(txtWebMsg);
    return {email:data[1], phone:data[2], name:data[3]}
}





app.listen(8080);
