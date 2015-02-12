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
        
    }
    else if (/req .*/g.test(txtWebMsg)){
        //todo: process booking request 
    }
    res.render('home',
        { title : 'Home' }
    )
});

function checkUserExists(phoneHash){

}

function createUser(phoneHash, email, name){
    
}

function getLocalityFromPin(pinCode){

}




app.listen(8080);
