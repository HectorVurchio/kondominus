	window.addEventListener("load",cargadoPagina,false);
	function cargadoPagina(){
	    profile = getCookie("profile");
		propDoc = getCookie("propDoc");
		if(profile == ''){logOut();}
		if(propDoc == ''){logOut();}	
		showUpdateAccountForm();
	}
	function showUpdateAccountForm(){
		var jwt = getCookie('jwt');
		var codEd = getCookie("propDoc").split(',')[1];
		var url = "/edificio";
		const resp = fetch(url, 
						{method: 'POST',
						mode: 'no-cors',
						credentials: 'same-origin',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify({ jwt:jwt,codEd:codEd})})
		.then(resp => resp.json())
		.then(data => {
		document.getElementById('tit').innerText = data.response[0].nombre_edificio+' - Recibo De Pago';
		document.getElementById('titTwo').innerText = data.response[0].nombre_edificio+' - Recibo De Pago';
		document.getElementById('nomEd').innerText ='Condominio '+ data.response[0].nombre_edificio;
		document.getElementById('nomEdTwo').innerText ='Condominio '+ data.response[0].nombre_edificio;
		document.getElementById('nombEdif').innerText =' Condominio '+ data.response[0].nombre_edificio;
		document.getElementById('nombEdifTwo').innerText =' Condominio '+ data.response[0].nombre_edificio;
		document.getElementById('numRi').innerText ='RIF '+ getCookie("propDoc").split(',')[1];
		document.getElementById('numRiTwo').innerText ='RIF '+ getCookie("propDoc").split(',')[1];
		document.getElementById('dir').innerText = 'Direccion: '+data.response[0].direccion;
		document.getElementById('dirTwo').innerText = 'Direccion: '+data.response[0].direccion;
		document.getElementById('ciu').innerText = data.response[0].ciudad;
		document.getElementById('ciuTwo').innerText = data.response[0].ciudad;
		document.getElementById('est').innerText = 'Estado '+data.response[0].estado;
		document.getElementById('estTwo').innerText = 'Estado '+data.response[0].estado;
		document.getElementById('tel').innerText = data.response[0].telefono;
		document.getElementById('telTwo').innerText = data.response[0].telefono;
		document.getElementById('email').innerText ='Correo '+ data.response[0].correo;
		document.getElementById('emailTwo').innerText ='Correo '+ data.response[0].correo;
		var fecha = sessionStorage.getItem("fecha").split('-');
		document.getElementById('atDer').innerText = data.response[0].ciudad+' '+fecha[2]+'/'+fecha[1]+'/'+fecha[0];
		document.getElementById('atDerTwo').innerText = data.response[0].ciudad+' '+fecha[2]+'/'+fecha[1]+'/'+fecha[0];
		}).then(()=>{
			document.getElementById('atIz').innerText = sessionStorage.getItem("numero");
			document.getElementById('nombre').innerText = sessionStorage.getItem("nombre");
			document.getElementById('cedula').innerText = sessionStorage.getItem("cedula");
			document.getElementById('monto').innerText = sessionStorage.getItem("monto");
			document.getElementById('concepto').innerText = sessionStorage.getItem("concepto");
			document.getElementById('formaPago').innerText = sessionStorage.getItem("tipo_pago");
			document.getElementById('referencia').innerText = sessionStorage.getItem("referencia");
		}).then(()=>{
			document.getElementById('atIzTwo').innerText = sessionStorage.getItem("numero");
			document.getElementById('nombreTwo').innerText = sessionStorage.getItem("nombre");
			document.getElementById('cedulaTWo').innerText = sessionStorage.getItem("cedula");
			document.getElementById('montoTwo').innerText = sessionStorage.getItem("monto");
			document.getElementById('conceptoTwo').innerText = sessionStorage.getItem("concepto");
			document.getElementById('formaPagoTwo').innerText = sessionStorage.getItem("tipo_pago");
			document.getElementById('referenciaTwo').innerText = sessionStorage.getItem("referencia");
		}).catch((error) => {
			//logOut();
		});	
	}
	
	function principal(){
		var protocol = window.location.protocol;
		var domain = window.location.hostname;
		url = protocol+'//'+domain;
		window.location.assign(url);
	}
	
	function logOut(){
		var propiedad = getCookie('property');
		var propSpted = propiedad.split(',');
		var JSONobject = JSON.stringify({ property:propSpted });
		var url = "/logOut";
		var insertRequest=new XMLHttpRequest();
		insertRequest.addEventListener("load",showLogOut,false);
		insertRequest.open("PUT",url,true);
		insertRequest.setRequestHeader("Content-Type", "application/json; charset=UTF-8");  
		insertRequest.send(JSONobject); 
	}
	function showLogOut(e){
		var stat = e.target.status;
		if(stat == 200){
		window.indexedDB.databases().then((r) => {
			for (var i = 0; i < r.length; i++) 
				window.indexedDB.deleteDatabase(r[i].name);})
			.then(() => {
				alert('Sesion Cerrada Con Normalidad');
		});
		}else{
			alert('Sesion Cerrada Con Problemas');
		}
		setCookie("jwt", "", -1);
		setCookie("profile", "", -1);
		setCookie("property", "", -1);
		setCookie("propError","", -1);
		setCookie("redir", "", -1); 
		setCookie("propDoc", "", -1);
		setCookie("izquierda", "", -1);
		setCookie("derecha", "", -1);
		window.location.assign('/');
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
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	} 	

	function printPagina(){
		window.print();
		window.close();
	}
	
	function regresar(){
		var redir = getCookie('redir');
		if(redir == ''){
			logOut();
		}else{
			var redirSpted = redir.split(',');
			var protocol = window.location.protocol;
			var domain = window.location.hostname;
			url = protocol+'//'+domain+'/'+redirSpted[1]+'/'+redirSpted[0]+'/egresos';
			window.location.assign(url);
		}
	}