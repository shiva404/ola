/**
 * Created by sn1 on 2/12/15.
 */

var request = require('request');

var mobileHash = "77035B27-E60E-4844-9F78-C35404BCA0BD";
var txtWebKey = "50972818-3fbb-4d4d-bb48-08fc1fd684ed";

var text = "<html><head><meta name=\"txtweb-appkey\" content=\" "+ txtWebKey + "\" /></head><body>Hello .. push from txtweb</body></html>";
var propertiesObject = {'txtweb-mobile':mobileHash, 'txtweb-message':text, 'txtweb-pubkey':txtWebKey};

var url = "http://api.txtweb.com/v1/push";

request({url:url, qs:propertiesObject, method:'POST'}, function(err, response, body) {
    if(err) { console.log(err); return; }
    console.log("Get response: " + response.statusCode);
    console.log(response)
});