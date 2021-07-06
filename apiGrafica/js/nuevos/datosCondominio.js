import {PageBehavior} from './pageBeha.js';
import{EventAsigner} from './eventAss.js';
import {BackQuery} from './backQ.js';
import{TablasMuestras} from './tabMue.js';
import {RetrieveDBEgresos} from './retriDBeg.js';
import{FormTemp} from './formTemp.js';
import{Pagination} from './Pagin.js';
import {Avisos} from './avisos.js';
import {IndexedDBProcess} from './IDBPro.js';

	var pageBehavior = new PageBehavior();
	var eventAsigner = new EventAsigner();
	var formTemp = new FormTemp();
	
	eventAsigner.windowLoad(()=>{
		const profile = pageBehavior.getCookie('profile');
		const propDoc = pageBehavior.getCookie('propDoc');
		if(profile == ''){logOut();}
		if(propDoc == ''){logOut();}	
		showUpdateAccountForm();
		retiraElmTxt();
		const section = document.getElementsByTagName('section')[0];
		const header = document.getElementsByTagName('header')[0];
		section.addEventListener('click',(e)=>{sectionclick(e);});
		section.addEventListener('input', (e)=>{inputMethod(e);});
		section.addEventListener('keypress', (e)=>{pageBehavior.keyDPressEnt(e);});
		header.addEventListener('click',(e)=>{headclicks(e.target);});
		sessionStorage.clear();
		inserInicio();
	});
	
	function headclicks(elm){
		const elmid = elm.id;
		const elmCl = elm.className;
		switch(elmid){
			case 'titulo':
				const redir = pageBehavior.getCookie('redir').split(','); 	
				window.location.assign(pageBehavior.getURL('/'+redir[1]+'/'+redir[0]));
			break;
		}
		switch(elmCl){
			case 'miPer':
				miPerfil();
			break;
			case 'princ':
				principal();
			break;
			case 'loOt':
				logOut();
			break;
		}
	}
	
	function sectionclick(e){
		const elmID = e.target.id;
		const tagN = e.target.tagName;
		const tgCL = e.target.className;
		if(elmID != 'inicio'){e.preventDefault();}
		
		console.log(tagN,tgCL,elmID);
		switch (elmID){
			case 'b0':
				formTemp.retiraUltNodo('section','TG',0);
				inserInicio();
				break;
			case 'boton b1':
				formTemp.retiraUltNodo('section','TG',0);
				listaPropiet();
				break;
			case 'botNOJun':
			case 'negInJu':
			case 'boton b2':
				formTemp.retiraUltNodo('section','TG',0);
				jCondSyst();
				break;
			case 'boton b3':
				formTemp.retiraUltNodo('section','TG',0);
				adminSyst();
				break;
			case 'boton b4':
				formTemp.retiraUltNodo('section','TG',0);
				fdosIniciales();
				break;
			case 'boton b5':
				formTemp.retiraUltNodo('section','TG',0);
				multasEint();
				break;
			case 'profileButton':
				profButton();
				break;
			case 'agregar':
				agregarAdm();
				break;
			case 'guardar':
				guardarMultasEInt(e);
				break;
			case 'renovar':
				renovJuntaUno();
				break;
			case 'cerInf1':
			case 'cerInf2':	
				formTemp.retiraUltNodo('section','TG',0);
				jCondSyst();
				break;
			case 'cnclBtn':
			case 'botNO':
			case 'acceptElim':
				respNO(e);
				break;
			case 'botSI':
				respSI(e);
				break;
			case 'acceptBut':
				eliminaAdministrador(e);
				break;
			case 'acceptElAf':
			case 'acceptInJu':
			case 'acceptInsAD':
			case 'acceptIntMor':
				updateAdm(e);
				break;
			case 'botonAviso':
				ingresarClkBtn(e);
				break;
			case 'botSIAdm':
				insertAdm(e);
				break;
			case 'botNOMul':
				botonNoMulta();
				break;
			case 'botSIMul':
				guardarMulta(e);
				break;	
			case 'renueva':
				renuevaJuntaUno(e);
			break;
			case 'botSIJun':
				renuevaJuntaEnviar(e);
			break;
		}
		if (tagN.toLowerCase() == 'img' && tgCL == 'goout'){
			goOut(e);
		}
		if (tagN.toLowerCase() == 'img' && tgCL == 'goinf'){
			infoJunta(e.target);
		}
		
	}
	
	function inputMethod(e){
		const elmID = e.target.id;
		const tagN = e.target.tagName;
		const tgCL = e.target.className;
		console.log(tagN,tgCL,elmID);
		switch(elmID){
			case 'rif':
				eventAsigner.numericInput(e);
				break;
			case 'multa':
			case 'interes':
			eventAsigner.decimalInput(e);
			break;
		}
		if(tgCL == 'rif'){eventAsigner.numericInput(e);}
	}
	
	function logOut(){  
		let property = pageBehavior.getCookie('property').split(',');
		pageBehavior.logOut(new BackQuery('/logOut',{property}).afirma());
	}
	
	function showUpdateAccountForm(){
		const jwt = pageBehavior.getCookie('jwt');
		const respuesta = new BackQuery('/verifica',{jwt}).afirma();
		respuesta.then(respuesta => {
			if (respuesta == 'Afirmativo'){
				setTitle(pageBehavior.getCookie('propDoc').split(',')[0]);
				logeado(pageBehavior.getCookie('profile').split(',')[0]);
			}else{
				window.location.assign(pageBehavior.getURL('/ingreso'));
			}		
		});
	}
	
	function setTitle(nombre){
		const titulo = document.getElementById("titulo");
		formTemp.crearNodoTextoTres(nombre,titulo,true)
	}
	
	function logeado(nombre){
		const contMen = [['Mi Perfil','miPer'],['Cerrar Sesión','loOt']];
		const contOpt = [['Mis Cuentas','princ']];
		pageBehavior.logHeaderOne(nombre,contMen,contOpt);
	}
	
	function miPerfil(){
		const perfil = document.getElementsByTagName('SECTION');
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
		} 
	}
	
	function principal(){
		window.location.assign(pageBehavior.getURL('/micuenta'));
	}
	
	function profButton(){
		console.log('cargado pagina');
		const sectFoTe = new FormTemp('section');
		sectFoTe.containerDisplay('');
		navigationPanel();
		inserInicio();
	}

	function retiraElmTxt(){
		const retira = new FormTemp('section');
		retira.retiraNodoTexto('TG',0);
	}
	
	function navigationPanel(){
		let navNodArr = new Array(['settings.svg','icon i00','br','DATOS DEL','CONDOMINIO','botonIzq','b0'],
					['groups.svg','icon','br','LISTADO','DE PROPIETARIOS','boton','boton b1'],
					['assignment.svg','icon',false,'','JUNTA DE CONDOMINIO','boton','boton b2'],
					['engineering-24px.svg','icon i02','br','ADMINISTRADORES','DEL SISTEMA','boton','boton b3'],
					['money-01.svg','icon',false,'','FONDOS INICIALES','boton','boton b4'],
					['money-24px.svg','icon',false,'','MULTAS E INTERESES','boton','boton b5']);			
		let hijos = new Array();
		let arrAttr = new Array();
		let nieto,hijo;
		navNodArr.forEach((item,index,array)=>{
			arrAttr = [['src','/apiGrafica/imagenes/'+item[0]],['class',item[1]]];
			nieto = formTemp.crearNodo('img',arrAttr,false);
			arrAttr = [['class',item[5]],['id',item[6]],['href','javascript:void(0);']];
			hijo = formTemp.crearNodo('a',arrAttr,nieto);
			formTemp.crearNodoTexto(item[2],item[3],item[4],hijo);
			hijos.push(hijo);			
		})
		const navig = formTemp.creaContenedor('nav','na',hijos);
		const sect = new FormTemp('section');
		sect.sacaHijos();
		sect.pareHijo(navig);
	}
	
	
	function inserInicio(){
		let padAttr = ['/apiGrafica/imagenes/settings_2.svg','DATOS GENERALES','titUno'];
		const attribOne = new Array();
		const attribTwo = new Array();
		const txtOne = new Array();
		const clNam = new Array();
		let formInpID = new Array('nombre_edificio','rif','direccion','ciudad','estado','telefono','correo');
		attribOne[0] = [['class','condominio'],['id',formInpID[0]],['size','35']];
		attribTwo[0] = 'condominio';
		txtOne[0] = 'Nombre del Condominio:';
		clNam[0] = 'nom';
		attribOne[1] = [['class','rif'],['id',formInpID[1]],['size','20']];
		attribTwo[1] = 'rif';
		txtOne[1] = 'RIF:';
		clNam[1] = '';
		attribOne[2] = [['class','direccion'],['id',formInpID[2]],['size','35']];
		attribTwo[2] = 'direccion';
		txtOne[2] = 'Dirección:';
		clNam[2] = '';
		attribOne[3] = [['class','ciudad'],['id',formInpID[3]],['size','35']];
		attribTwo[3] = 'ciudad';
		txtOne[3] = 'Ciudad:';
		clNam[3] = '';
		attribOne[4] = [['class','estado'],['id',formInpID[4]],['size','35']];
		attribTwo[4] = 'estado';
		txtOne[4] = 'Estado:';
		clNam[4] = '';
		attribOne[5] = [['class','estado'],['id',formInpID[5]],['size','35']];
		attribTwo[5] = 'estado';
		txtOne[5] = 'Teléfono:';
		clNam[5] = '';
		attribOne[6] = [['class','estado'],['id',formInpID[6]],['size','35']];
		attribTwo[6] = 'estado';
		txtOne[6] = 'Correo Electrónico:';
		clNam[6] = '';
		const resFor = formulInicio(padAttr,attribOne,attribTwo,txtOne,clNam,'GenData');
		const resDat = formTemp.crearNodo('div',[['class','resumenDatos'],['id','generales']],resFor[0]);
		resDat.appendChild(resFor[1]);
		padAttr = ['/apiGrafica/imagenes/administradora.svg','ADMINISTRACIÓN','titDos'];
		let formInpIDDos = new Array('administradora','rifAdm','dirAdm','city','state','phone','mail');
		attribOne[0] = [['class','administradora'],['id',formInpIDDos[0]],['size','35']];
		attribTwo[0] = 'administradora';
		txtOne[0] = 'Administradora:';
		clNam[0] = 'nomAd';
		attribOne[1] = [['class','rifAdmon'],['id',formInpIDDos[1]],['size','20']];
		attribTwo[1] = 'rifAdmon';
		txtOne[1] = 'RIF:';
		clNam[1] = '';	
		attribOne[2] = [['class','direccionAdmon'],['id',formInpIDDos[2]],['size','35']];
		attribTwo[2] = 'direccionAdmon';
		txtOne[2] = 'Dirección:';
		clNam[2] = '';		
		attribOne[3] = [['class','ciudadAdmon'],['id',formInpIDDos[3]],['size','35']];
		attribTwo[3] = 'ciudadAdmon';
		txtOne[3] = 'Ciudad:';
		clNam[3] = '';
		attribOne[4] = [['class','estadoAdmon'],['id',formInpIDDos[4]],['size','35']];
		attribTwo[4] = 'estadoAdmon';
		txtOne[4] = 'Estado:';
		clNam[4] = '';
		attribOne[5] = [['class','telefonoAdmon'],['id',formInpIDDos[5]],['size','35']];
		attribTwo[5] = 'telefonoAdmon';
		txtOne[5] = 'Teléfono:';
		clNam[5] = '';
		attribOne[6] = [['class','estado'],['id',formInpIDDos[6]],['size','35']];
		attribTwo[6] = 'estado';
		txtOne[6] = 'Correo Electrónico:';
		clNam[6] = '';		
		const admFor = formulInicio(padAttr,attribOne,attribTwo,txtOne,clNam,'adminData');
		const resDatDo = formTemp.crearNodo('div',[['class','resumenDatos'],['id','admon']],admFor[0]);
		resDatDo.appendChild(admFor[1]);
		let showup = formTemp.crearNodo('div',[['class','showup'],['id','summary']],resDat);
		showup.appendChild(resDatDo);
		let sect = document.getElementsByTagName('section')[0];
		sect.appendChild(showup);
		const propDoc = pageBehavior.getCookie('propDoc');
		let val;
		let egresos = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[2],1);
		egresos.retrieveAllTableDataArr('edificio',(r)=>{
			formInpID.forEach((item,index,array)=>{
				if(item == 'rif'){
					document.getElementById(item).value = propDoc.split(',')[2];
				}else{
					document.getElementById(item).value = r[0][item];
				}
			});
			document.getElementById(formInpIDDos[2]).value = r[0]['direccion'];
			document.getElementById(formInpIDDos[3]).value = r[0]['ciudad'];
			document.getElementById(formInpIDDos[4]).value = r[0]['estado'];
		});
		egresos.retrieveAllTableDataArr('administrador',(r)=>{
			document.getElementById(formInpIDDos[0]).value = r[0]['Nombre']+' '+r[0]['Apellido'];
			document.getElementById(formInpIDDos[1]).value = r[0]['cuenta_propietario'];
			document.getElementById(formInpIDDos[6]).value = r[0]['Correo'];
		});
	}

	function formulInicio(padAttr,attribOne,attribTwo,txtOne,clNam,formId){
		let attrb = [['src',padAttr[0]]];
		const nodHij = formTemp.crearNodo('img',attrb,false);
		attrb = [['class','titulo'],['id',padAttr[2]]];
		const nodPadre = formTemp.crearNodo('div',attrb,nodHij);
		formTemp.crearNodoTexto(false,'',padAttr[1],nodPadre);
		
		let nepOne,nepTwo,attNep,uncOn,uncle;
		uncle = document.createDocumentFragment();
		attribOne.forEach((item,index,array)=>{
			item.push(['type','text']);
			item.push(['disabled','true']);
			nepOne = formTemp.crearNodo('input',item,false);
			attNep = [['for',attribTwo[index]]];
			nepTwo = formTemp.crearNodo('label',attNep,false);
			formTemp.crearNodoTexto(false,'',txtOne[index],nepTwo);
			if(clNam[index] != ''){
				uncOn = formTemp.crearNodo('div',[['class','moduloZero'],['id',clNam[index]]],nepTwo);
				uncOn.appendChild(nepOne);
			}else{
				uncOn = formTemp.crearNodo('div',[['class','modulo']],nepTwo);
				uncOn.appendChild(nepOne);
			}
			uncle.appendChild(uncOn);
		})
		let nodTio = formTemp.crearNodo('form',[['id',formId]],uncle);
		return [nodPadre,nodTio];
	}
	

	function listaPropiet(){
		sessionStorage.setItem('curr_page',1);
		const propDoc = pageBehavior.getCookie('propDoc');
		let egresos = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[2],1);
		egresos.retrieveAllTableDataArr('unidades',(r)=>{cargaPropietarios(r);});
	}
	
	function cargaPropietarios(r){
		const elem = new FormTemp('section');
		const div = elem.crearNodo('div',[['class','titulo lipro']],false);
		const txt = elem.crearNodoTexto(false,'','LISTADO DE PROPIETARIOS',div);
		const cont = elem.creaContenedor('div','showup prop',[div]);
		const botoniera = elem.crearNodo('div',[['id','botoniera']],false);
		elem.pareHijo(cont);
		cont.appendChild(botoniera);
		const arrTabHe = ['#','Unidad','Cédula','Nombre','Apellido','Correo','Alícuota','Saldo'];
		let pagination = new Pagination(10,5,'showup prop','botoniera',arrTabHe);
		const curPag = Number(sessionStorage.getItem('curr_page'));
		pagination.paginacionParam(r,curPag,'listadoP');
	}
	
	function adminSyst(){
		const propDoc = pageBehavior.getCookie('propDoc');
		const egresos = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[2],1);
		egresos.retrieveAllTableDataArr('administrador',(r)=>{mostrarAdministrador(r);});
	}
	
	function mostrarAdministrador(Arr){
		const elem = new FormTemp('section');
		const div = elem.crearNodo('div',[['class','titulo lipro']],false);
		elem.crearNodoTexto(false,'','ADMINISTRADORES DEL SISTEMA',div);
		const br = document.createElement('br');
		/* Creacion de la tabla */
		const tabHeTe = ['Nombre','Apellido','Cédula','Correo Electrónico','Eliminar'];
		const datCLn = Object.keys(Arr[0]);
		const tabDatCL = [datCLn[3],datCLn[4],datCLn[1],datCLn[5],'imag'];
		const tabla = new TablasMuestras().createTableOne(tabHeTe,tabDatCL,Arr.length);
		/* boton agregar*/
		let element,tableData,tdImg,tdAnc;
		tdAnc = elem.crearNodo('a',[['id','agregar'],['href','javascript:void(0);']],false);
		elem.crearNodoTexto(false,'','+ Agregar administrador',tdAnc);
		/* contenedor*/
		const cont = elem.creaContenedor('div','showup prop',[div,tabla,br,tdAnc]);
		elem.pareHijo(cont);
		/* Boton Agregado a la tabla*/
		for(let i=0;i<Arr.length;i++){
			element = document.getElementById(`imag-${i}`);
			tdImg = elem.crearNodo('img',[['class','goout'],['id','goout-'+i],['src','/apiGrafica/imagenes/delete_forever-24px.svg']],false);
			tdAnc = elem.crearNodo('a',[['class','eliminar'],['id','eliminar'],['href','javascript:void(0);']],tdImg);
			element.appendChild(tdAnc);
		}
		/* valores de la tabla */
		let claves,valores,elemento,texto;
		Arr.forEach((item,index,array)=>{
			claves = Object.keys(item);
			valores = Object.values(item);
			claves.forEach((it,ind,arr)=>{
				elemento = document.getElementsByClassName(it)[index];
				if(elemento != undefined){
					texto = document.createTextNode(valores[ind]);
					elemento.appendChild(texto);
				}
			});
		}); 
	}
	
	function goOut(e){
		let padre,nieto;
		padre = e.target;
		nieto = e.target;
		for(let i=0;i<5;i++){padre = padre.parentElement;}
		for(let i=0;i<3;i++){nieto = nieto.parentElement;}
		const grdson = nieto.childNodes;
		const object = new Object();
		grdson.forEach(item => {object[`${item.className}`] = item.innerText;});
		object['disabled'] = e.target.className;
		object['enabled'] = 'going';
		const arrRows = [['¿Está seguro que desea Eliminar'],
						 ['al siguiente administrador:'],
						 [`${object.Nombre} ${object.Apellido} ${object.cuenta_propietario} ?`]];
		const arrBot = [['botNO','NO'],['botSI','SI']];
		const arrContAtt = [['contUno','contAvAdm1'],['subContUno','suCoAdm1']];
		const avis = new Avisos().dialogAvisoThree(arrRows,arrBot,arrContAtt);
		padre.removeChild(padre.lastChild);
		padre.appendChild(avis);
		/* nodos de informacion*/
		let arrAttrb,elem;
		const nodInf = new Array(['object',JSON.stringify(object)]);
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			elem = formTemp.crearNodo('input',arrAttrb,false);
			padre.appendChild(elem);
		});
		//desabilitan los botones
		const buts = document.getElementsByClassName(object.disabled);
		Array.from(buts).forEach(item =>{
			item.removeAttribute('class',object.disabled);
			item.setAttribute('class',object.enabled);
		});
	}
	
	function eliminaAdministrador(e){
		let padre = e.target;
		for(let i=0;i<5;i++){padre = padre.parentElement;}
		const object = JSON.parse(padre.lastChild.value);
		//habilitan de nuevo los botones
		const buts = document.getElementsByClassName(object.enabled);
		Array.from(buts).forEach(item =>{
			item.removeAttribute('class',object.enabled);
			item.setAttribute('class',object.disabled);
		});
		object['jwt'] = pageBehavior.getCookie('jwt');
		object['codEd'] = pageBehavior.getCookie('propDoc').split(',')[2];
		object['saiAsig'] = 'deladm';
		object['codigoProp'] = pageBehavior.getCookie('propDoc').split(',')[1];
		const resp = new BackQuery('/eliminarAdministrador',object).eliminaRequest();
		resp.then(resp => {
			let avis;
			if(resp == 'Afirmativo'){
				avis = new Avisos().dialogAvisoFive([object.Nombre+' '+object.Apellido+' '+object.cuenta_propietario,'fue eliminado','como Administrador'],'acceptElAf','Aceptar');
			}else{
				avis = new Avisos().dialogAvisoFive(['No Se Eliminó El Administrador',object.Nombre+' '+object.Apellido],'acceptElim','Aceptar');
			}
			for(let i = 0; i<2;i++){padre.removeChild(padre.lastChild);}
			padre.appendChild(avis);
			/* nodos de informacion*/
			let arrAttrb,elem;
			const nodInf = new Array(['object',JSON.stringify(object)]);
			nodInf.forEach((item,index,array)=>{
				arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
				elem = formTemp.crearNodo('input',arrAttrb,false);
				padre.appendChild(elem);
			});
		});
	}
	
	function respSI(e){
		let padre = e.target;
		for(let i=0;i<5;i++){padre = padre.parentElement;}
		const object = JSON.parse(padre.lastChild.value);
		const avis = new Avisos().dialogAvisoFive(['El Administrador:',object.Nombre+' '+object.Apellido+' '+object.cuenta_propietario,' será eliminado'],'acceptBut','Aceptar');
		padre.removeChild(padre.lastChild);
		padre.removeChild(padre.lastChild);
		padre.appendChild(avis);
		/* nodos de informacion*/
		let arrAttrb,elem;
		const nodInf = new Array(['object',JSON.stringify(object)]);
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			elem = formTemp.crearNodo('input',arrAttrb,false);
			padre.appendChild(elem);
		});
	}
	
	function respNO(e){
		let padre = e.target;
		for(let i=0;i<5;i++){padre = padre.parentElement;}
		const object = JSON.parse(padre.lastChild.value);
		//habilitan de nuevo los botones
		const buts = document.getElementsByClassName(object.enabled);
		Array.from(buts).forEach(item =>{
			item.removeAttribute('class',object.enabled);
			item.setAttribute('class',object.disabled);
		});
		for(let i=0;i<3;i++){padre.removeChild(padre.lastChild);}
		//const cont = document.getElementsByClassName('showup prop')[0];
		padre.appendChild(document.createElement('br'));
		const tdAnc = formTemp.crearNodo('a',[['id','agregar'],['href','javascript:void(0);']],false);
		const txt = document.createTextNode('+ Agregar administrador');
		formTemp.crearNodoTexto(false,'','+ Agregar administrador',tdAnc);
		padre.appendChild(tdAnc);
	}
	
	function agregarAdm(){
		const rifEd = pageBehavior.getCookie('propDoc').split(',')[2];
		const tok = pageBehavior.getCookie('jwt');
		const codProp = pageBehavior.getCookie('propDoc').split(',')[1];
		const arrFil = ['Ingrese La Cédula o RIF del Nuevo Administrador'];
		const optVals = ['V-','E-','J-','G-'];
		const arrHidInpVal = [['saiAsig','ingreadm'],['codEd',rifEd],['jwt',tok],['codProp',codProp]];
		const avisTwo = new Avisos().dialogAvisoFour(arrFil,optVals,'rifLetra',arrHidInpVal,'rif','botonAviso');	
		const shup = document.getElementsByClassName('showup prop')[0];
		shup.removeChild(shup.lastChild);
		shup.appendChild(avisTwo);
		const inp = document.getElementById('rif');
		inp.focus();
	}
	
	function ingresarClkBtn(e){
		let padre,flag,nodo;
		const elm = e.target;
		padre = elm.parentElement;
		for (let i=0;i<1;i++){padre = padre.parentElement;}
		const objAfl = formTemp.checkEmptyElem(padre);
		const object = objAfl[0];
		flag = objAfl[1];
		if(flag){
			const arrRows = [['¿Está seguro que desea Agregar'],
								 [`a ${object.rif} como Administrador ?`]];
			const arrBot = [['botNO','NO'],['botSIAdm','SI']];
			const arrContAtt = [['contUno','contAvAdm2'],['subContUno','suCoAdm2']];
			const avis = new Avisos().dialogAvisoThree(arrRows,arrBot,arrContAtt);
			const fragmento = document.createDocumentFragment();
			for (const [key, value] of Object.entries(object)) {
				nodo = formTemp.crearNodo('input',[['type','hidden'],['id',`${key}`],['value',`${value}`]],false);
				fragmento.appendChild(nodo);
			}
			avis.appendChild(fragmento);
			const shup = padre.parentElement.parentElement;
			shup.removeChild(shup.lastChild);
			shup.appendChild(avis);
		}

	}
	
	function insertAdm(e){
		let padre = e.target;
		for(let i=0;i<4;i++){padre = padre.parentElement;}
		const hijos = padre.childNodes;
		const dat = new Object();
		for(let i=1;i<hijos.length;i++){dat[hijos[i].id] = hijos[i].value;}
		const respuesta = new BackQuery('/agregarAdministrador',dat).afirma();
		respuesta.then(respuesta => {
			let avis;
			if(respuesta == 'Afirmativo'){
				avis = new Avisos().dialogAvisoFive(['La Cédula o RIF '+dat.rif,'fue Registrado','como Administrador.','Pulse Aceptar para actualizar'],'acceptInsAD','Aceptar');
			}else{
				avis = new Avisos().dialogAvisoFive(['No Se Agregó El Administrador',dat.rif],'acceptElim','Aceptar');
			}
			const shup = padre.parentElement;
			shup.removeChild(shup.lastChild);
			shup.appendChild(avis);	
		});
	}
	
	function updateAdm(e){
		const url = '/edificioInfo';
		const codEd = pageBehavior.getCookie('propDoc').split(',')[2];
		const dbName = 'edificio_Info-'+codEd;
		const vers = 1; 
		const method = 'POST';
		const saiAsig = 'infoEdif';
		const jwt = pageBehavior.getCookie('jwt');
		const object = {codEd,saiAsig,jwt};
		const IDBOb = new IndexedDBProcess(url,dbName,vers,method,object);
		IDBOb.deleteDB();
		pageBehavior.setCookie(pageBehavior.getCookie('propDoc').split(',')[2],'',1);
		const apellUsua = pageBehavior.getCookie('profile').split(',')[1].split(' ').join('');
		window.location.assign(pageBehavior.getURL('/'+codEd+'/'+apellUsua));
	}
	
	function fdosIniciales(){
		const elem = new FormTemp('section');
		const tit = elem.crearNodo('div',[['class','titulo lipro']],false);
		elem.crearNodoTexto(false,'','FONDOS INICIALES',tit);
		const fdoIn = elem.crearNodo('div',[['class','fondosIni']],false);
		const inpArr = new Array();
		inpArr[0]=['Dinero total en Bancos','corporate_fare-24px.svg','text','dineroBan'];
		inpArr[1]=['Dinero en Efectivo','money-24px.svg','text','dineroEfec'];
		inpArr[2]=['Cuentas por Cobrar','chart_outlined-24px.svg','text','cxc'];
		inpArr[3]=['Fondo de Reserva','money-01.svg','text','fondoR'];
		inpArr[4]=['Fondo de Provisiones','money-01.svg','text','dineroProv'];
		let fragmento = document.createDocumentFragment();
		let be,imag,lab,inp,txt;
		inpArr.forEach((item,index,array)=>{	
			be = elem.crearNodo('b',[],false);
			elem.crearNodoTexto(false,'',item[0],be);
			imag = elem.crearNodo('img',[['src','/apiGrafica/imagenes/'+item[1]]],false);
			lab = elem.creaContenedor('label','l',[imag,be]);
			fragmento.appendChild(lab);
			inp = elem.crearNodo('input',[['type',item[2]],['id',item[3]],['disabled','true']],false);
			fragmento.appendChild(inp);
			if(index == 3){
				fragmento.appendChild(document.createElement('hr'));
				fragmento.appendChild(document.createElement('br'));
			}else if(index == 4){
				fragmento.appendChild(document.createElement('br'));
			}
		});
		const aa = elem.crearNodo('a',[['class','guardar'],['id','guardar'],['href','javascript:void(0);']],false);
		elem.crearNodoTexto(false,'','Guardar',aa);
		fdoIn.appendChild(fragmento);
		const shup = elem.creaContenedor('div','showup fdoIni',[tit,fdoIn]);
		elem.pareHijo(shup);
		fondosSyst(['dineroBan','dineroEfec','cxc','fondoR','dineroProv']);
	}
	
	function fondosSyst(arrID){
		const propDoc = pageBehavior.getCookie('propDoc');
		const fondos = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[2],1);
		arrID.forEach((item,index,array)=>{
			let suma = 0;
			fondos.retrieveAllTableDataArr(item,(r)=>{
				r.forEach((it,ind,arr)=>{
					suma += +(it['monto']);
				});
				pageBehavior.setValue(item,suma.toFixed(2));
			});
		});
	}
	
	function multasEint(){	
		const elemt = new FormTemp('section');
		const tit = elemt.crearNodo('div',[['class','titulo lipro']],false);
		elemt.crearNodoTexto(false,'','MULTAS E INTERESES',tit);
		let hijo = elemt.crearNodo('h2',[],false);
		elemt.crearNodoTexto(false,'','Multas',hijo);
		const fragmento = document.createDocumentFragment();
		fragmento.appendChild(hijo);
		hijo = elemt.crearNodo('p',[],false);
		elemt.crearNodoTexto(false,'','Recarga que se le aplicará al propietario del inmueble por impago, una vez vencido el Aviso de Cobro.',hijo);
		fragmento.appendChild(hijo);
		fragmento.appendChild(document.createElement('br'));
		let lab = elemt.crearNodo('label',[],false);
		elemt.crearNodoTexto(false,'','Monto que se cargará al Aviso de Cobro vencido por impago.',lab);
		fragmento.appendChild(lab);
		let inpOn = elemt.crearNodo('input',[['type','text'],['placeholder','$ 0,00'],['id','multa'],['maxlength','16']],false);
		fragmento.appendChild(inpOn);
		fragmento.appendChild(document.createElement('br'));
		fragmento.appendChild(document.createElement('hr'));
		fragmento.appendChild(document.createElement('br'));
		hijo = elemt.crearNodo('h2',[],false);
		elemt.crearNodoTexto(false,'','Intereses',hijo);
		fragmento.appendChild(hijo);
		hijo = elemt.crearNodo('p',[],false);
		elemt.crearNodoTexto(false,'','Intereses de mora a cargar al propietario del inmueble por impago, una se venza el Aviso de Cobro.',hijo);
		fragmento.appendChild(hijo);
		fragmento.appendChild(document.createElement('br'));
		const mark = elemt.crearNodo('mark',[['class','mar']],false);
		elemt.crearNodoTexto('b',' monto ','del Aviso de Cobro adeudado.',mark);
		lab = elemt.crearNodo('label',[],mark);
		fragmento.appendChild(lab);
		let inpTwo = elemt.crearNodo('input',[['type','text'],['placeholder',' 0,00 %'],['id','interes'],['maxlength','6']],false);
		fragmento.appendChild(inpTwo);
		inpTwo = elemt.crearNodo('input',[['type','hidden'],['id','codEd'],['value',pageBehavior.getCookie('propDoc').split(',')[2]]],false);
		fragmento.appendChild(inpTwo);
		inpTwo = elemt.crearNodo('input',[['type','hidden'],['id','jwt'],['value',pageBehavior.getCookie('jwt')]],false);
		fragmento.appendChild(inpTwo);
		inpTwo = elemt.crearNodo('input',[['type','hidden'],['id','saiAsig'],['value','multaEint']],false);
		fragmento.appendChild(inpTwo);
		fragmento.appendChild(document.createElement('br'));
		fragmento.appendChild(document.createElement('br'));
		const aa = elemt.crearNodo('button',[['class','guardar'],['id','guardar']],false);
		elemt.crearNodoTexto(false,'','Guardar cambios',aa);
		fragmento.appendChild(aa);
		const fdoIn = elemt.crearNodo('form',[['class','multas'],['id','multas']],fragmento);
		const shup = elemt.creaContenedor('div','showup mul',[tit,fdoIn]);
		elemt.pareHijo(shup);
		elemt.crearNodoTextoDos('Interés sobre el','mar',2);
		inpOn.focus();
	}
	
	function guardarMultasEInt(e){
		let padre,flag,nodo;
		const elm = e.target;
		padre = elm.parentElement;
		for (let i=0;i<0;i++){padre = padre.parentElement;}
		const objAfl = formTemp.checkEmptyElem(padre);
		const object = objAfl[0];
		flag = objAfl[1];
		if(flag){
			const arrRows = [['Está a punto de cambiar'],
								[`el monto de la multa a ${object.multa}`],
								[`y la tasa anual de intereses de mora a ${object.interes}%.`],
								['¿Desea continuar?']];
			const arrBot = [['botNOMul','NO'],['botSIMul','SI']];
			const arrContAtt = [['contUno','contAvMul1'],['subContUno','suCoAvMu1']];
			const avis = new Avisos().dialogAvisoThree(arrRows,arrBot,arrContAtt);
			const fragmento = document.createDocumentFragment();
			for (const [key, value] of Object.entries(object)) {
				nodo = formTemp.crearNodo('input',[['type','hidden'],['id',`${key}`],['value',`${value}`]],false);
				fragmento.appendChild(nodo);
			}
			avis.appendChild(fragmento);
			const shup = padre.parentElement;;
			shup.removeChild(shup.lastChild);
			shup.appendChild(avis);
		}
	}
	
	function botonNoMulta(){
		const sect = new FormTemp('section');
		sect.retiraUltNodo('section','TG',0);
		multasEint();
	}
	
	function guardarMulta(e){
		let padre = e.target;
		for(let i=0;i<4;i++){padre = padre.parentElement;}
		const hijos = padre.childNodes;
		const dat = new Object();
		for(let i=1;i<hijos.length;i++){dat[hijos[i].id] = hijos[i].value;}
		const respuesta = new BackQuery('/registramulta',dat).afirma();
		respuesta.then(respuesta => {
			let avis;
			if(respuesta == 'Afirmativo'){
				avis = new Avisos().dialogAvisoFive(['Se fijó una Multa de $'+dat.multa+' para',
													 'recibos pagados después de su vencimiento',
													 'y una tasa de interés anual para recibos',
													 'en mora del '+dat.interes+'%.'],
													 'acceptIntMor','Aceptar');
			}else{
				avis = new Avisos().dialogAvisoFive(['No Se pudo fijar los nuevos parámetros'],'acIMNeg','Aceptar');
			}
			const shup = padre.parentElement;
			shup.removeChild(shup.lastChild);
			shup.appendChild(avis);	
		});
	}
	
	
	function juntaCondominio(Arr){
		const fe = Arr[0]['inicio'].split('-');
		const fecha = fe[2]+'/'+fe[1]+'/'+fe[0];
		const dur = Arr[0]['duracion'];
		const mTen = +(fe[1])+Number(dur);
		let mVen,anVen,elm,txtU,veFg,inFg;
		if(mTen>12){
			anVen = +fe[0]+Math.floor(mTen/12);
			mVen = Math.round(12*(+mTen/12-Math.floor(mTen/12)));
		}else{
			anVen = +fe[0];
			mVen = mTen;
		}
		const venc = fe[2]+'/'+mVen+'/'+anVen;
		const vig = pageBehavior.vencENdias(mVen+'/'+fe[2]+'/'+anVen);
		if(vig<0){txtU = 'La Junta se venció el ';veFg=true;}else{txtU = 'La Junta se vencerá el ';veFg=false}
		if(Arr[0]['unidad']=='ADMIN-0'){inFg=true}else{inFg=false}
		let atrU = [];
		if(inFg){txtU = 'La Junta debe constituirse! ';atrU=[['style','color:red;']]}
		const elemt = new FormTemp('section');
		const tit = elemt.crearNodo('div',[['class','titulo tres']],false);
		elemt.crearNodoTextoTres('JUNTA DE CONDOMINIO',tit,true);
		const ventana = elemt.crearNodo('div',[['class','ventana']],tit);
		const paramUno = [['legend',[],'Período',true],
							['label',[],'Fecha de inicio',true],
							['input',[['type','text'],['value',fecha],['disabled','true'],['class','fecha']],'',false],
							['div',atrU,txtU,true]];
		let fragmento = document.createDocumentFragment();
		paramUno.forEach((item,index,array)=>{
			elm = elemt.crearNodo(item[0],item[1],false);
			elemt.crearNodoTextoTres(item[2],elm,item[3]);
			fragmento.appendChild(elm);
		});
		let hijInp = elemt.crearNodo('input',[['type','text'],['value',venc],['disabled','true'],['class','fecha']],false);
		if(veFg){hijInp.style.borderColor = "red";}
		fragmento.lastElementChild.appendChild(hijInp);
		txtU = 'Renovar';
		if(inFg){hijInp.style.visibility = "hidden";txtU = 'Constituir';}
		hijInp = elemt.crearNodo('button',[['class','cambio'],['id','renovar']],false);
		elemt.crearNodoTextoTres(txtU,hijInp,true);
		if(!veFg){hijInp.style.visibility = "hidden";}
		if(inFg){hijInp.style.visibility = "visible";}
		fragmento.lastElementChild.appendChild(hijInp);
		let fieldS = elemt.crearNodo('fieldset',[],fragmento);
		const formato = elemt.crearNodo('div',[['class','form']],fieldS);
		fragmento = document.createDocumentFragment();
		const paramDos = [['legend',[],'Datos de los Miembros',true]];				  
		paramDos.forEach((item,index,array)=>{
			elm = elemt.crearNodo(item[0],item[1],false);
			elemt.crearNodoTextoTres(item[2],elm,item[3]);
			fragmento.appendChild(elm);
		});
		fieldS = elemt.crearNodo('fieldset',[],fragmento); 
		/* tabla*/
		const tabHeTe = ['Unidad','Cargo','Representante','Información'];
		const datCLn = Object.keys(Arr[0]);
		const tabDatCL = [datCLn[2],datCLn[1],datCLn[3],'info'];
		const tabla = new TablasMuestras().createTableOne(tabHeTe,tabDatCL,Arr.length);
		tabla.setAttribute('style','margin:auto;');
		fieldS.appendChild(tabla);
		formato.appendChild(fieldS);
		ventana.appendChild(formato);
		elemt.pareHijo(ventana);
		let element,tableData,tdImg,tdAnc;
		/* valores de la tabla */
		let claves,valores,elemento,texto;
		Arr.forEach((item,index,array)=>{
			claves = Object.keys(item);
			valores = Object.values(item);
			claves.forEach((it,ind,arr)=>{
				elemento = document.getElementsByClassName(it)[index];
				if(elemento != undefined){
					texto = document.createTextNode(valores[ind]);
					elemento.appendChild(texto);
				}
			});
		}); 
		/* Boton Agregado a la tabla*/
		for(let i=0;i<Arr.length;i++){
			element = document.getElementById(`info-${i}`);
			tdImg = elemt.crearNodo('img',[['class','goinf'],['id','goinf-'+i],['src','/apiGrafica/imagenes/info.svg']],false);
			tdAnc = elemt.crearNodo('a',[['class','eliminar'],['id','eliminar'],['href','javascript:void(0);']],tdImg);
			element.appendChild(tdAnc);
		}
	}
	
	function jCondSyst(){
		const propDoc = pageBehavior.getCookie('propDoc');
		const egresos = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[2],1);
		egresos.retrieveAllTableDataArr('junta',(r)=>{juntaCondominio(r);});
	}
	
	function infoJunta(elem){
		let tabR=elem;
		while(tabR.tagName.toLowerCase() != 'tr'){
			tabR = tabR.parentElement;
		}
		const cols = tabR.childNodes;
		const miembro = {};
		cols.forEach((item,index,array)=>{
			miembro[item.className] = item.innerText;
		});
		//miembro['unidad'] = '1B';
		sessionStorage.setItem('curr_page',1);
		const propDoc = pageBehavior.getCookie('propDoc');
		let junta = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[2],1);
		junta.retrieveDataByIdex('unidades','unidad',miembro['unidad'],(r)=>{infoJuntaDos(r,miembro)});
	}
	
	function infoJuntaDos(Obj,miembro){
		const propDoc = pageBehavior.getCookie('propDoc');
		let junta = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[2],1);
		junta.retrieveDataByIdex('junta','cargo',miembro['cargo'],(r)=>{
			let avis,arrFil,ventana;
			if(Obj == undefined){
				arrFil = [['Cargo:',' No Definido'],
						 ['Junta De Condominio: ',' No Constituida']];
			
			}else{
				arrFil = [['Inicio '+r['inicio'],' Duración '+r['duracion']+' mes(es)'],
								['Cargo: ',miembro['cargo']],
								['Datos del Propietario ','de la unidad '+Obj['unidad']],
								['Nombre: ',Obj['Nombre']+' '+Obj['Apellido']],
								['Correo: ',Obj['Correo']],
								['Datos del Representante ','para el cargo:'],
								['Nombre: ',r['Nombre']+' '+r['Apellido']],
								['Correo: ',r['Correo']]];
			}
			avis = new Avisos().dialogAvisoSix(arrFil,['cerInf1','cerInf2'],'Cerrar');
			ventana = document.getElementsByClassName('ventana')[0];
			ventana.lastElementChild.remove();
			ventana.appendChild(avis);			
		});

	}
	
	function renovJuntaUno(){
		const propDoc = pageBehavior.getCookie('propDoc');
		const egresos = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[2],1);
		egresos.retrieveAllTableDataArr('junta',(r)=>{renovJuntaDos(r);});
	}
	
	function renovJuntaDos(Arr){
		const clases = ['inicio','duracion','cargo','unidad','rifLetra','rif'];
		const titulos =['Cargo','Unidad','Representante'];
		const selOpt = [['V-','V-'],['J-','J-'],['E-','E-'],['G-','G-']];
		const plcHold = 'Rif o Cédula';
		const section = new FormTemp('section');
		const tabmuest = new TablasMuestras();
		let cargos = new Array();
		Arr.forEach((item,index,array)=>{
			cargos.push(item['cargo']);
		});
		let arrElm = new Array();
		let subArrElm = new Array();
		let fragmento,nodes;
		let Elt = new Array();
		// Elt = [tagName,[[atributo1],[atributo2]],'texto'];
		Elt[0] = ['label',[['for',clases[0]]],'Inicio'];
		Elt[1] = ['input',[['type','date'],['id',clases[0]],['autofocus','true']],false];
		Elt[2] = ['label',[['for',clases[1]]],'Duración'];
		Elt[3] = ['select',[['id',clases[1]]],[['0',0]]];
		Elt[4] = ['label',[['for',clases[1]]],'Mes(es)'];	
		Elt[5] = ['label',[],titulos[0]];	
		Elt[6] = ['label',[],titulos[1]];
		Elt[7] = ['label',[],titulos[2]];
		for(let i = 0;i < cargos.length; i++){
			Elt[4*i+8] = ['label',[['class','lab']],cargos[i]];
			Elt[4*i+9] = ['select',[['class',clases[3]],['id',clases[3]+i]],[[clases[3],'']]];
			Elt[4*i+10] = ['select',[['class',clases[4]],['id',clases[4]+i]],selOpt];
			Elt[4*i+11] = ['input',[['type','text'],['class',clases[5]],['id',clases[5]+i],['placeholder',plcHold],['maxLength','9']],false];
		}
		/* orden de los elementos de cada columna en la tabla*/
		let filas = new Array([[Elt[0],Elt[1]],[Elt[2],Elt[3],Elt[4]]],
							[[Elt[5]],[Elt[6]],[Elt[7]]]);
		for(let i = 0;i < cargos.length; i++){
			let renglon = [[Elt[4*i+8]],[Elt[4*i+9]],[Elt[4*i+10],Elt[4*i+11]]];
			filas.push(renglon);
		}
		/* creacion de los nodos */
		filas.forEach((item,index,array)=>{
			subArrElm = new Array();
			item.forEach((it,ind,arr)=>{
				fragmento = document.createDocumentFragment();
				nodes = new Array();
				it.forEach((articulo,indice,arreglo)=>{
					if(articulo[0] == 'select'){
						nodes.push(tabmuest.createSelect(articulo[1],articulo[2]));
					}else{
						nodes.push(tabmuest.crearNodo(articulo[0],articulo[1],articulo[2],false));
					}
				});
				nodes.forEach((art,indi,arreg)=>{fragmento.appendChild(art);});
				subArrElm.push(fragmento);	
			});
			arrElm.push(subArrElm);
		});
		nodes = new Array();
		nodes[0] = tabmuest.crearNodo('p',[],'Renovación de la junta de condominio',false);
		nodes[1] = tabmuest.crearTablaForm(arrElm);
		const cont = tabmuest.crearNodo('div',[['class','ventanados']],false,nodes[0]);
		cont.appendChild(nodes[1]);
		/* adjunta cargos*/
		fragmento = document.createDocumentFragment();
		for(let i = 0;i < cargos.length; i++){
			nodes = tabmuest.crearNodo('input',[['type','hidden'],['class',clases[2]],['id',clases[2]+i],['value',cargos[i]]],false,false);
			fragmento.appendChild(nodes);
		}
		cont.appendChild(fragmento);
		section.retiraUltNodo('section','TG',0);
		section.pareHijo(cont);
		listaUnidades();
	}
	
	function listaUnidades(){
		const propDoc = pageBehavior.getCookie('propDoc');
		let egresos = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[2],1);
		egresos.retrieveAllTableDataArr('unidades',(r)=>{insertUnit(r);});
	}
	function insertUnit(Arr){
		const unidades = document.getElementsByClassName('unidad');
		const unidArr = new Array();
		const arrDur = new Array();
		Arr.forEach((item,index,array)=>{unidArr.push([item['unidad'],item['unidad']]);});
		for(let i = 0; i<unidades.length;i++){formTemp.insertSelOptions(unidades[i].id,unidArr);}
		for(let i = 0; i<25;i++){arrDur.push([`${i}`,i])}
		formTemp.insertSelOptions('duracion',arrDur);
	}
	
	function renuevaJuntaUno(e){
		let padre = e.target;
		const clases = ['inicio','duracion','cargo','unidad','rifLetra','rif'];
		for(let i=0;i<2;i++){padre = padre.parentElement;}
		const inicio = document.getElementById(clases[1]);
		let inpEl,flag=true,linAvUn,mesCer=false;
		let filDo = new Object();
		if(inicio.value == 0){flag = false;mesCer=true}
		const objAfl = formTemp.checkEmptyElem(padre);
		const object = objAfl[0];
		flag = objAfl[1];
		if(mesCer == true && flag == true){inicio.style='border-color:red';setTimeout(()=> (alert('La duración debe ser superior a 0 meses!')),250)}
		if(flag){
			const jwt = pageBehavior.getCookie('jwt');
			const codEd = pageBehavior.getCookie('propDoc').split(',')[2];
			const codProp = pageBehavior.getCookie('propDoc').split(',')[1];
			const filUn = {jwt,codEd,codProp};
			const objSen = new Array(filUn);
			for(let i = 0;i<2;i++){filDo[clases[i]]=document.getElementById(clases[i]).value;}
			objSen.push(filDo);
			const longF = document.getElementsByClassName(clases[2]).length;
			for(let i = 0;i<longF;i++){
				filDo = new Object;
				filDo[clases[2]]=document.getElementById(`${clases[2]}${i}`).value;
				filDo[clases[3]]=document.getElementById(`${clases[3]}${i}`).value;
				filDo[clases[5]]=document.getElementById(`${clases[4]}${i}`).value+document.getElementById(`${clases[5]}${i}`).value;
				objSen.push(filDo);
			}
			const arrAvUn =[['Está seguro que desea Renovar'],
			['Los Cargos Para la Junta de Condominio: ?'],
			['con fecha de inicio '+objSen[1][`${clases[0]}`]+', y duración de '+objSen[1][`${clases[1]}`]+' meses'],
			['quedando constituida de la siguiente forma:']];
			for(let i = 2;i<objSen.length;i++){
				linAvUn = '';
				for (const [key, value] of Object.entries(objSen[i])) {
				linAvUn +=`${key}: ${value} `;
				}
				arrAvUn.push([linAvUn]);
			}
			const arrBot = [['botNOJun','NO'],['botSIJun','SI']];
			const arrContAtt = [['contUno','contAvJu1'],['subContUno','suCoAvJu1']];
			const avis = new Avisos().dialogAvisoThree(arrAvUn,arrBot,arrContAtt);
			const shup = padre.parentElement.parentElement;
			shup.removeChild(shup.lastChild);
			const cont = document.createElement('div');
			cont.setAttribute('class','showup prop');
			cont.append(avis);
			shup.appendChild(cont);
			let nodo = document.createElement('input');
			nodo.setAttribute('type','hidden');
			nodo.setAttribute('id','obj');
			nodo.setAttribute('value',JSON.stringify(objSen));
			cont.appendChild(nodo);
		}
	}
	function renuevaJuntaEnviar(e){
		let padre = e.target;
		const clases = ['inicio','duracion','cargo','unidad','rifLetra','rif'];
		let arrAvUn,linAvUn,butID;
		for(let i=0;i<5;i++){padre = padre.parentElement;}
		const objSen = JSON.parse(padre.lastChild.value);
		const resp = new BackQuery('/agregarJuntaDeCondominio',objSen).afirma();
		resp.then(resp => {
			if(resp == 'Afirmativo'){
				arrAvUn =['Los Cargos Para la Junta de Condominio:',
						'con fecha de inicio '+objSen[1][`${clases[0]}`]+', y duración de '+objSen[1][`${clases[1]}`]+' meses',
						'quedó constituida de la siguiente manera:'];
				for(let i = 2;i<objSen.length;i++){
					linAvUn = '';
					for (const [key, value] of Object.entries(objSen[i])) {
						linAvUn +=`${key}: ${value} `;
					}
					arrAvUn.push(linAvUn);
				}
				arrAvUn.push('Pulse Aceptar para actualizar');
				butID = 'acceptInJu';	
			}else{
				arrAvUn = ['No pudo actualizarse la junta','para el período seleccionado'];
				butID = 'negInJu';
			}
			const avis = new Avisos().dialogAvisoFive(arrAvUn,butID,'Aceptar');
			const shup = padre.parentElement;
			shup.removeChild(shup.lastChild);
			const cont = document.createElement('div');
			cont.setAttribute('class','showup prop');
			cont.append(avis);
			shup.appendChild(cont);
			document.getElementById('cnclBtn').style.display = 'none';
		});
		
	}
	

