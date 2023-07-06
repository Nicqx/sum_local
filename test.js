var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Http = new XMLHttpRequest();
const url='http://pmqxyz.hopto.org/random_szam.txt';
Http.open("GET", url );
Http.send();

Http.onreadystatechange=function(){
	if(this.readyState==4 && this.status==200){
		let num = parseFloat(Http.responseText);
		console.log("num:", num, "EMD", typeof num);
	}
}

