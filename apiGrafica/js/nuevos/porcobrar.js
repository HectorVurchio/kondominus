import{EventAsigner} from './eventAss.js';
import {PageBehavior} from './pageBeha.js';
import {BackQuery} from './backQ.js';
import{TablasMuestras} from './tabMue.js';
import {RetrieveDBEgresos} from './retriDBeg.js';
import{FormTemp} from './formTemp.js';


	const formTemp = new FormTemp();
	const pageBehavior = new PageBehavior();
	const eventAsigner = new EventAsigner();
	const codEd = pageBehavior.getCookie('propDoc').split(',')[2];
	const nombreEd = pageBehavior.getCookie('propDoc').split(',')[0];
	const profile = pageBehavior.getCookie('profile').split(',')[0];
	const dbName = `edificio_Info-${codEd}`;
	const idbquery = new RetrieveDBEgresos(dbName);
	const jwt = pageBehavior.getCookie('jwt');
	const tabfrag = document.createDocumentFragment();
	
	eventAsigner.windowLoad(()=>{
		const profile = pageBehavior.getCookie('profile');
		const propDoc = pageBehavior.getCookie('propDoc');
		if(profile == ''){logOut();}
		if(propDoc == ''){logOut();}	
		showUpdateAccountForm();
		cargandoResumen();
		const section = document.getElementsByTagName('section')[0];
		section.addEventListener('click',(e)=>{sectionclick(e);});
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
			
		}
		if(flag){e.preventDefault();}
		//console.log(tgCL,elmID,tagN);
		switch(elmID){
			case 'profileButton':
			case 'b0':
				cargadoPagina(e);
				break;
			case 'boton b1':
				ctaPCobrarProp(e);
				break;
			case 'boton b2':
				cuentasVencidas(e);
				break;
		}
		switch(tgCL){

		}
		if(tagN.toLowerCase() == 'input'){
			if(elemento.type == 'text'){
				elemento.select();
			}
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
			perfil[0].innerHTML = profItems;
		} 
	}
	
	function cargadoPagina(e){
		let hermanos,padre,nv,atributos,arrAttrb,hijo;
		const elm = e.target;
		padre = elm.parentElement;
		if(elm.id == 'profileButton'){nv = 2;}
		if(elm.id == 'b0'){nv = 1;}
		for(let i =0;i<nv;i++){padre = padre.parentElement;}
		const seccion = padre;
		const navCont = cargadoNav(); 
		const showup = cargadoShowupUno(); 
		showup.appendChild(cargandotablaone(['RECIBO','FECHA','monto'],'tabone'));
		while(seccion.hasChildNodes()){seccion.removeChild(seccion.lastChild);}
		seccion.appendChild(navCont);
		seccion.appendChild(showup);
		cargandoResumen(); 
	}
	

	function cargadoShowupUno(){
		let showup,hermanos,atributos,arrAttrb,parent;
		hermanos = document.createDocumentFragment();
		atributos = null;
		atributos = [['titulo','RESUMEN - CUENTAS POR COBRAR']];
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
	
	function cargandotablaone(tabhe,divid){
		let th,tr,txt;
		tr = document.createElement('tr');
		tabhe.forEach(item =>{
			txt = document.createTextNode(item);
			th = formTemp.crearNodo('th',[],txt);
			tr.appendChild(th);
		});
		const tbody = formTemp.crearNodo('tbody',[],tr);
		const tab = formTemp.crearNodo('table',[['class','cuerpoAC']],tbody);
		const div = formTemp.crearNodo('div',[['class',divid]],tab);
		return div;
	}
	
	//SUB-GUI-1
	function cargadoNav(){
		let hermanos,arrAttrb,hijo,parent,atributos;
		hermanos = document.createDocumentFragment();
		atributos = new Array(['icon i00','/apiGrafica/imagenes/i-aviso.png','botonIzq','b0',false,'','CUENTAS POR COBRAR'],
									['icon i01','/apiGrafica/imagenes/add_circle.svg','boton b1','boton b1','br','CUENTAS POR COBRAR','Propietarios'],
									['icon i02','/apiGrafica/imagenes/add_circle.svg','boton b1','boton b2','br','CUENTAS VENCIDAS','Propietarios'],
									['icon i02','/apiGrafica/imagenes/modify-24px.svg','boton b1','boton b3','br','PAGOS VERIFICADOS','Propietarios']);	
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
	
	function principal(){
		window.location.assign(pageBehavior.getURL('/micuenta'));
	}
	
	function showUpdateAccountForm(){
		const respuesta = new BackQuery('/verifica',{jwt}).afirma();
		respuesta.then(respuesta => {
			if (respuesta == 'Afirmativo'){
				setTitle(nombreEd);
				logeado(profile);
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
	
	function cargandoResumen(){
		let td,txt,tr;
		let variab = new Array();
		const tbody = document.getElementsByTagName('tbody')[0];
		idbquery.retrieveAllTableDataArr('cxc',(r)=>{
			const cuentas = agrupaCuentas(r,'resumen',0);
			cuentas[0].forEach(item => {
				variab[0] = `${item[0].toString().padStart(3,'0')}`;
				variab[1] = `${item[1]}`;
				variab[2] = `${item[2].toFixed(2)}`;
				tr = formTemp.crearNodo('tr',[],false);
				variab.forEach(it => {
					txt = document.createTextNode(it);
					td = formTemp.crearNodo('td',[],txt);
					tr.appendChild(td);
				});
				tbody.appendChild(tr);
			});	
			variab[0] = '';
			variab[1] = 'Total';
			variab[2] = cuentas[1].toFixed(2);
			tr = formTemp.crearNodo('tr',[],false);
			variab.forEach(it => {
				txt = document.createTextNode(it);
				td = formTemp.crearNodo('td',[],txt);
				tr.appendChild(td);
			});
			tbody.appendChild(tr);
		});
	}
	
	function agrupaCuentas(cta,cas,index){
		let flag = true;// la primera cuenta no existe
		let fragcol,fragfil,txt,b,td,tr;
		let total = 0;
		let ordcol1,ordcol2;
		let vares = new Array();
		switch (cas){
			case 'resumen':
			vares[0] = 'control';
			vares[1] = 'unidad';
			vares[2] = 'fecha';
			vares[3] = 'monto';
			ordcol1 = ['index',vares[0],vares[2],'',''];
			ordcol2 = ['','',,vares[1],vares[3],''];
			break;
		}
		const arrT = new Array();//array de comparacion
		//1.se obtiene el depict y se agrupan los gastos iguales
		for(let i=0; i< cta.length;i++){
			for(let j =0;j<arrT.length;j++){
				if(arrT[j][0] == cta[i][`${vares[0]}`]){//la cuenta ya existe
					arrT[j][2] += +cta[i][`${vares[3]}`];
					fragcol = document.createDocumentFragment();
					ordcol2.forEach(it => {//detalles de la cuenta
						if(it == ''){txt = false;}else{txt = document.createTextNode(cta[i][`${it}`]);}
						td = formTemp.crearNodo('td',[],txt);
						fragcol.appendChild(td);
					});
					tr = formTemp.crearNodo('tr',[],fragcol);
					arrT[j][3].appendChild(tr);
					flag = false;
					break;
				}else{
					flag = true;
				}
			}
			if(flag){ //cuando la cuenta no existe
				fragfil = document.createDocumentFragment();
				fragcol = document.createDocumentFragment();
				ordcol1.forEach(it => {//nombre de la cuenta a crear
					if(it == ''){
						txt = false;
						td = formTemp.crearNodo('td',[],txt);
					}else if(it == 'index'){
						txt = document.createTextNode((`${index}`).padStart(3, '0'));
						td = formTemp.crearNodo('td',[],txt);
					}else{
						txt = document.createTextNode(cta[i][`${it}`]);
						b = formTemp.crearNodo('b',[],txt);
						td = formTemp.crearNodo('td',[],b);
					}	
					fragcol.appendChild(td);
				});
				tr = formTemp.crearNodo('tr',[],fragcol);
				fragfil.appendChild(tr);
				fragcol = document.createDocumentFragment();
				ordcol2.forEach(it => {//detalles de la cuenta
					if(it == ''){txt = false;}else{txt = document.createTextNode(cta[i][`${it}`]);}
					td = formTemp.crearNodo('td',[],txt);
					fragcol.appendChild(td);
				});
				tr = formTemp.crearNodo('tr',[],fragcol);
				fragfil.appendChild(tr);
				arrT.push([cta[i][`${vares[0]}`],
							cta[i][`${vares[2]}`],
							+cta[i][`${vares[3]}`],
							fragfil]);
				index++;
			}
			total += +cta[i]['monto'];
		}
		return [arrT,total,index];
	}
	
	function ctaPCobrarProp(e){
		let variab = new Array();
		let tr,txt,td,total;
		const elm = e.target;
		const padre = elm.parentElement;
		const shup = padre.nextElementSibling;
		while(shup.hasChildNodes()){shup.removeChild(shup.lastChild);}
		txt = document.createTextNode('CUENTAS POR COBRAR - Propietarios');
		const div = formTemp.crearNodo('div',[['class','titulo']],txt);
		shup.appendChild(div);
		const tabhe = ['UNIDAD','RECIBO','FECHA','VENCIMIENTO','MONTO'];
		const table = cargandotablaone(tabhe,'tabtwo');
		shup.appendChild(table);
		const tbody = table.childNodes[0].childNodes[0];
		idbquery.retrieveAllTableDataArr('cxc',(r)=>{
			total = 0;
			r.forEach(item => {
				variab[0] = item['unidad'];
				variab[1] = `${item['control'].toString().padStart(3,'0')}`;
				variab[2] = `${item['fecha']}`;
				variab[3] = `${item['vencimiento']}`;
				variab[4] = `${Number(item['monto']).toFixed(2)}`;
				total += Number(item['monto']);
				tr = formTemp.crearNodo('tr',[],false);
				variab.forEach(it => {
					txt = document.createTextNode(it);
					td = formTemp.crearNodo('td',[],txt);
					tr.appendChild(td);
				});
				tbody.appendChild(tr);
			});	
			variab[0] = '';
			variab[1] = 'Total';
			variab[2] = '';
			variab[3] = '';
			variab[4] = total.toFixed(2);
			tr = formTemp.crearNodo('tr',[],false);
			variab.forEach(it => {
				txt = document.createTextNode(it);
				td = formTemp.crearNodo('td',[],txt);
				tr.appendChild(td);
			});
			tbody.appendChild(tr);
		});
	}
	
	function cuentasVencidas(e){
		let fe,ve,vig;
		let tr,txt,td,total;
		let variab = new Array();
		const elm = e.target;
		const padre = elm.parentElement;
		const shup = padre.nextElementSibling;
		while(shup.hasChildNodes()){shup.removeChild(shup.lastChild);}
		txt = document.createTextNode('CUENTAS VENCIDAS - Propietarios');
		const div = formTemp.crearNodo('div',[['class','titulo']],txt);
		shup.appendChild(div);
		const tabhe = ['UNIDAD','RECIBO','FECHA','VENCIMIENTO','MONTO','DIAS'];
		const table = cargandotablaone(tabhe,'tabthree');
		shup.appendChild(table);
		const tbody = table.childNodes[0].childNodes[0];
		idbquery.retrieveAllTableDataArr('cxc',(r)=>{
			total = 0;
			r.forEach(item => {
				fe = item['vencimiento'].split('/');
				ve = `${fe[1]}/${fe[0]}/${fe[2]}`;
				vig = pageBehavior.vencENdias(ve);
				if(vig < 0){
					variab[0] = item['unidad'];
					variab[1] = `${item['control'].toString().padStart(3,'0')}`;
					variab[2] = `${item['fecha']}`;
					variab[3] = `${item['vencimiento']}`;
					variab[4] = `${Number(item['monto']).toFixed(2)}`;
					variab[5] = Number(vig)*(-1);
					total += Number(item['monto']);
					tr = formTemp.crearNodo('tr',[],false);
					variab.forEach(it => {
						txt = document.createTextNode(it);
						td = formTemp.crearNodo('td',[],txt);
						tr.appendChild(td);
					});
					tbody.appendChild(tr);	
				}
			});
			variab[0] = '';
			variab[1] = 'Total';
			variab[2] = '';
			variab[3] = '';
			variab[4] = total.toFixed(2);
			variab[5] = '';
			tr = formTemp.crearNodo('tr',[],false);
			variab.forEach(it => {
				txt = document.createTextNode(it);
				td = formTemp.crearNodo('td',[],txt);
				tr.appendChild(td);
			});
			tbody.appendChild(tr);
		});
		
		
		/*const fe = '03/01/2021';
		const vig = pageBehavior.vencENdias(fe);
		console.log(vig);*/
	}
	

	
