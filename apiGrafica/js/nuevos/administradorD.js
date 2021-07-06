import {PageBehavior} from './pageBeha.js';
import {IndexedDBProcess} from './IDBPro.js';
import {BackQuery} from './backQ.js';
import{TablasMuestras} from './tabMue.js';
import{EventAsigner} from './eventAss.js';

	var pageBehavior = new PageBehavior();
	var eventAsigner = new EventAsigner();
	eventAsigner.windowLoad(()=>{cargadoPagina();});

	function cargadoPagina(){
		const profile = pageBehavior.getCookie('profile');
		const propDoc = pageBehavior.getCookie('propDoc');
		if(profile == ''){logOut();}
		if(propDoc == ''){logOut();}
		pageBehavior.borrar('clase','cuerpoDos');
		//getTools();
		let administradorD = pageBehavior.getCookie(propDoc.split(',')[2]);
		if(administradorD == 'Iniciado'){arrancaDos();}else{arrancaUno();}
		//showUpdateAccountForm();	
	}

	async function arrancaUno(){
		getInfo();
		let promise = new Promise((resolve,reject) =>{
			setTimeout(()=> resolve(showUpdateAccountForm()),10000)
		});
		let result = await promise;
		const propDoc = pageBehavior.getCookie('propDoc');
		pageBehavior.setCookie(propDoc.split(',')[2],'Iniciado', 1);
	}

	function arrancaDos(){
		showUpdateAccountForm();
	}

	function logOut(){  
		let property = pageBehavior.getCookie('property').split(',');
		pageBehavior.logOut(new BackQuery('/logOut',{property}).afirma());
	}

	/*function getTools(){
		const url = '/indexedDBProcess';
		const dbName = 'admin_tools';
		const vers = 1; 
		const method = 'GET';
		const object = '';
		new IndexedDBProcess(url,dbName,vers,method,object).getDataBase();
	}*/

	function getInfo(){
		const url = '/edificioInfo';
		const codEd = pageBehavior.getCookie('propDoc').split(',')[2];
		const dbName = 'edificio_Info-'+codEd;
		const vers = 1; 
		const method = 'POST';
		const saiAsig = 'infoEdif';
		const jwt = pageBehavior.getCookie('jwt');
		const object = {codEd,saiAsig,jwt};
		new IndexedDBProcess(url,dbName,vers,method,object).getDataBase();
	}

	function showUpdateAccountForm(){
		const jwt = pageBehavior.getCookie('jwt');
		const respuesta = new BackQuery('/verifica',{jwt}).afirma();
		respuesta.then(respuesta => {
			if (respuesta == 'Afirmativo'){
				setTitle(pageBehavior.getCookie('propDoc').split(',')[0]);
				logeado(pageBehavior.getCookie('profile').split(',')[0]);
				mainPage();  
			}else{
			window.location.assign(new PageBehavior().getURL('/micuenta'));
			}		
		});
	}

	function setTitle(nombre){
		const titulo = document.getElementById("titulo");
		titulo.innerHTML = nombre;
	}
	
	function logeado(nombre){
		let atrib = new Array();
		atrib[0] = ['miPer','Mi Perfil',miPerfil];
		atrib[1] = ['princ','Administrador',principal];
		atrib[2] = ['loOt','Salir',logOut];
		pageBehavior.logeado(nombre,'Mis Cuentas',atrib);
		atrib.forEach((item,index,array)=>{
			eventAsigner.clickAsign(item[0],'CL',item[2]);
		});
	}

	function mainPage(){
		const cuerpo = document.getElementsByClassName('cuerpo');
		const cuerpoCero = document.getElementsByClassName('cuerpoCero');
		let attrib = new Array();
		attrib[0]= [egresos,'egresos','i-egresos.png','egresos','EGRESOS'];
		attrib[1]= [ingresos,'ingresos','i-ingresos.png','ingresos','INGRESOS'];
		attrib[2]= [condominio,'datos','i-datos-bw.png','datos','DATOS <br>DEL CONDOMINIO'];
		attrib[3]= [cuentasPorCob,'morosidad','i-morosidad.png','morosidad','CUENTAS<br>POR COBRAR'];
		attrib[4]= [avisoCobro,'aviso','i-aviso.png','aviso','AVISO DE COBRO'];
		//attrib[5]= [proyecciones,'cargar','cargar.jpg','cargar','PROYECCIONES Y<br>PREVISIONES'];
		//attrib[6]= [proveedores,'proveedores','proveedores.jpg','proveedores','REGISTRO<br>PROVEEDORES'];
		//attrib[7]= [personasNaturales,'pernat','proveedores.jpg','pernat','REGISTRO<br>PERSONA NATURAL'];
		//attrib[8]= [regClien,'regclient','ingreso.jpg','regclient','REGISTRO<br>CLIENTES'];
		//attrib[9]= [balance,'balance','balance.jpg','balance','BALANCE GENERAL'];				
		let botones = '';
		attrib.forEach((item,index,array)=>{
			botones += "<div class='modulo'>"+
					"<a href='javascript:void(0);' id='"+item[1]+"' class='boton' role='button'>"+
					"<img class='"+item[1]+"-Img  Img' src='/apiGrafica/imagenes/"+item[2]+"'>"+
					"<p class='"+item[3]+"-Parr  Parr'>"+item[4]+"</p>"+
					"</a>"+
			"</div>";		
		});
		cuerpo[0].style.display = 'grid';
		cuerpo[0].innerHTML = botones;  
		cuerpoCero[0].style.display = 'none';
		attrib.forEach((item,index,array)=>{
			eventAsigner.clickAsign(item[1],'ID',item[0]);
		});
		//getInfo();
	}

	function miPerfil(){
		const perfil = document.getElementsByClassName('cuerpoCero');
		const profile = pageBehavior.getCookie('profile');
		const cuerpo= document.getElementsByClassName('cuerpo');
		if (profile != ""){
			const profSpted = profile.split(',');
			const title = '<b>MI PERFIL</b>';
			let dataArr = new Array(); 
			dataArr.push(['rowProf','colOneProf','colTwoProf']);
			dataArr.push(['rowProf','Nombre:',profSpted[0]]);
			dataArr.push(['rowProf','Apellido:',profSpted[1]]);
			dataArr.push(['rowProf','Cédula:',profSpted[3]]);
			dataArr.push(['rowProf','Correo:',profSpted[2]]);
			const tabla = new TablasMuestras(title,dataArr).tableProfUnBoton('profileButton','OK');
			const profItems ="<div style='height:100px;'></div>"+tabla;
			perfil[0].style.display='block';
			perfil[0].innerHTML = profItems;
			cuerpo[0].style.display = 'none';
			document.getElementsByClassName('cuerpoDos')[0].innerHTML = '';
			eventAsigner.clickAsign('profileButton','ID',cargadoPagina);
		} 
	}
	
	function principal(){
		window.location.assign(new PageBehavior().getURL('/micuenta'));
	}
	
	function egresos(){
		const egresos = ['i-egresos.png','Egresos','registrarFacturas()','FACTURAS',
		               'registrarRecibos()','RECIBOS','registrarCtasPPagar()','CUENTAS POR PAGAR',
					   'Administrador-Egresos','100px','100px','50px','formUno','FACTURAS'];
		pageBehavior.setCookie('izquierda',egresos, 1);			   
		const redirSpted = pageBehavior.getCookie('redir').split(',');
		window.location.assign(pageBehavior.getURL('/'+redirSpted[1]+'/'+redirSpted[0]+'/egresos'));
	}
	
	function ingresos(){
		const ingreso = ['i-ingresos.png','Ingresos','#','INTERESES DE MORA','#','','#','',
		'Administrador-Ingresos','40px','12px','12px','formUno','Recibo De Pago'];
		pageBehavior.setCookie('izquierdaTres',ingreso, 1);
		const redirSpted = pageBehavior.getCookie('redir').split(',');
		window.location.assign(pageBehavior.getURL('/'+redirSpted[1]+'/'+redirSpted[0]+'/ingresos'));
	}
	
	function proyecciones(){
		const proyec = ['cargar.jpg','Proyecciones','#','','#','','#','',
					   'Administrador-Proyecciones','24px','26px','12px','formCuatro','Datos Para Las Proyecciones'];
		pageBehavior.setCookie('izquierdaDos',proyec, 1);			   
		const redirSpted = pageBehavior.getCookie('redir').split(',');
		window.location.assign(pageBehavior.getURL('/'+redirSpted[1]+'/'+redirSpted[0]+'/proyecciones'));
	}
	
	function condominio(){
		const redirSpted = pageBehavior.getCookie('redir').split(',');
		window.location.assign(pageBehavior.getURL('/'+redirSpted[1]+'/'+redirSpted[0]+'/condominio'));
	}
	
	function cuentasPorCob(){
		const redirSpted = pageBehavior.getCookie('redir').split(',');
		window.location.assign(pageBehavior.getURL('/'+redirSpted[1]+'/'+redirSpted[0]+'/cuentas'));		
	}
	
	function avisoCobro(){
		const redirSpted = pageBehavior.getCookie('redir').split(',');
		window.location.assign(pageBehavior.getURL('/'+redirSpted[1]+'/'+redirSpted[0]+'/cobro'));	
	}
	
	function proveedores(){
	    const proveedores = ['','','listaProveedores()','Lista Proveedores',
		               'proveedores()','Registrar Proveedor','','',
					   'Administrador-Proveedores','','','','formUno','Registro Proveedor'];
		pageBehavior.setCookie('derecha',proveedores, 1);			   
		const redirSpted = pageBehavior.getCookie('redir').split(',');
		window.location.assign(pageBehavior.getURL('/'+redirSpted[1]+'/'+redirSpted[0]+'/proveedores'));
	}
	
	function personasNaturales(){
	    const pernat = ['','','listaPersonasNaturales()','Lista Personas Naturales',
		               'personasNaturales()','Registrar Persona Natural','','',
					   'Administrador-Personas','','','','formDos','Registro Persona Natural'];
		pageBehavior.setCookie('derecha',pernat, 1);			   
		const redirSpted = pageBehavior.getCookie('redir').split(',');
		window.location.assign(pageBehavior.getURL('/'+redirSpted[1]+'/'+redirSpted[0]+'/personas'));
	}
	
	function regClien(){
		console.log('regClien');
	}
	function balance(){
		console.log('balance');
	}
