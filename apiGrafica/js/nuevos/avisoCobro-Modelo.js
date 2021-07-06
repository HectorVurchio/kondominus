import {PageBehavior} from './pageBeha.js';
import {RetrieveDBEgresos} from './retriDBeg.js';
import{EventAsigner} from './eventAss.js';
import{FormTemp} from './formTemp.js';
import {BackQuery} from './backQ.js';

	const pageBehavior = new PageBehavior();
	const eventAsigner = new EventAsigner();
	const jwt = pageBehavior.getCookie('jwt');
	const api = '/consulta/cobro';
	const codPais = '+58';
	const profile = pageBehavior.getCookie('profile').split(',');
	const propDoc = pageBehavior.getCookie('propDoc').split(',');
	const codEd = propDoc[2];
	const dbName = `edificio_Info-${codEd}`;
	const formTemp = new FormTemp();
	const idbquery = new RetrieveDBEgresos(dbName,1);
	const administrador = `${profile[0]} ${profile[1]}`;
	const unidad = `${propDoc[3]}-${propDoc[4]}`;
	const tabfrag = document.createDocumentFragment();

	eventAsigner.windowLoad(()=>{
		if(profile == ''){logOut();}
		if(propDoc == ''){logOut();}
		populateDB();
	});
	
	function populateDB(){
		let inp,saiAsig,object;
		const todfechas = JSON.parse(sessionStorage.getItem('fechas'));
		const estatus = sessionStorage.getItem('estatus');
		if(estatus =='nuevo'){
			const fecha = todfechas['fechaB'];
			saiAsig = 'cobrec';
			object = {fecha,codEd,jwt,saiAsig};
		}else if(estatus == 'consulta'){
			const desde = todfechas['desde'];
			const hasta = todfechas['hasta'];
			const control = sessionStorage.getItem('contEx');
			saiAsig = 'hisrec';
			object = {control,desde,hasta,codEd,jwt,saiAsig};
		}
		const respuesta = new BackQuery(api,object).getServDatPO();
		const datadb = document.getElementById('datadb');
		respuesta.then((r)=>{
			for(const[key,value] of Object.entries(r)){
				inp = formTemp.crearNodo('input',[['type','hidden'],['id',key],['value',JSON.stringify(value)]],false);
				datadb.appendChild(inp);
			}
		}).then(()=>{
			populateDBDos();
		}).then(()=>{
			populateDBTres();
		}).then(()=>{
			setTimeout(()=>{showUpdateAccountForm()},100);
		});
	}
	
	function populateDBDos(){
		let inp;
		const idxdb1 = document.getElementById('idxdb1');
		idbquery.retrieveAllTableDataArr('edificio',(r)=>{
			for(const[key,value] of Object.entries(r[0])){
				inp = formTemp.crearNodo('input',[['type','hidden'],['id',key],['value',value]],false);
				idxdb1.appendChild(inp);
			}
		});
	}
	function populateDBTres(){
		let inp;
		const idxdb1 = document.getElementById('idxdb1');
		idbquery.retrieveAllTableDataArr('dineroProv',(r)=>{
			inp = formTemp.crearNodo('input',[['type','hidden'],['id','dineroProv'],['value',JSON.stringify(r)]],false);
			idxdb1.appendChild(inp);
		});			
	}
	
	
	function logOut(){  
		const property = pageBehavior.getCookie('property').split(',');
		pageBehavior.logOut(new BackQuery('/logOut',{property}).afirma());
	}
	
	function showUpdateAccountForm(){
		headerData(0);
		subHeaderData(0);
		preparaTablas();
		notasAlPie(0);
	}
	
	function headerData(n){
		let div,txt,fragmento,arrResp;
		const header = document.getElementsByClassName('header')[n];
		fragmento = document.createDocumentFragment();
		const datEdif = document.forms['idxdb1'].children;
			arrResp = [datEdif['nombre_edificio'].value,
							 codEd,datEdif['direccion'].value,
							 datEdif['correo'].value,
							 `${codPais}-${datEdif['telefono'].value}`];
			arrResp.forEach(item => {
				txt = document.createTextNode(item);
				div = formTemp.crearNodo('div',[],txt);
				fragmento.appendChild(div);
			});
			const datosCondo = formTemp.crearNodo('div',[['class','datosCondo']],fragmento);
			header.appendChild(datosCondo);
			
			txt = document.createTextNode('AVISO DE COBRO');
			const tituloTres = formTemp.crearNodo('p',[['class','titulo tres']],txt);
			header.appendChild(tituloTres);
			txt = document.createTextNode(controlRecibo());
			div = formTemp.crearNodo('div',[],txt);
			const datosAC = formTemp.crearNodo('div',[['class','datosAC']],div);
			const fechas = JSON.parse(sessionStorage.getItem('fechas'));
			const fE = fechas['emision'];
			const fV = fechas['vencimiento'].split('-');
			fragmento = document.createDocumentFragment();
			arrResp = ['Fecha de emision:',
					   `${fE}`,
					   'Fecha de vencimiento:',
					   `${fV[2]}/${fV[1]}/${fV[0]}`];
			arrResp.forEach(item => {
				txt = document.createTextNode(item);
				div = formTemp.crearNodo('div',[],txt);
				fragmento.appendChild(div);
			});	
			div = formTemp.crearNodo('div',[],fragmento);
			datosAC.appendChild(div);
			header.appendChild(datosAC);	
	}
	
	function controlRecibo(){
		let control,nuevCont;
		const contEx = sessionStorage.getItem('contEx');
		if(contEx == 'nuevo'){ // se esta preparando un nuevo recibo
			control = JSON.parse(document.forms[0].elements['control'].value);
			nuevCont = (Number(control[0]['control'])+1);
		}else{ // se esta consultando un recibo existente
			control = contEx;
			nuevCont = (Number(contEx));
		}
		const facNum = (`${nuevCont}`).padStart(3, '0');
		return `Nº ${facNum}`;
	}
	
	function subHeaderData(n){
		let div,txt,fragmento,arrResp;
		const subHeader = document.getElementsByClassName('subHeader')[n];
		const datosProp = formTemp.crearNodo('div',[['class','datosProp']],false);
		arrResp = [['Administrador:',administrador],
				   ['Unidad:',unidad],
				   ['Alícuota:','1']];
		arrResp.forEach(item => {
			fragmento = document.createDocumentFragment();
			item.forEach(it => {
				txt = document.createTextNode(it);
				div = formTemp.crearNodo('div',[],txt);
				fragmento.appendChild(div);
			});
			div = formTemp.crearNodo('div',[],fragmento);
			datosProp.appendChild(div);
		})
		subHeader.appendChild(datosProp);
	}
	
	function preparaTablas(){
		let subtitulo,subtotal,porc;
		let tr,txt,td,b,titulo1,provisiones,aplicFR,pAplFRmir,casoprov;
		const todfechas = JSON.parse(sessionStorage.getItem('fechas'));
		const datEdif = document.forms['datadb'].children; // data del edificio
		const contEx = sessionStorage.getItem('contEx');
		if(contEx == 'nuevo'){ // se esta preparando un nuevo recibo
			provisiones = JSON.parse(sessionStorage.getItem('provisiones'));
			aplicFR = sessionStorage.getItem('aplicFR'); //% de los gastos para FR
			pAplFRmir = sessionStorage.getItem('pAplFRmir'); //monto total de los gastos FR
			porc = sessionStorage.getItem('porc'); //% de lo gastado del FR a recuperar
			casoprov = 0; //caso nuevo para provisiones
		}else{ // se esta consultando un recibo existente
			provisiones = JSON.parse(datEdif['pro_actuales'].value);
			const recAnt = JSON.parse(datEdif['recibo_ant'].value);
			aplicFR = recAnt['papfr'];
			pAplFRmir = recAnt['reserva'];
			casoprov = 1; //caso existente para provisiones
			porc = recAnt['prefr'];
		}
		//provisiones
		let index = 1;
		let acobrar = 0;
		const prov = agrupaCuentas(provisiones,'prov',index);
		
		if(prov[0].length > 0){
			titulo1 = 'PROVISIONES PARA EL PRÓXIMO PERÍODO:';
			subtitulo = filaSubtitulos(titulo1);
			tabfrag.appendChild(subtitulo);
			prov[0].forEach(item => {tabfrag.appendChild(item[3]);}); // filas de detalles
			titulo1 = 'Subtotal de Provisiones Próximo Período';
			subtotal = filaSubTotal(titulo1,prov[1],1);
			tabfrag.appendChild(subtotal);
			index = prov[2];
			acobrar += Number(prov[1]);
		}
		//otros gastos
		
		const periodo = JSON.parse(datEdif['periodo'].value);
		//resumen de todos lo pagos efectuados 
		const resumenCobro = JSON.parse(datEdif['resumen_cobro'].value);
		if(resumenCobro.length > 0){
			titulo1 = `RESUMEN DE GASTOS EFECTUADOS DESDE ${periodo[0]['Desde']} HASTA ${periodo[0]['Hasta']}`;
			subtitulo = filaSubtitulos(titulo1);
			tabfrag.appendChild(subtitulo);
			//filas del medio
			const cobro = agrupaCuentasDos(resumenCobro,index);
			tabfrag.appendChild(cobro[0]);
			// FILA DEL SUBTOTAL
			titulo1 = 'Subtotal de Gastos efectuados';
			subtotal = filaSubTotal(titulo1,cobro[1],1);
			tabfrag.appendChild(subtotal);
			index = cobro[2];
			acobrar += Number(cobro[1]);
		}
		//resumen gastos hechos a credito
		const ctappagar = JSON.parse(datEdif['ctas_pagar'].value);
		if(ctappagar.length > 0){
			titulo1 = `CUENTAS POR PAGAR DESDE ${periodo[0]['Desde']} HASTA ${periodo[0]['Hasta']}`;
			subtitulo = filaSubtitulos(titulo1);
			tabfrag.appendChild(subtitulo);
			//filas del medio
			const cobro = agrupaCuentasDos(ctappagar,index);
			tabfrag.appendChild(cobro[0]);
			// FILA DEL SUBTOTAL
			titulo1 = 'Subtotal de Cuentas Por Pagar';
			subtotal = filaSubTotal(titulo1,cobro[1],1);
			tabfrag.appendChild(subtotal);
			index = cobro[2];
			acobrar += Number(cobro[1]);
		}
		//resumen gastos hechos con el fondo de reserva
		const resPagFR = JSON.parse(datEdif['resumen_pagos_fr'].value);
		if(resPagFR.length > 0){
			titulo1 = `FONDO DE RESERVA UTILIZADO DESDE ${periodo[0]['Desde']} HASTA ${periodo[0]['Hasta']}`;
			subtitulo = filaSubtitulos(titulo1);
			tabfrag.appendChild(subtitulo);
			//resumen de gastos efectuados
			const cobro = agrupaCuentasDos(resPagFR,index);
			tabfrag.appendChild(cobro[0]);
			// FILA DEL SUBTOTAL 1
			titulo1 = 'Fondo De Reserva Utilizado';
			subtotal = filaSubTotal(titulo1,cobro[1],2);
			tabfrag.appendChild(subtotal);
			index = cobro[2];
			const recupera = ((Number(porc)/100)*Number(cobro[1])).toFixed(2);
			//fila subtotal 2
			titulo1 = `Subtotal ${porc} % De Restitución Del Monto Utilizado`;
			subtotal = filaSubTotal(titulo1,recupera,1);
			tabfrag.appendChild(subtotal);
			acobrar += Number(recupera);
		}
		//% depposito fondo de reserva del periodo
		const titfr = `${aplicFR}% Para El Fondo De Reserva`;
		const imp = filaSubTotal(titfr,pAplFRmir,1);
		tabfrag.appendChild(imp);
		acobrar += Number(pAplFRmir);
		
		//provisiones no cumplidas o parcialmente cumplidas(ultimas filas)
		const provNOCump = JSON.parse(datEdif['prov_no_cumpl'].value);
		if(provNOCump.length > 0){
			provNoCumpl(provNOCump,tabfrag,index,acobrar,casoprov);
		}else{
			totalacobrarmes(acobrar,0);
			graficaTabla(tabfrag,acobrar);
		}
	}
	

	function provNoCumpl(arrProvNC,frag,index,acobrar,cas){
		let fdisp,aprobado,usado,reman,conc,fipro,datEdif;
		let tr,txt,td,b,titulo1,subtitulo,subtotal;
		if(cas == 0){
			datEdif = document.forms['idxdb1'].children;
		}else if(cas == 1){
			datEdif = document.forms['datadb'].children;
		}
		const dineroProv = JSON.parse(datEdif['dineroProv'].value); //disponible en cta provisiones
		let sumdev = 0;
		const arrOne = new Array();
		dineroProv.forEach((item,index,array)=>{arrOne.push(Number(item['monto']));});
		const initVal = 0;
		const reducer = (total, num) => {return total + num;};
		fdisp = arrOne.reduce(reducer, initVal);
		arrProvNC.forEach((item,ind) => {
			usado = Number(item['usado']);
			aprobado = Number(item['monto']);
			reman = aprobado - usado;  //diferencia a devolver
			//hay dinero en la cuenta?
			if(fdisp > 0){
				if(ind == 0){
					titulo1 = 'EXEDENTE PROVISIONES PERÍODO ANTERIOR';
					subtitulo = filaSubtitulos(titulo1);
					frag.appendChild(subtitulo);								
				}
				txt = document.createTextNode((`${index}`).padStart(3, '0'));
				td = formTemp.crearNodo('td',[],txt);
				tr = formTemp.crearNodo('tr',[],td);
				txt = document.createTextNode(item['tipo_gasto']);
				td = formTemp.crearNodo('td',[],txt);
				tr.appendChild(td);
				conc = `${item['concepto']} utilizados $ ${usado.toFixed(2)} de $ ${aprobado.toFixed(2)}`;
				txt = document.createTextNode(conc);
				td = formTemp.crearNodo('td',[],txt);
				tr.appendChild(td);
				if(reman > fdisp){//se devuelve lo que queda en la cuenta
					sumdev += fdisp;
					txt = document.createTextNode(fdisp.toFixed(2));
					fdisp -= fdisp;
				}else{//se devuelve lo que sobro
					sumdev += reman;
					txt = document.createTextNode(reman.toFixed(2));
					fdisp -= reman;
				}
				td = formTemp.crearNodo('td',[],txt);
				tr.appendChild(td);
				td = formTemp.crearNodo('td',[],false);
				tr.appendChild(td);
				frag.appendChild(tr);
				if(ind == arrProvNC.length-1 || fdisp <= 0){
				//total devolucion
					titulo1 = 'Sub Total Devolución Exedente';
					subtotal = filaSubTotal(titulo1,`-${sumdev.toFixed(2)}`,1);
					frag.appendChild(subtotal);
				}
				index++;				
			}
		});
		acobrar -= Number(sumdev);
		totalacobrarmes(acobrar,0);
		graficaTabla(tabfrag,acobrar);		
	}
	
	function graficaTabla(tabfrag,acobrar){
		const fippag = 20; //filas por pagina
		let txt,th,tr,term,rellenar;
		const alltab = document.getElementsByClassName('cuerpoAC');
		let tbody = alltab[0].children[0];
		let tabla = document.createElement('table');
		tabla.appendChild(tabfrag);
		const filas = Array.from(tabla.rows);
		const numfilas = filas.length;
		if(numfilas > fippag){//hay mas de una pagina
			for(let i = 0;i < fippag;i++){
				tbody.appendChild(filas[i]);
			};
			//cuantas paginas?
			const nupag = Math.ceil(numfilas/fippag);
			for(let i = 1;i < nupag;i++){
				insertarMasPag(acobrar,filas,fippag,i);
			}
		}else{
			//insersion del resto de los gastos
			const ini = 0;
			const fin = ini + fippag;
			if(numfilas < fin){
				term = filas.length;
				rellenar = true;
			}else{
				term = fin;
				rellenar = false;
			}
			for(let i = ini;i < term;i++){
				tbody.appendChild(filas[i]);
			};
			//relleno de la hoja en caso de necesidad
			if(rellenar){
				for(let i = filas.length; i< fin;i++){
					tr = formTemp.crearNodo('tr',[],false);
					for(let j=0;j<5;j++){
						th = formTemp.crearNodo('td',[],false);
						tr.appendChild(th);
					}
					tbody.appendChild(tr);
				}
			}
		}
	}
	
	//cuando se requiere otra pagina
	function insertarMasPag(acobrar,filas,fippag,n){
		let txt,th,tr,term,rellenar;
		//construccion de la hoja
		const currBody = document.getElementsByTagName('body')[0];
		const header = formTemp.crearNodo('div',[['class','header']],false);
		const subHeader = formTemp.crearNodo('div',[['class','subHeader']],false);
		const tabhe = ['#','CÓDIGO','DESCRIPCIÓN DE GASTOS','MONTO','TOTAL'];
		tr = formTemp.crearNodo('tr',[],false);
		tabhe.forEach(item => {
			txt = document.createTextNode(item);
			th = formTemp.crearNodo('th',[],txt);
			tr.appendChild(th);
		});
		const table = formTemp.crearNodo('table',[['class','cuerpoAC']],tr);
		const apaAt = [['title uno','MONTO A COBRAR:'],['sumaCuotaT','']];
		const aPagar = formTemp.crearNodo('div',[['class','aPagar']],false);
		apaAt.forEach(item => {
			txt =  document.createTextNode(item[1]);
			th = formTemp.crearNodo('div',[['class',item[0]]],txt);
			aPagar.appendChild(th);
		});
		const infUno = formTemp.crearNodo('div',[['class','inferior uno']],aPagar);
		const thTabd = ['Saldo Anterior','Cargos del mes','Abono del mes','Saldo Actual'];
		tr = formTemp.crearNodo('tr',[],false);
		thTabd.forEach(item => {
			txt = document.createTextNode(item);
			th = formTemp.crearNodo('th',[],txt);
			tr.appendChild(th);
		});
		const tabDos = formTemp.crearNodo('table',[['class','tablaFR']],tr);
		const thTabd2 = ['saldoAnterioFR','cargosFR','montoFR','saldoFR'];
		tr = formTemp.crearNodo('tr',[],false);
		thTabd2.forEach(item => {
			th = formTemp.crearNodo('td',[['class',item]],false);
			tr.appendChild(th);
		});
		tabDos.appendChild(tr);
		const foAt = [['title dos','Notas:'],['notaPP','']];
		const notas = formTemp.crearNodo('div',[['class','notas']],false);
		foAt.forEach(item => {
			txt = document.createTextNode(item[1]);
			th = formTemp.crearNodo('div',[['class',item[0]]],txt);
			notas.appendChild(th);
		});
		const footer = formTemp.crearNodo('div',[['class','footer']],notas);
		currBody.appendChild(header);
		currBody.appendChild(subHeader);
		currBody.appendChild(table);
		currBody.appendChild(infUno);
		currBody.appendChild(tabDos);
		currBody.appendChild(footer);
		headerData(n);
		subHeaderData(n);
		totalacobrarmes(acobrar,n);
		notasAlPie(n);
		//insersion del resto de los gastos
		const ini = n*fippag;
		const fin = ini + fippag;
		if(filas.length < fin){
			term = filas.length;
			rellenar = true;
		}else{
			term = fin;
			rellenar = false;
		}
		for(let i=ini;i<term;i++){
			table.appendChild(filas[i]);
		};
		//relleno de la hoja en caso de necesidad
		if(rellenar){
			for(let i = filas.length; i< fin;i++){
				tr = formTemp.crearNodo('tr',[],false);
				for(let j=0;j<5;j++){
					th = formTemp.crearNodo('td',[],false);
					tr.appendChild(th);
				}
				table.appendChild(tr);
			}
		}
	}
	
	function filaSubtitulos(texto){
		let tr,td,txt,b;
		//fila uno
		tr = formTemp.crearNodo('tr',[],false); 
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td); //columna uno
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td); //columna dos
		txt = document.createTextNode(texto);
		b = formTemp.crearNodo('b',[],txt);
		td = formTemp.crearNodo('td',[],b);
		tr.appendChild(td); //columna tres
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td); //columna cuatro
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td); //columna cinco
		return tr;
	}
	
	function filaSubTotal(texto,total,cas){
		let tr,td,txt,b,td4,td5,tdch1,tdch2;
		tdch1 = formTemp.crearNodo('td',[],false);
		txt = document.createTextNode(Number(total).toFixed(2));
		b = formTemp.crearNodo('b',[],txt);
		tdch2 = formTemp.crearNodo('td',[],b);
		switch(cas){
			case 1:
				td4 = tdch1;
				td5 = tdch2;
				break;
			case 2:
				td4 = tdch2;
				td5 = tdch1;
				break;
		}
		//fila del subtotal
		tr = formTemp.crearNodo('tr',[],false);
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td); //columna uno
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td);//columna dos
		txt = document.createTextNode(texto);
		b = formTemp.crearNodo('b',[],txt);
		td = formTemp.crearNodo('td',[],b);
		tr.appendChild(td); // columna tres
		tr.appendChild(td4); //columna cuatro
		tr.appendChild(td5); // columna cinco
		return tr;
	}
	
	function totalacobrarmes(acobrar,n){
		const sumaCuotaT = document.getElementsByClassName('sumaCuotaT')[n];
		const cargosFR = document.getElementsByClassName('cargosFR')[n];
		let txt = document.createTextNode(`$ ${acobrar.toFixed(2)}`);
		sumaCuotaT.appendChild(txt);
		txt = document.createTextNode(`$ ${acobrar.toFixed(2)}`);
		cargosFR.appendChild(txt);
	}
	
	function agrupaCuentas(cta,cas,index){
	let flag = true;// la primera cuenta no existe
		let fragcol,fragfil,txt,b,td,tr;
		let total = 0;
		let ordcol1,ordcol2;
		let vares = new Array();
		switch (cas){
			case 'prov':
			vares[0] = 'tipoGasto';
			vares[1] = 'provision';
			vares[2] = 'nombreGasto';
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
	
	function notasAlPie(n){
		let notPP;
		const contEx = sessionStorage.getItem('contEx');
		if(contEx == 'nuevo'){ // se esta preparando un nuevo recibo
			notPP = sessionStorage.getItem('notaPP');
		}else{ // se esta consultando un recibo existente
			const recibo_ant = JSON.parse(document.forms['datadb'].elements['recibo_ant'].value);
			notPP = recibo_ant['pie'];
		}
		const contNPP = document.getElementsByClassName('notaPP')[n];
		contNPP.innerText = notPP;
	}
	
	function agrupaCuentasDos(cta,index){
		let total = 0;
		let fragcol,fragfil,txt,b,td,tr;
		const vares = ['index','tipo_gasto','nombre_cta','monto',''];
		fragfil = document.createDocumentFragment();
		cta.forEach(item => {
			fragcol = document.createDocumentFragment();
			vares.forEach(it => {
				if(it == 'monto'){
					total += +item[`${it}`];
					txt = document.createTextNode((+item[`${it}`]).toFixed(2));
				}else if(it == ''){
					txt = false;
				}else if(it == 'index'){
					txt = document.createTextNode((`${index}`).padStart(3, '0'));
				}else{
					txt = document.createTextNode(item[`${it}`]);
				}
				td = formTemp.crearNodo('td',[],txt);
				fragcol.appendChild(td);	
			});
			tr = formTemp.crearNodo('tr',[],fragcol);
			fragfil.appendChild(tr);
			index++;
		});
		return [fragfil,total,index];
	}
	

	
	
	