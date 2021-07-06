import{EventAsigner} from './eventAss.js';
import {PageBehavior} from './pageBeha.js';
import {FormTemp} from './formTemp.js';
import {BackQuery} from './backQ.js';
import {AlertDialog} from './alertDia.js';
	const pageBehavior = new PageBehavior();
	const eventAsigner = new EventAsigner();
	const formTemp = new FormTemp();
	window.indexedDB.databases().then((r) => {
		for (let i = 0; i < r.length; i++){
			window.indexedDB.deleteDatabase(r[i].name)
		}
	});

	eventAsigner.windowLoad(()=>{
		const imageContainer = document.getElementsByClassName('imageContainer')[0];
		imageContainer.addEventListener('click',(e)=>{sectionclick(e);});
		imageContainer.addEventListener('keypress', (e)=>{pageBehavior.keyDPressEnt(e);});
		const header = document.getElementsByTagName('header')[0];
		header.addEventListener('click',(e)=>{headclicks(e);});
	});
	
	function sectionclick(e){
		e.preventDefault();
		const elemento = e.target;
		const elmID = elemento.id;
		switch(elmID){
			case 'botonIng':
				enviar(e);
			break;
			case 'botonAlert':
			case 'vueltaingreso':
			 ingresar(e);
			break;
			case 'registrarse':
				anmeldeFormular(e);
			break;
			case 'olvidoContra':
				recupera(e);
			break;
			case 'principal':
				principal(e);
			break;
		}
	}
	
	function headclicks(e){
		const elemento = e.target;
		const elmID = elemento.id;
		switch(elmID){
			case 'principal':
				principal(e);
			break;
		}		
	}

	function principal(e){
		window.location.assign(new PageBehavior().getURL('/'));
	}

	function anmeldeFormular(e){
		window.location.assign(new PageBehavior().getURL('/registro'));
	}

	function enviar(e){
	   let band = document.getElementById('band').value;
	   const object = formTemp.checkEmptyElem(e.target.form);
	   const jwt = new PageBehavior('jwt').getCookie();
	   let url = '',em = '',pass = '';
	   let obj = {};
	   if(object[1]){
		   const band = object[0]['band'];
		   switch(band){
				case 'olvido':
				em = object[0].email;
				url = '/recupera';
				obj = {jwt,em};	
				break;
				case 'ingreso':
				pass = object[0].password;
				em = object[0].email;
				url = '/login';
				obj = {jwt,em,pass};
				break;
		   }
		   ingresoForm(url,obj); 
	   }  
	}
	
	function ingresoForm(url,object){
		const respuesta = new BackQuery(url,object).getServDatPO();
		respuesta.then(respuesta => {
			let message = [];
			switch(respuesta.codigo){
				case 'LO001GO':
					pageBehavior.setCookie('jwt',respuesta.jwt, 1);
					window.location.assign(new PageBehavior().getURL('/micuenta'));
				break;
				case 'LO002FA':
					message = ['Usuario o clave inválida'];
				break;
				case 'RE001':
					message = ['Sin Conexión Con','La Base De Datos'];
					break;
				case 'RE002':
					message = ['El Correo',`${object.em}`,'No Existe'];
					break;
				case 'RE003':
					message = ['Su codigo De Acceso',
							  'Para La Recuperación',
							  'De Su Contraseña',
							  'Fue Enviado A Su',
							  'Correo Electrónico.'];
					break;
				case 'RE004':
					message = ['No Pudo Enviarse El',
							  'Correo De Validacion.',
							  'Por Favor Contacte',
							  'Al Administrador.'];	
					break;
			}
			if(respuesta.codigo != 'LO001GO'){
				let reg = new AlertDialog(message).dialogoUno();
				let def = document.getElementsByClassName("zonaIngreso");
				def[0].innerHTML = reg;	
			}
			

		});		
	}
	
	function ingresar(e){
	   const titulo = document.getElementsByTagName('title')[0];
		while(titulo.hasChildNodes()){titulo.removeChild(titulo.lastChild);}
	   let txt = document.createTextNode('Ingreso');
	   titulo.appendChild(txt);
	   const imageContainer = document.getElementsByClassName("imageContainer")[0];
	   while(imageContainer.hasChildNodes()){imageContainer.removeChild(imageContainer.lastChild);}
	   let div = formTemp.crearNodo('div',[['class','contenedorUno']],false);
	   imageContainer.appendChild(div);
	   const zonaIngreso = formTemp.crearNodo('div',[['class','zonaIngreso']],false);
	   imageContainer.appendChild(zonaIngreso);
	   txt = document.createTextNode('Iniciar Sesión');
	   let p = formTemp.crearNodo('p',[['class','is']],txt);
	   zonaIngreso.appendChild(p);
	   let form = formTemp.crearNodo('form',[['class','ingFormular'],['id','ingFormular']],false);
	   zonaIngreso.appendChild(form);
	   let atrib = [['id','email'],['class','campoFormular'],['type','email'],
					['autocomplete','username'],['placeholder','Correo Electrónico']];
	   let input = formTemp.crearNodo('input',atrib,false);
	   form.appendChild(input);
	   atrib = [['id','password'],['class','campoFormular'],['type','password'],
				['autocomplete','current-password'],['placeholder','Contraseña']];
	   input = formTemp.crearNodo('input',atrib,false);
	   form.appendChild(input);
	   atrib = [['id','band'],['type','hidden'],['value','ingreso']];
	   input = formTemp.crearNodo('input',atrib,false);
	   form.appendChild(input);
	   txt = document.createTextNode('Ingresar');
	   const button = formTemp.crearNodo('button',[['class','botonIng'],['id','botonIng']],txt);
	   form.appendChild(button);

	   
	   txt = document.createTextNode('¿Olvidé mi contraseña?');
	   atrib = [['id','olvidoContra'],['class','olvidoContra'],['href','javascript:void(0);']];
	   let a = formTemp.crearNodo('a',atrib,txt);
	   div = formTemp.crearNodo('div',[['class','olvidoCont']],a);
	   form.appendChild(div);
	   
	   
	   txt = document.createTextNode('¿Nuevo aquí?');
	   let spam = formTemp.crearNodo('spam',[['class','nuevoAqui']],txt);
	   div = formTemp.crearNodo('div',[['class','noReg']],spam);
	   txt = document.createTextNode('Registrarme');
	   atrib = [['id','registrarse'],['class','registrarse'],['href','javascript:void(0);']];
	   a = formTemp.crearNodo('a',atrib,txt);
	   div.appendChild(a);
	   form.appendChild(div);

	}

	function registro(){
	   window.location.assign('registro');
	}
	function olvidoContrasena(){
	   window.location.assign('olvido');
	}

	function recupera(e){
		const titulo = document.getElementsByTagName('title')[0];
		while(titulo.hasChildNodes()){titulo.removeChild(titulo.lastChild);}
		let txt = document.createTextNode('Recupera Contraseña');
		titulo.appendChild(txt);
		const imageContainer = document.getElementsByClassName("imageContainer")[0];
		while(imageContainer.hasChildNodes()){imageContainer.removeChild(imageContainer.lastChild);}
		const contUnoReg = formTemp.crearNodo('div',[['class','contUnoReg']],false);
	    imageContainer.appendChild(contUnoReg);
		
		let div = formTemp.crearNodo('div',[['class','arUnoReg']],false);
		contUnoReg.appendChild(div);
		div = formTemp.crearNodo('div',[['class','arUnoReg']],false);
		contUnoReg.appendChild(div);
		
		const zonaIngreso = formTemp.crearNodo('div',[['class','zonaIngreso']],false);
		imageContainer.appendChild(zonaIngreso);
		
		
		let atrib = [['id','register'],['class','recFormular'],['style','height:440px;']];
		const recFormular = formTemp.crearNodo('form',atrib,false);
	    zonaIngreso.appendChild(recFormular);
		
		
		txt = document.createTextNode('Olvidé mi contraseña');
		let p = formTemp.crearNodo('p',[['id','titRec']],txt);
		recFormular.appendChild(p);
		atrib = [['id','email'],['class','campoFormular2'],['type','email'],['placeholder','Correo Electrónico'], 		  ['autofocus','true']];
		let input = formTemp.crearNodo('input',atrib,false);
		recFormular.appendChild(input);
		
		atrib = [['id','band'],['type','hidden'],['value','olvido']];
		input = formTemp.crearNodo('input',atrib,false);
		recFormular.appendChild(input);
		
		txt = document.createTextNode('Restablecer');
		const button = formTemp.crearNodo('button',[['id','botonIng'],['class','botonIng']],txt);
		recFormular.appendChild(button);
		
		
		txt = document.createTextNode('Volver a Ingreso');
		atrib = [['id','vueltaingreso'],['class','olvidoContra'],['href','javascript:void(0);']];
		let a = formTemp.crearNodo('a',atrib,txt);
		div = formTemp.crearNodo('div',[['class','olvidoCont']],a);
		recFormular.appendChild(div);
	   
	   txt = document.createTextNode('¿Nuevo aquí?');
	   let spam = formTemp.crearNodo('spam',[['class','nuevoAqui']],txt);
	   div = formTemp.crearNodo('div',[['class','noReg']],spam);
	   txt = document.createTextNode('Registrarme');
	   atrib = [['id','registrarse'],['class','registrarse'],['href','javascript:void(0);']];
	   a = formTemp.crearNodo('a',atrib,txt);
	   div.appendChild(a);
	   recFormular.appendChild(div);
	}



















