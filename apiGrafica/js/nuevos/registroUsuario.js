import{FormTemp} from './formTemp.js';
import{EventAsigner} from './eventAss.js';
import {Avisos} from './avisos.js';
import {BackQuery} from './backQ.js';
import {PageBehavior} from './pageBeha.js';

	var eventAsigner = new EventAsigner();
	var formTemp = new FormTemp();
	var pageBehavior = new PageBehavior();
	
	eventAsigner.windowLoad(()=>{
		const element = document.getElementsByClassName('imageContainer')[0];
		const elementDos = document.getElementsByClassName('regFormular')[0];
		formTemp.retiraNodoTextoDos(elementDos);
		element.addEventListener('click',(e)=>{regclicks(e);});
		element.addEventListener('submit', (e)=>{e.preventDefault();});
		element.addEventListener('keypress', (e)=>{pageBehavior.keyDPressEnt(e);});
		element.addEventListener('input', (e)=>{inputkey(e);});
		document.forms[0].elements[0].focus();
	});
	
	
	function inputkey(e){
		const idNam = e.target.id;
		if(idNam == 'rif'){
			eventAsigner.numericInput(e);
		}
	}
	
	function regclicks(e){
		const clName = e.target.className;
		const idName = e.target.id;
		e.preventDefault();
		console.log(clName,idName);
		if(clName == 'botonIng' && idName == 'botEnv'){
			enviarConfirm(e);
		}
		if(clName == 'botAvDos'){
			switch(idName){
				case 'botSI':
				enviar(e);
				break;
				case 'botNO':
				regFormul(e);
				break;
			}
		}
		if(clName == 'botonAviso'){
			switch(idName){
				case 'seguir':
					const loc = window.location;
					window.location.assign(loc.protocol+'//'+loc.hostname+'/ingreso');
				break;
			}
		}
	}
	
	function enviarConfirm(e){
		let padre,flag,nodo,arrAttrb,elem;
		padre = e.target;
		for(let i=0;i<3;i++){padre = padre.parentElement;}
		const objAfl = formTemp.checkEmptyElem(padre.lastElementChild);
		const object = objAfl[0];
		flag = objAfl[1];
		if(flag){
			const arrRows = [['La persona con los datos a continuacion:'],
								  ['Nombre: ',object.nombre],
								  ['Apellido: ',object.apellido],
								  ['Rif:',object.rif],
								  ['Correo:',object.email],
								  ['va a ser registrada como usuario del sistema.']];
			const arrBot = [['botNO','NO'],['botSI','SI']];				  
			const arrContAtt = [['contUno','coUnenv1'],['subContUno','sucoUnenv1']];
			const avis = new Avisos().dialogAvisoThree(arrRows,arrBot,arrContAtt);
			const shup = padre.parentElement;
			while(shup.hasChildNodes()){shup.removeChild(shup.lastChild)};
			shup.appendChild(avis);
			const nodInf = new Array(['object',JSON.stringify(object)]);
			nodInf.forEach((item,index,array)=>{
				arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
				elem = formTemp.crearNodo('input',arrAttrb,false);
				shup.appendChild(elem);
			});
		}
	}
	
	function enviar(e){//c
		let padre = e.target;
		for(let i=0;i<5;i++){padre = padre.parentElement;}
		const object = JSON.parse(padre.lastChild.value);
		const respuesta = new BackQuery('/newuser',object).getServDatPO();
		respuesta.then(respuesta => {
			let message = [];
			switch(respuesta.codigo){
				case 'CR001':
					message = [['Sin Conexión Con'],['La Base De Datos']];
					break;
				case 'CR002':
					message = [[`El Correo ${object.email}`],
							   ['Existe Y Fue Verificado. Por Favor'],
							   ['Diríjase A Olvidó Su Contraseña']];
					break;
				case 'CR003':
				case 'CR005':
					message = [['Su codigo De Acceso Para La Asignacion'],
							   ['De Su Contraseña Fue Enviado A Su'],
							   ['Correo Electrónico.']];
					break;
				case 'CR004':
					message = [['No Pudo Enviarse El Correo De Validacion.'],
							   ['Por Favor Contacte Al Administrador.']];
					break;
				case 'CR006':
					message = [['Se Creo El Usuario Pero No Pudo'],
							   ['Enviarse El Correo De Validacion.'],
							   ['Por Favor Contacte Al Administrador.']];
					break;
				case 'CR007':
					message = [['No Se Pudo Crear El Usuario.'],
							   ['Por Favor Intente Mas Tarde']];
					break;
			}
			const botID = 'seguir';
			const arrAttCont = [['avisoDos','respDB1'],['subAvisoDos','suReDB1']];
			const avis = new Avisos().dialogAvisoOne(message,botID,arrAttCont);
			while(padre.hasChildNodes()){padre.removeChild(padre.lastChild)}
			padre.appendChild(avis);
		});
	}
	
	function regFormul(e){
		let part,filPar,fila,padre,nombre,apellido,rif,rl,email;
		padre = e.target;
		for(let i = 0;i<5;i++){padre = padre.parentElement;}
		const inpObj = padre.lastChild.value;
		if(inpObj != undefined){
			const obj = JSON.parse(inpObj);
			nombre = obj.nombre;
			apellido = obj.apellido;
			rif = obj.rif.split('-')[1];
			rl = pageBehavior.rifLetraOrden(obj.rif.split('-')[0]);
			email = obj.email;
		}else{
			nombre = '';
			apellido = '';
			rif = '';
			rl = [['V-','V-'],['J-','J-'],['E-','E-'],['G-','G-']];
			email = '';
		}
		const contPar = ['Registrarme','zonaRegistro','zonaRegistro-1'];
		const formPar = ['regFormular','register','regUsRow'];
		const elmts = new Array(['input'],['input'],['select','input'],['input'],['input']);
		const attrib = new Array();
		attrib[0] = [[['type','text'],['id','nombre'],['class','campoFormular'],['placeholder','Nombre'],['maxLength','30'],['value',nombre]]];
		attrib[1] = [[['type','text'],['id','apellido'],['class','campoFormular'],['placeholder','Apellido'],['maxLength','30'],['value',apellido]]];
		attrib[2] = [[
						[['id','rifLetra'],['class','campoFormular'],['style','width:60px;']],
						rl],
						[['type','text'],['id','rif'],['class','campoCedula'],['placeholder','Cédula o RIF'],['maxLength','9'],['value',rif]]];
						
		
		attrib[3] = [[['type','email'],['id','email'],['class','campoFormular'],['placeholder','Correo Electrónico'],['maxLength','60'],['value',email]]];
		attrib[4] = [[['type','button'],['id','botEnv'],['class','botonIng'],['value','Enviar']]];
		filPar = new Array();
		elmts.forEach((item,index) =>{
			fila = new Array();
			item.forEach((it,ind) => {
				switch(it){
					case 'select':
						part = formTemp.createSelect(attrib[index][ind][0],attrib[index][ind][1]);
					break;
					case 'input':
						part = formTemp.crearNodo('input',attrib[index][ind],false);
					break;
				}
				fila.push(part);
			});
			filPar.push(fila);
		});
		const cont = formTemp.formularioUno(contPar,formPar,filPar);
		const imgcter = padre;
		while(imgcter.hasChildNodes()){imgcter.removeChild(imgcter.lastChild);}
		imgcter.appendChild(cont);
	}