	function mainPage(){
	    var izq = getCookie('izquierdaDos');
		if(izq == ''){
			logOut();
		}else{
		    var izquierda = izq.split(',');
			var cuerpo = document.getElementsByClassName('cuerpo');
			setPageName(izquierda[8]);
			var cuerpoItems = 	"<div class='relleno' ></div>"+
			"<div class='izquierda'>"+	
				"<div class='idPagina'>"+
					"<img class='imgIdPagina' src='/apiGrafica/imagenes/"+izquierda[0]+"'>"+izquierda[1] +
				"</div>"+
	   "<div class='formulario'></div>"+  
				"<div class='anteBotonDos'><p>&nbsp;</p></div>"+
				"<div class='anteBotonDos'><p>&nbsp;</p></div>"+
			"</div>"+
			"<div class='derecha'>"+
				"<div class='areaFacturas' id='areaFacturas'></div>"+
				"<div class='factZone'>"+
					"<div class='areaFecha'>"+
						"<label for='rangoOne' id='rangOneLab'>Periodo</label>"+
						"<input type='date' id='rangoOne'></input>"+
					"</div>"+
					"<div class='areaBoton'>"+
						"<button id='facButton' onclick='facButton(\""+izquierda[12]+"\")'>Buscar</button>"+
					"</div>"+
				"</div>"+
			"</div>";
			cuerpo[0].innerHTML = cuerpoItems;
			formProvider(izquierda[12],izquierda[13]);
		}
	}
	
	function formProvider(form,tipoForm){
	    var formulario = document.getElementsByClassName('formulario');
		var fila = [];
		fila[0] = "<div class='anteTitulo'><p>&nbsp;</p></div>";
		fila[1] = "<div class='titulo'><p>"+tipoForm+"</p></div>";
		fila[2] ="<div class='fila'>"+
					"<div class='tipoProy'><select id='tipoProy'></select></div>"+
				"</div>";
		fila[3] ="<div class='fila'>"+
					"<div class='fecha'><input type='date' id='fecha' ></div>"+
				"</div>";
		fila[4] ="<div class='fila'>"+
					"<div class='numCu'><input type='text' id='numCu' oninput='numberValidation(event)' maxLength='2' placeholder='No' value='1' ></div>"+
				"</div>";		
		fila[5] ="<div class='fila'>"+
					"<div class='concepto'><input type='text' id='concepto' maxLength='80' placeholder='Concepto'></div>"+
				"</div>";
		fila[6] ="<div class='fila'>"+
					"<div class='monto'><input type='text' id='monto' oninput='decNumbValidation(event)' placeholder='0.00 Monto Total'></div>"+
				"</div>";
		fila[7] ="<div class='fila'>"+
					"<div class='nota'><input type='text' id='nota' placeholder='Anotaciones' maxLength='65'></div>"+
				"</div>";
		fila[8] = "<div class='anteTitulo'><p>&nbsp;</p></div>";
		fila[9] = "<div class='fila'>"+
			        "<div class='ingresoUno'><button id='ingresoUno' onclick='ingresoUno(\""+form+"\")'>Ingresar</button></div>"+
		            "</div>";
		fila[10] = "<div class='anteTitulo'><p>&nbsp;</p></div>";
		if(form == 'formCuatro'){
			interno = '';
			for(i=0;i<11;i++){
				interno = interno + fila[i];
			}
			formulario[0].innerHTML = interno;
		}
		tipoProyecto();
	}
	
	function tipoProyecto(){
		var nombreBD = 'estados_ciudades';
		var version = 1;
		var tabla = 'proyecciones';
		var baseDatos = indexedDB.open(nombreBD,version);
		var tipoProy = document.getElementById('tipoProy');
		var interno ='';
		baseDatos.onerror = function(e){
			console.log(e.target.error);
		}
		baseDatos.onsuccess = function(e){
			var db = e.target.result;
			var transaction = db.transaction([tabla], "readonly");
			var objectStore = transaction.objectStore(tabla);
			var request = objectStore.openCursor();
			request.onsuccess = function(event) {
				var cursor = event.target.result;
				if(cursor) {
				 interno += "<option value = '"+cursor.value.cod+"'>"+cursor.value.nomb+"</option>";
				 tipoProy.innerHTML = interno;
				cursor.continue();
				} else {
				console.log('nada');
				}
			};
		}
	}
	
	async function ingresoUno(form){
		var fields =[];
		if(form == 'formCuatro'){
			fields[0] = document.getElementById("tipoProy");
			fields[1] = document.getElementById("fecha");
			fields[2]=document.getElementById("numCu");
			fields[3]=document.getElementById("concepto");
			fields[4]=document.getElementById("monto");
			fields[5]=document.getElementById("nota");			
		}
		 for(i=0;i<fields.length;i++){
		    if(fields[i] != null){
				if(fields[i].value == ''){
					fields[i].style.border = '2px solid red';
				}else{
					fields[i].style.border = '1px solid #8c8c8c';
				}
			}
		}
		 let promise = new Promise((resolve,reject) =>{
			setTimeout(()=> resolve(aviso(fields,form)),250)});
		 let result = await promise;
	}
	
	function aviso(fie,form){
		var sigue = true;
		for(i=0;i<fie.length;i++){
			if(fie[i] != null){
				if(fie[i].style.border == '2px solid red'){
					sigue = false;
					alert('Favor Rellenar Los Campos Señalados En Rojo');
					break;
				}	
			}
		}
		if(sigue == true){
			var jwt = getCookie('jwt');
			var propDoc = getCookie("propDoc");
			var docSped = propDoc.split(',');
			var object,url;
			if(form == 'formCuatro'){
				 object = {jwt:jwt,coEd:docSped[1],fecha:fie[1].value,clasif:fie[0].value,cuotas:fie[2].value,
							concepto:fie[3].value,monto:fie[4].value,nota:fie[5].value};					   
				 url="/registroProyeccion";
			}
			var confirmar = new CustomConfirm(url,object,form);
			confirmar.render();
		}			
	}
	
	function CustomConfirm(url,object,form){
		this.render = function(){
			var cadena=[];
			cadena[0] = "<table><tr><td id='tabColOne'>Tipo:</td><td>&nbsp;</td><td id='tabColTwo'>"+object.clasif+"</td></tr>";			 
			cadena[1] = "<tr><td id='tabColOne'>Fecha:</td><td>&nbsp;</td><td id='tabColTwo'>"+object.fecha+"</td></tr>";
			cadena[2] = "<tr><td id='tabColOne'>Cuotas:</td><td>&nbsp;</td><td id='tabColTwo'>"+object.cuotas+"</td></tr>";
			cadena[3] =	"<tr><td id='tabColOne'>Concepto:</td><td>&nbsp;</td><td id='tabColTwo'>"+object.concepto+"</td></tr>";
			cadena[4] = "<tr><td id='tabColOne'>Monto:</td><td>&nbsp;</td><td id='tabColTwo'>"+object.monto+"</td></tr>";
			cadena[5] = "<tr><td id='tabColOne'>Nota:</td><td>&nbsp;</td><td id='tabColTwo'>"+object.nota+"</td></tr>";
			cadena[6] = "</table>";
			var interno = '';
			if (form == 'formCuatro'){
				for(i=0;i<cadena.length;i++){
					interno += cadena[i];
				}
			}
			var winW = window.innerWidth;
			var winH = window.innerHeight;
			var dialogoverlay = document.getElementById('dialogoverlay');
			var dialogbox = document.getElementById('dialogbox');		
			dialogoverlay.style.display = "block"; 				
			dialogoverlay.style.height = winH+"px";		
			dialogbox.style.display = "block"; 		
			document.getElementById('dialogboxhead').innerHTML = "Desea Introducir Estos Valores?";
			document.getElementById('dialogboxbody').innerHTML = interno;
			var botones='<button  id="yesButton">SI</button>'+
					'<button id="noButton" onclick="new CustomConfirm().no()">NO</button>';
			document.getElementById('dialogboxfoot').innerHTML=botones;
			var vent = window.matchMedia("(min-width: 300px)");
			vent.addListener(function(){
				if (vent.matches) { // If media query matches
					dialogbox.style.display = "none"; 
					dialogoverlay.style.display = "none";
				} else {
					dialogbox.style.display = "none"; 
					dialogoverlay.style.display = "none";
				}
			});
		dialogbox.style.left =(winW-dialogbox.offsetWidth)/2+"px";
		dialogbox.style.top ="0px";	
		document.getElementById('yesButton').addEventListener('click',function(){
			new CustomConfirm(url,object,form).yes();
		});
		}
		this.no = function(){ 
			document.getElementById('dialogbox').style.display = "none"; 
			document.getElementById('dialogoverlay').style.display = "none"; 
		}
		this.yes = function(){  
			insertExpenses(url,object,form);
			restabForm();
			document.getElementById('dialogbox').style.display = "none";  
			document.getElementById('dialogoverlay').style.display = "none"; 
		}
	}
	
	function insertExpenses(url,object,form){
        var objJson = JSON.stringify(object);	
		var insertRequest=new XMLHttpRequest();
		insertRequest.open("POST",url,true);
		insertRequest.send(objJson);
		insertRequest.onload = function(e){
			resp = JSON.parse(e.target.responseText);
			var areaFacturas = document.getElementById("areaFacturas");
			areaFacturas.innerHTML = e.target.responseText;
			if(e.target.status == 200){
				var cadena = [];
				cadena[0] = "<div class='avisoDos'>"+
								"<div class='subAvisoDos'>";
				cadena[1] =	"<div class='saRowDos'>La Proyeccion Con Los Siguientes Datos:</div>"+
							"<div class='saRowDos'>"+
								"<div class='sarColOnDos'>Tipo:</div>"+"<div class='sarColTwDos'>"+object.clasif+"</div>"+
							"</div>";
				cadena[2] =	"<div class='saRowDos'>"+
							"<div class='sarColOnDos'>Fecha:</div>"+"<div class='sarColTwDos'>"+object.fecha+"</div>"+
							"</div>";
				cadena[3] = "<div class='saRowDos'>"+
							"<div class='sarColOnDos'>Cuotas:</div>"+"<div class='sarColTwDos'>"+object.cuotas+"</div>"+
							"</div>";
				cadena[4] = "<div class='saRowDos'>"+
							"<div class='sarColOnDos'>Concepto:</div>"+"<div class='sarColTwDos'>"+object.concepto+"</div>"+
							"</div>";
				cadena[5] = "<div class='saRowDos'>"+
							"<div class='sarColOnDos'>Monto:</div>"+"<div class='sarColTwDos'>"+object.monto+"</div>"+
							"</div>";
				cadena[6] = "<div class='saRowDos'>"+
							"<div class='sarColOnDos'>Nota:</div>"+"<div class='sarColTwDos'>"+object.nota+"</div>"+
							"</div>";
				cadena[7] = "<div class='saRowDos'>Se Registró Satisfactoriamente</div>"+
							"</div>"+
							"</div>";
				interno = '';
				if(form == 'formCuatro'){
					for(i=0;i<cadena.length;i++){
						interno += cadena[i];
					}
				}
				areaFacturas.innerHTML = interno;
			}else{
				var interno = "<div class='avisoDos'>"+
								"<div class='subAvisoDos'>"+
								"<div class='saRowDos'>Status:"+e.target.status+"</div>"+
								"<div class='saRowDos'>Hubo Un Problema</div>"+
								"<div class='saRowDos'>"+resp.response.message+"</div>"+
								"<div class='saRowDos'>"+resp.response.response+"</div>"+
								"<div class='saRowDos'><button class='botonAviso' onclick='restabForm()'>Entendido</button></div>"+
								"</div>"+
							"</div>";
				areaFacturas.innerHTML = interno;
			}
		}

	}
	
	function restabForm(){
		var izq = getCookie('izquierdaDos');
		if(izq == ''){
			logOut();
		}else{
		    var izquierda = izq.split(',');
			formProvider(izquierda[12],izquierda[13]);
		}
	}
	
	async function facButton(form){
		var periodo = document.getElementById('rangoOne');
			if(periodo.value == ''){
				periodo.style.border = '2px solid red';
			}else{
				periodo.style.border = '1px solid #8c8c8c';
			}
		
		 
		 let promise = new Promise((resolve,reject) =>{
			setTimeout(()=> resolve(avisoDos(periodo,form)),250)});
		 let result = await promise;
	}
	
	function avisoDos(periodo,form){
		var sigue = true;
			if(periodo.style.border == '2px solid red'){
				sigue = false;
				alert('Favor Seleccionar La Fecha Para El Periodo Deseado');
			}
		if(sigue == true){
			var url;
			var jwt = getCookie('jwt');
			var coed = getCookie("propDoc").split(',')[1];
			var object = {codEd:coed,fecha:periodo.value,jwt:jwt};
			if(form == 'formCuatro'){
				url = "/consultaProyeccion";		
			}	
			buscarFacturas(url,object,form);
		}
	}
	
	async function buscarFacturas(url,object,form){	
		var areaFacturas = document.getElementById('areaFacturas');
		var periodo = document.getElementById('rangoOne');
		const resp = await fetch(url,{method: 'POST',mode: 'no-cors',credentials: 'same-origin',
									 headers: {'Content-Type': 'application/json'},body: JSON.stringify(object)})
		.then(resp => resp.json())
		.then(data => {
			var cuentas = data.response[0];
			var sumas = data.response[1];
			if(form == 'formCuatro'){
				var interno="<div style='overflow-x:auto;'>"+"<table>"+"<tr>"+"<th>Concepto</th>"+"<th>Clasificacion</th>"+"<th>Numero</th>"+
							"<th>Fecha</th>"+"<th>Cuotas</th>"+"<th>Monto</th>"+"</tr>";
				for(i=0;i<sumas.length;i++){
					for(j=0;j<cuentas.length;j++){
						if(sumas[i]['clasificacion'] == cuentas[j]['clasificacion']){
							interno += "<tr onclick='new deleteConfirm(event)'>"+"<td>"+cuentas[j]['concepto']+"</td>"+
							            "<td>"+cuentas[j]['clasificacion']+"</td>"+
										"<td style='text-align:left;'>"+cuentas[j]['control']+"</td>"+
										"<td>"+cuentas[j]['fecha']+"</td>"+
										"<td>"+cuentas[j]['cuotas']+"</td>"+"<td style='text-align:right;'>"
										+cuentas[j]['monto']+"</td>"+"</tr>";
						}
					}
					interno += "<tr style='background-color:#b8edff;'>"+"<td>&nbsp;</td>"+
								"<td style='text-align:left;'>Total "+sumas[i]['clasificacion']+"</div>"+"<td>&nbsp;</td>"+
								"<td>&nbsp;</td>"+"<td>&nbsp;</td>"+
								"<td style='text-align:right;'>"+sumas[i]['SUM(monto)']+"</td>"+"</tr>";
				}
			}

			areaFacturas.innerHTML = interno + "</table></div>";
		}).catch((error) => {
			console.error('Error:', error);
			var interno="<div style='overflow-x:auto;'><table><tr>"+error+"</tr><table></div>";
			areaFacturas.innerHTML = interno;
		});	
		periodo.value ='';
	}	

	function deleteConfirm(event){
		var izquierda = getCookie('izquierdaDos').split(',');
		var form = izquierda[12];
		var x = event.target;
		var z =x.parentElement;
		var d = z.childNodes; //mi variable
		var deletion=[];
		for(i=0;i<d.length;i++){
			if(deletion[i] != 'undefined'){
				deletion[i]=d[i].textContent;
			}
		}		  
        var cadena = "Que Accion Desea Realizar?";			
		var winW = window.innerWidth;
	    var winH = window.innerHeight;
		var dialogoverlay = document.getElementById('dialogoverlay');
	    var dialogbox = document.getElementById('dialogbox');		
		dialogoverlay.style.display = "block"; 
	    dialogoverlay.style.height = winH+"px";
	    dialogbox.style.display = "block"; 		
		document.getElementById('dialogboxhead').innerHTML = "Accion De Registro";
	    document.getElementById('dialogboxbody').innerHTML = cadena;
		var boton = [];
		var idB = [];
		var botones = '';
		if(form == 'formCuatro'){
			idB = ["","","wisButtonPro","wisButtonEl","wisButtonCan"];
			boton[0] ='';
			boton[1] ='';
			boton[2] ='<button id="wisButtonPro" onclick="personalData(\''+deletion+'\')">Datos Proyeccion</button>';
		}
		boton[3] ='<button id="'+idB[3]+'" onclick="new deleteConfirmAnswer().yesOne(\''+deletion+'\')">Eliminar</button>'; 
		boton[4] ='<button id="'+idB[4]+'" onclick="new deleteConfirmAnswer().no()">Cancelar</button>';
		for(i=0;i<boton.length;i++){
				botones += boton[i];
		}
		document.getElementById('dialogboxfoot').innerHTML=botones;
	  dialogbox.style.left =(winW-dialogbox.offsetWidth)/2+"px";
	  if(window.innerWidth < 1000+'px'){
		 dialogbox.style.top = (winH-dialogbox.offsetHeight)/2+"px"; 
	  }else{
		  dialogbox.style.top = (winH-dialogbox.offsetHeight)/3+"px"; 
	  }
	}
	
function deleteConfirmAnswer(){
	this.no = function(){ 
		document.getElementById('dialogbox').style.display = "none"; 
		document.getElementById('dialogoverlay').style.display = "none"; 
	}
	this.yesOne = function(dele){ 
	      toDelete = dele.split(',');
	      deletionData=toDelete;	  
		  var form = getCookie('izquierdaDos').split(',')[12];
		  var cadena =[];
		  if(form == 'formCuatro'){
			  cadena[0] ="<table><tr><td>Concepto:</td><td>&nbsp;</td><td>"+toDelete[0]+"</td></tr>";
			  cadena[1] = "<tr><td>Clasificacion:</td><td>&nbsp;</td><td>"+toDelete[1]+"</td></tr>";
			  cadena[2] =	"<tr><td>Numero:</td><td>&nbsp;</td><td>"+toDelete[2]+"</td></tr>";
			  cadena[3] =	"<tr><td>Fecha:</td><td>&nbsp;</td><td>"+toDelete[3]+"</td></tr>";
			  cadena[4] =	"<tr><td>Cuotas:</td><td>&nbsp;</td><td>"+toDelete[4]+"</td></tr>";
			  cadena[5] = "</table>";
		  }
			var interno = '';
			for(i=0;i<cadena.length;i++){
				interno += cadena[i];
			}	
	   document.getElementById('dialogboxhead').innerHTML = "Esta Seguro Que Desea Eliminar";
	   document.getElementById('dialogboxbody').innerHTML = interno;
	   var botones='<button id="yesButton" onclick="new deleteConfirmAnswerTwo(deletionData)">SI</button>'+
				'<button id="noButton" onclick="new deleteConfirmAnswer().no()">NO</button>';
	   document.getElementById('dialogboxfoot').innerHTML=botones;
	   var dialogbox = document.getElementById('dialogbox');
	   var winW = window.innerWidth;
	   var winH = window.innerHeight;
	   dialogbox.style.left =(winW-dialogbox.offsetWidth)/2+"px";
	   dialogbox.style.top = (winH-dialogbox.offsetHeight)/3+"px";	
	}
}

	function deleteConfirmAnswerTwo(toDelete){
		var form = getCookie('izquierdaDos').split(',')[12];
		var codEd = getCookie("propDoc").split(',')[1];
		var jwt = getCookie('jwt');
		var object,url; 
		if(form == 'formCuatro'){
			object = {jwt:jwt,codEd:codEd,recNum:toDelete[2]};
			url="/eliminaProyeccion";
		}

		const resp = fetch(url, 
						{method: 'DELETE',
						mode: 'cors',
						credentials: 'same-origin',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify(object)})
		.then(resp => resp.status)
		.then(data => {
			var areaFacturas = document.getElementById("areaFacturas");
			var cadena = [];			
			if(data == 200){
				cadena[0]="<p style='text-align:center;'>Los Datos Mostrados A Continuacion:</p>";
				if(form == 'formCuatro'){
					cadena[1] = "<table><tr><td>Concepto:</td><td>&nbsp;</td><td>"+toDelete[0]+"</td></tr>";
					cadena[2] =	"<tr><td>Clasificacion:</td><td>&nbsp;</td><td>"+toDelete[1]+"</td></tr>";
					cadena[3] = "<tr><td>Numero:</td><td>&nbsp;</td><td>"+toDelete[2]+"</td></tr>";
					cadena[4] = "<tr><td>Fecha:</td><td>&nbsp;</td><td>"+toDelete[3]+"</td></tr>";
					cadena[5] =	"<tr><td>Cuotas:</td><td>&nbsp;</td><td>"+toDelete[4]+"</td></tr>";
					cadena[6] =	"<tr><td>Monto:</td><td>&nbsp;</td><td>"+toDelete[5]+"</td></tr>";
					cadena[7] = "</table>";
					cadena[8] =	"<p style='text-align:center;'>Fueron Eliminados Satisfactoriamente</p>";
				}
				
			}else{
				cadena[0]="<p style='text-align:center;'>Estatus HTTP: "+data+"</p>";
				cadena[1]="<p style='text-align:center;'>Los Datos Seleccionados</p>";
				cadena[2]="<p style='text-align:center;'>No Pudieron Ser Eliminados</p>";
			}
			new deleteConfirmAnswer().no();
			var interno = '';
			for(i=1;i<9;i++){
				interno += cadena[i];
			}
			areaFacturas.innerHTML = cadena[0]+interno + cadena[7];
		}).catch((error) => {
			console.error('Error:', error);
		});	
		
	}
	
	function personalData(del){
		var deletion = del.split(',');
		var codRec = deletion[2];
		var codEd = getCookie("propDoc").split(',')[1];
		var izquierda = getCookie('izquierdaDos').split(',');
		var form = izquierda[12];
		var jwt = getCookie('jwt');
		var object,url; 
		var flagDos = false;
		if(form == 'formCuatro'){
			object = {codEd:codEd,codRec:codRec,jwt:jwt};
			url="/consultaproyecciondos";
		}
	
		var winW = window.innerWidth;
	    var winH = window.innerHeight;
		var dialogoverlay = document.getElementById('dialogoverlay');
	    var dialogbox = document.getElementById('dialogbox');
		const resp = fetch(url, 
						{method: 'POST',
						mode: 'no-cors',
						credentials: 'same-origin',
						headers: {'Content-Type': 'application/json'},
						body: JSON.stringify(object)})
		.then(resp => resp.json())
		.then(data => {			
			var	cadena = "<table>"+
					 "<tr><td>Concepto:</td><td>"+data.response[0].concepto+"</td></tr>"+
					 "<tr><td>Numero:</td><td>"+data.response[0].control+"</td></tr>"+
					 "<tr><td>Cuotas:</td><td>"+data.response[0].cuotas+"</td></tr>"+
					 "<tr><td>Fecha:</td><td>"+data.response[0].fecha+"</td></tr>"+
					 "<tr><td>Total:</td><td>"+data.response[0]['SUM(monto)']+"</td></tr>"+
					 "<tr><td>Nota:</td><td>"+data.response[0].nota+"</td></tr>";
			var cadenaDos;
			var tit = "Datos De La Proyección";					
			dialogoverlay.style.display = "block"; 			
			dialogoverlay.style.height = winH+"px";		
			dialogbox.style.display = "block"; 		
			document.getElementById('dialogboxhead').innerHTML = tit;
			document.getElementById('dialogboxbody').innerHTML = cadena+"</table>";
			var botones='<button id="proButtonAc" onclick="new CustomConfirm().no()" style="width:140px;">ACEPTAR</button>';
			document.getElementById('dialogboxfoot').innerHTML=botones;
			var vent = window.matchMedia("(min-width: 300px)");
			vent.addListener(function(){
				if (vent.matches) { // If media query matches
					dialogbox.style.display = "none";
                    dialogoverlay.style.display = "none";					
				} else {
					dialogbox.style.display = "none"; 
					dialogoverlay.style.display = "none";	
				}
			});
	  dialogbox.style.left =(winW-dialogbox.offsetWidth)/2+"px";
	  dialogbox.style.top = (winH-dialogbox.offsetHeight)/3+"px";		
		}).catch((error) => {
			console.error('Error:', error);
		});	
      
	}