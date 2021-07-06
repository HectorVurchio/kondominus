<!DOCTYPE html>
<html lang="en"> 
<head>
  <title>prueba</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
	<div class="pantalla"></div>
<script>
window.addEventListener("load",cargadoPagina,false);
function cargadoPagina(){
   showUpdateAccountForm();
}
function showUpdateAccountForm(){
   var jwt = getCookie('jwt');
   var JSONobject = JSON.stringify({ jwt:jwt });
   var url = "/verifica";
   var insertRequest=new XMLHttpRequest();
   insertRequest.addEventListener("load",showUpdateData,false);
   insertRequest.open("POST",url,true);
   insertRequest.setRequestHeader("Content-Type", "application/json; charset=UTF-8");  
   insertRequest.send(JSONobject);     
}

function showUpdateData(e){
var resp = JSON.parse(e.target.responseText);
var stat = e.target.status;
   if(stat == 200){
   console.log(resp);
     // store jwt to cookie
	   var inner = '<p>'+resp['message']+'</p>'+
		'<p>Nombre = '+resp['data'].Nombre+'</p>'+
        '<p>Apellido = '+resp['data'].Apellido+'</p>'+
		'<p>Cedula = '+resp['data'].Cedula+'</p>'+
		'<p>Estatus = '+resp['data'].Estatus+'</p>'+
		'<p>Email = '+resp['data'].email+'</p>'+
		'<p>id = '+resp['data'].id+'</p>'+
		'<p><button onclick="cleanCookie();">Borrar Cookie</button></p>';
   }else{
      var inner = '<p>HTTP State'+stat+'</p>';
   }   
   var def = document.getElementsByClassName("pantalla");
	   def[0].innerHTML = inner;
}
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
} 
function getCookie(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' '){
            c = c.substring(1);
        }
 
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function cleanCookie(){
    // remove jwt
    setCookie("jwt", "", 1);
}
</script>
</body>
</html>