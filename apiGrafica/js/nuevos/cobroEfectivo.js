import{EventAsigner} from './eventAss.js';
import {PageBehavior} from './pageBeha.js';
import {BackQuery} from './backQ.js';
import{TablasMuestras} from './tabMue.js';
import {RetrieveDBEgresos} from './retriDBeg.js';
import{FormTemp} from './formTemp.js';
import {Avisos} from './avisos.js';
import {IndexedDBProcess} from './IDBPro.js';

	var pageBehavior = new PageBehavior();
	var eventAsigner = new EventAsigner();
	var formTemp = new FormTemp();
	var retrieveDB = new RetrieveDBEgresos('admin_tools');
	const codEd = pageBehavior.getCookie('propDoc').split(',')[2];
	const dbName = `edificio_Info-${codEd}`;
	const idbquery = new RetrieveDBEgresos(dbName);
	const jwt = pageBehavior.getCookie('jwt');
	const api = '/consulta/cobro';
	const api2 = '/registro/cobro';
	const avisos = new Avisos();
	
	eventAsigner.windowLoad(()=>{
		const profile = pageBehavior.getCookie('profile');
		const propDoc = pageBehavior.getCookie('propDoc');
		if(profile == ''){logOut();}
		if(propDoc == ''){logOut();}	
		showUpdateAccountForm();
		cargandoResumen();
		const section = document.getElementsByTagName('section')[0];
		section.addEventListener('click',(e)=>{sectionclick(e);});
		section.addEventListener('change',(e)=>{sectionchange(e);});
		section.addEventListener('input', (e)=>{inputMethod(e);});
		section.addEventListener('keypress', (e)=>{pageBehavior.keyDPressEnt(e);});
		const header = document.getElementsByTagName('header')[0];
		header.addEventListener('click',(e)=>{headclicks(e.target);});
	});
	
	function sectionclick(e){
		const elemento = e.target;
		const elmID = elemento.id;
		const tagN = elemento.tagName;
		const tgCL = elemento.className;
		let flag = true;
		if(tagN.toLowerCase() == 'input'){
			if(e.target.type == 'month'){flag = false;}
			if(e.target.type == 'date'){flag = false;}
		}
		if(flag){e.preventDefault();}
		//console.log(tgCL,elmID,tagN);
		switch(elmID){
			case 'b0':
			case 'profileButton':
				cargadoPagina(e);
				break;
			case 'boton b1':
			case 'GUI-5-Atras':
			case 'end-1-Negativo':
				generarNuevoAv(e);
				break;
			case 'GUI-2-Siguiente-1':
			case 'GUI-2-Siguiente-2':
			case 'GUI-6-Atras':
				generarNuevoAvDos(e);
				break;
			case 'GUI-2-gasto-OFF':
			case 'SUB-GUI-5-reserva-OFF':
				resumenGastoON(e);
				break;
			case 'GUI-2-gasto-ON':
				resumentGastoOFF(e);
				break;
			case 'vencimiento':
			case 'fechaB':
				cambioatributoUno(e);
				break;
			case 'GUI-5-Adelante-1':
			case 'fork-1-NO':
				previsualizar(e);
				break;
			case 'GUI-6-Detalles':
			case 'GUI-6-Recibo':
			case 'GUI-7-Detalles':
			case 'GUI-7-Recibo':
				muestraDetalles(e);
				break;
			case 'GUI-6-Generar':
				dialogoAviUnoEnv(e);
				break;
			case 'fork-1-SI':
				generarrecibo(e);
			break;
			case 'end-1-Afirmativo':
				updateAdm(e);
			break;
			case 'GUI-7-Cerrar':
				cerrarIFrame(e);
			break;
		}
		switch(tgCL){
			case 'GUI-2-mas':
				agregaMasProvisiones(e);
				break;
			case 'GUI-2-menos':
				eliminarLaProvision(e);
				break;
			case 'monat':
				mostrarReciboEmitido(e);
			break;
		}
		if(tagN.toLowerCase() == 'input'){
			if(elemento.type == 'text'){
				elemento.select();
			}
		}
		
	}
	
	function cambioatributoUno(e){
		const elm = e.target;
		if(elm.type == 'text'){
			elm.value = '';
			elm.removeAttribute('type');
			elm.setAttribute('type','date');
		}
	}
	
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
	
	function sectionchange(e){
		const elmID = e.target.id;
		const tagN = e.target.tagName;
		const tgCL = e.target.className;
		switch(elmID){
			case 'fechaB':
				totalGastos(e);
				break;
		}
		switch(tgCL){
			case 'monto':
				cambiaMontoProvision(e);
				break;
			case 'tipoGasto':
				tipoGastoChange(e);
				break;
		}
	}
	
	function inputMethod(e){
		const elmID = e.target.id;
		const tagN = e.target.tagName;
		const tgCL = e.target.className;
		//console.log(tagN,tgCL,elmID);
		switch(tgCL){
			case 'monto':
				eventAsigner.decimalInput(e);
				break;
		}
		switch(elmID){
			case 'SUB-GUI-5-porcfr':
				eventAsigner.decimalInput(e);
				porcARecuperar(e);
				break;
			case 'SUB-GUI-5-pAFR':
				eventAsigner.decimalInput(e);
				porcAplicar(e);
				break;
		}
	}
	
	function logOut(){  
		const property = pageBehavior.getCookie('property').split(',');
		pageBehavior.logOut(new BackQuery('/logOut',{property}).afirma());
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
			//perfil[0].style.display='block';
			perfil[0].innerHTML = profItems;
		} 
	}
	
	function principal(){
		window.location.assign(pageBehavior.getURL('/micuenta'));
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
		titulo.innerHTML = nombre;
	}

	function logeado(nombre){
		const contMen = [['Mi Perfil','miPer'],['Cerrar Sesión','loOt']];
		const contOpt = [['Administrador','princ']];
		pageBehavior.logHeaderOne(nombre,contMen,contOpt);
	}
	
	//GUI-1
	function cargadoPagina(e){
		let hermanos,padre,nv,atributos,arrAttrb,hijo;
		const elm = e.target;
		padre = elm.parentElement;
		if(elm.id == 'profileButton'){nv = 2;}
		if(elm.id == 'b0'){nv = 1;}
		for(let i =0;i<nv;i++){padre = padre.parentElement;}
		const seccion = padre;
		const navCont = cargadoNav(); //SUB-GUI-1
		const showup = cargadoShowupUno(); //SUB-GUI-2
		while(seccion.hasChildNodes()){seccion.removeChild(seccion.lastChild);}
		seccion.appendChild(navCont);
		seccion.appendChild(showup);
		cargadoHistoricos(); //SUB-GUI-3
		cargandoResumen(); //SUB-GUI-4
	}
	
	//SUB-GUI-1
	function cargadoNav(){
		let hermanos,arrAttrb,hijo,parent,atributos;
		hermanos = document.createDocumentFragment();
		atributos = new Array(['icon i00','/apiGrafica/imagenes/i-aviso.png','botonIzq','b0',false,'','AVISO DE COBRO'],
									['icon i01','/apiGrafica/imagenes/add_circle.svg','boton b1','boton b1','br','GENERAR NUEVO','Aviso de Cobro'],
									['icon i02','/apiGrafica/imagenes/modify-24px.svg','boton b2','boton b2','br','MODIFICAR','Aviso de Cobro']);
		atributos.forEach((item,index,array)=>{
			arrAttrb = [['class',item[0]],['src',item[1]]];
			hijo = formTemp.crearNodo('img',arrAttrb,false);
			arrAttrb = [['class',item[2]],['id',item[3]],['href','javascript:void(0)']];
			parent = formTemp.crearNodo('a',arrAttrb,hijo);
			formTemp.crearNodoTexto(item[4],item[5],item[6],parent);
			hermanos.appendChild(parent);				
		})		
		const navCont = formTemp.crearNodo('nav',[['class','navig']],hermanos);
		return navCont;
	}
	//SUB-GUI-2
	function cargadoShowupUno(){
		let showup,hermanos,atributos,arrAttrb,parent;
		hermanos = document.createDocumentFragment();
		atributos = null;
		atributos = [['titulo','HISTÓRICO - AVISOS DE COBRO'],
					['titulo3','ÚLTIMOS 3 MESES'],
					['resumenAC',''],
					['titulo2','REALIZAR BÚSQUEDA AVANZADA'],
					['resumenAC 2','']];
		atributos.forEach((item,index,array)=>{
			arrAttrb = [['class',item[0]]];
			parent = formTemp.crearNodo('div',arrAttrb,false);
			formTemp.crearNodoTexto(false,'',item[1],parent);
			hermanos.appendChild(parent);
		})
		arrAttrb = [['class','showup'],['id','summary']];
		showup = formTemp.crearNodo('div',arrAttrb,hermanos);
		return showup
	}
	//SUB-GUI-3
	function cargadoHistoricos(){
		let hermanos, atributos,arrAttrb,hijo;
		hermanos = document.createDocumentFragment();
		atributos = ['mActual','mAnterior','mAAnterior'];
		/*
		atributos.forEach((item,index,array)=>{
			arrAttrb = [['class',item]];
			hijo = formTemp.crearNodo('div',arrAttrb,false);
			hermanos.appendChild(hijo);
		});
		
		*/
		const resumenAC = document.getElementsByClassName('resumenAC')[0];
		//resumenAC.appendChild(hermanos);
		
		hermanos = document.createDocumentFragment();
		arrAttrb = [['id','nombre'],['type','month'],['name','mes'],['step','1'],['min','2020-19'],['max','2030-20'],['value','']];
		hijo = formTemp.crearNodo('input',arrAttrb,false);
		hermanos.appendChild(hijo);
		arrAttrb = [['id','buscar'],['type','submit'],['name','enviar'],['value','buscar']];
		hijo = formTemp.crearNodo('input',arrAttrb,false);
		hermanos.appendChild(hijo);
		const formulario = formTemp.crearNodo('form',[['class','busMes']],hermanos);
		const resumenACDos = document.getElementsByClassName('resumenAC 2')[0];
		resumenACDos.appendChild(formulario);
	}

	//SUB-GUI-4
	function cargandoResumen(){
		let nodo,div,txt,primdc,inp;
		const resumenAC = document.getElementsByClassName('resumenAC')[0];
		idbquery.retrieveAllTableDataArr('rec_cobro',(r)=>{
			primdc = r.length - 3;
			if(primdc < 0){primdc = 0;}
			for(let i = primdc; i < r.length; i++){
				txt = document.createTextNode(`Recibo ${r[i]['control'].padStart(3, '0')}`);
				div = formTemp.crearNodo('div',[['class','monat'],['id',`monat-${i}`]],txt);
				inp = formTemp.crearNodo('input',[['type','hidden'],['id',`rec-${i}`],['value',JSON.stringify(r[i])]],false);
				div.appendChild(inp);
				resumenAC.appendChild(div);
			}
		});
	}
	
	//GUI-2-1
	function generarNuevoAv(e){
		const elm = e.target;
		let padre = elm.parentElement;
		let n,mod,fechas,provisiones,infoDiv,fe,total;
		const part2 = ['SUB-GUI-5-porcfr','forerecupera','notaPP','fondoreserva'];
		const part3 = ['SUB-GUI-5-pAFR','pAplFRmir','paPorMir'];
		const vares2 = new Array();
		const parteDos = new Object(); //datos de la segunda pagina
		const porcaplic = new Object(); //datos de la segunda pagina
		switch(elm.id){
			case 'boton b1':
				n = 1;
				mod = 0;
				break;
			case 'GUI-5-Atras':
			case 'end-1-Negativo':
				n = 4;
				mod = 1;
				part2.forEach(item => {parteDos[item] = document.getElementById(item).value;});
				part3.forEach(item => {porcaplic[item] = document.getElementById(item).value;});
				break;
		}
		for(let i=0;i<n;i++){padre = padre.parentElement;}
		const shup = padre.lastElementChild;
		switch(mod){
			case 0:
				vares2[0] = 'date';
				vares2[1] = '';
				vares2[3] = '';
				vares2[4] = 'none';
				vares2[5] = 'none';
				vares2[6] = 'Subtotal Gastos $ 0.00';
				vares2[7] = false;
				vares2[8] = '';
				vares2[9] = '$ 0.00';
				vares2[10] = '0';
				vares2[11] = 'GUI-2-Siguiente-1';
				vares2[13] = '';
				break;
			case 1:
				infoDiv = shup.lastElementChild.childNodes;
				fechas = JSON.parse(infoDiv[0].value);
				provisiones = JSON.parse(infoDiv[1].value);
				vares2[0] = 'text';
				fe = fechas['vencimiento'].split('-');
				vares2[1] = `${fe[2]}/${fe[1]}/${fe[0]}`;
				fe = fechas['fechaB'].split('-');
				vares2[3] = `${fe[2]}/${fe[1]}/${fe[0]}`;
				vares2[4] = fechas['gastos'];
				vares2[5] = fechas['fondoreserva'];
				total = 0;
				const sum = fechas['gastos'].split('*');
				sum.forEach(item => {total += +(item.split('$')[1]);});
				vares2[6] = `Subtotal Gastos $ ${total.toFixed(2)}`;
				vares2[7] = true;
				vares2[8] = provisiones;
				total = 0;
				provisiones.forEach(item => {total += +item['monto'];});
				vares2[9] = `$ ${total.toFixed(2)}`;
				vares2[10] = total.toFixed(2);
				vares2[11] = 'GUI-2-Siguiente-2';
				//vares2[13] = document.getElementById('parteTres').value;
				break;
		}
		while(shup.hasChildNodes()){shup.removeChild(shup.lastChild)}
		vares2[12] = parteDos;
		vares2[13] = porcaplic;
		generarformularioDos(shup,vares2);
	}
	
	//GUI-2-2
	function generarformularioDos(shup,vares2){
		let img,arrAttr,div,txt,fragmento,hijos,nodUno;
		let atirbOn,inp,divInt,neufil,num;
		arrAttr = [['src','/apiGrafica/imagenes/add_circle.svg'],['class','icon i01']];
		img = formTemp.crearNodo('img',arrAttr,false);
		txt = document.createTextNode('GENERAR NUEVO - AVISO DE COBRO');
		div = formTemp.crearNodo('div',[['class','titulo']],img);
		div.appendChild(txt);
		shup.appendChild(div);
		hijos = new Array();
		/* NODOS DE FECHAS*/
		fragmento = document.createDocumentFragment();
		const hoy = pageBehavior.getFechaHoyNum();
		const vares = new Array();
		vares[0] = ['id','emision'];
		vares[1] = ['type','text'];
		vares[2] = ['value',`${hoy[2]}/${hoy[1]}/${hoy[0]}`];
		vares[3] = ['disabled','true'];
		nodUno = new Array ([['texto','Fecha de Emisión'],
							 ['input',[vares[0],vares[1],vares[2],vares[3]]]]);
		div = formTemp.crearNodo('div',[['class','fev']],crearFragmentoUno(nodUno));
		fragmento.appendChild(div);
		vares[4] = ['id','vencimiento'];
		vares[5] = ['type',vares2[0]];
		vares[6] = ['min','2021-01-01'];
		vares[7] = ['max','2030-12-31'];
		vares[8] = ['value',vares2[1]];
		nodUno = new Array ([['texto','Fecha de Vencimiento'],
							 ['input',[vares[4],vares[5],vares[6],vares[7],vares[8]]]]);
		div = formTemp.crearNodo('div',[['class','fev']],crearFragmentoUno(nodUno));
		fragmento.appendChild(div);
		hijos.push(fragmento);
		/* NODO P*/
		nodUno = new Array ([['p',[]]]);
		hijos.push(crearFragmentoUno(nodUno));
		/* NODOS DE INTERVALOS DE  FECHA TOPE*/
		vares[9]  = ['id','fechaB'];
		vares[10]  = ['type',vares2[0]];  
		vares[11] = ['min','2021-01-01'];
		vares[12] = ['max','2030-12-31'];
		vares[13] = ['value',vares2[3]];
		vares[14] = ['id','GUI-2-gasto-OFF'];
		vares[15] = ['src','/apiGrafica/imagenes/down_chevron.svg'];
		vares[16] = ['id','gastos'];
		vares[17] = ['type','hidden'];
		vares[18] = ['value',vares2[4]]; 
		vares[19] = ['id','fondoreserva'];
		vares[20] = ['type','hidden'];
		vares[21] = ['value',vares2[5]];
		/*vares[22] = ['id','parteTres'];
		vares[23] = ['type','hidden'];
		vares[24] = ['value',vares2[13]];*/
		nodUno = new Array ([['input',[vares[9],vares[10],vares[11],vares[12],vares[13]]],
							 ['label',[['id','montoA']]],  
							 ['img',[vares[14],vares[15]]],
							 ['input',[vares[16],vares[17],vares[18]]],
							 ['input',[vares[19],vares[20],vares[21]]]/*,
							 ['input',[vares[22],vares[23],vares[24]]]*/]);
		hijos.push(crearFragmentoUno(nodUno));
		/* NODO DE SUBTITULO*/
		nodUno = new Array ([['p',[]]]);
		hijos.push(crearFragmentoUno(nodUno));
		/* PROVISIONES */
		if(vares2[7]){ //SI VENIMOS RETROCEDIENDO
			const arrFrag = document.createDocumentFragment();
			num = 0;
			vares2[8].forEach((item,index) => {
				nodUno = colCampProv(index);
				neufil = nodUno.childNodes;		
				neufil[0].value = item['provision'];
				neufil[0].disabled = true;
				neufil[1].value = item['monto'];
				neufil[1].disabled = true;
				neufil[2].removeChild(neufil[2].lastChild);
				neufil[2].appendChild(new Option(item['nombreGasto'],item['tipoGasto']))
				neufil[2].disabled = true;
				neufil[3].disabled = true;
				neufil[4].disabled = false;
				neufil[5].value = item['nombreGasto'];
				arrFrag.appendChild(nodUno);
				num++;
			});
			arrFrag.appendChild(colCampProv(num));
			divInt = arrFrag;	
		}else{//SI VENIMOS POR PRIMERA VEZ
			divInt = colCampProv(0);
		}
		hijos.push(divInt);
		/* TOTAL PROVISIONES*/
		nodUno = new Array ([['label',[]],
							 ['label',[]],
							 ['input',[['type','hidden'],['id','promir'],['value','0']]]]);
		hijos.push(crearFragmentoUno(nodUno));
		/* BOTON*/
		fragmento = document.createDocumentFragment();
		txt = document.createTextNode('Siguiente');
		atirbOn = [['id',vares2[11]],[ 'href','javascript:void(0)']]; 
		inp = formTemp.crearNodo('a',atirbOn,txt);
		fragmento.appendChild(inp);
		hijos.push(fragmento);
		fragmento = document.createDocumentFragment();
		/* FILAS DE LA INTERFAZ*/
		arrAttr = new Array(
							['div',[['class','fEmision']]],
							['div',[['class','texto uno']]],
							['div',[['class','rFechas']]],
							['div',[['class','texto dos']]],
							['form',[['class','formProv']]],
							['div',[['class','provresult']]],
							['div',[['class','botonG uno']]]);
		
		arrAttr.forEach((item,index)=>{
			inp = formTemp.crearNodo(item[0],item[1],hijos[index]);
			fragmento.appendChild(inp);
		});
		/* TEXTOS COMPLEMENTARIOS*/
		const formAC = formTemp.crearNodo('div',[['class','formularioAC']],fragmento);
		shup.appendChild(formAC);
		const ultFoChID = formAC.childNodes[4].lastChild.childNodes[2].id;
		tipoGastoUno(ultFoChID,['contabilidad','grupo','tres']);
		tipoGastoUno(ultFoChID,['contabilidad','grupo','Cuatro']);
		formAC.childNodes[1].childNodes[0].innerText = 'Relacionar gastos realizados hasta la fecha:';
		formAC.childNodes[2].childNodes[1].innerText = vares2[6]; 
		formAC.childNodes[3].childNodes[0].innerText ='Provisiones del período';
		formAC.childNodes[5].childNodes[0].innerText = 'Subtotal Provisiones';
		formAC.childNodes[5].childNodes[1].innerText = vares2[9];
		/* NODO DE INFORMACION PARTES SIGUIENTES si venimos retrocediendo*/
		if(vares2[7]){
			shup.appendChild(nodoInformacion([['partedos',vares2[12]],['porcaplic',vares2[13]]]));
		}
	}

	
	function nodoInformacion(arrTrab){
		/* nodos de informacion*/
		let arrAttrb,elm;
		const infodiv = formTemp.crearNodo('div',[['class','infoDiv']],false);
		const nodInf = new Array();
		arrTrab.forEach(item => { 
			nodInf.push([item[0],JSON.stringify(item[1])]);
		});
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			elm = formTemp.crearNodo('input',arrAttrb,false);
			infodiv.appendChild(elm);
		});
		return infodiv;
	}
	
	function tipoGastoChange(e){
		const elem = e.target;
		const selID = elem.id;
		const padre = elem.form;
		const num = selID.split('-')[1];
		const tipoGasto = padre[`tipoGasto-${num}`];
		const nombreGasto = padre[`nombreGasto-${num}`];
		if(nombreGasto != undefined){
			nombreGasto.value = tipoGasto.selectedOptions[0].innerText;
		}
	}
	
	function agregaMasProvisiones(e){
		let flag,total = 0;
		const elm = e.target;
		const padre = elm.parentElement.parentElement;
		const hno = elm.nextSibling;
		const elmID = elm.id;
		const num = +(elmID.split('-')[3])+1;
		const tipoGasto = elm.previousSibling;
		const monto = tipoGasto.previousSibling;
		const provision = monto.previousSibling;
		const objAfl = formTemp.checkEmptyElem(elm.form);
		const secObj = objAfl[0];
		flag = objAfl[1];	
		if(flag){
			const divInt = colCampProv(num);
			padre.appendChild(divInt);
			tipoGastoUno(`tipoGasto-${num}`,['contabilidad','grupo','tres']);
			tipoGastoUno(`tipoGasto-${num}`,['contabilidad','grupo','Cuatro']);
			elm.disabled = true;
			tipoGasto.disabled = true;
			monto.disabled = true;
			provision.disabled = true;
			hno.disabled = false;
			// CALCULO DEL TOTAL
			for(let i = 0; i < num; i++){total += +(secObj[`monto-${i}`]);}
			padre.nextSibling.childNodes[1].innerText = `$ ${total.toFixed(2)}`;
			padre.nextSibling.childNodes[2].value = total;
		}
	}
	
	function colCampProv(num){
		const vares = new Array();
		vares[0]  = ['class','provision'];
		vares[1]  = ['id',`provision-${num}`];
		vares[2]  = ['type','text'];
		vares[3]  = ['placeholder','Ej. Estimado Vigilancia'];
		vares[4]  = ['class','monto'];
		vares[5]  = ['id',`monto-${num}`];
		vares[6]  = ['type','text'];
		vares[7]  = ['placeholder','$ 0,00'];
		vares[8]  = ['maxlength','16'];
		vares[9]  = ['class','tipoGasto'];
		vares[10] = ['id',`tipoGasto-${num}`];
		vares[11] = ['Tipo de Gasto',''];
		vares[12] = ['class','GUI-2-mas'];
		vares[13] = ['id',`GUI-2-mas-${num}`];
		vares[14] = ['type','image'];
		vares[15] = ['src','/apiGrafica/imagenes/add_circle.svg'];
		vares[16] = ['value','none'];
		vares[17] = ['class','GUI-2-menos'];
		vares[18] = ['id',`GUI-2-menos-${num}`];
		vares[19] = ['type','image'];
		vares[20] = ['src','/apiGrafica/imagenes/remove_circle.svg'];
		vares[21] = ['disabled','true'];
		vares[22] = ['value','none'];
		vares[23] = ['class','nombreGasto'];
		vares[24] = ['id',`nombreGasto-${num}`];
		vares[25] = ['type','hidden'];
		vares[26] = ['value',''];
		vares[27] = ['class','supromir'];
		vares[28] = ['id',`supromir-${num}`];
		vares[29] = ['type','hidden'];
		vares[30] = ['value','0']
		const nodUno = new Array ([['input',[vares[0],vares[1],vares[2],vares[3]]]],
	[['input',[vares[4],vares[5], vares[6],vares[7],vares[8]]],['select',[[vares[9],vares[10]],[vares[11]]]]],
							[['input',[vares[12],vares[13],vares[14],vares[15],vares[16]]]],
							[['input',[vares[17],vares[18],vares[19],vares[20],vares[21],vares[22]]]],
							[['input',[vares[23],vares[24],vares[25],vares[26]]]],
							[['input',[vares[27],vares[28],vares[29],vares[30]]]]);
		const atirbOn = [['class','subFormProv']];
		const divInt = formTemp.crearNodo('div',atirbOn,crearFragmentoUno(nodUno));
		return divInt;
	}
	
	function eliminarLaProvision(e){
		let numCol,obj,filn,fil2,ind,col2,index2;
		const elm = e.target;
		const padre = elm.parentElement.parentElement;
		const hno = elm.nextSibling;
		const elmID = elm.id;
		const num = +(elmID.split('-')[3]);
		const tipoGasto = elm.previousSibling;
		const monto = tipoGasto.previousSibling;
		const provision = monto.previousSibling;
		//se toman los valores de los inputs con un objeto
		let formul = elm.form;
		const numFil = formul.childNodes.length-1;
		const filas = new Array();
		for(let i = 0;i < numFil;i++){
			filn = formul.childNodes[i].childNodes;
			numCol = filn.length;
			obj = new Object();
			for(let j = 0; j < numCol; j++){obj[`${filn[j].className}`] = filn[j].value;}
			filas.push(obj);
		}
		//se retira la fila
		filas.splice(num,1);
		padre.removeChild(padre.childNodes[num]);
		//se renombran los atributos
		index2 = 0;
		let total=0;
		filas.forEach((item,index) => {
			fil2 = formul.childNodes[index].childNodes;
			ind = 0;
			for(const[key,value] of Object.entries(item)){
				col2 = fil2[ind];
				col2.removeAttribute('id');
				col2.setAttribute('id',`${key}-${index}`);
				col2.value = value;
				if(key == 'monto'){total+= +(value);}
				ind++;
			}
			index2++;
		});
		const ultfilNs = formul.childNodes[index2].childNodes;
		for (let i =0;i < ultfilNs.length;i++){
			ultfilNs[i].removeAttribute('id');
			ultfilNs[i].setAttribute('id',`${ultfilNs[i].className}-${index2}`);
		}
		//se coloca el total
		padre.nextSibling.childNodes[1].innerText = `$ ${total.toFixed(2)}`;
		padre.nextSibling.childNodes[2].value = total;
	}
	
	//gastos para el recibo
	function totalGastos(e){
		let acum,acum2,entr,ind;
		const elm = e.target;
		const hno = elm.nextSibling;
		const grd = hno.nextSibling.nextSibling;
		const fecha = elm.value;
		const saiAsig = 'gastostotal';
		const object = {fecha,codEd,jwt,saiAsig};
		const respuesta = new BackQuery(api,object).getServDatPO();
		respuesta.then((r) => {
			entr = Object.entries(r['gastos']);
			ind = 0;
			acum = 0;
			acum2 = '';
			for(const[key,value] of entr){
				acum += +(value);
				acum2 += `${key}#$ ${value}`;
				if(ind != entr.length-1){acum2 += '*';};
				ind ++;
			}
			hno.innerText = `Subtotal Gastos $ ${acum.toFixed(2)}`;
			grd.value = acum2;
			entr = Object.entries(r['fondoreserva']);
			ind = 0;
			acum = 0;
			acum2 = '';
			for(const[key,value] of entr){
				acum += +(value);
				acum2 += `${key}#$ ${value}`;
				if(ind != entr.length-1){acum2 += '*';};
				ind ++;
			}
			grd.nextSibling.value = acum2;
		});
		
	}
	
	
	//resumen por gasto
	function resumenGastoON(e){
		let col,scta,txt,lab;
		const elm = e.target;
		const padre = elm.parentElement;
		const hno = elm.nextSibling;
		if(hno.value != 'none'){
			const ctas = hno.value.split('*');
			const fila = document.createElement('div');
			fila.setAttribute('class','rgfil');
			ctas.forEach(item => {
				scta = item.split('#');
				col = document.createElement('div');
				col.setAttribute('class','rgcol');
				scta.forEach(it => {
					txt = document.createTextNode(it);
					lab = formTemp.crearNodo('label',[],txt);
					col.appendChild(lab);	
				});
				fila.appendChild(col);
			});
			padre.appendChild(fila);
			elm.removeAttribute('id');
			elm.removeAttribute('src');
			elm.setAttribute('id','GUI-2-gasto-ON');
			elm.setAttribute('src','/apiGrafica/imagenes/up_chevron.svg');
		}
	}
	
	function resumentGastoOFF(e){
		const elm = e.target;
		const padre = elm.parentElement;
		padre.removeChild(padre.lastChild);
		elm.removeAttribute('id');
		elm.removeAttribute('src');
		elm.setAttribute('id','GUI-2-gasto-OFF');
		elm.setAttribute('src','/apiGrafica/imagenes/down_chevron.svg');
	}
	
	//SUB-GUI-5
	function generarNuevoAvDos(e){
		let elm2,elm3,val,filn,numCol,obj,hijos,arrAttrb;
		let padre,inp,fragmento,txt,nodUno,atirbOn,flag,fechas;
		let n,parteDos,variabl,flag2,provisiones,porcaplic;
		const paso = new Array();
		const elm = e.target;
		padre = elm.parentElement;
		const elmID = elm.id;
		for(let i =0;i < 1; i++){padre = padre.parentElement;}
		switch(elmID){
			case 'GUI-2-Siguiente-1':
				n = 1;
				padre = padre.parentElement;
				parteDos = {'SUB-GUI-5-porcfr':'0.00','forerecupera':'0.00','notaPP':''}
				variabl = ['emision','vencimiento','fechaB','gastos','fondoreserva'];
				fechas = new Object();
				flag2 = true;
				provisiones = new Array();
				porcaplic = {'SUB-GUI-5-pAFR':'0.00','pAplFRmir':'0.00','paPorMir':'0.00'};
				break;
			case 'GUI-2-Siguiente-2':
				n = 2;
				padre = padre.parentElement;
				parteDos = JSON.parse(padre.childNodes[2].childNodes[0].value);
				variabl = ['emision','vencimiento','fechaB','gastos','fondoreserva'];
				fechas = new Object();
				flag2= true;
				provisiones = new Array();
				porcaplic = JSON.parse(padre.childNodes[2].childNodes[1].value);
				break;
			case 'GUI-6-Atras':
				n = 3;
				variabl = [];
				paso[0] = 'SI';
				parteDos = JSON.parse(padre.childNodes[3].childNodes[2].value);
				fechas = JSON.parse(padre.childNodes[3].childNodes[0].value);
				flag2 = false;
				provisiones = JSON.parse(padre.childNodes[3].childNodes[1].value);
				porcaplic = JSON.parse(padre.childNodes[3].childNodes[3].value);
				break;
		}	

		for(let i = 0;i < variabl.length;i++){
			elm2 = document.getElementById(`${variabl[i]}`);
			val = elm2.value;
			if(val == ''){
				elm2.style='border-color:red';
				paso.push('NO');
			}else{
				elm2.style='border-color:default';
			if((i ==1 || i == 2) && val.includes('/')){
				elm3 = val.split('/');
				fechas[`${elm2.id}`] = `${elm3[2]}-${elm3[1]}-${elm3[0]}`;
			}else{
				fechas[`${elm2.id}`] = val;
			}
				paso.push('SI');
			}
		}
		if(paso.includes('NO')){
			setTimeout(()=>{alert('Rellene los Campos Marcados en Rojo')},50);
		}else{
			//se toman los valores de los inputs con un objeto
			if(flag2){
				const formul = elm.parentElement.previousSibling.previousSibling;
				const numFil = formul.childNodes.length;
				for(let i = 0;i < numFil;i++){
					filn = formul.childNodes[i].childNodes;
					numCol = filn.length;
					obj = new Object();
					flag = true;
					for(let j = 0; j < numCol; j++){
						if(filn[j].value == ''){
							flag = false;
							break;
						}else{
							obj[`${filn[j].className}`] = filn[j].value;
						}
					}
					if(flag){//los campos del renglon estan llenos
						provisiones.push(obj);
					}
				}
			}
			const arrTrab = [['fechas',fechas],['provisiones',provisiones]];
			const infodiv = nodoInformacion(arrTrab);
			for(let i = 0;i < n; i++){padre.removeChild(padre.lastElementChild);}
			//Nueva sub interfaz grafica
			hijos = new Array();
			const vares = new Array();
			//filas de recuperacion de fondo reserva
			nodUno = new Array ([['p',[]]]);
			hijos.push(crearFragmentoUno(nodUno)); //0
			vares[0]  = ['id','SUB-GUI-5-porcfr'];
			vares[1]  = ['type','text'];
			vares[2]  = ['maxlength','6'];
			vares[3]  = ['value',parteDos['SUB-GUI-5-porcfr']];
			vares[4]  = ['id','SUB-GUI-5-reserva-OFF'];
			vares[5]  = ['src','/apiGrafica/imagenes/down_chevron.svg'];
			vares[6]  = ['id','fondoreserva'];
			vares[7]  = ['type','hidden'];
			vares[8]  = ['value',fechas['fondoreserva']];
			vares[9]  = ['id','forerecupera'];
			vares[10] = ['type','hidden'];
			vares[11] = ['value',parteDos['forerecupera']];
			nodUno = new Array ([
								['input',[vares[0],vares[1],vares[2],vares[3]]],
								['label',[['id','porc']]],
								['label',[['id','totfondre']]],
								['img',[vares[4],vares[5]]],
								['input',[vares[6],vares[7],vares[8]]],
								['input',[vares[9],vares[10],vares[11]]]]);
			hijos.push(crearFragmentoUno(nodUno)); //1

			//fila para aplicar fondo de reserva
			const vares3 = new Array();
			nodUno = new Array ([['p',[]]]);//2
			hijos.push(crearFragmentoUno(nodUno));
			vares3[0] = ['id','SUB-GUI-5-pAFR'];
			vares3[1] = ['type','text'];
			vares3[2] = ['maxlength','6'];
			vares3[3] = ['value',porcaplic['SUB-GUI-5-pAFR']];
			vares3[4] = ['id','pAplFRmir'];
			vares3[5] = ['type','hidden'];
			vares3[6] = ['value',porcaplic['pAplFRmir']];
			vares3[7] = ['id','paPorMir'];
			vares3[8] = ['type','hidden'];
			vares3[9] = ['value',porcaplic['paPorMir']];
			vares3[10] = ['id','gastos2'];
			vares3[11] = ['type','hidden'];
			vares3[12] = ['value',`${fechas['gastos']}`];
			vares3[13] = ['id','provi2'];
			vares3[14] = ['type','hidden'];
			vares3[15] = ['value',`${JSON.stringify(provisiones)}`];

			nodUno = new Array ([
								['input',[vares3[0],vares3[1],vares3[2],vares3[3]]],
								['label',[['id','porc2']]],
								['label',[['id','totAcarg']]],
								['input',[vares3[4],vares3[5],vares3[6]]],
								['input',[vares3[7],vares3[8],vares3[9]]],
								['input',[vares3[10],vares3[11],vares3[12]]],
								['input',[vares3[13],vares3[14],vares3[15]]]]);
			hijos.push(crearFragmentoUno(nodUno));//3

			//fila del pie de pagina
			nodUno = new Array ([['p',[]]]);
			hijos.push(crearFragmentoUno(nodUno));//4

			vares[12] = ['class','anotaciones'];
			vares[13] = ['id','notaPP'];
			vares[14] = ['rows','4'];
			vares[15] = ['cols','40'];
			vares[16] = ['placeholder','Escribe aquí las notas a colocar en el pié de página del Aviso de Cobro'];
			nodUno = new Array ([['textarea',[vares[12],vares[13],vares[14],vares[15],vares[16]]]]);
			hijos.push(crearFragmentoUno(nodUno));//5

			// BOTONES
			nodUno = new Array ([['button',[['id','GUI-5-Atras']]],
			['button',[['id','GUI-5-Adelante-1']]]]);
			hijos.push(crearFragmentoUno(nodUno));//6

			fragmento = document.createDocumentFragment();
			const arrAttr = new Array(
								['div',[['class','facfil']]], //0
								['div',[['class','facfil']]], //1
								['div',[['class','facfil']]], //2
								['div',[['class','facfil']]],  //3
								['div',[['class','facfil']]], //4
								['div',[['class','facfil']]],  //5
								['div',[['class','facfil']]]);  //6
		
			arrAttr.forEach((item,index)=>{
				inp = formTemp.crearNodo(item[0],item[1],hijos[index]);
				fragmento.appendChild(inp);
			});
			const formAC = formTemp.crearNodo('div',[['class','subFormulario2']],fragmento);
			const formularioAC = formTemp.crearNodo('div',[['class','formulario2']],formAC);
			padre.appendChild(formularioAC);
			padre.appendChild(infodiv);
			formAC.childNodes[0].childNodes[0].innerText = '% a Recuperar de lo Utilizado del Fondo de Reseva';
			formAC.childNodes[1].childNodes[1].innerText = '%';
			formAC.childNodes[1].childNodes[2].innerText = `Total a Recuperar $ ${parteDos['forerecupera']}`;
			formAC.childNodes[2].childNodes[0].innerText = '% De Los Gastos Para El Fondo De Reserva';
			formAC.childNodes[3].childNodes[1].innerText = '%';
			formAC.childNodes[3].childNodes[2].innerText = `Cargo para el Fondo De Reserva $ ${porcaplic['pAplFRmir']}`;
			formAC.childNodes[4].childNodes[0].innerText = 'Notas de pié de página en el Aviso de Cobro';
			formAC.childNodes[5].childNodes[0].innerText = parteDos['notaPP'];
			formAC.lastChild.firstChild.innerText = 'Atras';
			formAC.lastChild.lastChild.innerText = 'Previsualizar';	
		}	
	}
	
	function crearFragmentoUno(nodUno){
		let fragmento,elm1;
		fragmento = document.createDocumentFragment();
		nodUno.forEach((item)=>{
			item.forEach(it =>{
				if(it[0] == 'select'){
					elm1 = formTemp.createSelect(it[1][0],it[1][1]);
				}else if(it[0] == 'texto'){
					elm1 = document.createTextNode(it[1]);
				}else{
					elm1 = formTemp.crearNodo(it[0],it[1],false);
				}
				fragmento.appendChild(elm1);
			});
		});
		return fragmento;
	}
	
	function tipoGastoUno(selID,datIDDB){
		retrieveDB.retriMultDataByIdex(datIDDB[0],datIDDB[1],datIDDB[2],(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[3]}`],item[`${clave[0]}`]]);
			});
			formTemp.insertSelOptions(selID,arrOne.sort());
		});
	}
	
	function cambiaMontoProvision(e){
		let flag,nodUno,atirbOn,divInt,total = 0;
		const elm = e.target;
		const padre = elm.parentElement.parentElement;
		const supromir = +(elm.parentElement.childNodes[6].value);
		const monto = elm.value;
		const montMost = padre.nextSibling.childNodes[1].innerText;
		const montant = +(montMost.split('$')[1]);
		total = (+monto) + (montant - supromir);
		// CALCULO DEL TOTAL
		padre.nextSibling.childNodes[1].innerText = `$ ${total.toFixed(2)}`;
		padre.nextSibling.childNodes[2].value = total;
		elm.parentElement.childNodes[6].value = monto;
	}
	
	function porcARecuperar(e){
		const elm = e.target;
		const padre = elm.parentElement;
		const forerec = padre.childNodes[5];
		const lab = padre.childNodes[2];
		const montos = padre.childNodes[4];
		if(Number(elm.value) > 100){
			alert('El rango de % permitido es 0 - 100');
			elm.value = '0.00';
			forerec.value = '0.00';
			lab.innerText = 'Total a Recuperar $ 0.00';
		}else{
			let sum = 0;
			montos.value.split('*').forEach(item => {sum += +(item.split('$')[1]);});
			const porc = +(elm.value)/100 * sum;
			forerec.value = porc.toFixed(2);
			lab.innerText = `Total a Recuperar $ ${porc.toFixed(2)}`;			
		}
	}
	
	function porcAplicar(e){
		const elm = e.target;
		const padre = elm.parentElement;
		const ctas = padre.childNodes[5].value;
		const prov = JSON.parse(padre.childNodes[6].value);
		const cuentas = (x)=>{
			const a = x.split('*');
			let s = 0;
			a.forEach(item =>{s += Number(item.split('$')[1])});
			return s;
		};
		const provisiones = (x)=>{
			let s = 0;
			x.forEach(item =>{
				s += Number(item['monto']);
			});
			return s;
		};
		const total = cuentas(ctas) + provisiones(prov); 
		let cobro = 0;
		if(Number(elm.value) > 100){
			alert('El rango de % permitido es 0 - 100');
			elm.value = '0.00';
			padre.childNodes[4].value = 0.00;
		}else{
			cobro = total*Number(elm.value)*(0.01);
			padre.childNodes[4].value = elm.value;
		}
		padre.childNodes[3].value = cobro.toFixed(2);
		padre.childNodes[2].innerText = `Cargo para el Fondo De Reserva $ ${cobro.toFixed(2)}`;
	}
	
	
	function previsualizar(e){
		const elm = e.target;
		let val,inp,nodUno,arrInf,infoDiv;
		let padre = elm.parentElement;
		switch(elm.id){
			case 'GUI-5-Adelante-1':
				for(let i=0; i<3;i++){padre = padre.parentElement}
				const porc = document.getElementById('SUB-GUI-5-porcfr').value; //% a recuperar de lo gastado fr
				const notaPP = document.getElementById('notaPP').value;
				const aplicFR = document.getElementById('paPorMir').value; //% fondo de reserva  periodo
				const pAplFRmir = document.getElementById('pAplFRmir').value; //total monto fondo de reserva  periodo
				sessionStorage.setItem('fechas',padre.lastChild.firstChild.value);
				sessionStorage.setItem('provisiones',padre.lastChild.lastChild.value);
				sessionStorage.setItem('porc',porc);
				sessionStorage.setItem('notaPP',notaPP);
				sessionStorage.setItem('aplicFR',aplicFR);
				sessionStorage.setItem('pAplFRmir',pAplFRmir);
				sessionStorage.setItem('contEx','nuevo');
				sessionStorage.setItem('estatus','nuevo');
				infoDiv = padre.childNodes[2];
				arrInf = ['SUB-GUI-5-porcfr','fondoreserva','forerecupera','notaPP'];
				const parteDos = new Object();
				arrInf.forEach(item => {
					val = document.getElementById(item).value;
					parteDos[`${item}`] = val;
				});	
				inp = formTemp.crearNodo('input',[['type','hidden'],['id','parteDos'],['value',JSON.stringify(parteDos)]],false);
				infoDiv.appendChild(inp);
				const porcaplic = new Object();
				arrInf = ['SUB-GUI-5-pAFR','pAplFRmir','paPorMir'];	
				arrInf.forEach(item => {porcaplic[item] = document.getElementById(item).value;});
				arrInf.forEach(item => {
					val = document.getElementById(item).value;
					parteDos[`${item}`] = val;
				});	
				inp = formTemp.crearNodo('input',[['type','hidden'],['id','porcaplic'],['value',JSON.stringify(parteDos)]],false);
				infoDiv.appendChild(inp);
				for(let i=0;i<2;i++){padre.removeChild(padre.lastChild);}			
			break;
			case 'fork-1-NO':
				for(let i=0; i<4;i++){padre = padre.parentElement}
				infoDiv = padre.lastChild;
				for(let i=0;i<2;i++){padre.removeChild(padre.lastChild);}	
			break;
		}
		const redir = pageBehavior.getCookie('redir').split(',');
		const sourc = pageBehavior.getURL(`/${redir[1]}/${redir[0]}/recibo`);
		const previewAC = formTemp.crearNodo('iframe',[['class','previewAC'],['src',sourc]],false);
		padre.appendChild(previewAC);
		//botones
		const vares = new Array();
		vares[0] = ['id','GUI-6-Atras'];
		vares[1] = ['type','button'];
		vares[2] = ['id','GUI-6-Detalles'];
		vares[3] = ['type','button'];
		vares[4] = ['id','GUI-6-Generar'];
		vares[5] = ['type','button'];
		nodUno = new Array ([
							 ['input',[vares[0],vares[1]]],
							 ['input',[vares[2],vares[3]]],
							 ['input',[vares[4],vares[5]]]]);
		const botones = crearFragmentoUno(nodUno);
		const botonera = formTemp.crearNodo('div',[['class','botonera']],botones);
		padre.appendChild(botonera);
		padre.appendChild(infoDiv);
		botonera.firstChild.value = 'Atras';
		botonera.childNodes[1].value = 'Detalles';
		botonera.lastChild.value = 'Generar';
		
	}
	 function muestraDetalles(e){
		 const elm = e.target;
		 const elmID = elm.id;
		 const redir = pageBehavior.getCookie('redir').split(',');
		 let neuID,sourc,nomb,n;
		 switch(elmID){
			 case 'GUI-6-Detalles':
				neuID = 'GUI-6-Recibo';
				sourc = pageBehavior.getURL(`/${redir[1]}/${redir[0]}/resumen`);
				nomb = 'Recibo';
				n = 1;
				break;
			case 'GUI-6-Recibo':
				neuID = 'GUI-6-Detalles';
				sourc = pageBehavior.getURL(`/${redir[1]}/${redir[0]}/recibo`);
				nomb = 'Detalles';
				n = 1;
				break;
			case 'GUI-7-Recibo':
				neuID = 'GUI-7-Detalles';
				sourc = pageBehavior.getURL(`/${redir[1]}/${redir[0]}/recibo`);
				nomb = 'Detalles';
				n = 5;
				break;
			 case 'GUI-7-Detalles':
				neuID = 'GUI-7-Recibo';
				sourc = pageBehavior.getURL(`/${redir[1]}/${redir[0]}/resumen`);
				nomb = 'Recibo';
				n = 5 ;
				break;
			
		 }
		 let padre = elm.parentElement.parentElement;
		 const hno = padre.children[n];
		 elm.removeAttribute('id');
		 elm.setAttribute('id',neuID);
		 elm.value = nomb;
		 hno.removeAttribute('src');
		 hno.setAttribute('src',sourc);
	 }
	
	//fork-1
	function dialogoAviUnoEnv(e){
		const elm = e.target;
		const padre = elm.parentElement.parentElement;
		const infoDiv = padre.lastChild;
		const buttNO = 'fork-1-NO';
		const buttSI = 'fork-1-SI';
		const arrRows = new Array([['Está a Punto de Generar un recibo de cobro']],
								  [['¿Desea Continuar con El Registro?' ]]);
		const arrBot = [[buttNO,'NO'],[buttSI,'SI']];
		const arrContAtt = [['contUno','contFac3'],['subContUno','subContFac3']];
		const avis = avisos.dialogAvisoThree(arrRows,arrBot,arrContAtt);
		for(let i=0; i<3;i++){padre.removeChild(padre.lastChild);}
		padre.appendChild(avis);
		/* nodos de informacion*/
		padre.appendChild(infoDiv);
	}
	
	
	
	
	//end-1
	function generarrecibo(e){
		let padre,object,arrAv,botID;
		const elm = e.target;
		padre = elm.parentElement;
		for(let i=0;i<4;i++){padre = padre.parentElement;}
		const infoDiv = padre.lastChild;
		const prov = JSON.parse(sessionStorage.getItem('provisiones'));
		const fechas = JSON.parse(sessionStorage.getItem('fechas'));
		const provisiones = new Array();
		prov.forEach((item,index) => {
			object = new Object();
			object['tipo_gasto'] = item['tipoGasto'];
			object['monto'] = item['monto'];
			object['concepto'] = item['provision'];
			provisiones.push(object);
		});
		const fec = fechas['emision'].split('/');
		const fecha = `${fec[2]}-${fec[1]}-${fec[0]}`; 
		const vence = fechas['vencimiento'];
		const porc = sessionStorage.getItem('porc');
		const aplicFR = sessionStorage.getItem('aplicFR');
		const notaPP = sessionStorage.getItem('notaPP');
		const saiAsig = 'reciboreg';
		const obj = {fecha,vence,provisiones,porc,aplicFR,notaPP,codEd,jwt,saiAsig};
		const respuesta = new BackQuery(api2,obj).afirma();
		respuesta.then((r) => {
			if(r == 'Afirmativo'){
				arrAv =[['El Recibo De Cobro Introducido'],
						['Se Registró Satisfactoriamente'],
						['Pulse Aceptar Procesar Los Cambios']];
				botID = 'end-1-Afirmativo';
			}else if(r == 'Negativo'){
				arrAv =[['El Recibo De Cobro Introducido'],
						['No Pudo Ser Registrado']];
				botID = 'end-1-Negativo';
			}
			const arrAttCont = [['avisoDos','contRegPro1'],['subAvisoDos','suCoRePro1']];
			const avis = avisos.dialogAvisoOne(arrAv,botID,arrAttCont);
			while(padre.hasChildNodes()){padre.removeChild(padre.lastChild);}
			padre.appendChild(avis);
			padre.appendChild(infoDiv);
		});
		
	}
	
	function updateAdm(e){
		const url = '/edificioInfo';
		const dbName = 'edificio_Info-'+codEd;
		const vers = 1; 
		const method = 'POST';
		const saiAsig = 'infoEdif';
		const object = {codEd,saiAsig,jwt};
		const IDBOb = new IndexedDBProcess(url,dbName,vers,method,object);
		IDBOb.deleteDB();
		pageBehavior.setCookie(pageBehavior.getCookie('propDoc').split(',')[2],'',1);
		const apellUsua = pageBehavior.getCookie('profile').split(',')[1].split(' ').join('');
		window.location.assign(pageBehavior.getURL('/'+codEd+'/'+apellUsua));
	}
	
	//GUI-7 para recibos ya existentes
	function mostrarReciboEmitido(e){
		const elm = e.target;
		let padre = elm.parentElement;
		Array.from(padre.children).forEach(item => {
			item.removeAttribute('class');
			item.setAttribute('class','monatBenuzt');			
		})
		const dat = JSON.parse(elm.lastChild.value);
		const fec = dat['fecha'].split('-');
		const emision = `${fec[2]}/${fec[1]}/${fec[0]}`;
		const vencimiento = dat['vencimiento'];
		const fechaB = dat['hasta'];
		const notaPP = dat['pie'];
		const control = dat['control'];		
		const desde = dat['desde'];
		const hasta = dat['hasta'];
		sessionStorage.setItem('notaPP',notaPP);
		sessionStorage.setItem('fechas',JSON.stringify({emision,vencimiento,fechaB,desde,hasta}));
		sessionStorage.setItem('contEx',control);
		sessionStorage.setItem('estatus','consulta');
		const redir = pageBehavior.getCookie('redir').split(',');
		const sourc = pageBehavior.getURL(`/${redir[1]}/${redir[0]}/recibo`);
		const previewAC = formTemp.crearNodo('iframe',[['class','previewAC'],['src',sourc]],false);
		for(let i =0;i<1;i++){padre = padre.parentElement;}
		padre.appendChild(previewAC);
		//botones
		const vares = new Array();
		vares[0] = ['id','GUI-7-Cerrar'];
		vares[1] = ['type','button'];
		vares[2] = ['id','GUI-7-Detalles'];
		vares[3] = ['type','button'];
		
		const nodUno = new Array ([
							 ['input',[vares[0],vares[1]]],
							 ['input',[vares[2],vares[3]]]]);
		const botones = crearFragmentoUno(nodUno);
		const botonera = formTemp.crearNodo('div',[['class','botonera']],botones);
		padre.appendChild(botonera);
		botonera.firstChild.value = 'Cerrar';
		botonera.childNodes[1].value = 'Detalles';
	}
	
	function cerrarIFrame(e){
		const elm = e.target;
		let padre = elm.parentElement;
		for (let i = 0; i<1;i++){padre = padre.parentElement;}
		padre.children[2].childNodes.forEach(item =>{
			item.removeAttribute('class');
			item.setAttribute('class','monat');
		});
		for(let i =0; i<2;i++){padre.removeChild(padre.lastChild);}
	}
	