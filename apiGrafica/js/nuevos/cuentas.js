import{EventAsigner} from './eventAss.js';
import {PageBehavior} from './pageBeha.js';
import {BackQuery} from './backQ.js';
import{FormTemp} from './formTemp.js';
import{TablasMuestras} from './tabMue.js';
import {IndexedDBProcess} from './IDBPro.js';


	var eventAsigner = new EventAsigner();
	var pageBehavior = new PageBehavior();
	var formTemp = new FormTemp();
	eventAsigner.windowLoad(()=>{
		const header = document.getElementsByTagName('header')[0];
		header.addEventListener('click',(e)=>{clickFunction(e);});
		let cuenta = pageBehavior.getCookie('cuenta');
		if(cuenta == 'Iniciado'){arrancaDos();}else{arrancaUno();}
	});
	
	async function arrancaUno(){
		getTools();
		let promise = new Promise((resolve,reject) =>{
			setTimeout(()=> resolve(showUpdateAccountForm()),10000)
		});
		let result = await promise;
		pageBehavior.setCookie('cuenta','Iniciado', 1);
	}
	
	function arrancaDos(){
		//getTools();
		showUpdateAccountForm();		
	}
		
	function getTools(){
		const url = '/indexedDBProcess';
		const dbName = 'admin_tools';
		const vers = 1; 
		const method = 'GET';
		const object = '';
		new IndexedDBProcess(url,dbName,vers,method,object).getDataBase();
	}
	
	function showUpdateAccountForm(){
		const jwt = pageBehavior.getCookie('jwt');
		const respuesta = new BackQuery('/verifica',{jwt}).afirma();
		respuesta.then(respuesta => {
			if (respuesta == 'Afirmativo'){
				logeado();
			}else{
				window.location.assign(pageBehavior.getURL('/ingreso'));
			}		
		});
	}
	
	function logOut(){  
		const property = pageBehavior.getCookie('property').split(',');
		pageBehavior.logOut(new BackQuery('/logOut',{property}).afirma());
	}
	
	function logeado(){
		const jwt = pageBehavior.getCookie('jwt');
		const datos = new BackQuery('/verifica',{jwt}).getServDatPO();
		datos.then((r)=>{
			const object = r.data;
			const perDat = Object.values(object);
			const profile = perDat.slice(1,6);
			pageBehavior.setCookie('profile', profile, 1);
			const nomEd = perDat[6];
			let property = new Array();
			if(Array.isArray(nomEd)){
				nomEd.forEach((item,index,array)=>{
					let propln = '';
					for (const pro in item) {propln += `${item[pro]}&`;}
					propln += perDat[8][index];
					property.push(propln);
				});
			}else{
				let propln = '';
				for (const pro in nomEd) {propln += `${nomEd[pro]}&`;}
				propln += perDat[8];
				property.push(propln);
			}
			pageBehavior.setCookie('property', property, 1);
			const contMen = [['Mi Cuenta','micta'],['Mi Perfil','miPer'],['Agregar Inmueble','agrin'],['Cerrar Sesión','loOt']];
			const contOpt = [['Nosotros','nost'],['Contacto','ctact']];
			pageBehavior.logHeaderOne(profile[0],contMen,contOpt);
			miCuenta();
		});
	}
	
	
	function clickFunction(e){
		let target = e.target;
		switch(target.innerText){
			case 'Mi Cuenta':
				miCuenta();
				break;
			case 'Mi Perfil':
				miPerfil();
				break;
			case 'Agregar Inmueble':
				agreInm();
				break;
			case 'Cerrar Sesión':
				logOut();
				break;	
		}		
	}
	
	function miCuenta(){
		let cuenta = new FormTemp('dDos');
		const profile = pageBehavior.getCookie('profile').split(',');
		const nombre = profile[0];
		const apellido = profile[1];
		const propiedad = pageBehavior.getCookie('property').split(',');
		let arrAttrb,padre,hijo;
		let totCuentas = new Array();
		arrAttrb = [['class','rowOneCta']];
		let hermanoUno = cuenta.crearNodo('div',arrAttrb,false);
		cuenta.crearNodoTexto(false,'',`Hola, ${nombre} ${apellido}`,hermanoUno);
		totCuentas.push(hermanoUno);
		propiedad.forEach((item,index,array)=>{
			let profSptedTwo = item.split('&');
			let unidad = profSptedTwo[3];
			let inmueble = profSptedTwo[0];
			arrAttrb = [['class','buttonCta'],['id',`but-${index}`]];
			hijo = cuenta.crearNodo('button',arrAttrb,false);
			if(profSptedTwo[3] == "ADMIN"){
				cuenta.crearNodoTexto(false,'',`Administrador En ${inmueble}`,hijo);
			}else{
				cuenta.crearNodoTexto(false,'',`Propietario del ${unidad} en ${inmueble}`,hijo);
			}
			arrAttrb = [['class','rowCta']];
			padre = cuenta.crearNodo('div',arrAttrb,hijo);
			totCuentas.push(padre);	
		});
		let cont = cuenta.creaContenedor('div','tableCta',totCuentas);
		cuenta.sacaHijosDos();
		cuenta.pareMasHijos(new Array(cont));
		eventAsigner.clickAsign('tableCta','CL',(event)=>{clickFunctionDos(event);});
	}

	function miPerfil(){
		const perfil = document.getElementsByClassName('dDos');
		const profile = pageBehavior.getCookie('profile');
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
			eventAsigner.clickAsign('profileButton','ID',miCuenta);
		} 
	}
	
	function clickFunctionDos(event){
		let id = event.target.id
		let obj = id.split('-')[1];
		if(event.target.tagName.toLowerCase() == 'button'){
			verCta(obj);
		}
	}

	function agreInm(){
		const propiedad = pageBehavior.getCookie('property').split(',');
		const propSptedTwo = propiedad[0].split('&');
		let propDoc = new Array();
		propSptedTwo.forEach((item,index,array)=>{
			propDoc.push(item);
		});
		pageBehavior.setCookie("propDoc", propDoc, 1);
		window.location.assign(pageBehavior.getURL('/registro/inmueble'));
	}

	function verCta(obj){
		const propiedad = pageBehavior.getCookie('property');
		const propSpted = propiedad.split(',');
		const propSptedTwo = propSpted[obj].split('&');
		let propDoc = new Array();
		propSptedTwo.forEach((item,index,array)=>{
			propDoc.push(item);
		});
		pageBehavior.setCookie("propDoc", propDoc, 1);
		const profile = pageBehavior.getCookie('profile');
		const profSpted = profile.split(',');
		let redir = new Array();
		const apellUsua = quitaEspacios(profSpted[1]);
		redir.push(apellUsua); 
		redir.push(propSptedTwo[2]);
		pageBehavior.setCookie("redir", redir, 1);
		window.location.assign(pageBehavior.getURL('/'+propSptedTwo[2]+'/'+apellUsua)); 
	}
	
	function quitaEspacios(str){
		const patron = new RegExp(" ");
		const resultado = patron.test(str);
		let resThree;
		if(resultado == true){
			const resTwo = str.split(' ');
			resThree = '';
			for(let i=0;i<resTwo.length;i++){
				resThree += resTwo[i];
			}
		}else{
			resThree = str;
		}	
		return resThree;
	}


	
