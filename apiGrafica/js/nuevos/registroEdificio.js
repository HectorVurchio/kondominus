import{EventAsigner} from './eventAss.js';
import {PageBehavior} from './pageBeha.js';
import {BackQuery} from './backQ.js';
import{FormTemp} from './formTemp.js';
import{TablasMuestras} from './tabMue.js';
import {RetrieveDBEgresos} from './retriDBeg.js';
import {Avisos} from './avisos.js';
/* en la base de datos insertar rif proveedor J-000000000 con los datos del edificio para cuentas por cobrar apertura Proveedor = Proveedores Anteriores*/

	var eventAsigner = new EventAsigner();
	var pageBehavior = new PageBehavior();
	var formTemp = new FormTemp();
	var avisos = new Avisos();
	
	eventAsigner.windowLoad(()=>{
		sessionStorage.clear();
		showUpdateAccountForm();
		const section = document.getElementsByTagName('section')[0];
		const header = document.getElementsByTagName('header')[0];
		section.addEventListener('click',(e)=>{navclicks(e);});
		header.addEventListener('click',(e)=>{headclicks(e.target);});
	});
	
	function showUpdateAccountForm(){
		const jwt = pageBehavior.getCookie('jwt');
		const respuesta = new BackQuery('/verifica',{jwt}).afirma();
		respuesta.then(respuesta => {
			if (respuesta == 'Afirmativo'){
				logeado();
				cargaForm();
			}else{
				window.location.assign(pageBehavior.getURL('/ingreso'));
			}		
		});
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
			const contMen = [['Mi Perfil','miPer'],['Cerrar Sesión','loOt']];
			const contOpt = [['Mis Cuentas','princ']];
			pageBehavior.logHeaderOne(profile[0],contMen,contOpt);
			document.getElementById('jwt').value = pageBehavior.getCookie('jwt');			
		});
	}
	
	
	function headclicks(elm){
		const elmid = elm.id;
		const elmCl = elm.className;
		console.log(elmCl,elmid);
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
	
	function navclicks(e){
		const elmID = e.target.id;
		const tagN = e.target.tagName;
		const tgCL = e.target.className;
		switch (elmID){
			case 'btnAfirm':
				volver(e);
				break;
			case 'btnNegativo':
				volver(e);
				break;
			case 'btnAfirmRego':
				logOut();
				break;
		}
	}
	
	function cargaForm(){
		cargaAdminTools('estado','resultado',['id_estado','estado'],'Estado','');
		formAdminToolsThree('rifLetra',['J-','V-','E-','G-'],1);
		formAdminToolsThree('ciudad',['ciudad'],2);
		formAdminToolsThree('telI',['Cod'],2);
		eventAsigner.submitAssign('formul','CL');
		eventAsigner.formFocusEnterKD('formul','CL');
		eventAsigner.inputAsign('rif','ID','Number');
		eventAsigner.changeAsign('rif','ID',(e)=>{let obj=e.target;(obj.value.length>7)?rifChange('formul'):rifNeg(obj)});
		eventAsigner.inputAsign('telef','ID','Number');
		eventAsigner.changeAsign('estado','ID',(e)=>{setCity(e.target.value);});
		eventAsigner.changeAsign('ciudad','ID',(e)=>{setPhoneCode(e.target.value);});
		eventAsigner.inpTexMethGen('formul','CL',(x)=>{clika(x)});
		eventAsigner.clickAsign('ingresar','ID',()=>{if(ingresar('formul')){planillaUnidades();}});	
		pageBehavior.setMaxLength('rif',9);
		pageBehavior.setMaxLength('proveedor',70);
		pageBehavior.setMaxLength('direc',70);
		pageBehavior.setMaxLength('telef',8);
		pageBehavior.setMaxLength('email',70);
	}
	
	function rifNeg(obj){obj.value = '';}
	function rifChange(forTyp){
		const object = formTemp.formTxtFormatTwo(forTyp,'');
			const respuesta = new BackQuery('/consulta/edificio',object.__proto__).getServDatPO();
			respuesta.then(respuesta => {
				if (respuesta.numReg == 'Presente'){
					const edificio = respuesta.response.nombre_edificio;
					const ciudad = respuesta.response.ciudad;
					const estado = respuesta.response.estado;
					const arrAv =[['El Edificio '+object.__proto__.rif],['Se Encuentra Ya Registrado.'],
									['Edificio: '+ edificio],['Dirección: '+ ciudad + ', ' + estado]];
					const botID = 'btnAfirm';
					const arrAttCont = [['avisoDos','contRegEd1'],['subAvisoDos','suCoReEd1']];
					const avis = avisos.dialogAvisoOne(arrAv,botID,arrAttCont);
					const shup = document.getElementsByClassName('showup')[0];
					for(let i=0;i<3;i++){shup.removeChild(shup.lastChild);}
					shup.appendChild(avis);
					//eventAsigner.clickAsign('btnAfirm','ID',volver);
				}
			});
	}
	
	function volver(e){
		miCuenta();
		cargaForm();
	}
	
	function miCuenta(){
		let seccion =  new FormTemp('section');
		let regEdHi,arrAttrb,hijo,padre,hijos;
		let regEdPa = new Array();
		let elm = new Array(['select','input'],['input'],['input'],['select','select'],['img','select','input'],['img','input'],['input']);
		let atr = new Array();
		atr[0] = [[['id','rifLetra']],[['type','text'],['id','rif'],['placeholder','RIF Del Condominio']]];
		atr[1] = [[['type','text'],['id','proveedor'],['placeholder','Nombre Del Condominio']]];
		atr[2] = [[['type','text'], ['id','direc'], ['placeholder','Calle y número']]];
		atr[3] = [[['id','estado']],[['id','ciudad']]];
		atr[4] = [[['src','/apiGrafica/imagenes/phone.png']],[['id','telI']],[['type','text'],['id','telef'],['placeholder','Teléfono']]];
		atr[5] = [[['src','/apiGrafica/imagenes/mail.png']],[['type','email'],['id','email'],['placeholder','correo@dominio.com']]];
		atr[6] = [[['type','hidden'],['id','jwt'],['value',pageBehavior.getCookie('jwt')]]];
		elm.forEach((item,index,array)=>{
			regEdHi = new Array();
			hijos = item;
			hijos.forEach((it,ind,arr)=>{
				arrAttrb = atr[index][ind];
				hijo = seccion.crearNodo(it,arrAttrb,false);
				regEdHi.push(hijo);
			})
			padre = seccion.creaContenedor('div','regEd',regEdHi);
			regEdPa.push(padre);
		});
		regEdHi = null;
		const boton = seccion.crearNodo('button',[['id','ingresar']],false);
		seccion.crearNodoTexto(false,'','Ingresar',boton);
		regEdPa.push(boton);
		const formEdif = seccion.creaContenedor('div','formEdif',regEdPa);
		formEdif.setAttribute('style','display:table');
		const formulario  = seccion.crearFormulario('formul',formEdif);
		const titulo = seccion.crearNodo('h2','',false);
		seccion.crearNodoTexto(false,'','Registrar Inmueble',titulo);		
		const showup = seccion.creaContenedorDos('div','showup','summary',[titulo,formulario]);
		seccion.sacaHijos();
		seccion.containerDisplay('flex');
		seccion.pareHijo(showup);
		cargaForm();
		pageBehavior.setStyle([['rif','margin-left','5px'],['telef','margin-left','6px']]);
	}
	
	function ingresar(contID){
		let flag = true;
		const allVal = formTemp.getInpValAllTwo(contID);
		allVal.forEach((item,index,array)=>{if(flag){if(item == ''){flag=false;}}});
		const objeto = formTemp.formObjVal(contID).then((result)=>{
			if(flag){
				let keys = new Array();				
				for(const key in result){
					sessionStorage.setItem(key,result[key]);
					keys.push(key);
				}
				sessionStorage.setItem(contID,keys);
			}	
		});
		return flag;
	}
	
	function ingresarDos(contID){
		let flag = true;
		const allVal = formTemp.getInpValAllThree(contID);
		allVal.forEach((item,index,array)=>{if(flag){if(item == ''){flag=false;}}});
		const objeto = formTemp.divObjVal(contID).then((result)=>{
			if(flag){
				let keys = new Array();				
				for(const key in result){
					sessionStorage.setItem(key,result[key]);
					keys.push(key);
				}
				sessionStorage.setItem(contID,keys);
			}	
		});
		return flag;
	}
	
	function ingRegistroEdificio(){
		let unid,arrAv,padre,botID;
		const condObj = getEdifObject('regJuntCond');
		condObj['duracion-0'] = sessionStorage.getItem('duracion');;
		const obt = [getEdifObject('formul'),getEdifObject('fondosIni'),condObj];
		const unidObj = obt.concat(getUnidades('itemNum','regEdDos'));
		console.log(unidObj);
		
		
		const respuesta = new BackQuery('/registro/edificio',unidObj).afirma();
		unid = unidObj[0];
		respuesta.then(respuesta => {
			if(respuesta == 'Afirmativo'){
				arrAv =[['El Edificio ' + unid.proveedor],
						['RIF '+unid.rif],
						['Ubicado En '+unid.direc],
						[unid.ciuLetr + ' ' + unid.estLetr],
						['Telefono '+unid.telef],
						['Correo '+unid.email],
						['Se Registró Satisfactoriamente.']];
				botID = 'btnAfirmRego';
			}else{
				arrAv =[['El Edificio ' + unid.proveedor],
						['RIF '+unid.rif],
						['No pudo Ser Registrado.'],
						['Favor Intente De Nuevo']];
				botID = 'btnNegativo';
			}
			const arrAttCont = [['avisoDos','contRegEd1'],['subAvisoDos','suCoReEd1']];
			const avis = avisos.dialogAvisoOne(arrAv,botID,arrAttCont);
			padre = document.getElementsByClassName('showup fdoIni')[0];
			padre.removeChild(padre.lastChild);
			padre.appendChild(avis);
		});
	}
	

	function getUnidades(numIt,nomFil){
		const numItems = +(sessionStorage.getItem(numIt));
		let compDos,unidad;
		let unidades = new Array();
		for(let i=1;i<=numItems;i++){
			compDos = sessionStorage.getItem(nomFil+i).split(',');
			unidad = new Object();
			compDos.forEach((it,ind,Ar)=>{
				unidad[it] = sessionStorage.getItem(it);
			});
			unidades.push(unidad);
		}
		return unidades;		
	}
	
	function getEdifObject(edif){
		const formul = sessionStorage.getItem(edif).split(',');
		let comp;
		let object = {};
		formul.forEach((item,index,array)=>{
			comp = sessionStorage.getItem(item);
			object[item] = comp;
		});
		return object;
	}
	
	function planillaUnidades(){
		const showup =  new FormTemp('showup');
		const num = 1;
		sessionStorage.setItem('ItemPorPag',10);
		sessionStorage.setItem('pagina',1);
		sessionStorage.setItem('alicRest',parseFloat(100.00));
		const titulo = showup.crearNodo('h2','',false);
		showup.crearNodoTexto(false,'','Paso 2: Registrar Unidades',titulo);
		let regEdPa = new Array();
		const etiqu = etiquetas(showup);
		regEdPa.push(etiqu);
		const padre = campos(showup,num);
		regEdPa.push(padre);
		const formEdif = showup.creaContenedor('div','formEdifDos',regEdPa);
		const formulario  = showup.crearFormulario('formulDos',formEdif);
		const botYal = botonYalicuota(showup);
		formulario.appendChild(botYal);
		showup.sacaHijosDos();
		showup.pareMasHijos([titulo,formulario]);
		cargaFormDos(num);
		document.getElementById(`alic${num}`).placeholder = '100.00%';
	}
	
	function botonYalicuota(object){
		let regEdHi = new Array();
		let arrAttrb,padreU,padreD,hijo,texto;
		let atributosH = new Array([['id','labU'],['for','alicRes']],
							[['type','text'],['id','alicRes'],['readOnly','true'],['placeholder','100%']],
							[['id','labD'],['for','numPag']],
							[['type','text'],['id','numPag'],['readOnly','true'],['placeholder','1']],
							[['id','labT'],['for','numPagD']],
							[['type','text'],['id','numPagD'],['readOnly','true'],['placeholder','1']]);
		const elementosH = new Array('label','input','label','input','label','input');
		const textos = new Array('Alícuota Restante',null,'Página',null,'De',null);
		elementosH.forEach((item,index,array)=>{
			arrAttrb = atributosH[index];
			hijo = object.crearNodo(item,arrAttrb,false);
			texto = textos[index];
			if(texto != null){object.crearNodoTexto(false,'',texto,hijo);}
			regEdHi.push(hijo);
		});
		padreU = object.creaContenedorDos('div','infArea','infArU',regEdHi);
		padreD = object.crearNodo('button',[['class','ingReEd'],['id','ingReEd'],['style','visibility:hidden']],false);
		object.crearNodoTexto(false,'','Ingresar',padreD);
		const botArea = object.creaContenedorDos('div','botArea','botArea',[padreU,padreD]);
		//padreD.addEventListener('click',fdosIniciales);
		padreD.addEventListener('click',juntaCondominio);
		return botArea;		
	}
	
	function cargaFormDos(n){
		const itemPoPag = Number(sessionStorage.getItem('ItemPorPag'));
		const pagina = Number(sessionStorage.getItem('pagina'))-1;
		const num = n - pagina*itemPoPag;
		formAdminToolsThree(`rifLetra${n}`,['J-','V-','E-','G-'],1);
		eventAsigner.submitAssign('formulDos','CL');
		eventAsigner.divFocusEnterKD('regEdDos','CL',num);
		eventAsigner.clickAsign(`but-${n}`,'ID',(event)=>{agregaotro(event)});
		eventAsigner.indKeyPresInpAssign(`but-${n}`,'ID',botonEnter);
		pageBehavior.setMaxLength(`unidad${n}`,4);
		pageBehavior.setMaxLength(`rif${n}`,9);
		pageBehavior.setMaxLength(`alic${n}`,5);
		pageBehavior.setMaxLength(`deuda${n}`,12);
		eventAsigner.inputAsign(`rif${n}`,'ID','Number');
		eventAsigner.inputAsign(`alic${n}`,'ID','Decimal');
		eventAsigner.inputAsign(`deuda${n}`,'ID','Decimal');	
	}

	function botonEnter(x){
		const flag = x.which;
		if(flag == 13){
			x.target.click();
		}
	}
	
	function agregaotro(x){
		/* refactorizar aqui */
		const n = Number(x.target.id.split('-')[1]);
		const alicRestant = alicuotaRestante(n);
		const nuevaAlic = alicRestant[0];
		if(alicRestant[1]){
			const num = n+1;
			const formEdifDos =  new FormTemp('formEdifDos');
			const flag = ingresarDos(`regEdDos${n}`);
			if(flag){
				const itemPoPag = Number(sessionStorage.getItem('ItemPorPag')); 
				const pagina = Number(sessionStorage.getItem('pagina'))-1; 
				const numb = n - pagina*itemPoPag; 
				const padre = campos(formEdifDos,num);
				const cambioPag = numeroPagina(num);
				if(cambioPag[0]){
					if(alicRestant[2]){
						document.getElementById('ingReEd').style.visibility = 'visible';
						formEdifDos.disabAllElmInDiv('regEdDos','CL',numb);
					}else{
						sessionStorage.setItem('pagina',cambioPag[1]);
						sessionStorage.setItem('paginacion',cambioPag[1]);
						document.getElementById('numPag').value = cambioPag[1];
						document.getElementById('numPagD').value = cambioPag[1];
						const etiq = etiquetas(formEdifDos);
						formEdifDos.sacaHijosDos();
						formEdifDos.pareMasHijos([etiq,padre]);
						paginacionUno(cambioPag[1],1);	
						cargaFormDos(num); 
						document.getElementById(`alic${num}`).placeholder = `${nuevaAlic}%`;
						sessionStorage.setItem('itemNum',num);
					}	
				}else{
					if(alicRestant[2]){
						document.getElementById('ingReEd').style.visibility = 'visible';
					}else{
						formEdifDos.pareMasHijos([padre]);
						cargaFormDos(num); 
						document.getElementById(`alic${num}`).placeholder = `${nuevaAlic}%`;
						sessionStorage.setItem('itemNum',num);
					}
					formEdifDos.disabAllElmInDiv('regEdDos','CL',numb);
					formEdifDos.defaultBordC('regEdDos','CL',numb);	
				}
				document.getElementById('alicRes').value = `${nuevaAlic}%`;
			}
		}else{
			alert('La Suma De Alícuotas Excede el 100%');
			const elemt = document.getElementById(`alic${n}`);
			elemt.focus();
			elemt.select();
		}
	}
	
	function paginacionUno(techo,tipo){  /*PAGINACION refactorizar*/
		let piso = +techo -4;
		if(piso<1){
			piso = 1;
		}
		let pagination = document.getElementsByClassName('pagination')[0];
		let arrNodHijos = new Array();
		let nieto,hijo;
		let arrAttrb = new Array();
		arrAttrb.push(['atras','<']);
		for(let i = piso;i<=techo;i++){arrAttrb.push([`bot-${i}`,`${i}`]);}
		arrAttrb.push(['adelante','>']);
		arrAttrb.forEach((item,index,array)=>{
			nieto = formTemp.crearNodo('a',[['id',item[0]],['href','javascript:void(0)']],false);
			formTemp.crearNodoTexto(false,'',item[1],nieto);
			hijo = formTemp.crearNodo('li',[['class','bot']],nieto);
			arrNodHijos.push(hijo);
		});
		if(pagination != null){
			formTemp.sacaHijostres(pagination);
			formTemp.pareHijosDos('pagination',arrNodHijos);
		}else{
			const pagCont = formTemp.creaContenedor('ul','pagination',arrNodHijos);
			const cont = formTemp.creaContenedor('div','zonaPaginacion',[pagCont]);
			formTemp.pareHijosDos('showup',[cont]);
		}
		pagination = document.getElementsByClassName('pagination')[0];
		if(tipo == 1){
			pagination.lastChild.previousSibling.childNodes[0].style='background-color:#410bf1;font-size:18px;';
		}else if(tipo == 2){
			pagination.firstChild.nextSibling.childNodes[0].style='background-color:#410bf1;font-size:18px;';
		}
		if(Number(sessionStorage.getItem('paginacion')) == 1){document.getElementById('atras').style.visibility='hidden';}
		if(Number(sessionStorage.getItem('paginacion')) == Number(sessionStorage.getItem('pagina'))){
			document.getElementById('adelante').style.visibility='hidden';
		}
		cargaPaginacion(pagination);
	}
	
	function cargaPaginacion(elem){  /*PAGINACION */
		const cont = elem.childNodes;
		for(let i = 0;i<cont.length;i++){
			cont[i].firstChild.addEventListener('click',(event)=>{paginacionDos(event)});
		}
	}
	
	function paginacionDos(x){  /*PAGINACION refactorizar*/
		const atras = document.getElementById('atras');
		const adelante = document.getElementById('adelante');
		const elemento = x.target;
		if(elemento.tagName.toLowerCase() != 'a'){return;}
		const itPorPag = Number(sessionStorage.getItem('ItemPorPag'));
		const ultItem = Number(sessionStorage.getItem('itemNum'));
		const bot = elemento.id;
		const pagAct = Number(sessionStorage.getItem('paginacion'));
		const formEdifDos =  new FormTemp('formEdifDos');
		let nuePag,num,techo,piso,el2,roof;
		const numeroPagina = document.getElementById('numPag');
		const alicRestant = +(sessionStorage.getItem('alicRest'));
		if(bot == 'atras'){
			if(adelante.style.visibility == 'hidden'){adelante.style.visibility = 'visible';}
			nuePag = pagAct-1;
			if(nuePag < 1){nuePag = 1;}
			num = nuePag;
			sessionStorage.setItem('paginacion',nuePag);
			numeroPagina.value = nuePag;
			el2 = document.getElementById(`bot-${num}`);
			if(el2 != null){segnalPagina(el2);}else{roof = +num+4;paginacionUno(roof,2);}
			if(num == 1){elemento.style.visibility = 'hidden';}
		}else if(bot == 'adelante'){
			if(atras.style.visibility == 'hidden'){atras.style.visibility = 'visible';}
			const ultPag = sessionStorage.getItem('pagina');
			nuePag = pagAct+1;
			if(nuePag > ultPag){nuePag = ultPag;}
			num = nuePag;
			sessionStorage.setItem('paginacion',nuePag);
			numeroPagina.value = nuePag;
			el2 = document.getElementById(`bot-${num}`);
			if(el2 != null){segnalPagina(el2);}else{roof = +num;paginacionUno(roof,1);}
			if(num == ultPag){elemento.style.visibility = 'hidden';}
		}else{
			segnalPagina(elemento);
			num = Number(bot.split('-')[1]);
			sessionStorage.setItem('paginacion',num);
			numeroPagina.value = num;
		}
		techo = num*itPorPag;
		if(techo > ultItem){techo = ultItem;}
		piso = (num-1)*itPorPag+1;
		formEdifDos.sacaHijosDos();
		const etiq = etiquetas(formEdifDos);
		formEdifDos.pareMasHijos([etiq]);
		let padre,hijos;
		let pendiente = false;
		let padres = new Array();
		for(let i=piso;i<=techo;i++){
			padre = campos(formEdifDos,i);
			hijos = padre.childNodes;
			hijos.forEach((item,index,array)=>{
			if(item.tagName.toLowerCase() == 'input'){
				if(item.type == 'text'){
					item.value = sessionStorage.getItem(item.id);
					if(i != ultItem){item.disabled = true;}
					if(alicRestant < 0.01 && alicRestant > -0.1){item.disabled = true;} 
				}
			} else if(item.tagName.toLowerCase() == 'select'){
				if(i != ultItem){
					const opt = document.createElement("option");
					opt.value = sessionStorage.getItem(item.id);
					opt.text = sessionStorage.getItem(item.id);
					item.add(opt);
					item.disabled = true;
				}else{
					if(alicRestant < 0.01 && alicRestant > -0.1){
						const opt = document.createElement("option");
						opt.value = sessionStorage.getItem(item.id);
						opt.text = sessionStorage.getItem(item.id);
						item.add(opt);
						item.disabled = true;
					}else{
						pendiente = true; 
					} 
				}
			}
			});
			padres.push(padre);
		}
		formEdifDos.pareMasHijos(padres);
		if(pendiente){cargaFormDos(ultItem);}
		if(Number(sessionStorage.getItem('paginacion')) == 1){document.getElementById('atras').style.visibility='hidden';}
		if(Number(sessionStorage.getItem('paginacion')) == Number(sessionStorage.getItem('pagina'))){
			document.getElementById('adelante').style.visibility='hidden';
		}
	}
	
	function segnalPagina(elem){  /*PAGINACION */
		const padre = elem.parentNode.parentNode;
		const hermanos = padre.childNodes;
		for(let bro of hermanos.entries()){bro[1].firstChild.style = 'default';}
		elem.style='background-color:#410bf1;font-size:18px;';
	}
	
	function alicuotaRestante(n){
		let alicAct = +(sessionStorage.getItem('alicRest'));
		let alicInt = +(document.getElementById(`alic${n}`).value);
		let menor = true;
		let nueAlic = (alicAct-alicInt).toFixed(2);
		if(alicInt > alicAct){menor = false;}else{sessionStorage.setItem('alicRest',nueAlic);}
		let buscada = false;
		if(nueAlic < 0.01 && nueAlic > -0.1){buscada = true;}
		return new Array(nueAlic,menor,buscada);
	}
	
	function numeroPagina(num){
		let cambioPag = false;
		const itemPoPag = Number(sessionStorage.getItem('ItemPorPag'));
		let pagPres = Math.ceil(+num/itemPoPag);
		let pagCorr = Number(sessionStorage.getItem('pagina'));
		if(pagPres > pagCorr){cambioPag = true;}
		return new Array(cambioPag,pagPres);
	}
	
	function etiquetas(object){
		let regEdHi = new Array();
		let arrAttrb,padre,hijo,nieto;
		let atributosH = new Array([['class','title'],['id','tit0']],
							[['class','title'],['id','tit1']],
							[['class','title'],['id','tit2']],
							[['class','title'],['id','tit3']],
							[['class','title'],['id','tit4']]);
		let textos = new Array('Item','Unidad','Cédula ó RIF','Alícuota','Deuda $');
		let elementosH = new Array('label','label','label','label','label');
		elementosH.forEach((item,index,array)=>{
			arrAttrb = atributosH[index];
			hijo = object.crearNodo(item,arrAttrb,false);
			object.crearNodoTexto(false,'',textos[index],hijo);
			regEdHi.push(hijo);
		});
		padre = object.creaContenedorDos('div','regEdDos','regEdDosL',regEdHi);
		return padre;		
		
	}
	
	function campos(object,num){
		let regEdHi = new Array();
		let arrAttrb,padre,hijo,nieto;
		const nNum = +num;
		let teLa;
		if(nNum < 10){teLa = `#0${nNum}`;}else{teLa = `#${nNum}`;}
		hijo = object.crearNodo('label',[['class','etiqueta'],['id',`lab${num}`]],false);
		object.crearNodoTexto(false,'',teLa,hijo);
		regEdHi.push(hijo);
		let atributosH = new Array([['type','text'],['class','unidad'],['id',`unidad${num}`],['placeholder','Unidad']],
							[['class','rifLetra'],['id',`rifLetra${num}`]],
							[['type','text'],['class','rif'],['id',`rif${num}`],['placeholder','RIF Propietario']],
							[['type','text'],['class','alic'],['id',`alic${num}`],['placeholder','Alícuota']],
							[['type','text'],['class','deuda'],['id',`deuda${num}`],['placeholder','Deuda']],
							[['type','image'],['src','/apiGrafica/imagenes/add_circle.svg'],['class','i04'],['id',`but-${num}`]]);
		let elementosH = new Array('input','select','input','input','input','input');
		let elementosN = new Array(null,null,null,null,null,null);
		let atributosN = new Array(null,null,null,null,null,null);
		elementosH.forEach((item,index,array)=>{
			if(elementosN[index] == null){
				nieto = false;
			} else{
				arrAttrb = atributosN[index];
				nieto = object.crearNodo(elementosN[index],arrAttrb,false);
			}
			arrAttrb = atributosH[index];
			hijo = object.crearNodo(item,arrAttrb,nieto);
			regEdHi.push(hijo);
		});
		padre = object.creaContenedorDos('div','regEdDos',`regEdDos${num}`,regEdHi);
		return padre;
	}
	
	function clika(x){
		eventAsigner.clickAsign(x,'ID',(e)=>{e.target.select();})	
	}

	function miPerfil(){
		const perfil = document.getElementsByTagName('section');
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
			perfil[0].innerHTML = profItems;
			eventAsigner.clickAsign('profileButton','ID',miCuenta);
		} 
	}
	
	function logOut(){  
		const property = pageBehavior.getCookie('property').split(',');
		pageBehavior.logOut(new BackQuery('/logOut',{property}).afirma());
	}
	
	function principal(){
		window.location.assign(pageBehavior.getURL('/micuenta'));
	}
	
	function cargaAdminTools(selID,tabla,indic,port,condicion){
		let admin = new RetrieveDBEgresos('admin_tools');
		admin.retrieveAllTableDataArr(tabla,(r)=>{formAdminTools(r,selID,indic,port,condicion);});
	}
	
	function formAdminTools(r,selID,indic,port,condicion){
		let tipGas = document.getElementById(selID);
		let opcion = document.createElement("option");
		if(port == ''){
			opcion.value = '';
			opcion.text = '';
		}else{
			opcion.value = '';
			opcion.text = port;
		}
		formTemp.sacaHijostres(tipGas);
		tipGas.add(opcion,null);
		r.forEach((item,index,array)=>{
			if(Array.isArray(condicion)){
				if(item[condicion[0]] == condicion[1]){
					opcion = document.createElement("option");
					opcion.value = item[indic[0]];
					opcion.text = item[indic[1]];
					tipGas.add(opcion,null);
				}
			}else{
				opcion = document.createElement("option");
				opcion.value = item[indic[0]];
				opcion.text = item[indic[1]];
				tipGas.add(opcion,null);
			}
		});
	}
	
	function formAdminToolsThree(selID,optIDarr,cas){
		let forPag = document.getElementById(selID);
		let opcion;
		formTemp.sacaHijostres(forPag);
		optIDarr.forEach((item,index,array)=>{
			opcion = document.createElement("option");
			switch(cas){
				case 1:
					opcion.value = item;
					break;
				case 2:
					opcion.value = '';
					break;
			}
			opcion.text = item;
			forPag.add(opcion,null);
		});
	}
	
	async function setCity(idEstado){
		cargaAdminTools('ciudad','telefonos',['id_ciudad','ciudad'],'Ciudad',['id_estado',idEstado]);
		let promise = new Promise((resolve,reject) =>{
			setTimeout(()=> resolve(document.getElementById('ciudad').value),250)
		});
		let result = await promise;
		promise.then((r)=>{
			cargaAdminTools('telI','telefonos',['prefijo_telefonico','prefijo_telefonico'],'Cod',['id_ciudad',r]);
		});
	}
	
	function setPhoneCode(idCiudad){
		cargaAdminTools('telI','telefonos',['prefijo_telefonico','prefijo_telefonico'],'Cod',['id_ciudad',idCiudad]);
	}
	
	function fdosIniciales(){
		const elem = new FormTemp('section');
		const tit = elem.crearNodo('div',[['class','titulo lipro'],['id','paTre']],false);
		elem.crearNodoTexto(false,'','Paso 4: FONDOS INICIALES',tit);
		const fdoIn = elem.crearNodo('form',[['class','fondosIni']],false);
		const inpArr = new Array();
		inpArr[0]=['Dinero total en Bancos','corporate_fare-24px.svg','text','dineroBan',16];
		inpArr[1]=['Dinero en Efectivo','money-24px.svg','text','dineroEfec',16];
		inpArr[2]=['Fondo de Reserva','money-01.svg','text','fondoR',16];
		inpArr[3]=['Cuentas Por Pagar','','text','ctappag',16];
		inpArr[4]=['Cuentas De Provisiones','','text','ctappro',16];
		let fragmento = document.createDocumentFragment();
		let be,imag,lab,inp,txt;
		inpArr.forEach((item,index,array)=>{	
			be = elem.crearNodo('b',[],false);
			elem.crearNodoTexto(false,'',item[0],be);
			imag = elem.crearNodo('img',[['src','/apiGrafica/imagenes/'+item[1]]],false);
			lab = elem.creaContenedor('label','l',[imag,be]);
			fragmento.appendChild(lab);
			inp = elem.crearNodo('input',[['type',item[2]],['id',item[3]],['maxlength',item[4]]],false);
			fragmento.appendChild(inp);
			if(index == 3){
				fragmento.appendChild(document.createElement('hr'));
				fragmento.appendChild(document.createElement('br'));
			}else if(index == 4){
				fragmento.appendChild(document.createElement('br'));
			}
		});
		const aa = elem.crearNodo('button',[['class','guardar'],['id','guardar']],false);
		elem.crearNodoTexto(false,'','Guardar',aa);
		fragmento.appendChild(aa);
		fdoIn.appendChild(fragmento);
		const shup = elem.creaContenedor('div','showup fdoIni',[tit,fdoIn]);
		elem.sacaHijos();
		elem.pareHijo(shup);
		shup.addEventListener('click',(e)=>{formClick(e,shup);});
		pageBehavior.setFocus('dineroBan');
		eventAsigner.submitAssign('fondosIni','CL');
		eventAsigner.formFocusEnterKD('fondosIni','CL');
		eventAsigner.inputAsign('fondosIni','CL','Decimal');
	}
	
	function formClick(e,elemt){
		//elemt.removeEventListener('click',(e)=>{formClick(e,shup);});
		const elem = e.target;
		const clNam = elem.className;
		const idNam = elem.id;
		console.log(clNam);
		switch(clNam){
			case 'guardar':
				if(ingresar('fondosIni')){
					guardaEdificio();
				}
				break;
			case 'botAvDos':
				if(idNam == 'botSI'){
					ingRegistroEdificio();
				}else if(idNam == 'botNO'){
					sessionStorage.clear();
					miCuenta();
				}
				break;
			case 'i04':
				agregaCargo(idNam.split('-')[1]);
				break;
			case 'i05':
				remueveCargo(idNam.split('-')[1]);
				break;
			case 'seguirUno':
				const duracion = document.getElementById('duracion').value;
				if(duracion>0){
					if(ingresar('regJuntCond')){
						//confirmJuntCond();
						sessionStorage.setItem('duracion',duracion);
						fdosIniciales();
					}
				}else{
					alert('El período de duracion de la junta debe ser mayor que 0 meses');
				}
				break;
		}
	}
	
	function guardaEdificio(){
		const shup = new FormTemp('showup fdoIni');
		shup.sacaHijosDos();
		const edificio = getEdifObject('formul');
		const arrRows = [['¿Esta Seguro de registrar'],
						[`el edificio ${edificio.proveedor}`],
						[`RIF: ${edificio.rif}?`]];
		const arrBot = [['botSI','SI'],['botNO','NO']];
		const arrContAtt = [['contUno','coAvEd1'],['subContUno','suCoAvEd1']];
		const avis = avisos.dialogAvisoThree(arrRows,arrBot,arrContAtt);
		shup.pareMasHijos([avis]);
	}
	
	function juntaCondominio(){
		const elemt = new FormTemp('section');
		const paramUno = [['legend',[],'Período',true],
		['label',['for','duracion'],'Duración',true],
		['select',[['id','duracion']],'',false],
		['label',[],'Meses',true]];
		let fragmento = document.createDocumentFragment();
		let elm;
		paramUno.forEach((item,index,array)=>{
			elm = elemt.crearNodo(item[0],item[1],false);
			elemt.crearNodoTextoTres(item[2],elm,item[3]);
			fragmento.appendChild(elm);
		});
		let fieldS = elemt.crearNodo('fieldset',[],fragmento);
		const formatoUno = elemt.crearNodo('div',[['class','regJuntCond']],fieldS);
		fragmento = document.createDocumentFragment();
		const paramDos = [['label',[['for','cargo1'],['class','etiqueta']],'#01',true],
						  ['input',[['type','text'],['class','cargo'],['id','cargo-1'],['placeholder','Ej: Presidente'],['maxlength','30']],'',false],
						  ['input',[['type','image'],['class','i04'],['id','but-1'],['src','/apiGrafica/imagenes/add_circle.svg']],'+',true],
						  ['input',[['type','image'],['class','i05'],['id','rem-1'],['src','/apiGrafica/imagenes/remove_circle.svg']],'+',true]];
		paramDos.forEach((item,index,array)=>{
			elm = elemt.crearNodo(item[0],item[1],false);
			elemt.crearNodoTextoTres(item[2],elm,item[3]);
			fragmento.appendChild(elm);
		});
		const divisZer = elemt.crearNodo('p',[],false);
		elemt.crearNodoTextoTres('Cargo de los miembros:',divisZer,true);
		const divis = elemt.crearNodo('div',[['class','subRegJun'],['id','subRegJun-1']],fragmento);
		const formatoDos = elemt.crearNodo('form',[['class','regJuntCond']],divisZer);
		formatoDos.appendChild(divis);
		const butt = elemt.crearNodo('button',[['class','seguirUno'],['id','seguir']],false);
		elemt.crearNodoTextoTres('Aceptar',butt,true);
		const divisUno = elemt.crearNodo('div',[['class','butRow']],butt);
		formatoDos.appendChild(divisUno);
		const nota = elemt.crearNodo('p',[['class','expl']],false);
		elemt.crearNodoTextoTres('Cargo de cada uno de los miembros que componen la junta de condominio según el documento de condominio.',nota,true);
		const ventana = elemt.crearNodo('div',[['class','showup fdoIni']],nota);
		const notaDos = elemt.crearNodo('p',[['class','expl']],false);
		elemt.crearNodoTextoTres('Por ejemplo: Presidente, Vice-Presidente, Tesorero, Vocal, etc.',notaDos,true);
		ventana.appendChild(notaDos);
		const tit = elemt.crearNodo('div',[['id','paTre'],['class','titulo lipro']],false);
		elemt.crearNodoTextoTres('Paso 3: MIEMBROS DE LA JUNTA DE CONDOMINIO',tit,true);
		ventana.appendChild(tit);
		ventana.appendChild(formatoUno);
		ventana.appendChild(formatoDos);
		elemt.sacaHijos();
		elemt.pareHijo(ventana);
		let numOpt = new Array();
		for(let i=0;i<25;i++){
			numOpt.push([`${i}`,i]);
		}
		formTemp.insertSelOptions('duracion',numOpt);
		eventAsigner.submitAssign('regJuntCond','CL');
		ventana.addEventListener('click',(e)=>{formClick(e,ventana);});
	}
	
	function agregaCargo(n){
		if(n<10){
			const num = Number(n)+1;
			const formato = document.forms[0];
			const ultHij = formato.lastChild;
			const ultCamp = ultHij.previousSibling;
			const flag = ingresarDos(ultCamp.id);
			if(flag){
				formTemp.disabAllElmInDiv(ultCamp.id,'ID',0);
				formTemp.defaultBordC(ultCamp.id,'ID',0);	
				let teLa;
				if(num < 10){teLa = `#0${num}`;}else{teLa = `#${num}`;}
				formato.removeChild(ultHij);
				let fragmento = document.createDocumentFragment();
				const paramUno = [['label',[['for','cargo1'],['class','etiqueta']],teLa,true],
						  ['input',[['type','text'],['class','cargo'],['id',`cargo-${num}`],['placeholder','Ej: Presidente'],['maxlength','30']],'',false],
						  ['input',[['type','image'],['class','i04'],['id',`but-${num}`],['src','/apiGrafica/imagenes/add_circle.svg']],'+',true],
						  ['input',[['type','image'],['class','i05'],['id',`rem-${num}`],['src','/apiGrafica/imagenes/remove_circle.svg']],'+',true]];
				let elemt;
				paramUno.forEach((item,index,array)=>{
					elemt = formTemp.crearNodo(item[0],item[1],false);
					formTemp.crearNodoTextoTres(item[2],elemt,item[3]);
					fragmento.appendChild(elemt);
				});
				const divis = formTemp.crearNodo('div',[['class','subRegJun'],['id',`subRegJun-${num}`]],fragmento);
				formato.appendChild(divis);
				formato.appendChild(ultHij);
			}
		}else{
			alert('No Hay Espacio Para Mas De 10 Miembros');
		}
	}
	
	function remueveCargo(n){
		if(n>1){
			const formato = document.forms[0];
			const ultCamp = formato.lastChild.previousSibling;
			const penultCamp = ultCamp.previousSibling;
			formato.removeChild(ultCamp);
			formTemp.enableAllElmInDiv(penultCamp.id,'ID',0);
			const key = sessionStorage.getItem(ultCamp.id);
			sessionStorage.removeItem(key);
			sessionStorage.removeItem(ultCamp.id);
		}
	}
	
	function confirmJuntCond(){
		let cargo;
		const shup = new FormTemp('showup fdoIni');
		shup.sacaHijosDos();
		const edificio = getEdifObject('formul');
		const arrRows = [['La Junta Directiva'],
						 [`del edificio ${edificio.proveedor}`],
						 [`RIF: ${edificio.rif}`],
						 ['según consta en su documento de condominio'],
						 ['esta constituida por los siguientes cargos:']];
		const cargos = getEdifObject('regJuntCond');
		cargos.forEach((item,index,array)=>{
			cargo = sessionStorage.getItem(item);
			arrRows.push([cargo]);
		});
		const arrBot = [['cargSI','SI'],['cargNO','NO']];
		const arrContAtt = [['contUno','conAvconfJu1'],['subContUno','suCoAvconfJu1']];
		const avis = avisos.dialogAvisoThree(arrRows,arrBot,arrContAtt);
		shup.pareMasHijos([avis]);
	}
	
	