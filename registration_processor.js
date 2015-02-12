var value = "reg email:shiva.n404@gmail.com phone:9535890448 name:shiv";



//console.log(/reg .*/g.test(value2));

//console.log(matchFound)

var data = /reg email:(.*)\s+phone:(.*)\s+name:(.*)/g.exec(value);
console.log(data[1]);




//value.replace(/reg .*/g)
