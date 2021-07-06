import{EventAsigner} from './eventAss.js';
import {PageBehavior} from './pageBeha.js';
import {BackQuery} from './backQ.js';
import{TablasMuestras} from './tabMue.js';
import {RetrieveDBEgresos} from './retriDBeg.js';
import{FormTemp} from './formTemp.js';
import {Avisos} from './avisos.js';
	const pageBehavior = new PageBehavior();
	const eventAsigner = new EventAsigner();
	const formTemp = new FormTemp();
	const codEd = pageBehavior.getCookie('propDoc').split(',')[2];
	const jwt = pageBehavior.getCookie('jwt');
	const dbName = `edificio_Info-${codEd}`;
	const idbquery = new RetrieveDBEgresos(dbName);
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
		section.addEventListener('keypress',(e)=>{pageBehavior.keyDPressEnt(e);});
		section.addEventListener('input', (e)=>{inputMethod(e);});
		const header = document.getElementsByTagName('header')[0];
		header.addEventListener('click',(e)=>{headclicks(e.target);});
	});
	
	function sectionclick(e){
		e.preventDefault();
		const elemento = e.target;
		const elmID = elemento.id;
		const tagN = elemento.tagName;
		const tgCL = elemento.className;
		switch(elmID){
			case 'NAV-1-ingresos':
			case 'profileButton':
				cargadoPagina(e);
			break;
			case 'NAV-1-recibir':
			case 'join-1-NO':
			case 'END-1-Negativo':
			case 'END-1-Accept':
				recibirdinero(e);
				break;
			case 'NAV-1-confirmar':
				confirmarPago(e);
				break;
			case 'NAV-1-reportar':
			case 'reporte-cancelar':
			case 'END-2-Accept':
			case 'END-2-Negativo':
				ingresosReportar(e);
				break;
			case 'NAV-1-extraordinarios':
				//anteIngresosExtraordinarios(e);
				break;
			case 'ingresar':
				console.log('Ingresa!');
				break;
			case 'GUI-1-ingresar':
				enviarDinero(e);
				break;
			case 'join-1-SI':
				enviardineroDos(e);
				break;
			case 'GUI-3-ingresar':
				enviaReportar(e);
				break;
			case 'reporte-aceptar':
				enviaReportesDos(e);
				break;
			
		}
		if(tagN.toLowerCase() == 'input'){
			if(elemento.type == 'text'){
				elemento.select();
			}
		}
		switch(tgCL){
			case 'GUI-2-muestra-ON':
				muestracuentasON(e);
			break;
			case 'GUI-2-muestra-OFF':
				muestracuentasOFF(e);
			break;
			case 'botrecha':
			case 'botacept':
				rechazarconfirm(e);
			break;
			case 'botAvDos':
				avisodecision(e);
			break;
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
			case 'inmueble':
				setPropietario(e);
				break;
		}
		
	}
	
	function inputMethod(e){
		const elmID = e.target.id;
		const tagN = e.target.tagName;
		const tgCL = e.target.className;
		switch(elmID){
			case 'monto':
				eventAsigner.decimalInput(e);
				break;
		}
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
		});
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
			perfil[0].innerHTML = profItems;
		} 
	}
	
	function principal(){
		window.location.assign(new PageBehavior().getURL('/micuenta'));
	}
	
	function cargandoResumen(){
		/*const propDoc = new PageBehavior('propDoc').getCookie();
		let ingresos = new RetrieveDBEgresos('edificio_Info-'+propDoc.split(',')[1],1);
		ingresos.retrieveAllTableDataArr('facturas_resumen',(r)=>{respProcessOne(r,'facPpag');});
		ingresos.retrieveAllTableDataArr('fact_pend_resumen',(r)=>{respProcessOne(r,'facPorpag');});
		ingresos.retrieveAllTableDataArr('recibos_resumen',(r)=>{respProcessOne(r,'recPag');});
		ingresos.retrieveAllTableDataArr('reci_pend_resumen',(r)=>{respProcessOne(r,'recPorPag');});
		ingresos.retrieveAllTableDataArr('nomina_mes',(r)=>{respProcessOne(r,'nomina');});
		ingresos.retrieveAllTableDataArr('comision_banco',(r)=>{respProcessOne(r,'comisiones');});*/

		document.getElementById('monto 01').innerHTML = '$ 1.450,00';
		document.getElementById('monto 02').innerHTML = '$ 325,00';
		document.getElementById('monto 03').innerHTML = '$ 1.125,00';
		document.getElementById('monto 04').innerHTML = '$ 2.850,00';
		document.getElementById('monto 05').innerHTML = '$ 850,00';
		document.getElementById('monto 06').innerHTML = '$ 2.000,00';
		document.getElementById('monto 07').innerHTML = '$ 2.150,00';
		document.getElementById('monto 08').innerHTML = '$ 325,00';
		document.getElementById('monto 09').innerHTML = '$ 1.825,00';
		document.getElementById('monto 10').innerHTML = '84,88%';
	}
	
	function cargadoPagina(e){
		const perfil = document.getElementsByTagName('SECTION')[0];
		while(perfil.hasChildNodes()){perfil.removeChild(perfil.lastChild)}
		let va = new Array();
		let fD =['botonIzq','NAV-1-ingresos','icon i00','/apiGrafica/imagenes/i-ingresos.png','INGRESOS'];
		let attrb = new Array();
		let compArr = new Array();
		let titulo,img,txt,aa,nod,nod2,nod3,nod4;
//PANEL IZQUIERDO
        const nave = document.createElement('nav');
		//boton principal
		va[0] = ['class','icon i00'];
		va[1] = ['src','/apiGrafica/imagenes/i-ingresos.png'];
		img = formTemp.crearNodo('img',[va[0],va[1]],false);
		txt = document.createTextNode('INGRESOS');
		va[0] = ['id','NAV-1-ingresos'];
		va[1] = ['class','botonIzq'];
		const div = formTemp.crearNodo('div',[va[0],va[1]],img);
		div.appendChild(txt);
		nave.appendChild(div);
		//boton recibir pago
		va[0] = ['class','icon i01'];
		va[1] = ['src','/apiGrafica/imagenes/hmincome.svg'];
		img = formTemp.crearNodo('img',[va[0],va[1]],false);
		txt = document.createTextNode('Recibir dinero');
		va[0] = ['class','boton b1'];
		va[1] = ['id','NAV-1-recibir'];
		va[2] = ['href','javascript:void(0)'];
		aa = formTemp.crearNodo('a',[va[0],va[1],va[2]],img);
		aa.appendChild(txt);
		nave.appendChild(aa);
		//boton confirmar un pago
		va[0] = ['class','icon i01'];
		va[1] = ['src','/apiGrafica/imagenes/check-mark.svg'];
		img = formTemp.crearNodo('img',[va[0],va[1]],false);
		txt = document.createTextNode('Confirmar un pago');
		va[0] = ['class','boton b1'];
		va[1] = ['id','NAV-1-confirmar'];
		va[2] = ['href','javascript:void(0)'];
		aa = formTemp.crearNodo('a',[va[0],va[1],va[2]],img);
		aa.appendChild(txt);
		nave.appendChild(aa);
		//boton reportar un pago
		va[0] = ['class','icon i02'];
		va[1] = ['src','/apiGrafica/imagenes/bills.svg'];
		img = formTemp.crearNodo('img',[va[0],va[1]],false);
		txt = document.createTextNode('Reportar un pago');
		va[0] = ['class','boton b2'];
		va[1] = ['id','NAV-1-reportar'];
		va[2] = ['href','javascript:void(0)'];
		aa = formTemp.crearNodo('a',[va[0],va[1],va[2]],img);
		aa.appendChild(txt);
		nave.appendChild(aa);
		//boton ingresos Extraordinarios
		va[0] = ['class','icon i03'];
		va[1] = ['src','/apiGrafica/imagenes/extra-income.svg'];
		img = formTemp.crearNodo('img',[va[0],va[1]],false);
		txt = document.createTextNode('Ingresos');
		va[0] = ['class','boton b3'];
		va[1] = ['id','NAV-1-extraordinarios'];
		va[2] = ['href','javascript:void(0)'];
		aa = formTemp.crearNodo('a',[va[0],va[1],va[2]],img);
		aa.appendChild(txt);
		aa.appendChild(document.createElement('br'));
		txt = document.createTextNode('Extraordinarios');
		aa.appendChild(txt);
		nave.appendChild(aa);
		perfil.appendChild(nave);
		
//PANEL DERECHO
		// titulo uno
		txt = document.createTextNode('RESUMEN DE INGRESOS');
		titulo = formTemp.crearNodo('div',[['class','titulo']],txt);
		const showup = formTemp.crearNodo('div',[['class','showup'],['id','summary']],titulo);
		//fila uno
		va = new Array();
		//cuadro izquierda
		nod3 = formTemp.crearNodo('div',[['class','resumenIng']],false);
		va[0] = ['id','monto 01'];
		va[1] = ['class','monto 01'];
		nod = formTemp.crearNodo('div',[va[0],va[1]],false);
		txt = document.createTextNode('Total a recaudar mes actual');
		va[2] = ['class','totRec'];
		nod2 = formTemp.crearNodo('div',[va[2]],txt);
		nod2.appendChild(nod);
		nod3.appendChild(nod2);
		//cuadro medio
		va[0] = ['id','monto 02'];
		va[1] = ['class','monto 02'];
		nod = formTemp.crearNodo('div',[va[0],va[1]],false);
		txt = document.createTextNode('Recaudado');
		va[2] = ['class','recaudado'];
		nod2 = formTemp.crearNodo('div',[va[2]],txt);
		nod2.appendChild(nod);
		nod3.appendChild(nod2);
		//cuadro derecha
		va[0] = ['id','monto 03'];
		va[1] = ['class','monto 03'];
		nod = formTemp.crearNodo('div',[va[0],va[1]],false);
		txt = document.createTextNode('Por recaudar');
		va[2] = ['class','porRec'];
		nod2 = formTemp.crearNodo('div',[va[2]],txt);
		nod2.appendChild(nod);
		nod3.appendChild(nod2);	
		showup.appendChild(nod3);
		//titulo dos
		txt = document.createTextNode('RESUMEN CUOTAS EXTRAORDINARIAS');
		titulo = formTemp.crearNodo('div',[['class','titulo2']],txt);
		showup.appendChild(titulo);
		//fila dos
		//cuadro izquierda
		nod3 = formTemp.crearNodo('div',[['class','resumenIng 2']],false);
		va[0] = ['id','monto 04'];
		va[1] = ['class','monto 04'];
		nod = formTemp.crearNodo('div',[va[0],va[1]],false);
		txt = document.createTextNode('Total a recaudar mes actual');
		va[2] = ['class','tRecCE'];
		nod2 = formTemp.crearNodo('div',[va[2]],txt);
		nod2.appendChild(nod);
		nod3.appendChild(nod2);
		//cuadro medio
		va[0] = ['id','monto 05'];
		va[1] = ['class','monto 05'];
		nod = formTemp.crearNodo('div',[va[0],va[1]],false);
		txt = document.createTextNode('Recaudado');
		va[2] = ['class','recaudadoCE'];
		nod2 = formTemp.crearNodo('div',[va[2]],txt);
		nod2.appendChild(nod);
		nod3.appendChild(nod2);
		//cuadro derecha
		va[0] = ['id','monto 06'];
		va[1] = ['class','monto 06'];
		nod = formTemp.crearNodo('div',[va[0],va[1]],false);
		txt = document.createTextNode('Por recaudar');
		va[2] = ['class','porRecCE'];
		nod2 = formTemp.crearNodo('div',[va[2]],txt);
		nod2.appendChild(nod);
		nod3.appendChild(nod2);	
		showup.appendChild(nod3);		
		// titulo tres
		txt = document.createTextNode('BALANCE GENERAL');
		titulo = formTemp.crearNodo('div',[['class','titulo3']],txt);
		showup.appendChild(titulo);
		//fila tres
		va = null;
		//cuadro 1
		nod3 = formTemp.crearNodo('div',[['class','resumenIng 3']],false);
		txt = document.createTextNode('TOTAL POR COBRAR');
		nod2 = formTemp.crearNodo('div',[['class','totRecBG']],txt);
		txt = document.createTextNode('Morosidad + Mes actual');
		nod = formTemp.crearNodo('div',[['class','subTitulo']],txt);
		nod2.appendChild(nod);
		nod = formTemp.crearNodo('div',[['class','monto 07'],['id','monto 07']],false);
		nod2.appendChild(nod);
		nod3.appendChild(nod2);
		//cuadro 2
		txt = document.createTextNode('Recaudado');
		nod2 = formTemp.crearNodo('div',[['class','recaudadoBG']],txt);
		txt = document.createTextNode('Mes actual');
		nod = formTemp.crearNodo('div',[['class','subTitulo']],txt);
		nod2.appendChild(nod);
		nod = formTemp.crearNodo('div',[['class','monto 08'],['id','monto 08']],false);
		nod2.appendChild(nod);
		nod3.appendChild(nod2);
		//cuadro 3
		txt = document.createTextNode('Por RECAUDAR');
		nod2 = formTemp.crearNodo('div',[['class','porRecBG']],txt);
		txt = document.createTextNode('Incluye morosidad');
		nod = formTemp.crearNodo('div',[['class','subTitulo']],txt);
		nod2.appendChild(nod);
		nod4 = formTemp.crearNodo('div',[['class','monto 09'],['id','monto 09']],false);
		nod2.appendChild(nod4);
		nod3.appendChild(nod2);
		// cuadro 4
		txt = document.createTextNode('% Morosidad');
		nod2 = formTemp.crearNodo('div',[['class','porcMorosidad']],txt);
		txt = document.createTextNode('Total');
		nod = formTemp.crearNodo('div',[['class','subTitulo']],txt);
		nod2.appendChild(nod);
		nod4 = formTemp.crearNodo('div',[['class','monto 10'],['id','monto 10']],false);
		nod2.appendChild(nod4);
		nod3.appendChild(nod2);	
		showup.appendChild(nod3);			
		perfil.appendChild(showup);
		cargandoResumen();
	}
	
	//GUI-3 
	function ingresosReportar(e){
		let titulo,txt,select,input;
		let va = new Array();
		const showup = document.getElementsByClassName('showup')[0];
		while(showup.hasChildNodes()){showup.removeChild(showup.lastChild)}
		txt = document.createTextNode('REPORTAR PAGO');
		titulo = formTemp.crearNodo('div',[['class','titulo']],txt);
		showup.appendChild(titulo);
		const formpago = formTemp.crearNodo('div',[['class','formPago']],false);
		const form = formTemp.crearNodo('form',[['class','formpa']],formpago);
		select = formTemp.createSelect([['id','inmueble']],[['Unidad','']]);
		formpago.appendChild(select);
		formpago.appendChild(document.createElement('br'));
		va[0] = ['id','propietario'];
		va[1] = ['type','text'];
		va[2] = ['placeholder','Propietario'];
		va[3] = ['disabled','true'];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		formpago.appendChild(document.createElement('br'));
		txt = document.createTextNode('Saldo a Favor:');
		titulo = formTemp.crearNodo('p',[],txt);
		formpago.appendChild(titulo);
		va[0] = ['id','saldo'];
		va[1] = ['type','text'];
		va[2] = ['placeholder','$ 0,00'];
		va[3] = ['disabled','true'];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		formpago.appendChild(document.createElement('br'));
		txt = document.createTextNode('Monto adeudado:');
		titulo = formTemp.crearNodo('p',[],txt);
		formpago.appendChild(titulo);
		va[0] = ['id','deuda'];
		va[1] = ['type','text'];
		va[2] = ['placeholder','$ 0,00'];
		va[3] = ['disabled','true'];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		formpago.appendChild(document.createElement('br'));
		txt = document.createTextNode('Monto a cancelar:');
		titulo = formTemp.crearNodo('p',[],txt);
		formpago.appendChild(titulo);
		va[0] = ['id','cancelar'];
		va[1] = ['type','text'];
		va[2] = ['placeholder','$ 0,00'];
		va[3] = ['disabled','true'];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		formpago.appendChild(document.createElement('br'));
		//hidden inputs
		idbquery.retrieveAllTableDataArr('int_multa',(r)=>{
			va = new Array();
			va[0] = ['id','interes'];
			va[1] = ['type','hidden'];
			va[2] = ['value',r[0]['interes']];
			input = formTemp.crearNodo('input',va,false);
			formpago.appendChild(input);
			va = new Array();
			va[0] = ['id','multa'];
			va[1] = ['type','hidden'];
			va[2] = ['value',r[0]['multa']];
			input = formTemp.crearNodo('input',va,false);
			formpago.appendChild(input);
		});
		va = new Array();
		va[0] = ['id','saiAsig'];
		va[1] = ['type','hidden'];
		va[2] = ['value','ctacobpag'];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		va = new Array();
		va[0] = ['id','codEd'];
		va[1] = ['type','hidden'];
		va[2] = ['value',codEd];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		va = new Array();
		va[0] = ['id','jwt'];
		va[1] = ['type','hidden'];
		va[2] = ['value',jwt];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		//boton
		txt = document.createTextNode('Reportar');
		input = formTemp.crearNodo('button',[['id','GUI-3-ingresar']],txt);
		formpago.appendChild(input);
		showup.appendChild(form);
		// poblando el campo unidad
		idbquery.retrieveAllTableDataArr('unidades',(r)=>{
			const arrUd = new Array();
			r.forEach(item => {
				arrUd.push([item['unidad'],item['unidad']]);
			});
			formTemp.insertSelOptions('inmueble',arrUd);
		});
	}
	
	function enviaReportar(e){
		const elm = e.target;
		const tabla = 'cxc';
		const key = 'unidad';
		const keyser = 'inmueble';
		let showup = elm.parentElement;
		for(let i =0; i<2;i++){showup = showup.parentElement}
		const form = elm.form;
		const object = formTemp.checkEmptyElem(form)[0];
console.log(object);
		let saldo = Number(object['saldo']);
		let objpag = new Object(); //recoleccion de los recibos a pagar
		let ve,dv; //dias de vencida
		let diasMora,carInt,multa; //interes adicional por deuda vencida
		let apagar; //monto total a pagar
		let cap = new Array(); // cuentas por cobrar que van a ser pagadas
		idbquery.retrieveAllTableDataArr(tabla,(r)=>{
			const cxc = new Array(); // cuentas por cobrar existentes
			r.forEach(item => {if(item[key] == object[keyser]){cxc.push(item);}});
			//total de cuentas pendientes
			for(let i = 0; i<cxc.length;i++){
				//1. La deuda esta vencida?
				ve = cxc[i]['vencimiento'].split('/');
				dv = pageBehavior.vencENdias(`${ve[1]}/${ve[0]}/${ve[2]}`);
				if(dv < 0){ //esta vencida
					diasMora = (-1)*dv;
					carInt = +(object['interes'])*(0.01)*(+cxc[i]['monto'])*(diasMora/365);
					multa = +object['multa'];
				}else{ //no esta vencida
					diasMora = 0;
					carInt = 0;
					multa = 0;
				}
console.log(dv,carInt,multa);
				//2. hay saldo suficiente para pagar
				apagar = +cxc[i]['monto']+carInt+multa;
				if(saldo >= apagar){ //hay suficiente fondo para cubrir esta cuenta
					objpag = cxc[i];
					objpag['dmora'] = diasMora; // dias de morosidad
					objpag['carint'] = carInt.toFixed(2); // cargo de intereses de mora
					objpag['mulpag'] = multa; //multa a pagar por la mora
					objpag['apagar'] = apagar.toFixed(2); // total a pagar
					objpag['tipo'] = 'Pago';
					saldo -= apagar;
					cap.push(objpag);
				}else{// no hay suficiente monto para cubrir esta cuenta
					objpag = cxc[i];
					objpag['dmora'] = diasMora; // dias de morosidad
					objpag['carint'] = carInt.toFixed(2); // cargo de intereses de mora
					objpag['mulpag'] = 0; //la multa para cuando se termine de pagr la cta
					objpag['apagar'] = saldo.toFixed(2); // total a pagar					
					objpag['tipo'] = 'Abono';
					saldo -= saldo;
					cap.push(objpag);
					break;
				}	
			}
			//presentacion de cuentas por cobrar que van a ser pagadas cap en dialogo
			const arrRows = new Array();
			arrRows.push([`Serán Reportados los Siguientes Pagos para el Inmueble ${object['inmueble']}:`]);
			arrRows.push(['Recibo','Emision','Vencimiento','Monto','Mora','Multa','Total','Modo']);
			cap.forEach(item => {
				arrRows.push([item['control'].padStart(3,0),item['fecha'],item['vencimiento'],Number(item['monto']).toFixed(2),item['carint'],item['mulpag'].toFixed(2),item['apagar'],item['tipo']]);
				
			});
		const arrBot = [['reporte-cancelar','Cancelar'],['reporte-aceptar','Aceptar']]
		const arrContAtt = [['reporteDos','contRep1'],['subReporteDos','suCoRep1']];	
		const avis = avisos.dialogAvisoThree(arrRows,arrBot,arrContAtt);	
		while(showup.hasChildNodes()){showup.removeChild(showup.lastChild)}
		showup.appendChild(avis);
		/* envio a base de datos*/
		let arrAttrb,inp;
		const nodInf = new Array(['object',JSON.stringify(object)],['cap',JSON.stringify(cap)]);
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			inp = formTemp.crearNodo('input',arrAttrb,false);
			showup.appendChild(inp);
		});		
console.log(cap);	
console.log(cxc);
		});
	}
	
	function enviaReportesDos(e){
		const elm = e.target;
		let showup = elm.parentElement;
		for (let i = 0;i<4;i++){showup = showup.parentElement}
		const object = JSON.parse(showup.childNodes[1].value);
		const cap = JSON.parse(showup.childNodes[2].value);
		object['cap'] = cap;
		const url = '/registro/ingresos';
		const respuesta = new BackQuery(url,object).afirma();
		respuesta.then(res => {
			dialogoAvisoDosAfirm(showup,object,res);
			if(res == 'Afirmativo'){
				//1. actualizar los saldos propietarios en local
				//2. dirigir dinero hacia las cuentas correspondientes
				// 3 . en realidad en este moemto se actualiza todo
			}
		})
		
	}
	
	function cargaEdificioInfo(selID,tabla,indic,port,condicion){
		let bd = 'edificio_Info-'+pageBehavior.getCookie('propDoc').split(',')[2];
		let edifInf = new RetrieveDBEgresos(bd);
		edifInf.retrieveAllTableDataArr(tabla,(r)=>{formEdificioInfoPrueba(r,selID,indic,port,condicion);});
	}
	
	
	function formEdificioInfoPrueba(r,selID,indic,port,condicion){
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
	
	function setPropietario(e){
		const tabla = 'unidades';
		const tabla2 = 'cxc';
		const key = 'unidad';
		const unidad = e.target;
		const form = unidad.form;
		const inpAsig = form['propietario'];
		const saldo = form['saldo'];
		const deuda = form['deuda'];
		const inmueble = unidad.value;
		const cancelar = form['cancelar'];
		idbquery.retrieveAllTableDataArr(tabla,(x)=>{
			let object;
			x.forEach((item)=>{if(item[key] == inmueble){object = item;}});
			if(object.Nombre == null || object.Apellido == null){
				inpAsig.value = object.cuenta_propietario;
			}else{
				inpAsig.value = object.Nombre+' '+object.Apellido;
			}
			saldo.value = object.saldo;
			const cxc = new Array();
			idbquery.retrieveAllTableDataArr(tabla2,(x)=>{
				x.forEach((item)=>{if(item[key] == inmueble){cxc.push(item);}});
				let debe = 0;
				cxc.forEach(item => {debe += Number(item['monto']);});
				deuda.value = debe.toFixed(2);
				//total a pagar
				let apagar;
				if(Number(object.saldo) >= debe){
					apagar = debe;
				}else{
					apagar = Number(object.saldo);
				}
				cancelar.value = apagar.toFixed(2);	
			});
		});
	
	}
	
	
	//GUI-1
	function recibirdinero(e){
		let txt,titulo,select,input,monto,propietario,referencia;
		let showup,selInd1,selInd2,selFl = false,object;
		let va = new Array();
		const elm = e.target;
		const elmID = elm.id;
		const padre = elm.parentElement;
		switch(elmID){
			case 'NAV-1-recibir':
				showup = padre.nextElementSibling;
				monto = '';
				propietario = '';
				referencia = '';
				break;
			case 'END-1-Accept':
				showup = padre.parentElement;
				for(let i=0;i<2;i++){showup = showup.parentElement}
				monto = '';
				propietario = '';
				referencia = '';
				break;
			case 'join-1-NO':
				showup = padre.parentElement;
				for(let i=0;i<2;i++){showup = showup.parentElement}
				object = JSON.parse(showup.lastElementChild.value);
				selInd1 = object['selInd1'];
				selInd2 = object['selInd2'];
				selFl = true;
				monto = Number(object['total']).toFixed(2);
				propietario = object['propietario'];
				referencia = object['referencia'];
				break;
			case 'END-1-Negativo':
				showup = padre.parentElement;
				for(let i=0;i<2;i++){showup = showup.parentElement}
				object = JSON.parse(showup.lastElementChild.value);
				selInd1 = object['selInd1'];
				selInd2 = object['selInd2'];
				selFl = true;
				monto = Number(object['total']).toFixed(2);
				propietario = object['propietario'];
				referencia = object['referencia'];
				break;
		}
		while(showup.hasChildNodes()){showup.removeChild(showup.lastChild)}
		//titulo
		txt = document.createTextNode('Recibir Dinero');
		titulo = formTemp.crearNodo('div',[['class','titulo']],txt);
		showup.appendChild(titulo);
		//formulario
		const formpago = formTemp.crearNodo('div',[['class','formPago2']],false);
		const form = formTemp.crearNodo('form',[['class','formpa2']],formpago);
		select = formTemp.createSelect([['id','inmueble']],[['Unidad','']]);
		formpago.appendChild(select);
		va[0] = ['id','propietario'];
		va[1] = ['type','text'];
		va[2] = ['placeholder','Propietario'];
		va[3] = ['disabled','true'];
		va[4] = ['value',propietario];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		va = new Array();
		const hoy = pageBehavior.getFechaHoyNum();
		va[0] = ['id','fecha'];
		va[1] = ['type','text'];
		va[3] = ['disabled','true'];
		va[4] = ['value',`${hoy[2]}/${hoy[1]}/${hoy[0]}`];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		va = new Array();
		va[0] = ['id','monto'];
		va[1] = ['type','text'];
		va[2] = ['placeholder','Monto $ 0.00'];
		va[3] = ['maxlength','15'];
		va[4] = ['value',monto];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		select = formTemp.createSelect([['id','pago']],[['Forma de pago',''],['Efectivo','dineroEfec'],['Transferencia','dineroBan']]);
		formpago.appendChild(select);
		va = new Array();
		va[0] = ['id','referencia'];
		va[1] = ['type','text'];
		va[2] = ['placeholder','Referencia, Ej. Banco y transacción #'];
		va[3] = ['maxlength','80'];
		va[4] = ['value',referencia];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		//hidden inputs
		va = new Array();
		va[0] = ['id','saiAsig'];
		va[1] = ['type','hidden'];
		va[2] = ['value','reporpag'];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		va[0] = ['id','codEd'];
		va[1] = ['type','hidden'];
		va[2] = ['value',codEd];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		va[0] = ['id','jwt'];
		va[1] = ['type','hidden'];
		va[2] = ['value',jwt];
		input = formTemp.crearNodo('input',va,false);
		formpago.appendChild(input);
		//boton
		txt = document.createTextNode('Ingresar');
		input = formTemp.crearNodo('button',[['id','GUI-1-ingresar']],txt);
		formpago.appendChild(input);
		showup.appendChild(form);
		//poblando el campo unidad
		idbquery.retrieveAllTableDataArr('unidades',(r)=>{
			const arrUd = new Array();
			r.forEach(item => {
				arrUd.push([item['unidad'],item['unidad']]);
			});
			formTemp.insertSelOptions('inmueble',arrUd);
		});
		if(selFl){
			setTimeout(()=>{
				form.elements[0].selectedIndex = selInd1;
				form.elements[4].selectedIndex = selInd2;
			},100);
		}
	}
	
	//join-1
	function enviarDinero(e){
		const elm = e.target;
		let padre = elm.parentElement;
		const obj = formTemp.checkEmptyElem(padre.parentElement);
		const flag = obj[1];
		const object = obj[0];
		const selInd1 = document.forms[0].elements[0].selectedIndex;
		const selInd2 = document.forms[0].elements[4].selectedIndex;
		object['selInd1'] = selInd1;
		object['selInd2'] = selInd2;
		for(let i =0 ; i<2;i++){padre = padre.parentElement}
		if(flag){
			const total = Number(object['total']).toFixed(2);
			const referencia = object['referencia'].substring(0,50);
			const arrRows =[['Esta por Ingresar un Pago:'],
						  [`para ${object['propietario']}`],
						  [`Propietario de la Unidad ${object['inmueble']} por un Monto de $ ${Number(object['total']).toFixed(2)}`],
						  [`pagado en ${object['pago']} bajo la referencia:`],
						  [referencia],
						  ['¿Desea Continuar?']];
			const arrBot = [['join-1-NO','NO'],['join-1-SI','SI']];
			const arrContAtt = [['contDos','contFac1'],['subContDos','subContFac1']];
			const avis = avisos.dialogAvisoThree(arrRows,arrBot,arrContAtt);
			while(padre.hasChildNodes()){padre.removeChild(padre.lastChild);}
			padre.appendChild(avis);
			/* envio a base de datos*/
			let arrAttrb,inp;
			const nodInf = new Array(['object',JSON.stringify(object)]);
			nodInf.forEach((item,index,array)=>{
				arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
				inp = formTemp.crearNodo('input',arrAttrb,false);
				padre.appendChild(inp);
			});	
		}
	}
	
	function enviardineroDos(e){
		const elm = e.target;
		let showup = elm.parentElement;
		for(let i = 0; i<4;i++){showup = showup.parentElement;}
		const url = '/registro/ingresos';
		const object = JSON.parse(showup.lastChild.value);
		const respuesta = new BackQuery(url,object).afirma();
		respuesta.then(res => {
			dialogoAvisoUnoAfirm(showup,object,res);
			if(res == 'Afirmativo'){
				idbquery.retrieveAllTableDataArr('pag_no_ver',(r)=>{insertarDBlocal(r,'pag_no_ver',object)});
			}
		});
	}
	
	function insertarDBlocal(arr,tabla,object){
		let control = 1;
		let flag = true;
		while(flag){//hastq que se encuentre el numero
			for(let i = 0; i< arr.length;i++){
				if(arr[i]['control'] == control){ // si el numero existe descarta ese y busca otro
					control++;
					break;
				}
				if(i == arr.length-1 && arr[i]['control'] != control){
					flag = false; //no se encontro ningun numero igual, no hace falta repetir
				}
			}
		}
		control = control.toString();
		const unidad = object['inmueble'];
		const fecha = object['fecha'];
		const monto = Number(object['total']).toFixed(2);
		const referencia = object['referencia'];
		const objData = {control,unidad,fecha,monto,referencia};
		idbquery.addDataToTable(tabla,objData)
	}
	
	// END-1
	function dialogoAvisoUnoAfirm(elem,object,res){
		let arrAv,botID,vari2,vari3,vari4;
		if(res == 'Afirmativo'){
			arrAv = [['Fue registrado El Ingreso'],
				[`Proveniente de ${object.propietario}`],
				[`Propietario de la Unidad ${object.inmueble}`],
				[`por un monto de ${Number(object.total).toFixed(2)}`]];
			botID = 'END-1-Accept';
		}else if(res == 'Negativo'){
			arrAv = [['El Ingreso Introducido'],
					['NO Pudo ser Registrado']];
			botID = 'END-1-Negativo';	
		}
		const arrAttCont = [['avisoDos','contRegFac1'],['subAvisoDos','suCoReFac1']];	
		const avis = avisos.dialogAvisoOne(arrAv,botID,arrAttCont);	
		while(elem.hasChildNodes()){elem.removeChild(elem.lastChild);}
		elem.appendChild(avis);
		/* envio a base de datos*/
		let arrAttrb,inp;
		const nodInf = new Array(['object',JSON.stringify(object)]);
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			inp = formTemp.crearNodo('input',arrAttrb,false);
			elem.appendChild(inp);
		});	
	}

	// END-2
	function dialogoAvisoDosAfirm(elem,object,res){
		let arrAv,botID,vari2,vari3,vari4;
		if(res == 'Afirmativo'){
			arrAv = [['Fue reportado El Pago'],
				[`Proveniente de ${object.propietario}`],
				[`Propietario de la Unidad ${object.inmueble}`],
				[`por un monto de ${Number(object.saldo).toFixed(2)}`]];
			botID = 'END-2-Accept';
		}else if(res == 'Negativo'){
			arrAv = [['El Ingreso Introducido'],
					['NO Pudo ser Registrado']];
			botID = 'END-2-Negativo';	
		}
		const arrAttCont = [['avisoDos','contRegFac1'],['subAvisoDos','suCoReFac1']];	
		const avis = avisos.dialogAvisoOne(arrAv,botID,arrAttCont);	
		while(elem.hasChildNodes()){elem.removeChild(elem.lastChild);}
		elem.appendChild(avis);
		/* envio a base de datos*/
		let arrAttrb,inp;
		const nodInf = new Array(['object',JSON.stringify(object)]);
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			inp = formTemp.crearNodo('input',arrAttrb,false);
			elem.appendChild(inp);
		});	
	}


	//GUI-2
	function confirmarPago(e){
		let txt,titulo,tr,td,img,atr,inp;
		const tabla = 'pag_no_ver';
		const cabtab = ['Fecha','Unidad','Monto','Info'];
		const ke = ['fecha','unidad','monto'];
		const elm = e.target;
		let showup = elm.parentElement.nextElementSibling;
		while(showup.hasChildNodes()){showup.removeChild(showup.lastChild)}
		//titulo
		txt = document.createTextNode('Pagos Por Confirmar');
		titulo = formTemp.crearNodo('div',[['class','titulo']],txt);
		showup.appendChild(titulo);
		
		tr = formTemp.crearNodo('div',[['class','rowtit']],false);
		cabtab.forEach(item => {
			txt = document.createTextNode(item);
			td = formTemp.crearNodo('div',[['class','coltit']],txt);
			tr.appendChild(td);
		});
		const table = formTemp.crearNodo('div',[['class','table']],tr);
		const confcont = formTemp.crearNodo('div',[['class','confcont']],table);
		showup.appendChild(confcont);
		idbquery.retrieveAllTableDataArr(tabla,(r)=>{
			r.forEach((item,index)=>{
				tr = formTemp.crearNodo('div',[['class','rowbod'],['id',`rowbod-${index}`]],false);
				ke.forEach(it =>{
					txt = document.createTextNode(`${item[it]}`);
					td = formTemp.crearNodo('div',[['class','colbo']],txt);
					tr.appendChild(td);
				});
				atr = [['src','/apiGrafica/imagenes/down_chevron.svg'],
						['class','GUI-2-muestra-ON'],['id',`GUI-2-muestra-ON-${index}`]];
				img = formTemp.crearNodo('img',atr,false);
				td = formTemp.crearNodo('div',[['class','colbo']],img);
				tr.appendChild(td);
				atr = [['type','hidden'],['id',`control-${index}`],['value',item['control']]];
				inp = formTemp.crearNodo('input',atr,false);
				tr.appendChild(inp);
				atr = [['type','hidden'],['id',`referencia-${index}`],['value',item['referencia']]];
				inp = formTemp.crearNodo('input',atr,false);
				tr.appendChild(inp);
				atr = [['type','hidden'],['id',`tipo_pago-${index}`],['value',item['tipo_pago']]];
				inp = formTemp.crearNodo('input',atr,false);
				tr.appendChild(inp);
				table.appendChild(tr);
				tr = formTemp.crearNodo('div',[['class','rowinfo'],['id',`rowinfo-${index}`]],false);
				table.appendChild(tr);
			});

		});
	}
	//GUI-2
	function muestracuentasON(e){
		const elm = e.target;
		const tabla = 'unidades';
		const key = 'unidad';
		const n = elm.id.split('-')[4];
		elm.removeAttribute('class');
		elm.setAttribute('class','GUI-2-muestra-OFF');
		elm.removeAttribute('src');
		elm.setAttribute('src','/apiGrafica/imagenes/up_chevron.svg');
		const rowbod = elm.parentElement.parentElement;
		const rowchild = rowbod.children;
		const fecha = rowchild[0].innerText;
		const inmueble = rowchild[1].innerText;
		const total = rowchild[2].innerText;
		const control = rowchild[`control-${n}`].value;
		const referencia = rowchild[`referencia-${n}`].value;
		const rowinfo = rowbod.nextElementSibling;
		let txt,p,div,nombre,apellido,boton,attr;
		idbquery.retriMultDataByIdex(tabla,key,inmueble,(r)=>{
			if(r[0]['Nombre'] == null){nombre = 'Usuario'}else{nombre = r[0]['Nombre']}
			if(r[0]['Apellido'] == null){apellido = 'No Registrado'}else{apellido = r[0]['Apellido']}
			txt = document.createTextNode('Propietario:');
			p = formTemp.crearNodo('p',[],txt);
			rowinfo.appendChild(p);
			txt = document.createTextNode(`${nombre} ${apellido} ${r[0]['cuenta_propietario']}`);
			div = formTemp.crearNodo('div',[['class','roindet']],txt);
			rowinfo.appendChild(div);
			txt = document.createTextNode('Referencia:');
			p = formTemp.crearNodo('p',[],txt);
			rowinfo.appendChild(p);
			txt = document.createTextNode(`${referencia}`);
			div = formTemp.crearNodo('div',[['class','roindet']],txt);
			rowinfo.appendChild(div);
			//id propietario
			div = formTemp.crearNodo('input',[['type','hidden'],['id',`id_prop-${n}`],['value',r[0]['id_prop']]],false);
			rowinfo.appendChild(div);
			//saldo
			div = formTemp.crearNodo('input',[['type','hidden'],['id',`saldo-${n}`],['value',r[0]['saldo']]],false);
			rowinfo.appendChild(div);
			//botones
			txt = document.createTextNode('Rechazar');
			attr = [['class','botrecha'],['id',`GUI-2-botrecha-${n}`]];
			boton = formTemp.crearNodo('button',attr,txt);
			div = formTemp.crearNodo('div',[['class','roindet']],boton);
			txt = document.createTextNode('Aceptar');
			attr = [['class','botacept'],['id',`GUI-2-botacept-${n}`],['value','Aceptar']];
			boton = formTemp.crearNodo('button',attr,txt);
			div.appendChild(boton);
			rowinfo.appendChild(div);
		});
		
	}
	
	function muestracuentasOFF(e){
		const elm = e.target;
		const n = elm.id.split('-')[4];
		elm.removeAttribute('class');
		elm.setAttribute('class','GUI-2-muestra-ON');
		elm.removeAttribute('src');
		elm.setAttribute('src','/apiGrafica/imagenes/down_chevron.svg');
		const rowbod = elm.parentElement.parentElement;
		const rowinfo = rowbod.nextElementSibling;
		while(rowinfo.hasChildNodes()){rowinfo.removeChild(rowinfo.lastChild)}
	}
	
	//sub-GUI-2
	function rechazarconfirm(e){
		let condicion,lin1,lin2;
		const elm = e.target;
		const clname = elm.className;
		switch(clname){
			case 'botrecha':
				condicion = 'rechazo';
				lin1 = 'Esta por Rechazar el Pago:';
				lin2 = 'rech';
			break;
			case 'botacept':
				condicion = 'aceptac';
				lin1 = 'Esta por Aceptar el Pago:';
				lin2 = 'acep';
			break;
		}
		const n = elm.id.split('-')[3];
		const rowinfo = elm.parentElement.parentElement;
		const rowbod = rowinfo.previousSibling;
		const rowchild = rowbod.children;
		const control = rowchild[`control-${n}`].value;
		const tipopago = rowchild[`tipo_pago-${n}`].value;
		const saiAsig = 'AccRej';
		const fecha = rowchild[0].innerText;
		const inmueble = rowchild[1].innerText;
		const total = rowchild[2].innerText;
		const id_prop = rowinfo.children[4].value;
		const saldo = rowinfo.children[5].value;
		const object = {id_prop,saldo,fecha,inmueble,total,condicion,control,tipopago,saiAsig,codEd,jwt};
		while(rowinfo.hasChildNodes()){rowinfo.removeChild(rowinfo.lastChild)}
		const arrRows =[[lin1],
						[`de la unidad ${inmueble} y monto $ ${total}.`],
						['¿Desea Continuar?']];
		const arrBot = [[`${lin2}-GUI-2-NO-${n}`,'NO'],[`${lin2}-GUI-2-SI-${n}`,'SI']];
		const arrContAtt = [['cont3','contFac1'],['subCont3','subContFac1']];
		const avis = avisos.dialogAvisoThree(arrRows,arrBot,arrContAtt);
		rowinfo.appendChild(avis);
		/* envio a base de datos*/
		let arrAttrb,inp;
		const nodInf = new Array(['object',JSON.stringify(object)]);
		nodInf.forEach((item,index,array)=>{
			arrAttrb = [['type','hidden'],['id',item[0]],['value',item[1]]];
			inp = formTemp.crearNodo('input',arrAttrb,false);
			avis.appendChild(inp);
		});	
		
	}
	
	function avisodecision(e){
		const elm = e.target;
		const elmID = elm.id;
		const idcomp = elmID.split('-');
		const crit = idcomp[0];
		const n = idcomp[4];
		const cond = idcomp[3];
		switch(crit){
			case 'rech':
				if(cond == 'NO'){cierradialogo(e);}
				if(cond == 'SI'){sigueAceptaRecha(e);}
			break;
			case 'acep':
				if(cond == 'NO'){cierradialogo(e);}
				if(cond == 'SI'){sigueAceptaRecha(e);}
			break;
			case 'pass':
				if(cond == 'NO'){cierradialogo(e);}
				if(cond == 'SI'){verificaPago(e);}			
			break;
			case 'verif':
					if(cond == 'NO'){sigueAceptaRecha(e);}
					if(cond == 'SI'){afirmaAceptar(e);}
			break;
		}
		
	}
	
	function cierradialogo(e){
		const elm = e.target;
		let rowinfo = elm.parentElement;
		for (let i =0;i<4;i++){rowinfo = rowinfo.parentElement};
		const rowbod = rowinfo.previousSibling;
		rowbod.children[3].children[0].click();
	}
	
	function sigueAceptaRecha(e){
		const elm = e.target;
		let div,txt,inp,attr,div2,form;
		let subCont3 = elm.parentElement;
		for (let i =0;i<2;i++){subCont3 = subCont3.parentElement};
		const rowinfo = subCont3.parentElement.parentElement;
		const n = rowinfo.id.split('-')[1];
		while(subCont3.hasChildNodes()){subCont3.removeChild(subCont3.lastChild)}
		txt = document.createTextNode('Introduzca su Clave de Acceso');
		div = formTemp.crearNodo('div',[['class','saRowDos']],txt);
		subCont3.appendChild(div);
		attr = [['type','password'],['id',`password-${n}`],['autocomplete','off'],['autofocus','true']];
		inp = formTemp.crearNodo('input',attr,false);
		form = formTemp.crearNodo('form',[['id',`form-${n}`]],inp);
		div = formTemp.crearNodo('div',[['class','saRowDos']],form);
		subCont3.appendChild(div);
		//botones
		div = formTemp.crearNodo('div',[['class','butRowOne']],false);
		txt = document.createTextNode('Cancelar');
		attr = [['class','botAvDos'],['id',`pass-Av-1-NO-${n}`]]; 
		inp = formTemp.crearNodo('button',attr,txt);
		div2 = formTemp.crearNodo('div',[['class','avColBut']],inp);
		div.appendChild(div2);
		txt = document.createTextNode('Seguir');
		attr = [['class','botAvDos'],['id',`pass-Av-1-SI-${n}`]]; 
		inp = formTemp.crearNodo('button',attr,txt);
		div2 = formTemp.crearNodo('div',[['class','avColBut']],inp);
		div.appendChild(div2);
		subCont3.appendChild(div);
	}
	
	function verificaPago(e){
		const elm = e.target;
		const elmID = elm.id;
		const idcomp = elmID.split('-');
		const n = idcomp[4];
		let cont3 = elm.parentElement;
		for(let i=0;i<3;i++){cont3 = cont3.parentElement;}
		const pass = document.forms[`form-${n}`].children[`password-${n}`].value;
		if(pass == ''){
			alert('Introduzca Su Clave de Acceso');
		}else{
			const object = JSON.parse(cont3.lastChild.value);
			const url = '/registro/ingresos';
			object['email'] = pageBehavior.getCookie('profile').split(',')[2];
			object['password'] = document.forms[`form-${n}`].children[`password-${n}`].value;
			const respuesta = new BackQuery(url,object).afirma();
			respuesta.then(res => {
				verificaAfirmativo(res,cont3,n);
				if(res == 'Afirmativo'){
					//remueve de la base datos local el pendiente
					idbquery.removeDataInTable('pag_no_ver',object['control']);
					//actualiza en la base datos local el saldo
					const newval = (Number(object['saldo']) + Number(object['total'])).toFixed(2);
					idbquery.updateDataInTable('unidades',object['id_prop'],'saldo',newval);
					//introduce nuevo valor a la cta afectada en local			
					const d = new Date();
					idbquery.retrieveAllTableDataArr(object['tipopago'],(r)=>{
						const clave = new Array();
						for (const [key, value] of Object.entries(r[0])) {clave.push(`${key}`);}
						const arrTwo = new Array();  
						r.forEach((it,index,array)=>{arrTwo.push(Number(it[`${clave[0]}`]));});
						arrTwo.sort((a, b) => a - b);
						const neuInd = +(arrTwo[arrTwo.length-1])+1;
						const fecha = `${d.getFullYear()}-${String((d.getMonth()+1)).padStart(2, "0")}-${d.getDate()}`;
						const nueMon = +object['total'];
						const nueVals = [neuInd,fecha,nueMon];
						const objData = new Object();
						clave.forEach((ite,ind,array)=>{objData[ite] = String(nueVals[ind])});
						idbquery.addDataToTable(object['tipopago'],objData);
					});	
				}
			});
		}
	}

	
	function verificaAfirmativo(res,padre,n){
		let texto1,texto2,texto3,btnID;
		if(res == 'Afirmativo'){
			texto1 = 'El Pago Fue Verificado';
			texto2 = 'Con Exito';
			texto3 = 'Proceda a Reportar El Pago';
			btnID = 'verif-Ac-1-SI-0';
		}else if(res == 'Negativo'){
			texto1 = 'El pago no pudo ser Verificado';
			texto2 = 'Usuario, Clave Inválida o';
			texto3 = 'Última confirmación No Reportada';
			btnID = 'verif-Ac-1-NO-0';
		}		
		const subCont3 = padre.children[0];
		while(subCont3.hasChildNodes()){subCont3.removeChild(subCont3.lastChild)}
		let div,txt,attr,bot,div2;
		txt = document.createTextNode(texto1);
		div = formTemp.crearNodo('div',[['class','saRowDos']],txt);
		subCont3.appendChild(div);
		txt = document.createTextNode(texto2);
		div = formTemp.crearNodo('div',[['class','saRowDos']],txt);
		subCont3.appendChild(div);
		txt = document.createTextNode(texto3);
		div = formTemp.crearNodo('div',[['class','saRowDos']],txt);
		subCont3.appendChild(div);
		
		//botones
		div = formTemp.crearNodo('div',[['class','butRowOne']],false);
		txt = document.createTextNode('Aceptar');
		attr = [['class','botAvDos'],['id',btnID]]; 
		bot = formTemp.crearNodo('button',attr,txt);
		div2 = formTemp.crearNodo('div',[['class','avColBut']],bot);
		div.appendChild(div2);
		subCont3.appendChild(div);
	}
	
	function afirmaAceptar(e){
		const elm = e.target;
		let rowinfo = elm.parentElement;
		for (let i = 0;i<4 ;i++){rowinfo = rowinfo.parentElement}
		const rowbod = rowinfo.previousSibling;
		const padre = rowinfo.parentElement;
		padre.removeChild(rowbod);
		padre.removeChild(rowinfo);
	}
	
