import{EventAsigner} from './eventAss.js';
import {PageBehavior} from './pageBeha.js';
import {BackQuery} from './backQ.js';
import{TablasMuestras} from './tabMue.js';
import {RetrieveDBEgresos} from './retriDBeg.js';
import{FormTemp} from './formTemp.js';
import {Avisos} from './avisos.js';
	var pageBehavior = new PageBehavior();
	var eventAsigner = new EventAsigner();
	var formTemp = new FormTemp();
	var avisos = new Avisos();
	var coed = pageBehavior.getCookie('propDoc').split(',')[2];
	var dbName = `edificio_Info-${coed}`;
	var idbquery = new RetrieveDBEgresos(dbName);
	var retrieveDB = new RetrieveDBEgresos('admin_tools');
	var formularios = new Array('facturas_resumen','recibos_resumen','nomina_mes','cuentas_pagar','comision_banco','provisiones');
	var cuentas = new Array(['Dinero en Banco','dineroBan'],['Dinero en Efectivo','dineroEfec'],['Fondo de Reserva','fondoR'],['Fondo de Provisiones','dineroProv']);
	var direccion = '/registro/egresos';
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
		section.addEventListener('keypress', (e)=>{pageBehavior.keyDPressEnt(e);});
		section.addEventListener('input', (e)=>{inputMethod(e);});
		const header = document.getElementsByTagName('header')[0];
		header.addEventListener('click',(e)=>{headclicks(e.target);});
		
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
		const elemento = e.target;
		const elmID = elemento.id;
		const tagN = elemento.tagName;
		const tgCL = elemento.className;
		if(elmID != 'fecha' && tgCL != 'prorb'){
			e.preventDefault();
		}
		console.log(tgCL,elmID);
		switch(elmID){
			case 'b0':
			case 'btnNegRif':
			case 'profileButton':
				cargadoPagina(e);
				break;
			case 'b1':
			case `fork-3-${formularios[0]}-NO`:
			case 'btnAfirmRifFac':
			case `end-2-${formularios[0]}-Accept`:
				anteEgresosFacturas(e);
				break;
			case 'join-3-NO':
			case 'join-4-cancel':
			case 'join-5-NO':
			case `join-1-${formularios[5]}-cancel`:
			case `join-2-${formularios[5]}-cancel`: 
			case `fork-1-${formularios[0]}-NO`:
			case `fork-1-${formularios[1]}-NO`:
			case `fork-1-${formularios[2]}-NO`:
			case `fork-1-${formularios[3]}-NO`:
				 anteEgresos(e);
				break;
			case 'b2':
			case `fork-3-${formularios[1]}-NO`:
			case `end-2-${formularios[1]}-Accept`:
			case 'btnAfirmRifRec':
				anteEgresosRecibos(e);
				break;
			case 'b3':
			case `fork-3-${formularios[2]}-NO`:
			case 'btnAfirmCedEmp':
			case `end-2-${formularios[2]}-Accept`:
			case 'btnCPPForRifNO':
				anteEgresosNomina(e);
				break;
			case 'b4':
			case `fork-1-${formularios[4]}-NO`:
			case `end-2-${formularios[4]}-Accept`:
				anteEgresosComisiones(e);
				break;
			case 'bcinco':
			case `fork-3-${formularios[3]}-NO`:
			case 'btnAfirmRifCPP':
			case `end-2-${formularios[3]}-Accept`:
				anteEgresosCTAPPagar(e);
				break
			case 'ingrFac':
			case 'ingrRec':
			case 'ingrNom':
			case 'ingrCoBa':
			case 'ingrCPP':
				enviar(e);
				break;
			case `fork-1-${cuentas[3][1]}`:
				enviarPagoProvisiones(e);
				break;
			case 'ingreRif':
			case 'ingreEmp':
				diaAviUnoRif(e);
				break;
			case `fork-3-${formularios[0]}-SI`:
			case `fork-3-${formularios[1]}-SI`:
			case `fork-3-${formularios[3]}-SI`:
				cargarProveedor(e);
				break;
			case `fork-1-${formularios[0]}-SI`:
			case `fork-1-${formularios[1]}-SI`:
			case `fork-1-${formularios[2]}-SI`:
			case `fork-1-${formularios[4]}-SI`:
				fondosdisponibles(e);
				break;
			case `fork-1-${formularios[3]}-SI`:
				registroCPPagar(e);
				break;
			case `fork-3-${formularios[2]}-SI`:
				registroEmpleado(e);
				break;
			case 'botEnviarRif':
				enviarRif(e);
				break;
			case 'b5':
			case 'b6':
			case 'b7':
			case 'b8':
			case 'b9':
				reportesEgresos(e);
				break;
			case 'join-3-SI-fork-2':
			case 'join-3-SI-fork-4':
				traspasoFondos(e);
				break;
			case 'join-4-Accept':
				cuentasCombinadas(e);
				break;
			case 'join-5-SI':
				enviarPagoComb(e);
				break;
			case `join-2-${formularios[5]}-accept`:
				ejecutaProvision(e);
				break;
		}
		//seleccion texto
		if(tagN.toLowerCase() == 'input'){
			if(elemento.type == 'text'){
				elemento.select();
			}
		}
		
		switch(tgCL){
			case 'resinf':
				infoEgresos(e);
				break;
			case 'close':
				closeInfoEgresos(e);
				break;
			case 'selprov':
				infoEgresosDos(e);
				break;
		}
		
	}
	
	function sectionchange(e){
		const elmID = e.target.id;
		const tagN = e.target.tagName;
		const tgCL = e.target.className;
		//console.log(elmID);	
		switch(elmID){
			case 'rif':
				const obj=e.target;
				(obj.value.length > 7)?rifChange(e):obj.value = '';
				break;
			case 'excento':
			case 'iva':
			case 'baseImp':
				montototal();
				break;
			case 'formaPago':
				formaPago(e);
				break;
			case 'estado':
				estadoChange(e);
				break;
			case 'ciudad':
				ciudadChange(e);
				break;
			case 'banco':
			case 'tipoComision':
			case 'tipoGasto':
				selectionChange(e);
				break;
		}
	}
	
	
	function inputMethod(e){
		const elmID = e.target.id;
		const tagN = e.target.tagName;
		const tgCL = e.target.className;
		//console.log(tagN,tgCL,elmID);
		switch(elmID){
			case 'rif':
			case 'telef':
			case 'vencimiento':
				eventAsigner.numericInput(e);
				break;
			case 'iva':
			case 'baseImp':
			case 'excento':
			case 'total':
				eventAsigner.decimalInput(e);
				break;
			case `restar-${cuentas[0][1]}`:
			case `restar-${cuentas[1][1]}`:
			case `restar-${cuentas[2][1]}`:
			case `restar-${cuentas[3][1]}`:
				eventAsigner.decimalInput(e);
				retiroEnCuenta(e);
				break;
		}
		if(tgCL == 'rif'){eventAsigner.numericInput(e);}
	}
	
	function logOut(){  
		const property = pageBehavior.getCookie('property').split(',');
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
		titulo.innerHTML = nombre;
	}
	
	function logeado(nombre){
		const contMen = [['Mi Perfil','miPer'],['Cerrar Sesión','loOt']];
		const contOpt = [['Administrador','princ']];
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

	function cargadoPagina(e){
		let naveg = new FormTemp('section');
		let arrBot = new Array();
		arrBot = [['i-egresos.png','icon i00','div','botonIzq','b0',false,'','EGRESOS'],
				['note_add-24px.svg','icon i01','a','boton b1','b1',false,'','FACTURA'],
				['receipt-24px.svg','icon i02','a','boton b2','b2',false,'','RECIBO'],
				['person_add_alt_1-24px.svg','icon i03','a','boton b3','b3',false,'','NÓMINA'],
				['request_page-24px.svg','icon i04','a','boton b4','b4','br','COMISIONES','BANCARIAS'],
				['','icon i04','a','boton b4','bcinco','br','CUENTAS','POR PAGAR']];
		let nieto,hijo,subContUno, subContDos,nodo,texto;
		let hijos = new Array();
		arrBot.forEach((item,index,array)=>{
			nieto = naveg.crearNodo('img',[['src','/apiGrafica/imagenes/'+item[0]],['class',item[1]]],false);
			hijo = naveg.crearNodo(item[2],[['class',item[3]],['id',item[4]]],nieto);
			hijos.push(hijo);
			naveg.crearNodoTexto(item[5],item[6],item[7],hijo);
		})
		subContUno = naveg.creaContenedor('nav','navUno',hijos);
		let hijosDos = new Array();
		hijosDos[0] = naveg.crearNodo('div',[['class','titulo']],false);
		naveg.crearNodoTexto(false,'','RESUMEN',hijosDos[0]);
		let arrRes = new Array();
		arrRes = [['facP','facPpag','FACTURAS',' pagadas en el mes actual ---'],
				['recP','recPag','RECIBOS',' pagados en el mes actual ---'],
				['nominaA','nomina','NÓMINA',' en mes actual ---'],
				['comisiones','comisiones','COMISIONES BANCARIAS',' en mes actual ---'],
				['facxP','facPorpag','CUENTAS POR PAGAR',' en mes actual ---']];
		let nietosDos = new Array();		
		arrRes.forEach((item,index,array)=>{
			nodo = naveg.crearNodo('div',[['class',item[0]],['id',item[1]]],false);
			texto = naveg.crearNodoTexto('b',item[2],item[3],nodo);
			nietosDos.push(nodo);
		})		
		hijosDos[1] = naveg.creaContenedor('div','resumen',nietosDos);
		subContDos = naveg.creaContenedor('div','showup',hijosDos);
		naveg.sacaHijos();
		naveg.pareHijo(subContUno);
		naveg.pareHijo(subContDos);
		naveg.getContElm().style.display='flex';
		cargandoResumen();
	}

	
	function anteEgresosFacturas(e){
		let padre;
		const elemento = e.target;
		padre = elemento.parentElement.parentElement;
		while(padre.tagName.toLowerCase() != 'section'){padre = padre.parentElement;}
		sessionStorage.clear();
		egresosFacturas(padre);
	}
	function anteEgresosRecibos(e){
		let padre;
		const elemento = e.target;
		padre = elemento.parentElement;
		while(padre.tagName.toLowerCase() != 'section'){padre = padre.parentElement;}
		sessionStorage.clear();
		egresosRecibos(padre);
	}
	function anteEgresosNomina(e){
		let flag,padre;
		const elemento = e.target;
		padre = elemento.parentElement;
		while(padre.tagName.toLowerCase() != 'section'){padre = padre.parentElement;}
		egresosNomina(padre);
	}
	function anteEgresosComisiones(e){
		let flag,padre;
		const elemento = e.target;
		padre = elemento.parentElement;
		while(padre.tagName.toLowerCase() != 'section'){padre = padre.parentElement;}
		egresosComisiones(padre);
	}
	
	function anteEgresosCTAPPagar(e){//metodo ?
		let flag,padre;
		const elemento = e.target;
		padre = elemento.parentElement;
		while(padre.tagName.toLowerCase() != 'section'){padre = padre.parentElement;}
		switch(elemento.id){
			case `fork-3-${formularios[3]}-NO`:
			case `fork-1-${formularios[3]}-NO`:
			case 'btnCPPForRifNO':
				padre.removeChild(padre.lastElementChild);
			break;	
		}
		egresosCTAPPagar(padre);
	}
	
	function cargandoResumen(){
		const arrRes = [[formularios[0],'facPpag'],
						[formularios[1],'recPag'],
						[formularios[2],'nomina'],
						[formularios[4],'comisiones'],
						[formularios[3],'facPorpag']];
		const propDoc = pageBehavior.getCookie('propDoc');
		//let egresos = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[2],1);
		arrRes.forEach((item,index,array)=>{
			idbquery.retrieveAllTableDataArr(item[0],(r)=>{respProcessOne(r,item[1]);});
		});
	}
	
	function respProcessOne(r,idObj){
		let obj = document.getElementById(idObj);
		let monto = 0;
			r.forEach((item,index,array)=>{
				if(item.cMonto == 'none'){
					monto = 0;
				}else{
					monto += +item.cMonto;
				}
			});
			obj.insertAdjacentHTML('beforeend',monto.toFixed(2));
	}
	
	function saldoEnCuentas(formElemt,selID){
		let x , neuStr;
		const sel = formElemt[`${selID}`];
		const opt = sel.options;
		for(let i = 1;i < opt.length;i++){
			idbquery.retrieveAllTableDataArr(opt[i].value,(r)=>{
				const clave = new Array();
				for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
				const arrOne = new Array();
				r.forEach((item,index,array)=>{
					arrOne.push(Number(item[`${clave[2]}`]));
				});
				const initialValue = 0;
				const reducer = (total, num) => {return total + num;};
				const fdisp = arrOne.reduce(reducer, initialValue);
				x = 20;
				neuStr = `$${fdisp.toFixed(2)}`;
				neuStr = new Array(x+1).join('.') + neuStr;
				opt[i].insertAdjacentText('beforeend',neuStr);
			});

		}
	}
	
	function egresosFacturas(padre){
		const obj = padre.lastElementChild.lastElementChild.value;
		let priSeAt,segSeAt,terSeAt,cuaSeAt,quiSeAt;
		/* PARTE IZQUIERDA*/
		const nav = parteIzquierda('REPORTE FACTURAS PAGADAS','b5');
		/* PARTE DERECHA*/
		if(obj != undefined){
			const objSen = JSON.parse(obj);
			const rifval = objSen['rif'].split('-');
			//priSeAt = ['disabled','true'];
			priSeAt = ['autofocus','true'];
			//segSeAt = [[`${rifval[0]}-`,`${rifval[0]}-`]];
			segSeAt = pageBehavior.rifLetraOrden(rifval[0]);
			terSeAt = ['value',`${rifval[1]}`];
			//cuaSeAt = ['disabled','true'];
			cuaSeAt = ['minlength','8'];
			quiSeAt = ['value',`${objSen.proveedor}`];
		}else{
			priSeAt = ['autofocus','true'];
			segSeAt = [['J-','J-'],['V-','V-'],['E-','E-'],['G-','G-']];
			terSeAt = ['placeholder','RIF'];
			cuaSeAt = ['minlength','8'];
			quiSeAt = ['value',''];
		}
		const nodos = new Array();
		const atributos = new Array([]);
		nodos[0] = ['select','input'];
		atributos[0] = [[['id','rifLetra'],priSeAt],segSeAt,
					   [['type','text'],['id','rif'],terSeAt,cuaSeAt,['maxlength','9']],false];	   
		nodos[1] = ['input'];
		atributos[1] = [[['type','text'],['id','proveedor'],['placeholder','Proveedor'],quiSeAt,
						['disabled','true']],false];			
		nodos[2] = ['input'];
		atributos[2] = [[['type','date'],['id','fecha']],false];
		nodos[3] = ['input'];
		atributos[3] = [[['type','text'],['id','factura'],['placeholder','Factura No.'],['maxlength','30']],false];
		nodos[4] = ['input'];
		atributos[4] = [[['type','text'],['id','concepto'],['placeholder','Concepto'],['maxlength','38']],false];
		nodos[5] = ['input'];
		atributos[5] = [[['type','text'],['id','excento'],['placeholder','Monto Excento'],['maxlength','15']],false];
		nodos[6] = ['input'];
		atributos[6] = [[['type','text'],['id','iva'],['placeholder','% IVA'],['maxlength','5']],false];
		nodos[7] = ['input'];
		atributos[7] = [[['type','text'],['id','baseImp'],['placeholder','Base Imponible'],['maxlength','15']],false];
		nodos[8] = ['input'];
		atributos[8] = [[['type','text'],['id','total'],['placeholder','Monto Total'],['disabled','true']],false];
		nodos[9] = ['select'];
		atributos[9] = [[['id','tipoGasto']],[['Tipo De Gasto','']]];
		nodos[10] = ['select'];
		atributos[10] = [[['id','formaPago']],[['Cargo en Cuenta','']].concat(cuentas)];
		nodos[11] = ['input'];
		atributos[11] = [[['type','text'],['id','referencia'],['placeholder','# Referencia'],['maxlength','30']],false];
		nodos[12] = ['input'];
		atributos[12] = [[['type','button'],['id','ingrFac'],['class','butForm'],['value','Ingresar']],false];
		const divFrag = crearFragmento(nodos,atributos,'facrow');
		/* creacion del contenedor, form y nodos de informacion*/
		const contCL = ['subFormFacturas','formFacturas'];
		const formular = formularios[0];
		const saiAsig = 'ingrefac';
		const api = direccion;
		const mainTit = 'Agregar Facturas';
		const secDerCL = 'showup';
		const datIDDB = ['contabilidad','grupo','tres'];
		const fork = 'una Factura con los Siguientes Datos:#/#Proveedor:#/#Rif:#/#Referencia:';
		const end = 'La Factura Con Los Datos:#/#Proveedor:#/#Rif:#/#Concepto:';
		const arrInf = new Array(contCL,formular,saiAsig,api,mainTit,secDerCL,fork,end);
		const shup = parteDerechaUno(divFrag,arrInf);
		/* Insersion de las partes izquierda y derecha*/
		while(padre.hasChildNodes()){padre.removeChild(padre.lastChild)}
		padre.appendChild(nav);
		padre.appendChild(shup);
		retrieveDB.retriMultDataByIdex(datIDDB[0],datIDDB[1],datIDDB[2],(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[3]}`],item[`${clave[0]}`]]);
			});
			formTemp.insertSelOptions(`${atributos[9][0][0][1]}`,arrOne.sort());
		});
		saldoEnCuentas(shup.lastElementChild,'formaPago');
	}
	
	function egresosRecibos(padre){
		const obj = padre.lastElementChild.lastElementChild.value;
		let priSeAt,segSeAt,terSeAt,cuaSeAt,quiSeAt,arrAttrb,elem,attrb,txt,fragmento;
		/* PARTE IZQUIERDA*/
		const nav = parteIzquierda('REPORTE DE RECIBOS','b6');
		/* PARTE DERECHA*/
		if(obj != undefined){
			const objSen = JSON.parse(obj);
			const rifval = objSen['rif'].split('-');
			//priSeAt = ['disabled','true'];
			priSeAt = ['autofocus','true'];
			//segSeAt = [[`${rifval[0]}-`,`${rifval[0]}-`]];
			segSeAt = pageBehavior.rifLetraOrden(rifval[0]);
			terSeAt = ['value',`${rifval[1]}`];
			//cuaSeAt = ['disabled','true'];
			cuaSeAt = ['minlength','8'];
			quiSeAt = ['value',`${objSen.proveedor}`];
		}else{
			priSeAt = ['autofocus','true'];
			segSeAt = [['J-','J-'],['V-','V-'],['E-','E-']];
			terSeAt = ['placeholder','RIF'];
			cuaSeAt = ['minlength','8'];
			quiSeAt = ['value',''];
		}
		const nodos = new Array();
		const atributos = new Array([]);
		nodos[0] = ['select','input'];
		atributos[0] = [[['id','rifLetra'],priSeAt],segSeAt,
					   [['type','text'],['id','rif'],terSeAt,cuaSeAt,['maxlength','9']],false];	   
		nodos[1] = ['input'];
		atributos[1] = [[['type','text'],['id','proveedor'],['placeholder','Proveedor'],quiSeAt,
						['disabled','true']],false];			
		nodos[2] = ['input'];
		atributos[2] = [[['type','date'],['id','fecha']],false];
		nodos[3] = ['input'];
		atributos[3] = [[['type','text'],['id','concepto'],['placeholder','Concepto'],['maxlength','38']],false];
		nodos[4] = ['input'];
		atributos[4] = [[['type','text'],['id','total'],['placeholder','Monto Total']],false];
		nodos[5] = ['select'];
		atributos[5] = [[['id','tipoGasto']],[['Tipo De Gasto','']]];
		nodos[6] = ['select'];
		atributos[6] = [[['id','formaPago']],[['Cargo en Cuenta','']].concat(cuentas)];
		nodos[7] = ['input'];
		atributos[7] = [[['type','text'],['id','referencia'],['placeholder','# Referencia'],['maxlength','30']],false];
		nodos[8] = ['input'];
		atributos[8] = [[['type','text'],['id','notas'],['placeholder','Ej. Número de Orden de entrega'],['maxlength','70']],false];
		nodos[9] = ['input'];
		atributos[9] = [[['type','button'],['id','ingrRec'],['class','butForm'],['value','Ingresar']],false];
		const divFrag = crearFragmento(nodos,atributos,'recrow');
		/* creacion del contenedor, form y nodos de informacion*/
		const contCL = ['subFormRecibos','formRecibos'];
		const formular = formularios[1];
		const saiAsig = 'ingrerec';
		const api = direccion;
		const mainTit = 'Generar Recibo de pago';
		const secDerCL = 'showup';
		const datIDDB = ['contabilidad','grupo','Cuatro'];
		const fork = 'un Recibo con los Siguientes Datos:#/#Proveedor:#/#Rif:#/#Referencia:';
		const end = 'El Recibo Con Los Datos:#/#Proveedor:#/#Rif:#/#Concepto';
		const arrInf = new Array(contCL,formular,saiAsig,api,mainTit,secDerCL,fork,end);
		const shup = parteDerechaUno(divFrag,arrInf);
		/* Insersion de las partes izquierda y derecha*/
		while(padre.hasChildNodes()){padre.removeChild(padre.lastChild)}
		padre.appendChild(nav);
		padre.appendChild(shup);
		retrieveDB.retriMultDataByIdex(datIDDB[0],datIDDB[1],datIDDB[2],(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[3]}`],item[`${clave[0]}`]]);
			});
			formTemp.insertSelOptions(`${atributos[5][0][0][1]}`,arrOne.sort());
		});
		saldoEnCuentas(shup.lastElementChild,'formaPago');
	}
	
	function egresosNomina(padre){
		const obj = padre.lastElementChild.lastElementChild.value;
		let priSeAt,segSeAt,terSeAt,cuaSeAt,quiSeAt,arrAttrb,elem,attrb,txt,fragmento;
		/* PARTE IZQUIERDA*/
		const nav = parteIzquierda('REPORTE DE NÓMINA','b7');
		/* PARTE DERECHA*/
		if(obj != undefined){
			const objSen = JSON.parse(obj);
			const rifval = objSen['rif'].split('-');
			//priSeAt = ['disabled','true'];
			priSeAt = ['autofocus','true'];
			//segSeAt = [[`${rifval[0]}-`,`${rifval[0]}-`]];
			segSeAt = pageBehavior.rifLetraOrden(rifval[0]);
			terSeAt = ['value',`${rifval[1]}`];
			//cuaSeAt = ['disabled','true'];
			cuaSeAt = ['minlength','8'];
			quiSeAt = ['value',`${objSen.proveedor}`];
		}else{
			priSeAt = ['autofocus','true'];
			segSeAt = [['V-','V-'],['E-','E-']];
			terSeAt = ['placeholder','Cédula'];
			cuaSeAt = ['minlength','8'];
			quiSeAt = ['value',''];
		}
		const nodos = new Array();
		const atributos = new Array([]);
		nodos[0] = ['select','input'];
		atributos[0] = [[['id','rifLetra'],priSeAt],segSeAt,
					   [['type','text'],['id','rif'],terSeAt,cuaSeAt,['maxlength','9']],false];	   
		nodos[1] = ['input'];
		atributos[1] = [[['type','text'],['id','proveedor'],['placeholder','Nombre Empleado'],quiSeAt,
						['disabled','true']],false];			
		nodos[2] = ['input'];
		atributos[2] = [[['type','date'],['id','fecha']],false];
		nodos[3] = ['input'];
		atributos[3] = [[['type','text'],['id','concepto'],['placeholder','Concepto'],['maxlength','38']],false];
		nodos[4] = ['input'];
		atributos[4] = [[['type','text'],['id','total'],['placeholder','Monto Total']],false];
		nodos[5] = ['select'];
		atributos[5] = [[['id','formaPago']],[['Cargo en Cuenta','']].concat(cuentas)];
		nodos[6] = ['select'];
		atributos[6] = [[['id','tipoGasto']],[['Tipo De Gasto','']]];
		nodos[7] = ['input'];
		atributos[7] = [[['type','text'],['id','referencia'],['placeholder','# Referencia'],['maxlength','30']],false];
		nodos[8] = ['input'];
		atributos[8] = [[['type','text'],['id','notas'],['placeholder','Ej. Motivo del pago'],['maxlength','70']],false];
		nodos[9] = ['input'];
		atributos[9] = [[['type','button'],['id','ingrNom'],['class','butForm'],['value','Ingresar']],false];
		const divFrag = crearFragmento(nodos,atributos,'recrow');
		/* creacion del contenedor, form y nodos de informacion*/
		const contCL = ['formNomina','formNom'];
		const formular = 'nomina_mes';
		const saiAsig = 'ingrenom';
		const api = direccion;
		const mainTit = 'Pago de Nómina';
		const secDerCL = 'showup';
		const fork = 'El Pago Con Los Datos:#/#Nombre:#/#Cédula:#/#Referencia:';
		const end = 'El Pago Con Los Datos:#/#Nombre:#/#Cédula:#/#Concepto:';
		const arrInf = new Array(contCL,formular,saiAsig,api,mainTit,secDerCL,fork,end);
		const shup = parteDerechaUno(divFrag,arrInf);
		/* Insersion de las partes izquierda y derecha*/
		while(padre.hasChildNodes()){padre.removeChild(padre.lastChild)}
		padre.appendChild(nav);
		padre.appendChild(shup);
		const datIDDB = ['contabilidad','grupo','Cuatro'];
		retrieveDB.retriMultDataByIdex(datIDDB[0],datIDDB[1],datIDDB[2],(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[3]}`],item[`${clave[0]}`]]);
			});
			formTemp.insertSelOptions(`${atributos[6][0][0][1]}`,arrOne.sort());
		});
		saldoEnCuentas(shup.lastElementChild,'formaPago');
	}
	
	function egresosComisiones(padre){
		const obj = padre.lastElementChild.lastElementChild.value;
		let terSeAt,cuaSeAt,quiSeAt,arrAttrb,elem,attrb,txt,fragmento;
		/* PARTE IZQUIERDA*/
		const nav = parteIzquierda('REPORTE COMISIONES BANCARIAS','b8');
		/* PARTE DERECHA*/		
		const nodos = new Array();
		const atributos = new Array([]);		
		nodos[0] = ['select'];
		atributos[0] = [[['id','banco']],[['Entidad Bancaria','']]];
		nodos[1] = ['input'];
		atributos[1] = [[['type','date'],['id','fecha']],false];
		nodos[2] = ['input'];
		atributos[2] = [[['type','text'],['id','total'],['placeholder','Monto de la Comisión Bancaria'],['maxlength','16']],false];
		nodos[3] = ['select'];
		atributos[3] = [[['id','formaPago']],[['Cargo en Cuenta','']].concat(cuentas)];
		nodos[4] = ['select'];
		atributos[4] = [[['id','tipoComision']],[['Tipo De Comision','']]];
		nodos[5] = ['input'];
		atributos[5] = [[['type','text'],['id','referencia'],['placeholder','# Referencia'],['maxlength','30']],false];
		nodos[6] = ['input'];
		atributos[6] = [[['type','text'],['id','notas'],['placeholder','Nota: Ej. Motivo del pago'],['maxlength','70']],false];
		nodos[7] = ['input'];
		atributos[7] = [[['type','button'],['id','ingrCoBa'],['class','butForm'],['value','Ingresar']],false];
		const divFrag = crearFragmento(nodos,atributos,'recrow');
		/* creacion del contenedor, form y nodos de informacion*/
		const contCL = ['formCom','formComisiones'];
		const formular = formularios[4];
		const saiAsig = 'ingrecom';
		const api = direccion;
		const mainTit = 'Agregar Comisiones Bancarias';
		const secDerCL = 'showup';
		const fork = 'El Pago de Comision Bancaria:#/#Banco:#/#Comision:#/#Referencia:';
		const end = 'La Comisión Con Los Datos:#/#Banco:#/#Comisión#/#Fecha:';
		const arrInf = new Array(contCL,formular,saiAsig,api,mainTit,secDerCL,fork,end);
		const shup = parteDerechaUno(divFrag,arrInf);
		/* nodos secreto necesario para los dialogos diferencia con los ant*/
		let atrnosec,nosec;
		atrnosec = [['type','hidden'],['id','proveedor'],['value','']];
		nosec = formTemp.crearNodo('input',atrnosec,false);
		shup.lastElementChild.appendChild(nosec);
		/* Insersion de las partes izquierda y derecha*/
		while(padre.hasChildNodes()){padre.removeChild(padre.lastChild)}
		padre.appendChild(nav);
		padre.appendChild(shup);
		let datIDDB = ['ent_bancaria'];
		retrieveDB.retrieveAllTableDataArr(datIDDB[0],(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[2]}`],item[`${clave[1]}`]]);
			});
			formTemp.insertSelOptions(`${atributos[0][0][0][1]}`,arrOne.sort());
		});	
		datIDDB = ['contabilidad','grupo','seis'];
		retrieveDB.retriMultDataByIdex(datIDDB[0],datIDDB[1],datIDDB[2],(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[3]}`],item[`${clave[0]}`]]);
			});
			formTemp.insertSelOptions(`${atributos[4][0][0][1]}`,arrOne.sort());
		});
		saldoEnCuentas(shup.lastElementChild,'formaPago');
	}
	
	function egresosCTAPPagar(padre){
		const obj = padre.lastElementChild.lastElementChild.value;
		let priSeAt,segSeAt,terSeAt,cuaSeAt,quiSeAt,arrAttrb,elem,attrb,txt,fragmento;
		/* PARTE IZQUIERDA*/
		const nav = parteIzquierda('REPORTE DE CUENTAS POR PAGAR','b9');
		/* PARTE DERECHA*/
		if(obj != undefined){
			const objSen = JSON.parse(obj);
			const rifval = objSen['rif'].split('-');
			//priSeAt = ['disabled','true'];
			priSeAt = ['autofocus','true'];
			//segSeAt = [[`${rifval[0]}-`,`${rifval[0]}-`]];
			segSeAt = pageBehavior.rifLetraOrden(rifval[0]);
			terSeAt = ['value',`${rifval[1]}`];
			//cuaSeAt = ['disabled','true'];
			cuaSeAt = ['minlength','8'];
			quiSeAt = ['value',`${objSen.proveedor}`];
		}else{
			priSeAt = ['autofocus','true'];
			segSeAt = [['J-','J-'],['V-','V-'],['E-','E-']];
			terSeAt = ['placeholder','RIF'];
			cuaSeAt = ['minlength','8'];
			quiSeAt = ['value',''];
		}
		const nodos = new Array();
		const atributos = new Array([]);
		nodos[0] = ['select','input'];
		atributos[0] = [[['id','rifLetra'],priSeAt],segSeAt,
					   [['type','text'],['id','rif'],terSeAt,cuaSeAt,['maxlength','9']],false];	   
		nodos[1] = ['input'];
		atributos[1] = [[['type','text'],['id','proveedor'],['placeholder','Proveedor'],quiSeAt,
						['disabled','true']],false];			
		nodos[2] = ['input'];
		atributos[2] = [[['type','date'],['id','fecha']],false];
		nodos[3] = ['input'];
		atributos[3] = [[['type','text'],['id','concepto'],['placeholder','Concepto'],['maxlength','38']],false];
		nodos[4] = ['input'];
		atributos[4] = [[['type','text'],['id','total'],['placeholder','Monto Total']],false];
		nodos[5] = ['select'];
		atributos[5] = [[['id','tipoGasto']],[['Tipo De Gasto','']]];
		nodos[6] = ['input'];
		atributos[6] = [[['type','text'],['id','vencimiento'],['placeholder','# De Dias para Pagar'],['maxlength','3']],false];
		nodos[7] = ['input'];
		atributos[7] = [[['type','text'],['id','notas'],['placeholder','Anotaciones Ej. Segun pactado en la reunion numero 25'],['maxlength','70']],false];
		nodos[8] = ['input'];
		atributos[8] = [[['type','button'],['id','ingrCPP'],['class','butForm'],['value','Ingresar']],false];
		
		const divFrag = crearFragmento(nodos,atributos,'recrow');
		/* creacion del contenedor, form y nodos de informacion*/
		const contCL = ['subFormRecibos','formRecibos'];
		const formular = formularios[3];
		const saiAsig = 'ingrecred';
		const api = direccion;
		const mainTit = 'Generar Pago a Crédito';
		const secDerCL = 'showup';
		const datIDDB = ['contabilidad','grupo','cinco'];
		const fork = 'Una Cuenta Por Pagar a Favor de:#/#Rif:#/#Proveedor:#/# ';
		const end = 'La Cuenta Por Pagar Con Los Datos:#/#Proveedor:#/#Rif:#/#Concepto';
		const arrInf = new Array(contCL,formular,saiAsig,api,mainTit,secDerCL,fork,end);
		const shup = parteDerechaUno(divFrag,arrInf);
		/* nodos secreto necesario para los dialogos diferencia con los ant*/
		let atrnosec,nosec;
		atrnosec = [['type','hidden'],['id','formaPago'],['value','credito']];
		nosec = formTemp.crearNodo('input',atrnosec,false);
		shup.lastElementChild.appendChild(nosec);
		/* Insersion de las partes izquierda y derecha*/
		while(padre.hasChildNodes()){padre.removeChild(padre.lastChild)}
		padre.appendChild(nav);
		padre.appendChild(shup);
		retrieveDB.retriMultDataByIdex(datIDDB[0],datIDDB[1],datIDDB[2],(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[3]}`],item[`${clave[0]}`]]);
			});
			formTemp.insertSelOptions(`${atributos[5][0][0][1]}`,arrOne.sort());
		});
	}
	
	function parteIzquierda(texto,idNam){
		//texto = 'REPORTE FACTURAS PAGADAS';
		//idName = 'b5';
		let fragmento,txt,attrb,elem;
		fragmento = document.createDocumentFragment();
		txt = document.createTextNode('EGRESOS');
		attrb = [['class','botonIzq'],['id','b0']];
		elem = formTemp.crearNodo('div',attrb,txt);
		fragmento.appendChild(elem);
		txt = document.createTextNode(texto);
		attrb = [['class',`boton ${idNam}`],['id',idNam],['href','javascript:void(0)']];
		elem = formTemp.crearNodo('a',attrb,txt);
		fragmento.appendChild(elem);
		/* contenedor izquierdo*/
		attrb = [['class','navUno']];
		const nav = formTemp.crearNodo('nav',attrb,fragmento);
		return nav;
	}
	
	function parteDerechaUno(divFrag,arrInf){
		let arrAttrb,elem,txt;
		const contCL = arrInf[0];
		const formular = arrInf[1];
		const saiAsig = arrInf[2];
		const api = arrInf[3];
		const mainTit = arrInf[4];
		const secDerCL = arrInf[5];
		const fork = arrInf[6];
		const end = arrInf[7];
		/* creacion del contenedor*/
		arrAttrb = [['class',contCL[0]]];
		elem = formTemp.crearNodo('div',arrAttrb,divFrag);
		/* creacion del form*/
		arrAttrb = [['class',contCL[1]]];
		const formato = formTemp.crearNodo('form',arrAttrb,elem);
		/* nodos de informacion*/
		const nodInf = new Array(['formular',formular],
									['saiAsig',saiAsig],
									['codEd',pageBehavior.getCookie('propDoc').split(',')[2]],
									['api',api],
									['jwt',pageBehavior.getCookie('jwt')],
									['fork',fork],
									['end',end],
									['nombreGasto','']);
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			elem = formTemp.crearNodo('input',arrAttrb,false);
			formato.appendChild(elem);
		});
		/* creacion del titulo*/
		txt = document.createTextNode(mainTit);
		arrAttrb = [];
		elem = formTemp.crearNodo('h2',arrAttrb,txt);
		/* seccion derecha*/
		arrAttrb = [['class',secDerCL]];
		const shup = formTemp.crearNodo('div',arrAttrb,elem);
		shup.appendChild(formato);
		return shup;
	}
		
	function formaPago(e){
		let referencia = e.target.form.elements['referencia'];
		if(referencia != undefined){
			if(e.target.value == cuentas[1][1]){
				referencia.value = 'No Aplica';
				referencia.disabled = true;
			
			}else{
				referencia.value = ''; 
				referencia.disabled = false;
			}
		}
	}
	
	//fork-3
	function rifChange(e){
		let btnNO,btnSI,padre,objAfl,object,flag,arrAv,newSAg,api,fiAns;
		padre = e.target;
		for(let i=0;i<3;i++){padre =padre.parentElement;}
		objAfl = formTemp.checkEmptyElemPartial(padre,e.target);
		object = objAfl[0];
		flag = objAfl[1];
		const variantes = object.fork.split('#/#')
		if(object.formular == formularios[2]){
			newSAg = 'cedverif';
			api = '/cedulaverification'
		}else{
			newSAg = 'rifverif';
			api = '/rifverification';
		}
		object['saiAsig'] = newSAg;
		const respuesta = new BackQuery(api,object).getServDatPO();
		respuesta.then(respuesta => {
				if (respuesta.numReg == 'Presente'){
					padre['proveedor'].value = respuesta.proveedor[0].nombre;
				}else if (respuesta.numReg == 'Ausente'){
					arrAv =[[`El ${variantes[1]} ${object.rif}`],['No Se Encuentra En El Registro.'],['¿Desea Registrarlo?']];
					const arrBot = [[`fork-3-${object.formular}-NO`,'NO'],[`fork-3-${object.formular}-SI`,'SI']];
					const arrContAtt = [['contUno','contFac3'],['subContUno','subContFac3']];
					const avis = avisos.dialogAvisoThree(arrAv,arrBot,arrContAtt);
					avis.style.margin = 'auto';
					let shup = padre.parentElement;
					while(shup.hasChildNodes()){shup.removeChild(shup.lastChild);}
					shup.appendChild(avis);
					const nodo = document.createElement('input');
					nodo.setAttribute('type','hidden');
					nodo.setAttribute('id','obj');
					nodo.setAttribute('value',JSON.stringify(object));
					shup.appendChild(nodo);
				}else{
					console.log(respuesta);
				}	
		});
	}
	
	function enviar(e){
		/* metodo que se apoya con los metodos fondosdisponibles,dialogoAvisoNoFunds, 
		IDBupdate, dialogoAvisoAfirm, dialogoAviUnoEnv */
		let btnID,padre,objAfl,object,flag,tabla,msj,forpags;
		padre = e.target;
		for(let i=0;i<3;i++){padre = padre.parentElement;}
		const forPagEle = padre.elements['formaPago'];
		forpags = (forPagEle != undefined) ? forPagEle.childNodes : [];
		const pagos = new Object();
		for(let i = 0;i < forpags.length;i++){pagos[forpags[i].value] = forpags[i].innerText}
		objAfl = formTemp.checkEmptyElem(padre);
		object = objAfl[0];
		flag = objAfl[1];
		//mensaje para cuenta en uso
		switch(object.formaPago){
			case cuentas[0][1]:
				msj = cuentas[0][0];
				break;
			case cuentas[1][1]:
				msj = cuentas[1][0];
				break;
			case cuentas[2][1]:
				msj = cuentas[2][0];
				break;
			case cuentas[3][1]:
				msj = cuentas[3][0];
				break;
		}
		object['ctauso'] = msj;
		if(flag){dialogoAviUnoEnv(pagos,object,padre);}
	}
	//fork-1
	function dialogoAviUnoEnv(pagos,object,elemento){
		let arrAttrb,elem,buttNO,buttSI,variantesDos,refDos;
		const shup = elemento.parentElement;
		const variantes = object.fork.split('#/#');
		if(object.formular == formularios[4]){
			variantesDos = object.nombreGasto;
		}else{
			variantesDos = object.rif;
		}
		buttNO = `fork-1-${object.formular}-NO`;
		buttSI = `fork-1-${object.formular}-SI`;
		if(object.formaPago == cuentas[3][1]){
			buttSI = `fork-1-${object.formaPago}`;
			object['formularDos'] = formularios[5]; //existe operacion con provisiones
		}else{
			object['formularDos'] = 'none'; //no hay operacion con provisiones
		}
		const arrRows = new Array([[`Está a Punto Registrar ${variantes[0]}`]],
						[[variantes[1]],[object.proveedor]],
						[[variantes[2]],[variantesDos]],
						[['Fecha:'],[object.fecha]],
						[['Monto:'],[object.total.toFixed(2)]],
						[[variantes[3]],[object.referencia]],
						[['¿Desea Continuar con El Registro?' ]]);
		const arrBot = [[buttNO,'NO'],[buttSI,'SI']];
		const arrContAtt = [['contUno','contRegi1'],['subContUno','subContRegi1']];
		const avis = avisos.dialogAvisoThree(arrRows,arrBot,arrContAtt);
		while(shup.hasChildNodes()){shup.removeChild(shup.lastChild);}
		shup.appendChild(avis);
		/* nodos de informacion*/
		const nodInf = new Array(['pagos',JSON.stringify(pagos)],
								 ['object',JSON.stringify(object)]);
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			elem = formTemp.crearNodo('input',arrAttrb,false);
			shup.appendChild(elem);
		});
	}
	
	
	//fork-2
	function fondosdisponibles(e){
		let padre,hijos,disponible,refDos;
		padre = e.target;
		for(let i=0;i<5;i++){padre = padre.parentElement;}
		hijos = padre.childNodes;
		const pagos = JSON.parse(hijos[1].value);
		const object = JSON.parse(hijos[2].value);
		const monto = object.total;
		idbquery.retrieveAllTableDataArr(object.formaPago,(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push(Number(item[`${clave[2]}`]));
			});
			const initialValue = 0;
			const reducer = (accumulator, item) => {return accumulator + item;};
			const fdisp = arrOne.reduce(reducer, initialValue);
			if(fdisp >= Number(monto)){disponible = true;}else{disponible = false;}
			if(disponible){
				//uso de operacion simple
				object['operacion'] = 'simple';
				const formaPagoDos = new Array();
				cuentas.forEach(item => {
					if(item[1] == object.formaPago){formaPagoDos.push([item[0],item[1],+(object.total)]);}
				});
				object['formaPagoDos'] = formaPagoDos;
				object['disponible'] = fdisp;
				object['referencia'] += `#/#${object.formaPago}${object.total.toFixed(2)}`;
				const respuesta = new BackQuery(object.api,object).afirma();
				respuesta.then(res => {
					if (res == 'Afirmativo'){
						IDBupdate(r,clave,object);  //end-1
						dialogoAvisoUnoAfirm(padre,object,res);//end-2
					}else if (res == 'Negativo'){				
						dialogoAvisoUnoAfirm(padre,object,res);//end-2
					}			
				});		
			}else{
				//uso de operacion combinada
				object['operacion'] = 'combinada';
				object['disponible'] = fdisp;				
				object['formularDos'] = 'none';
				dialogoAvisoNoFunds(padre,object,fdisp,'fork-2'); //join-3
			}
		});
	}

//end-1
	function IDBupdate(r,clave,object){
		/* construccion del objeto a almacenar en local*/
		/* almacenamiento de operacion en cuenta utilizada*/
		let keydb1,keydb2;
		switch(object.formular){
			case formularios[0]:
			case formularios[1]:
				keydb1 = object.tipoGasto;
				keydb2 = object.nombreGasto;
				break;
			case formularios[2]:
				keydb1 = object.rif;
				keydb2 = object.proveedor;
				break;
			case formularios[4]:
				keydb1 = object.tipoComision;
				keydb2 = object.nombreGasto;
				break;
		}
		const d = new Date();
		const objData = new Object();
		/* hallar el ultimo key de la db para
		afectar la cuenta utilizada*/
		const arrTwo = new Array();  
		r.forEach((item,index,array)=>{arrTwo.push(Number(item[`${clave[0]}`]));});
		arrTwo.sort((a, b) => a - b);
		const neuInd = +(arrTwo[arrTwo.length-1])+1;
		const fecha = `${d.getFullYear()}-${String((d.getMonth()+1)).padStart(2, "0")}-${d.getDate()}`;
		const nueMon = (-1)*(+object.total);
		const nueVals = [neuInd,fecha,nueMon];
		clave.forEach((item,index,array)=>{objData[item] = String(nueVals[index])});
		idbquery.addDataToTable(object.formaPago,objData);
		 /*almacenamiento de la factura */
		idbquery.retrieveAllTableDataArr(object.formular,(res)=>{
			const cl = new Array();
			for (const [key, value] of Object.entries(res[0])) {cl.push(`${key}`);}
			const objDF = new Object();
			// hallar el ultimo key de la db
			const arrThree = new Array();  
			res.forEach((item,index,array)=>{arrThree.push(Number(item[`${cl[0]}`]));});
			arrThree.sort((a, b) => a - b);
			const iteUn = +(arrThree[arrThree.length-1])+1;
			const iteDo = keydb1;
			const iteTr = keydb2;
			const iteCu = object.total;
			const nueValTwo = [iteUn,iteDo,iteTr,iteCu];
			cl.forEach((item,index,array)=>{objDF[item] = String(nueValTwo[index])});
			idbquery.addDataToTable(object.formular,objDF);
		});
	}
	
	//end-2
	function dialogoAvisoUnoAfirm(elem,object,res){
		let arrAv,botID,vari2,vari3,vari4;
		const variantes = object.end.split('#/#');
		if(object.formular == formularios[4]){
			vari2 = object.nombreGasto;
			vari3 = object.fecha;
		}else{
			vari2 = object.rif;
			vari3 = object.concepto.split('#/#')[0];
		}
		if(res == 'Negativo'){
			vari4 = 'Falló en el Registro.';
		}else if(res == 'Afirmativo'){
			vari4 = 'Se Registró Satisfactoriamente.';
		}
		arrAv = [[variantes[0]],
				[`${variantes[1]} ${object.proveedor}`],
				[`${variantes[2]} ${vari2}`],
				[`${variantes[3]} ${vari3}`],
				[`Monto Total: ${object.total.toFixed(2)}`],
				[vari4]];
		botID = `end-2-${object.formular}-Accept`;	
		const arrAttCont = [['avisoDos','contRegFac1'],['subAvisoDos','suCoReFac1']];	
		const avis = avisos.dialogAvisoOne(arrAv,botID,arrAttCont);	
		while(elem.hasChildNodes()){elem.removeChild(elem.lastChild);}
		elem.appendChild(avis);
	}
	
	//join-1
	function enviarPagoProvisiones(e){
		let padre,hijos,disponible,tvresult;
		padre = e.target;
		for(let i=0;i<5;i++){padre = padre.parentElement;}
		hijos = padre.childNodes;
		const pagos = JSON.parse(hijos[1].value);
		const object = JSON.parse(hijos[2].value);
		const monto = object.total;
		const titTres = 'Seleccione LA PROVISION a ejecutar:';
		const tabla = object.formularDos;
		idbquery.retrieveAllTableDataArr(object.formularDos,(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			const arrTwo = new Array();
			/* Agrupamiento y suma de miembros iguales*/
			let sigue = true,total = 0;
			r.forEach((item,index,array)=>{
				arrOne.forEach((it)=>{
					if(it[0] == item[`${clave[2]}`]){
						it[1] += Number(item[`${clave[3]}`]);
						total += Number(item[`${clave[3]}`]);
						sigue = false;
					}
				});
				if(sigue){
					arrOne.push([item[`${clave[2]}`],+item[`${clave[3]}`]]);
					arrTwo.push(item[`${clave[1]}`]);
					total += Number(item[`${clave[3]}`]);
				}
				sigue = true;
			});
			arrOne.forEach((item,index) =>{if (item[1] == 0){arrOne.splice(index,1)}}); //removes zeros
			
			if(arrOne.length > 0){
				tvresult = visorDeHistoricoDos(arrOne,arrTwo,titTres,tabla,'selprov','tvshow');
			}else{
				const arrAv = [['No Hay Provisiones Pendientes Por Ejecutar']];
				const botID = `join-1-${tabla}-cancel`;	
				const arrAttCont = [['avisoDos','contRegFac1'],['subAvisoDos','suCoReFac1']];	
				tvresult = avisos.dialogAvisoTwo(arrAv,botID,arrAttCont);
			}
			while(padre.hasChildNodes()){padre.removeChild(padre.lastChild)}
			padre.appendChild(tvresult);
			const arrAtt = [['type','hidden'],['id','object'],['value',JSON.stringify(object)]];
			const elem = formTemp.crearNodo('input',arrAtt,false);
			padre.appendChild(elem);
		});

	}

	//join-2
	function visorDeHistoricoDos(arrOne,arrTwo,titTres,tabla,btnCL,shCL){
		let elem,txt,fragcol,fragrow,arrAtt,elemDo;
		fragrow = document.createDocumentFragment();
		arrOne.forEach((item,index)=>{
			if(+item[1] != 0){
				item[1] = Number(item[1]).toFixed(2);
				fragcol = document.createDocumentFragment();
				item.forEach((it)=>{
					txt = document.createTextNode(it);
					elem = formTemp.crearNodo('div',[['class','procol']],txt);
					fragcol.appendChild(elem);
				});
				/* icono de informacion*/
				arrAtt = [['class',btnCL],['id',`${btnCL}-${index}`],['src','/apiGrafica/imagenes/info.svg']];
				elem = formTemp.crearNodo('img',arrAtt,false);
				arrAtt = [['class','eliminar'],['id','eliminar'],['href','javascript:void(0);']];
				elemDo = formTemp.crearNodo('a',arrAtt,elem);
				arrAtt = [['class','procol']];
				elem = formTemp.crearNodo('div',arrAtt,elemDo); 
				fragcol.appendChild(elem);
				/* nodo de informacion */
				arrAtt = [['type','hidden'],['id',`tipoGasto-${index}`],['value',arrTwo[index]]];
				elem = formTemp.crearNodo('input',arrAtt,false);
				fragcol.appendChild(elem);
				elem = formTemp.crearNodo('div',[['class','prorow']],fragcol);
				fragrow.appendChild(elem);
				elem = formTemp.crearNodo('div',[['class',shCL],['id',`${shCL}-${index}`]],false);
				fragrow.appendChild(elem);
			}
		});
		txt = document.createTextNode(titTres);
		elem = formTemp.crearNodo('p',[],txt);
		const procont = formTemp.crearNodo('div',[['class','proCont']],elem);
		const subprocont = formTemp.crearNodo('form',[['class','subProCont']],fragrow);
		/* botones */
		//const btnIDAcept = `accept-${tabla}`;
		const btnIDAcept =`join-2-${tabla}-accept`;
		//const btnIDCancel = `cancel-${tabla}`;
		const btnIDCancel = `join-2-${tabla}-cancel`;
		fragrow = document.createDocumentFragment();
		arrAtt = [['type','button'],['class','btndialog'],['id',btnIDCancel],['value','Cancelar']];
		const cancelar = formTemp.crearNodo('input',arrAtt,false); 
		elem = formTemp.crearNodo('div',[['class','procol']],cancelar);
		fragrow.appendChild(elem);
		arrAtt = [['type','button'],['class','btndialog'],['id',btnIDAcept],['value','Aceptar']];
		const aceptar = formTemp.crearNodo('input',arrAtt,false); 
		elem = formTemp.crearNodo('div',[['class','procol']],aceptar);
		fragrow.appendChild(elem);
		elem = formTemp.crearNodo('div',[['class','prorow']],fragrow);
		subprocont.appendChild(elem);
		arrAtt = [['type','hidden'],['id','formular'],['value',tabla]];
		elem = formTemp.crearNodo('input',arrAtt,false);
		subprocont.appendChild(elem);
		procont.appendChild(subprocont);
		return procont;
	}
	
	function infoEgresosDos(e){
		const elm = e.target;
		const n = elm.id.split('-')[1];
		let padre = elm.parentElement,muestuno;
		if(padre.tagName.toLowerCase() != 'div'){
			while(padre.tagName.toLowerCase() != 'div'){padre = padre.parentElement}
		}
		const radio = 'control';
		const nxsib = padre.nextSibling;
		const tipoGasto = nxsib.value;
		const formular = nxsib.form['formular'].value;
		const codEd = pageBehavior.getCookie('propDoc').split(',')[2];
		const jwt = pageBehavior.getCookie('jwt');
		const saiAsig = 'consegre';
		const object = {tipoGasto,formular,codEd,jwt,saiAsig};
		const respuesta = new BackQuery('/consulta/egresos',object).getServDatPO();
		respuesta.then((r) => {
			if(r.length == 0){
				muestuno = formTemp.crearNodo('h3',[],document.createTextNode('Error en Base De Datos!!!!'));
			}else{
				muestuno = muestraDetallesDos(r,radio);
			}
			const tvshow = document.getElementById(`tvshow-${n}`);
			tvshow.appendChild(muestuno);
		});
		elm.removeAttribute('class');
		elm.setAttribute('class','close');
	}
	
	function muestraDetallesDos(r,chkname){
		let elem,txt,lab,fragcol,fragfil,rad,flag;
		const clave = new Array();
		for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
		fragcol = document.createDocumentFragment();
		/* diferencia con la uno*/
		txt = '';
		elem = formTemp.crearNodo('div',[['class','coshu']],txt);
		fragcol.appendChild(elem);
		/* fin diferencia*/
		clave.forEach(item => {
			txt = document.createTextNode(item);
			elem = formTemp.crearNodo('div',[['class','coshu']],txt);
			fragcol.appendChild(elem);
		});
		elem = formTemp.crearNodo('div',[['class','fishu']],fragcol);
		const showuno = formTemp.crearNodo('div',[['class','showuno']],elem);
		fragfil = document.createDocumentFragment();
		r.forEach((item,index) =>{
			fragcol = document.createDocumentFragment();
			/* diferencia con la uno*/
			rad = formTemp.crearNodo('input',[['type','radio'],['name',chkname],['value',item[`${clave[0]}`]],['id',item[`${clave[0]}`]],['class','prorb']],false);
			if(index == 0){rad.setAttribute('checked','true');}
			elem = formTemp.crearNodo('div',[['class','coshu']],rad);
			fragcol.appendChild(elem);
			/* fin diferencia*/
			for (const [key, value] of Object.entries(item)) {
				txt = document.createTextNode(`${value}`);
				elem = formTemp.crearNodo('div',[['class','coshu']],txt);
				fragcol.appendChild(elem);
			}
			elem = formTemp.crearNodo('div',[['class','fishu']],fragcol);
			fragfil.appendChild(elem);
		});
		showuno.appendChild(fragfil);
		return showuno;
	}
	//fork-4
	function ejecutaProvision(e){
		let elm,padre,selval,ctrchk,mretiro,usadoProv,shup,con2,con3,ref2,ref3,ref4;
		elm = e.target;
		padre = elm.parentElement;
		for(let i=0;i<4;i++){padre = padre.parentElement;}
		const object = JSON.parse(padre.lastElementChild.value);
		const ctrl = elm.form['control'];
		if(ctrl != undefined){
			if(ctrl.constructor.name == 'HTMLInputElement'){
				selval = ctrl.value;
				ctrchk = ctrl;
			}else if(ctrl.constructor.name == 'RadioNodeList'){
				for(let i =0;i<ctrl.length;i++){
					if(ctrl[i].checked){
						selval = ctrl[i].value;
						ctrchk = ctrl[i];
						break;
					}else{
						selval = '';
					}
				}
			}
			if(selval != ''){
				const padre = ctrchk.parentElement.parentElement;
				const sibl = padre.childNodes;
				const control = +selval;
				const fecha = padre.childNodes[2].innerText;
				const concepto = padre.childNodes[3].innerText;
				const monto = +padre.lastElementChild.innerText; //monto provisto
				const tio = padre.parentElement.parentElement.previousSibling;
				const tipoGasto = tio.lastElementChild.value;
				const nombreGasto = tio.firstChild.innerText;
				object['provcont'] = control; //control prevision;
				object['tipoGasto'] = tipoGasto;
				object['nombreGasto'] = nombreGasto;
				//concepto
				con2 = `${object.concepto}#/#${concepto}#/#${control}`;
				if(con2.length < 80){
					object['concepto'] += `#/#${concepto}#/#${control}`;
				}else{
					con3 = concepto.slice(3, 30);
					object['concepto'] += `#/#${con3}#/#${control}`;
				}
				idbquery.retrieveAllTableDataArr(object.formaPago,(r)=>{
					const clave = new Array();
					for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
					const arrOne = new Array();
					r.forEach((item,index,array)=>{
						arrOne.push(Number(item[`${clave[2]}`]));
					});
					const initialValue = 0;
					const reducer = (total, num) => {return total + num;};
					const fdisp = arrOne.reduce(reducer, initialValue);  //dineroProv
					//1. El monto total > dineroProv
						//dineroProv > monto provisto?
					if(object.total > fdisp){
						if(fdisp > monto){mretiro = monto;}else{mretiro = fdisp;}
					}else{
						if(object.total > monto){mretiro = monto;}else{mretiro = object.total;}
					}
					if(object.total > monto){usadoProv = monto;}else{usadoProv = object.total}
					object['mretiro'] = mretiro;
					object['usadoProv'] = usadoProv; //cantidad usada por la provision
					//2. monto total > monto a retirar.
					if(object.total > mretiro){
						//operacion combinada
						shup = padre.parentElement;
						for(let i=0;i<4;i++){shup = shup.parentElement;}
						dialogoAvisoNoFunds(shup,object,mretiro,'fork-4'); //join-3
					}else{
						//operacion simple
						shup = padre.parentElement;
						for(let i = 0; i<4;i++){shup = shup.parentElement;}
						object['operacion'] = 'simple';
						const formaPagoDos = new Array();
						cuentas.forEach(item => {
							if(item[1] == object.formaPago){formaPagoDos.push([item[0],item[1],+(object.total)]);}
						});
						object['formaPagoDos'] = formaPagoDos;
						object['disponible'] = fdisp;
						object['referencia'] += `#/#${object.formaPago}${object.total.toFixed(2)}`;
						const respuesta = new BackQuery(object.api,object).afirma();
						respuesta.then(res => {
							if (res == 'Afirmativo'){
								IDBupdate(r,clave,object);  //end-1
								IDBupdateDos(object); //end-3
								dialogoAvisoUnoAfirm(shup,object,res);//end-2
							}else if (res == 'Negativo'){				
								dialogoAvisoUnoAfirm(shup,object,res);//end-2
							}			
						});		
					}
				});

			}else{
				alert('Debe definir la cuenta a ejecutar');
			}	
		}else{
			alert('Debe definir la cuenta a ejecutar');
		}
	}
	
	
	function registroCPPagar(e){
		let btnID,padre,objAfl,object;
		padre = e.target;
		for(let i=0;i<5;i++){padre = padre.parentElement;}
		objAfl = padre.lastElementChild.value;
		object = JSON.parse(objAfl);
		object['operacion'] = 'simple';
		const respuesta = new BackQuery(object.api,object).afirma();
		respuesta.then(res => {
			if (res == 'Afirmativo'){
				dialogoAvisoUnoAfirm(padre,object,res);//end-2
				IDBupdateDos(object);	//end-3	
			}else if (res == 'Negativo'){
				dialogoAvisoUnoAfirm(padre,object,res);//end-2
			}			
		});
	}
	
	//end-3
	function IDBupdateDos(object){ //almacena los egresos
		let keydb2,dbUpdate,mretiro;
		if(object['formularDos'] == formularios[5]){
			dbUpdate = formularios[5];
			mretiro = +object.usadoProv*(-1); //* -1 para provisiones
		}else{
			dbUpdate = object.formular;
			mretiro = +object.total;
		}
		idbquery.retrieveAllTableDataArr(dbUpdate,(res)=>{
			const cl = new Array();
			for (const [key, value] of Object.entries(res[0])) {cl.push(`${key}`);}
			const objDF = new Object();
			const arrThree = new Array();  
			res.forEach((item,index,array)=>{arrThree.push(Number(item[`${cl[0]}`]));});
			arrThree.sort((a, b) => a - b);
			const iteUn = +(arrThree[arrThree.length-1])+1;
			const iteDo = object.tipoGasto;
			const iteTr = object.nombreGasto;
			const iteCu = mretiro;
			const nueValTwo = [iteUn,iteDo,iteTr,iteCu];
			cl.forEach((item,index,array)=>{objDF[item] = String(nueValTwo[index])});
			idbquery.addDataToTable(dbUpdate,objDF);
		});
		
	}
	
	function IDBupdateTres(object){
		let keydb1,keydb2;
		switch(object.formular){
			case formularios[0]:
			case formularios[1]:
				keydb1 = object.tipoGasto;
				keydb2 = object.nombreGasto;
				break;
			case formularios[2]:
				keydb1 = object.rif;
				keydb2 = object.proveedor;
				break;
			case formularios[4]:
				keydb1 = object.tipoComision;
				keydb2 = object.nombreGasto;
				break;
		}
		/*operacion en la cuenta utilizada*/
		const d = new Date();
		object.formaPagoDos.forEach(item =>{
			idbquery.retrieveAllTableDataArr(item[0],(r)=>{
				const clave = new Array();
				for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
				const arrTwo = new Array();  
				r.forEach((it,index,array)=>{arrTwo.push(Number(it[`${clave[0]}`]));});
				arrTwo.sort((a, b) => a - b);
				const neuInd = +(arrTwo[arrTwo.length-1])+1;
				const fecha = `${d.getFullYear()}-${String((d.getMonth()+1)).padStart(2, "0")}-${d.getDate()}`;
				const nueMon = (-1)*(+item[2]);
				const nueVals = [neuInd,fecha,nueMon];
				const objData = new Object();
				clave.forEach((ite,ind,array)=>{objData[ite] = String(nueVals[ind])});
				idbquery.addDataToTable(item[0],objData);
			});
		})
		/*almacenamiento del egreso */
		idbquery.retrieveAllTableDataArr(object.formular,(res)=>{
			const cl = new Array();
			for (const [key, value] of Object.entries(res[0])) {cl.push(`${key}`);}
			const objDF = new Object();
			const arrThree = new Array();  
			res.forEach((item,index,array)=>{arrThree.push(Number(item[`${cl[0]}`]));});
			arrThree.sort((a, b) => a - b);
			const iteUn = +(arrThree[arrThree.length-1])+1;
			const iteDo = object.tipoGasto;
			const iteTr = object.nombreGasto;
			const iteCu = object.total;
			const nueValTwo = [iteUn,iteDo,iteTr,iteCu];
			cl.forEach((item,index,array)=>{objDF[item] = String(nueValTwo[index])});
			idbquery.addDataToTable(object.formular,objDF);
		});
	}
	
	function IDBupdateCuatro(object){
		/*almacenamiento del egreso */
		idbquery.retrieveAllTableDataArr(object.formular,(res)=>{
			const cl = new Array();
			for (const [key, value] of Object.entries(res[0])) {cl.push(`${key}`);}
			const objDF = new Object();
			const arrThree = new Array();  
			res.forEach((item,index,array)=>{arrThree.push(Number(item[`${cl[0]}`]));});
			arrThree.sort((a, b) => a - b);
			const iteUn = +(arrThree[arrThree.length-1])+1;
			const iteDo = object.tipoGasto;
			const iteTr = object.nombreGasto;
			const iteCu = object.total;
			const nueValTwo = [iteUn,iteDo,iteTr,iteCu];
			cl.forEach((item,index,array)=>{objDF[item] = String(nueValTwo[index])});
			idbquery.addDataToTable(object.formular,objDF);
		});
	}	
	
	
	function IDBupdateCinco(object){
		/*operacion en las cuentas utilizada*/
		const d = new Date();
		object.formaPagoDos.forEach(item =>{
			idbquery.retrieveAllTableDataArr(item[0],(r)=>{
				const clave = new Array();
				for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
				const arrTwo = new Array();  
				r.forEach((it,index,array)=>{arrTwo.push(Number(it[`${clave[0]}`]));});
				arrTwo.sort((a, b) => a - b);
				const neuInd = +(arrTwo[arrTwo.length-1])+1;
				const fecha = `${d.getFullYear()}-${String((d.getMonth()+1)).padStart(2, "0")}-${d.getDate()}`;
				const nueMon = (-1)*(+item[2]);
				const nueVals = [neuInd,fecha,nueMon];
				const objData = new Object();
				clave.forEach((ite,ind,array)=>{objData[ite] = String(nueVals[ind])});
				idbquery.addDataToTable(item[0],objData);
			});
		})
	}
	
	//join-3
	function dialogoAvisoNoFunds(elem,object,disp,siID){
		let arrAv,avis;
		const padre = elem;
		if(+disp > 0.01){
			const falta = ((object.total-Number(disp)).toFixed(2));
			object['falta'] = +falta;
			 arrAv =[['No posee fondos suficientes:'],
					[`en la cuenta ${object.ctauso} para`],
					[`efectuar un pago de $ ${object.total}.`],
					[`Su saldo disponible es de $ ${disp.toFixed(2)}`],
					[`¿Desea completar los $ ${falta} faltantes con otra cuenta?`]];
			const arrBot = [['join-3-NO','NO'],[`join-3-SI-${siID}`,'SI']];
			const arrContAtt = [['contUno','contFac3'],['subContUno','subContFac3']];
			avis = avisos.dialogAvisoThree(arrAv,arrBot,arrContAtt);		
		}else{
			 arrAv = [[`Su saldo disponible es de $ ${disp.toFixed(2)}`],
					      [`en la cuenta ${object.ctauso}`],
					      ['Por Favor Seleccione Otra Cuenta']];
			const botID = 'join-3-NO';	
			const arrAttCont = [['avisoDos','contRegFac1'],['subAvisoDos','suCoReFac1']];	
			avis = avisos.dialogAvisoTwo(arrAv,botID,arrAttCont);
		}
		while(padre.hasChildNodes()){padre.removeChild(padre.lastChild);}
		padre.appendChild(avis);
		/* nodos de informacion*/
		let arrAttrb,elemento;
		const nodInf = new Array(['object',JSON.stringify(object)]);
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			elemento = formTemp.crearNodo('input',arrAttrb,false);
			padre.appendChild(elemento);
		});
	}
	
	//join-4
	function traspasoFondos(e){
		let padre,clave,arrOne,tot,subtot,inp,txt,lab,foc,fila,fragmento,indice,col;
		const elm = e.target;
		padre = elm.parentElement;
		for(let i = 0;i<4;i++){padre = padre.parentElement;}
		const object = JSON.parse(padre.lastChild.value);
		/* titulo */
		txt = document.createTextNode('Cuentas Restantes');
		const tit = formTemp.crearNodo('h1',[],txt);
		/* contenedor*/
		const cont = formTemp.crearNodo('div',[['class','contUno'],['id','ctas']],tit);
		/* divs dentro del formulario*/
		fragmento = document.createDocumentFragment();
		for(let i = 0; i<7;i++){
			fila = formTemp.crearNodo('div',[['class','ctaRow']],false);
			for(let j = 0; j<3;j++){
				col = formTemp.crearNodo('div',[['class',`ctacol-${j}`]],false);
				fila.appendChild(col);
			}
			fragmento.appendChild(fila);
		}
		/* formulario*/
		const formul = formTemp.crearNodo('form',[['class','subContDos'],['id','subCtas']],fragmento);
		/* cabecera del formulario*/
		txt = document.createTextNode('Cuenta');
		lab = formTemp.crearNodo('label',[],txt);
		formul.childNodes[0].childNodes[0].appendChild(lab);
		txt = document.createTextNode('Débito');
		lab = formTemp.crearNodo('label',[],txt);
		formul.childNodes[0].childNodes[1].appendChild(lab);
		txt = document.createTextNode('Disponible');
		lab = formTemp.crearNodo('label',[],txt);
		formul.childNodes[0].childNodes[2].appendChild(lab);
		
		/* fila de totalizacion */
		txt = document.createTextNode('Total en Cuentas');
		lab = formTemp.crearNodo('label',[],txt);
		formul.childNodes[formul.childNodes.length-3].childNodes[0].appendChild(lab);
		inp = formTemp.crearNodo('input',[['type','hidden'],['id','suma'],['value',0]],false);
		formul.childNodes[formul.childNodes.length-3].childNodes[1].appendChild(inp);
		txt = document.createTextNode('0.00');
		lab = formTemp.crearNodo('label',[],txt);
		formul.childNodes[formul.childNodes.length-3].childNodes[2].appendChild(lab);
		/* fila de la diferencia*/
		txt = document.createTextNode('Falta por Completar');
		lab = formTemp.crearNodo('label',[],txt);
		formul.childNodes[formul.childNodes.length-2].childNodes[0].appendChild(lab);
		txt = document.createTextNode(object.falta.toFixed(2));
		lab = formTemp.crearNodo('label',[],txt);
		formul.childNodes[formul.childNodes.length-2].childNodes[2].appendChild(lab);
		/* botones del formulario*/
		txt = document.createTextNode('Cancelar');
		const cancel = formTemp.crearNodo('button',[['class','botAvDos'],['id','join-4-cancel']],txt);
		formul.childNodes[formul.childNodes.length-1].childNodes[0].appendChild(cancel);
		txt = document.createTextNode('Aceptar');
		const aceptar = formTemp.crearNodo('button',[['class','botAvDos'],['id','join-4-Accept'],['style','visibility:hidden']],txt);
		formul.childNodes[formul.childNodes.length-1].childNodes[2].appendChild(aceptar);
		cont.appendChild(formul);

		while(padre.hasChildNodes()){padre.removeChild(padre.lastChild);}
		padre.appendChild(cont);
		const ctaProh = cuentas[3][1];
		indice = 1;
		tot = 0;
		cuentas.forEach((item,index) => {
			if(object.formaPago != item[1] && item[1] != ctaProh){
				idbquery.retrieveAllTableDataArr(item[1],(r)=>{			
					clave = new Array();
					for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
					subtot = 0;
					r.forEach((it,ind,array)=>{subtot += Number(it[`${clave[2]}`]);});
					tot += subtot;
		if(subtot > 0.01){
					/* elimina fila de totalizacion*/
					while(formul.childNodes[formul.childNodes.length-3].childNodes[1].hasChildNodes()){
						formul.childNodes[formul.childNodes.length-3].childNodes[1].removeChild(formul.childNodes[formul.childNodes.length-3].childNodes[1].lastChild);
					}
					while(formul.childNodes[formul.childNodes.length-3].childNodes[2].hasChildNodes()){
						formul.childNodes[formul.childNodes.length-3].childNodes[2].removeChild(formul.childNodes[formul.childNodes.length-3].childNodes[2].lastChild);
					}
					/* fila de las cuentas*/
					txt = document.createTextNode(`${item[0]}`);
					lab = formTemp.crearNodo('label',[],txt);
					formul.childNodes[indice].childNodes[0].appendChild(lab);
					if(indice == 1){foc = ['autofocus','true'];}else{foc = ['maxlength','15'];}
					inp = formTemp.crearNodo('input',[['type','hidden'],['id',`mirror-${item[1]}`],['value',0]],false);
					formul.childNodes[indice].childNodes[1].appendChild(inp);
					inp = formTemp.crearNodo('input',[['type','text'],['id',`restar-${item[1]}`],['class','restar'],foc,['maxlength','15'],['value','0.00']],false);
					formul.childNodes[indice].childNodes[1].appendChild(inp);
					inp = formTemp.crearNodo('input',[['type','hidden'],['id',`monto-${item[1]}`],['value',subtot]],false);
					formul.childNodes[indice].childNodes[1].appendChild(inp);
					txt = document.createTextNode(`${subtot.toFixed(2)}`);
					lab = formTemp.crearNodo('label',[],txt);
					formul.childNodes[indice].childNodes[2].appendChild(lab);
					/* fila de totalizacion*/
					txt = document.createTextNode(`${tot.toFixed(2)}`);
					lab = formTemp.crearNodo('label',[],txt);
					formul.childNodes[formul.childNodes.length-3].childNodes[2].appendChild(lab);
					inp = formTemp.crearNodo('input',[['type','hidden'],['id','suma'],['value',tot]],false);
					formul.childNodes[formul.childNodes.length-3].childNodes[1].appendChild(inp);
					indice++;
		}
				});
				
			}
		});
		/* nodos de informacion*/
		let arrAttrb,elemento;
		const nodInf = new Array(['object',JSON.stringify(object)]);
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			elemento = formTemp.crearNodo('input',arrAttrb,false);
			padre.appendChild(elemento);
		});
	}
	
	function retiroEnCuenta(e){
		let falta,totCtas,totCtsLab;
		const elm = e.target;
		/* lo que hay*/
		const witdval = +(pageBehavior.retiracoma(elm.value));
		const currval = +(elm.nextElementSibling.value);
		const mirror = +(elm.previousElementSibling.value);
		const formul = elm.form;
		falta = +(formul.childNodes[formul.childNodes.length-2].childNodes[2].firstChild.innerText);
		const actfield = formul.childNodes[formul.childNodes.length-3];
		totCtas = +(actfield.childNodes[1].firstChild.value);
		totCtsLab = actfield.childNodes[2].firstChild.innerText;
		Array.from(formul.elements).forEach(item =>{
			if(item.type == 'text'){item.style='border-color:default';}
		});
		/* lo nuevo */
		const faltaDos = falta + mirror - witdval;
		const currvalDos = currval + mirror - witdval;
		/* no se puede sacar mas de lo que se tiene*/
		if(currvalDos < -0.01){
			elm.style='border-color:red';
			formul.childNodes[formul.childNodes.length-2].childNodes[2].firstChild.innerText = (falta+mirror).toFixed(2);
			actfield.childNodes[1].firstChild.value = (totCtas + mirror);
			actfield.childNodes[2].firstChild.innerText = (totCtas + mirror).toFixed(2);
			elm.parentElement.nextElementSibling.firstElementChild.innerText = (currval + mirror).toFixed(2);
			elm.value = '0.00';
			elm.previousElementSibling.value = 0;
			elm.nextElementSibling.value = currval + mirror;
			setTimeout(()=> (alert('El Monto de Retiro NO DEBE ser MAYOR al Monto disponible')),250);
		/* no se puede sacar mas de lo que hay que pagar*/
		}else if(faltaDos < -0.01){
			elm.style='border-color:red';
			formul.childNodes[formul.childNodes.length-2].childNodes[2].firstChild.innerText = (falta+mirror).toFixed(2);
			actfield.childNodes[1].firstChild.value = (totCtas + mirror);
			actfield.childNodes[2].firstChild.innerText = (totCtas + mirror).toFixed(2);
			elm.parentElement.nextElementSibling.firstElementChild.innerText = (currval + mirror).toFixed(2);
			elm.value = '0.00';
			elm.previousElementSibling.value = 0;
			elm.nextElementSibling.value = currval + mirror;
			setTimeout(()=> (alert('El Monto de Retiro NO DEBE ser MAYOR al Monto restante para el Pago')),250);
		}else{
			formul.childNodes[formul.childNodes.length-2].childNodes[2].firstChild.innerText = (Math.abs(falta+mirror-witdval)).toFixed(2);/* falta por pagar*/
			actfield.childNodes[1].firstChild.value = (totCtas + mirror - witdval);/* suma cuentas*/
			actfield.childNodes[2].firstChild.innerText = (totCtas + mirror - witdval).toFixed(2); /* suma ctas label*/
			elm.parentElement.nextElementSibling.firstElementChild.innerText = (currval + mirror - witdval).toFixed(2); /* cta en uso label*/
			elm.nextElementSibling.value = currval + mirror - witdval;
			elm.previousElementSibling.value = witdval;
		}
		falta = +(formul.childNodes[formul.childNodes.length-2].childNodes[2].firstChild.innerText);
		const acept = formul.childNodes[formul.childNodes.length-1].childNodes[2].firstChild;
		if(falta > 0){
			acept.style.visibility = "hidden";
		}else if(falta > -0.1 && falta < 0.1){
			acept.style.visibility = "visible";
		}
	}
	//join-5
	function cuentasCombinadas(e){
		let padre,flag,mo,filOn,arrAttrb,inp,vari2,vari3,ref2,ref3,ref4;
		const elm = e.target;
		padre = elm.parentElement;
		for(let i =0;i < 4;i++){padre = padre.parentElement;}
		const object = JSON.parse(padre.lastElementChild.value);
		const objAfl = formTemp.checkEmptyElem(elm.form);
		const secObj = objAfl[0];
		flag = objAfl[1];		
		if(flag){	
			const variantes = object.end.split('#/#');
			if(object.formular == formularios[4]){
				vari2 = object.nombreGasto;
				vari3 = object.fecha;
			}else{
				vari2 = object.rif;
				vari3 = object.concepto.split('#/#')[0];
			}
			const formaPagoDos = new Array();
			cuentas.forEach((item)=>{
				mo = Number(secObj[`restar-${item[1]}`]);

				if(mo > 0){formaPagoDos.push([item[1],item[0],mo]);}
				//cuenta inicial de donde se retira
				if(item[1] == object['formaPago']){
					mo = Number(object['total']) - Number(object['falta']);
					formaPagoDos.push([item[1],item[0],mo]);
				}
			});		
			const arrDos = new Array();
			for(let i = 0;i<4;i++){arrDos.push(['','']);}
			formaPagoDos.forEach((item,index)=> {arrDos[index] = [item[1],item[2].toFixed(2)];});
			const arrAv =[[`${variantes[0]}`],
						[`${variantes[1]} ${object.proveedor}`],
						[`${variantes[2]} ${vari2}  Monto de $ ${object.total}`],[`${variantes[3]} ${vari3}`],
						['Se Pagará debitando la(s) cuenta(s):']];
			arrAv.push(['Cuenta','Monto'])		
			const arrRows = arrAv.concat(arrDos);
		
			arrRows.push(['¿Desea Continuar?']);
			const arrBot = [['join-5-NO','NO'],['join-5-SI','SI']];
			const arrContAtt = [['contUno','contFac2'],['subContUno','subContFac2']];
			const avis = avisos.dialogAvisoThree(arrRows,arrBot,arrContAtt);
			while(padre.hasChildNodes()){padre.removeChild(padre.lastChild);}
			padre.appendChild(avis);
			/* nodos de informacion*/
			object['operacion'] = 'combinada';
			object['formaPagoDos'] = formaPagoDos;
			/* referencia */
			ref2 = '';
			formaPagoDos.forEach(item => {
				ref2 += `#${item[0]}${item[2].toFixed(2)}`;
			});
			ref3 = `${object.referencia}#/${ref2}`;
			if(ref3.length < 80){
				object['referencia'] = ref3;
			}else{
				ref4 = object.referencia + ref2.replace(/dinero/g,'').replace('fondo','');
				if(ref4.length < 80){object['referencia'] = ref4;}
			}
			/* envio a base de datos*/
			const nodInf = new Array(['object',JSON.stringify(object)]);
			nodInf.forEach((item,index,array)=>{
				arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
				inp = formTemp.crearNodo('input',arrAttrb,false);
				padre.appendChild(inp);
			});	
		}
	}
	
	function enviarPagoComb(e){
		let padre,flag,mo,filOn,obkeo,obket,btnSI,buttSI,buttNO,arrAttrb,inp;
		const elm = e.target;
		padre = elm.parentElement;
		for(let i =0;i < 4;i++){padre = padre.parentElement;}
		const object = JSON.parse(padre.lastElementChild.value);
		console.log(object);
		const respuesta = new BackQuery(object.api,object).afirma();
		respuesta.then(res => {
			if (res == 'Afirmativo'){
				IDBupdateDos(object); //almacena tabla egresos
				IDBupdateCinco(object); //afecta las cuentas utilizadas
				if(object['formularDos'] == formularios[5]){
					const objectTwo = new Object();
					objectTwo['formular'] = formularios[1];
					objectTwo['tipoGasto'] = object.tipoGasto;
					objectTwo['nombreGasto'] = object.nombreGasto;
					objectTwo['total'] = object.falta;
					IDBupdateCuatro(objectTwo);  //almacena el egreso recibo
				}
				dialogoAvisoUnoAfirm(padre,object,res);//end-2
			}else if (res == 'Negativo'){
				dialogoAvisoUnoAfirm(padre,object,res);//end-2
			}			
		});
	}
		
	function anteEgresos(e){
		let padre,objAfl,object;
		padre = e.target;
		for(let i=0;i<5;i++){padre = padre.parentElement;}
		objAfl = padre.lastElementChild.value;
		object = JSON.parse(objAfl);
		const ref = object.referencia.split('#/#')[0];
		const concepto = object.concepto.split('#/#')[0];
		object['referencia'] = ref;
		object['concepto'] = concepto;
		const abuelo = padre.parentElement;
		switch(object.formular){
			case formularios[0]:
				egresosFacturas(abuelo);
				break;
			case formularios[1]:
				egresosRecibos(abuelo);
				break;
			case formularios[2]:
				egresosNomina(abuelo);
				break;
			case formularios[3]:
				egresosCTAPPagar(abuelo);
				break;	
			case formularios[4]:
				egresosComisiones(abuelo);
				break;
		}
		setTimeout(()=>{formfactpopulate(object);},250);
	}
	
	function formfactpopulate(object){
		let elem,tgn,val,opt,opval,forEl;
		forEl = document.forms[0].elements;
		for (const [key, value] of Object.entries(object)){
			elem = forEl[key];
			if(elem != undefined){
				tgn = elem.tagName;
				val = elem.value;
				switch(tgn.toLowerCase()){
					case 'input':
						if(val == ''){elem.value = value;}
						break;
					case 'select':
						opt = elem.childNodes;
						opt.forEach((item,index,array)=>{
							if(item.value == value){elem.selectedIndex = index;}
						})
					break;
				}
			}
		}
	}

	function cargarProveedor(e){ 
		let padre = e.target.parentElement;
		let elem,arrAttrb;
		for(let i=0;i<4;i++){padre = padre.parentElement;}
		const obj = padre.lastChild.value;
		const objSen = JSON.parse(padre.lastChild.value);
		objSen['saiAsig'] = 'regPro';
		const objTwo = JSON.stringify(objSen);
		const rifval = objSen['rif'].split('-');
		const nodos = new Array();
		const atributos = new Array([]);
		nodos[0] = ['select','input'];
		atributos[0] = [[['id','rifLetra'],['disabled','true']],
					   [[`${rifval[0]}-`,`${rifval[0]}-`]],
					   [['type','text'],['id','rif'],['value',`${rifval[1]}`],['disabled','true']],
					   false];
		nodos[1] = ['input'];
		atributos[1] = [[['type','text'],['id','proveedor'],['placeholder','Proveedor'],['maxlength','70'],['autofocus','true']],false];
		nodos[2] = ['input'];
		atributos[2] = [[['type','text'],['id','direc'],['placeholder','Direccion'],['maxlength','70']],false];
						
		nodos[3] = ['select','select'];
		atributos[3] = 	[[['id','estado']],[['estado','']],[['id','ciudad']],[['ciudad','']]];
		nodos[4] = ['select','input'];
		atributos[4] = [[['id','telI']],[['cod','']],
						[['type','text'],['id','telef'],['placeholder','Teléfono'],['maxlength','8']],false];
				
		nodos[5] = ['input'];
		atributos[5] = [[['type','text'],['id','conta'],['placeholder','Contácto'],['maxlength','70']],false];
		nodos[6] = ['input'];
		atributos[6] = [[['type','email'],['id','email'],['placeholder','Correo Electrónico'],['maxlength','70']],
						false]	;			
		nodos[7] = ['select'];
		atributos[7] = [[['id','actividad']],[['Actividad Económica','']]];
		nodos[8] = ['input'];
		atributos[8] = [[['type','button'],['id','ingreRif'],['value','Ingresar']],false];
		const divFrag = crearFragmento(nodos,atributos,'forrow');
		/* creacion del contenedor*/
		arrAttrb = [['class','subFormProvider']];
		elem = formTemp.crearNodo('div',arrAttrb,divFrag);
		/* nodos auxiliares*/
		arrAttrb = [['type','hidden'],['id','estadoName'],['value','']];
		const nodEstNa = formTemp.crearNodo('input',arrAttrb,false);
		elem.appendChild(nodEstNa);
		arrAttrb = [['type','hidden'],['id','ciudadName'],['value','']];
		const nodCiudNa =  formTemp.crearNodo('input',arrAttrb,false);
		elem.appendChild(nodCiudNa);
		/* creacion del form*/
		arrAttrb = [['class','formProvider']];
		const formato = formTemp.crearNodo('form',arrAttrb,elem);
		/* nodo de informacion*/
		arrAttrb = [['type','hidden'],['id','obj'],['value',objTwo]];
		elem = formTemp.crearNodo('input',arrAttrb,false);
		formato.appendChild(elem);
		arrAttrb = [];
		/* titulo*/
		const txt = document.createTextNode('Registro De Proveedores');
		elem = formTemp.crearNodo('h2',arrAttrb,txt);
		padre.removeChild(padre.lastChild);
		padre.removeChild(padre.lastChild);
		padre.appendChild(elem);
		padre.appendChild(formato);
		retrieveDB.retrieveAllTableDataArr('resultado',(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[1]}`],item[`${clave[0]}`]]);
			});
			formTemp.insertSelOptions(`${atributos[3][1][0][0]}`,arrOne.sort());
		});
		retrieveDB.retrieveAllTableDataArr('actividades',(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[0]}`],item[`${clave[1]}`]]);
			});
			formTemp.insertSelOptions(`${atributos[7][0][0][1]}`,arrOne.sort());
		});
	}
	
	function registroEmpleado(e){
		let padre = e.target.parentElement;
		let elem,arrAttrb;
		for(let i=0;i<4;i++){padre = padre.parentElement;}
		const obj = padre.lastChild.value;
		const objSen = JSON.parse(padre.lastChild.value);
		objSen['saiAsig'] = 'regemp';
		const objTwo = JSON.stringify(objSen);
		const rifval = objSen['rif'].split('-');
		const nodos = new Array();
		const atributos = new Array([]);
		nodos[0] = ['select','input'];
		atributos[0] = [[['id','rifLetra'],['disabled','true']],
					   [[`${rifval[0]}-`,`${rifval[0]}-`]],
					   [['type','text'],['id','rif'],['value',`${rifval[1]}`],['disabled','true']],
					   false];
		nodos[1] = ['input'];
		atributos[1] = [[['type','text'],['id','proveedor'],['placeholder','Nombre'],['maxlength','70'],['autofocus','true']],false];
		nodos[2] = ['input'];
		atributos[2] = [[['type','text'],['id','direc'],['placeholder','Direccion'],['maxlength','70']],false];		
		nodos[3] = ['select','select'];
		atributos[3] = 	[[['id','estado']],[['estado','']],[['id','ciudad']],[['ciudad','']]];
		nodos[4] = ['select','input'];
		atributos[4] = [[['id','telI']],[['cod','']],
						[['type','text'],['id','telef'],['placeholder','Teléfono'],['maxlength','8']],false];
		nodos[5] = ['input'];
		atributos[5] = [[['type','email'],['id','email'],['placeholder','Correo Electrónico'],['maxlength','70']],
						false]	;		
		nodos[6] = ['input'];
		atributos[6] = [[['type','text'],['id','total'],['placeholder','Sueldo'],['maxlength','16']],false];nodos[7] = ['select'];
		atributos[7] = [[['id','actividad']],[['Actividad','']]];		
		nodos[8] = ['input'];
		atributos[8] = [[['type','button'],['id','ingreEmp'],['value','Ingresar']],false];
		const divFrag = crearFragmento(nodos,atributos,'forrow');
		/* creacion del contenedor*/
		arrAttrb = [['class','subFormProvider']];
		elem = formTemp.crearNodo('div',arrAttrb,divFrag);
		/* nodos auxiliares*/
		arrAttrb = [['type','hidden'],['id','estadoName'],['value','']];
		const nodEstNa = formTemp.crearNodo('input',arrAttrb,false);
		elem.appendChild(nodEstNa);
		arrAttrb = [['type','hidden'],['id','ciudadName'],['value','']];
		const nodCiudNa =  formTemp.crearNodo('input',arrAttrb,false);
		elem.appendChild(nodCiudNa);
		/* creacion del form*/
		arrAttrb = [['class','formProvider']];
		const formato = formTemp.crearNodo('form',arrAttrb,elem);
		/* nodo de informacion*/
		arrAttrb = [['type','hidden'],['id','obj'],['value',objTwo]];
		elem = formTemp.crearNodo('input',arrAttrb,false);
		formato.appendChild(elem);
		arrAttrb = [];
		/* titulo*/
		const txt = document.createTextNode('Registro De Empleado');
		elem = formTemp.crearNodo('h2',arrAttrb,txt);
		padre.removeChild(padre.lastChild);
		padre.removeChild(padre.lastChild);
		padre.appendChild(elem);
		padre.appendChild(formato);
		retrieveDB.retrieveAllTableDataArr('resultado',(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[1]}`],item[`${clave[0]}`]]);
			});
			formTemp.insertSelOptions(`${atributos[3][1][0][0]}`,arrOne.sort());
		});
		retrieveDB.retrieveAllTableDataArr('actividades',(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[0]}`],item[`${clave[1]}`]]);
			});
			formTemp.insertSelOptions(`${atributos[7][0][0][1]}`,arrOne.sort());
		});		
		
	}
	
	function crearFragmento(nodos,atributos,ficlnam){
		const divFrag = document.createDocumentFragment();	
		let fragmento,part,elem;
		for(let i = 0;i < nodos.length; i++){
			fragmento = document.createDocumentFragment();
			nodos[i].forEach((item,index,array)=>{
			switch(item){
				case 'select':
					part = formTemp.createSelect(atributos[i][2*index],atributos[i][2*index+1]);
				break;
				case 'input':
					part = formTemp.crearNodo('input',atributos[i][2*index],false);
				break;
			}	
			fragmento.appendChild(part);
			});
			elem = formTemp.crearNodo('div',[['class',ficlnam]],fragmento);;
			divFrag.appendChild(elem);
		}
		return divFrag;
	}
	
	function estadoChange(e){
		const element = e.target;
		const brother = element.nextSibling;
		const cod_estado = element.value;
		const nombEstado = element.selectedOptions[0].innerText;
		element.form['estadoName'].value = nombEstado;
		const proOne = new Promise((resolve,reject)=>{
			while(brother.hasChildNodes()){brother.removeChild(brother.lastChild);}
			(brother.hasChildNodes == false)? resolve('ok') : reject('error');
		}).then(()=>{
			setTimeout(()=>{poblarCiudad(cod_estado,brother);}, 200);
		}).catch(()=>{
			while(brother.hasChildNodes()){brother.removeChild(brother.lastChild);}
			setTimeout(()=>{poblarCiudad(cod_estado,brother);}, 200);
		});
	}
	
	function poblarCiudad(cod,elemento){
		retrieveDB.retriMultDataByIdex('telefonos','id_estado',cod,(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			r.forEach((item,index,array)=>{
				arrOne.push([item[`${clave[3]}`],item[`${clave[0]}`]]);
			});
			formTemp.insertSelOptions(elemento.id,arrOne.sort());
			const nombCiudad = elemento.selectedOptions[0].innerText;
			elemento.form['ciudadName'].value = nombCiudad;
			/* cambio de codigo telefonico para la nueva ciudad*/
			const brother = elemento.form.elements['telI'];
			const proOne = new Promise((resolve,reject)=>{
				while(brother.hasChildNodes()){brother.removeChild(brother.lastChild);}
				(brother.hasChildNodes == false)? resolve('ok') : reject('error');
			}).then(()=>{poblarCodTlf(arrOne[0][1],brother);
			}).catch(()=>{
				while(brother.hasChildNodes()){brother.removeChild(brother.lastChild);}
				poblarCodTlf(arrOne[0][1],brother);
			});
			
		});
	}
	
	function ciudadChange(e){
		const element = e.target;
		const brother = element.form.elements['telI'];
		const cod_ciudad = element.value;
		const nombCiudad = element.selectedOptions[0].innerText;
		element.form['ciudadName'].value = nombCiudad;
		const proOne = new Promise((resolve,reject)=>{
			while(brother.hasChildNodes()){brother.removeChild(brother.lastChild);}
			(brother.hasChildNodes == false)? resolve('ok') : reject('error');
		}).then(()=>{
			poblarCodTlf(cod_ciudad,brother);
		}).catch(()=>{
			while(brother.hasChildNodes()){brother.removeChild(brother.lastChild);}
			poblarCodTlf(cod_ciudad,brother);
		});
	}
	
	function poblarCodTlf(cod,elemento){
		retrieveDB.retrieveSomeTableDataArr('telefonos',cod,(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r)) {clave.push(`${key}`);}
			formTemp.insertSelOptions(elemento.id,[[r[`${clave[4]}`],r[`${clave[4]}`]]]);
		});
	}

	function diaAviUnoRif(e){
		let padre,flag,avis,buttNO,filOn,obkeo,obket,elem,arrAttrb;
		padre = e.target;
		for(let i=0;i<3;i++){padre = padre.parentElement;}
		const objAfl = formTemp.checkEmptyElem(padre);
		const objGot = objAfl[0];
		flag = objAfl[1];
		const objSen = JSON.parse(padre.lastChild.value);
		const object = Object.assign(objSen,objGot);
		switch(object.formular){
			case formularios[0]:
				filOn = 'Al Siguiente Proveedor:';
				obkeo = 'Proveedor:';
				buttNO = `fork-1-${object.formular}-NO`;
				obket = 'Rif:';
				break;
			case formularios[1]:
				filOn = 'Al Siguiente Proveedor:';
				obkeo = 'Proveedor:';
				buttNO = `fork-1-${object.formular}-NO`;
				obket = 'Rif:';
				break;
			case formularios[3]:
				filOn = 'Al Siguiente Proveedor:';
				obkeo = 'Proveedor:';
				buttNO = `fork-1-${object.formular}-NO`;
				obket = 'Rif:';
			break;
			case formularios[2]:
				filOn = 'Al Siguiente Empleado:';
				obkeo = 'Empleado:';
				buttNO = 'btnCPPForRifNO';
				obket = 'Cédula:';
			break;
		}
		if(flag){
			const arrRows = new Array([[`Está a Punto Registrar ${filOn}`]],
						[[obkeo],[object.proveedor]],
						[[obket],[object.rif]],
						[['Direccion:'],[object.direc]],
						[['Ciudad:',object.ciudadName],['Estado:',object.estadoName]],
						[['Teléfono:'],[object.telef]],
						[['Persona de Contácto:'],[object.conta]],
						[['Correo Electrónico:'],[object.email]],
						[['¿Desea Continuar con El Registro?' ]]);
			const arrBot = [[buttNO,'NO'],['botEnviarRif','SI']];
			const arrContAtt = [['contUno','contFac4'],['subContUno','subContFac4']];
			const avis = avisos.dialogAvisoThree(arrRows,arrBot,arrContAtt);
			const shup = padre.parentElement;
			while(shup.hasChildNodes()){shup.removeChild(shup.lastChild);}
			shup.appendChild(avis);
			/* nodos de informacion*/
			const nodInf = new Array(['object',JSON.stringify(object)]);
			nodInf.forEach((item,index,array)=>{
				arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
				elem = formTemp.crearNodo('input',arrAttrb,false);
				shup.appendChild(elem);
			});
		}	
	}
	
	function enviarRif(e){
		let btnID,padre,flag,arrAv,avis,shup,botID,botSI,botNO,arrAttCont,api,ansOn,ansTw;
		padre = e.target.parentElement;
		for(let i=0;i<4;i++){padre = padre.parentElement;}
		const object = JSON.parse(padre.lastChild.value);
		switch(object.formular){
			case formularios[0]:
				botSI = 'btnAfirmRifFac';
				botNO = 'btnNegRif';
				ansOn = 'Proveedor';
				ansTw = 'Rif';
				api = '/registroProveedores';
				break;
			case formularios[1]:
				botSI = 'btnAfirmRifRec';
				botNO = 'btnNegRif';
				ansOn = 'Proveedor';
				ansTw = 'Rif';
				api = '/registroProveedores';
				break;
			case formularios[2]:
				botSI = 'btnAfirmCedEmp';
				botNO = 'btnNegRif';
				ansOn = 'Empleado';
				ansTw = 'Cédula';
				api = '/registroEmpleados';
				break;
			case formularios[3]:
				botSI = 'btnAfirmRifCPP';
				botNO = 'btnNegRif';
				ansOn = 'Proveedor';
				ansTw = 'Rif';
				api = '/registroProveedores';
				break;			
				
		}
		const respuesta = new BackQuery(api,object).afirma();
		respuesta.then((respuesta) => {
			shup = padre;
			while(shup.hasChildNodes()){shup.removeChild(shup.lastChild);}
			if (respuesta == 'Afirmativo'){
				arrAv =[[`El ${ansOn} ${object.proveedor}`],
								  [`${ansTw} ${object.rif}`],
								  [`Direccion: ${object.direc}`],
								  [`${object.ciudadName}, ${object.estadoName}`],
								  [`Teléfono ${object.telef}`],
								  ['Se Registró Satisfactoriamente']];
				botID = botSI;
				arrAttCont = [['avisoDos','contRegPro1'],['subAvisoDos','suCoRePro1']];			  
				avis = avisos.dialogAvisoOne(arrAv,botID,arrAttCont);
				shup.appendChild(avis);
				const nodo = document.createElement('input');
				nodo.setAttribute('type','hidden');
				nodo.setAttribute('id','obj');
				nodo.setAttribute('value',JSON.stringify(object));
				shup.appendChild(nodo);
			}else if (respuesta == 'Negativo'){
				arrAv =[[`El ${ansOn} ${object.proveedor}`],
								  [`${ansTw} ${object.rif}`],['No Pudo Ser Registrado']];
				botID = botNO;
				arrAttCont = [['avisoDos','contNegPro1'],['subAvisoDos','suCoNePro1']];						  
				avis = avisos.dialogAvisoOne(arrAv,botID,arrAttCont);
				shup.appendChild(avis);
			}
		});
	}
	
	function montototal(){
		const inp = ['excento','iva','baseImp','total'];
		const monto = new Array();
		let val,elem;
		for(let i =0;i<inp.length-1;i++){
			let sPto = '';
			elem = document.getElementById(inp[i]);
			(elem != undefined) ? val = elem.value : val = 0;
			if(val.includes(',')){
				let w = val.split(',');
				for(let i=0;i<w.length;i++){sPto += w[i];}
			}else{sPto = val;}
			monto[i] = sPto;
		}
		let total = ((+monto[0])+(+monto[1]*0.01+1)*(+monto[2])).toFixed(2);
		document.getElementById(inp[3]).value = (formTemp.inpNumbForm(total.toString()));
	}
	
	function selectionChange(e){
		const elem = e.target;
		const selID = elem.id;
		const padre = elem.form;
		let banco,proveedor,comision,tipoGasto,nombreGasto,ciudad;
		switch(selID){
			case 'banco':
					banco = padre['banco'];
					proveedor = padre['proveedor'];
					proveedor.value = banco.selectedOptions[0].innerText;
					break;
			case 'tipoComision':
					comision = padre['tipoComision'];
					tipoGasto = padre['nombreGasto'];
					tipoGasto.value = comision.selectedOptions[0].innerText;
					break;
			case 'tipoGasto':
					tipoGasto = padre['tipoGasto'];
					nombreGasto = padre['nombreGasto'];
					if(nombreGasto != undefined){
						nombreGasto.value = tipoGasto.selectedOptions[0].innerText;
					}
				break;
		}
	}
	
	function reportesEgresos(e){
		let padre,txt,elem,titulo,tabla,titTres;
		padre = e.target;
		const padreID = padre.id;
		switch(padreID){
			case 'b5':
				titulo = 'REPORTE FACTURAS PAGADAS';
				tabla = formularios[0];
				titTres = 'TOTAL FACTURAS PAGADAS';
				break;
			case 'b6':
				titulo = 'REPORTE RECIBOS PAGADOS';
				tabla = formularios[1];
				titTres = 'TOTAL RECIBOS PAGADOS';
				break;
			case 'b7':
				titulo = 'REPORTE PAGOS DE NÓMINA';
				tabla = formularios[2];
				titTres = 'TOTAL NOMINA PAGADA';
				break;
			case 'b8':
				titulo = 'REPORTE COMISIONES BANCARIAS';
				tabla = formularios[4];
				titTres = 'TOTAL COMISIONES PAGADAS';
				break;
			case 'b9':
				titulo = 'REPORTE CUENTAS POR PAGAR';
				tabla = formularios[3];
				titTres = 'TOTAL CUENTAS POR PAGAR';
				break;
		}
		for(let i = 0; i<2; i++){padre = padre.parentElement;}
		padre.removeChild(padre.lastElementChild);
		/* creacion del titulo*/
		txt = document.createTextNode(titulo);
		elem = formTemp.crearNodo('h2',[],txt);
		const shup = formTemp.crearNodo('div',[['class','showup']],elem);
		txt = document.createTextNode('RESUMEN:');
		elem = formTemp.crearNodo('h3',[],txt);
		shup.appendChild(elem);
		idbquery.retrieveAllTableDataArr(tabla,(r)=>{
			const clave = new Array();
			for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
			const arrOne = new Array();
			const arrTwo = new Array();
			
			/* Agrupamiento y suma de miembros iguales*/
			let sigue = true,total = 0;
			r.forEach((item,index,array)=>{
				arrOne.forEach((it)=>{
					if(it[0] == item[`${clave[2]}`]){
						it[1] += Number(item[`${clave[3]}`]);
						total += Number(item[`${clave[3]}`]);
						sigue = false;
					}
				});
				if(sigue){
					arrOne.push([item[`${clave[2]}`],+item[`${clave[3]}`]]);
					arrTwo.push(item[`${clave[1]}`]);
					total += Number(item[`${clave[3]}`]);
				}
				sigue = true;
			});
			const tvresult = visorDeHistorico(arrOne,arrTwo,titTres,total,tabla,'resinf');
			shup.appendChild(tvresult);
			padre.appendChild(shup);
		});
		
	}
	
	function visorDeHistorico(arrOne,arrTwo,titTres,total,tabla,btnCL){
		let elem,txt,fragcol,fragrow,arrAtt,elemDo;
		fragrow = document.createDocumentFragment();
		arrOne.forEach((item,index)=>{
			if(item[0] != '0'){
				item[1] = Number(item[1]).toFixed(2);
				fragcol = document.createDocumentFragment();
				item.forEach((it)=>{
					txt = document.createTextNode(it);
					elem = formTemp.crearNodo('div',[['class','tvcol']],txt);
					fragcol.appendChild(elem);
				});
				/* icono de informacion*/
				arrAtt = [['class',btnCL],['id',`${btnCL}-${index}`],['src','/apiGrafica/imagenes/info.svg']];
				elem = formTemp.crearNodo('img',arrAtt,false);
				arrAtt = [['class','eliminar'],['id','eliminar'],['href','javascript:void(0);']];
				elemDo = formTemp.crearNodo('a',arrAtt,elem);
				arrAtt = [['class','tvcol']];
				elem = formTemp.crearNodo('div',arrAtt,elemDo); 
				fragcol.appendChild(elem);
				/* nodo de informacion */
				arrAtt = [['type','hidden'],['id',`tipoGasto-${index}`],['value',arrTwo[index]]];
				elem = formTemp.crearNodo('input',arrAtt,false);
				fragcol.appendChild(elem);
				elem = formTemp.crearNodo('div',[['class','tvrow']],fragcol);
				fragrow.appendChild(elem);
				elem = formTemp.crearNodo('div',[['class','tvshow'],['id',`tvshow-${index}`]],false);
				fragrow.appendChild(elem);
			}
		});
		fragcol = document.createDocumentFragment();
		txt = document.createTextNode(titTres);
		elem = formTemp.crearNodo('div',[['class','tvcol']],txt);
		fragcol.appendChild(elem);
		txt = document.createTextNode(total.toFixed(2));
		elem = formTemp.crearNodo('div',[['class','tvcol']],txt);
		fragcol.appendChild(elem);
		elem = formTemp.crearNodo('div',[['class','tvrow']],fragcol);
		fragrow.appendChild(elem);
		const tvresult = formTemp.crearNodo('form',[['class','tvresult']],fragrow);
		arrAtt = [['type','hidden'],['id','formular'],['value',tabla]];
		elem = formTemp.crearNodo('input',arrAtt,false);
		tvresult.appendChild(elem);
		return tvresult;
	}
	
	function infoEgresos(e){
		const elm = e.target;
		const n = elm.id.split('-')[1];
		let padre = elm.parentElement,muestuno;
		if(padre.tagName.toLowerCase() != 'div'){
			while(padre.tagName.toLowerCase() != 'div'){padre = padre.parentElement}
		}
		const nxsib = padre.nextSibling;
		const tipoGasto = nxsib.value;
		const formular = nxsib.form['formular'].value;
		const codEd = pageBehavior.getCookie('propDoc').split(',')[2];
		const jwt = pageBehavior.getCookie('jwt');
		const saiAsig = 'consegre';
		const object = {tipoGasto,formular,codEd,jwt,saiAsig};
		const respuesta = new BackQuery('/consulta/egresos',object).getServDatPO();
		respuesta.then((r) => {
			if(r.length == 0){
				muestuno = formTemp.crearNodo('h3',[],document.createTextNode('Error en Base De Datos!!!!'));
			}else{
				muestuno = muestraDetalles(r);
			}
			const tvshow = document.getElementById(`tvshow-${n}`);
			tvshow.appendChild(muestuno);
		});
		elm.removeAttribute('class');
		elm.setAttribute('class','close');
		
	}
	
	function muestraDetalles(r){
		let elem,txt,fragcol,fragfil;
		const clave = new Array();
		for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
		fragcol = document.createDocumentFragment();
		clave.forEach(item => {
			txt = document.createTextNode(item);
			elem = formTemp.crearNodo('div',[['class','comu']],txt);
			fragcol.appendChild(elem);
		});
		elem = formTemp.crearNodo('div',[['class','fimu']],fragcol);
		const muestuno = formTemp.crearNodo('div',[['class','muestuno']],elem);
		fragfil = document.createDocumentFragment();
		r.forEach(item =>{
			fragcol = document.createDocumentFragment();
			for (const [key, value] of Object.entries(item)) {
				txt = document.createTextNode(`${value}`);
				elem = formTemp.crearNodo('div',[['class','comu']],txt);
				fragcol.appendChild(elem);
			}
			elem = formTemp.crearNodo('div',[['class','fimu']],fragcol);
			fragfil.appendChild(elem);
		});
		muestuno.appendChild(fragfil);
		return muestuno;
	}
	
	function closeInfoEgresos(e){
		const elm = e.target;
		const n = elm.id.split('-')[1];
		const cln = elm.id.split('-')[0];
		let padre = elm.parentElement;
		if(padre.tagName.toLowerCase() != 'div'){
			while(padre.tagName.toLowerCase() != 'div'){padre = padre.parentElement}
		}
		const tvshow = document.getElementById(`tvshow-${n}`);
		while(tvshow.hasChildNodes()){tvshow.removeChild(tvshow.lastChild)}
		elm.removeAttribute('class');
		elm.setAttribute('class',cln);
	}
