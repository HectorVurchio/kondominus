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
			saiAsig = 'detalrec';
			object = {fecha,codEd,jwt,saiAsig};
		}else if(estatus == 'consulta'){
			const control = sessionStorage.getItem('contEx');
			saiAsig = 'detalrecviej';
			object = {control,codEd,jwt,saiAsig};
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
			
			txt = document.createTextNode('DETALLE DE COBRO');
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
			nuevCont = (Number(control['control'])+1);
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
		let subtitulo,subtotal;
		let tr,txt,td,b,titulo1;
		const todfechas = JSON.parse(sessionStorage.getItem('fechas'));
		const datEdif = document.forms['datadb'].children;
		const periodo = JSON.parse(datEdif['periodo'].value);
		const totalcobro = JSON.parse(datEdif['total_cobro'].value);
		
		//total cobro
		let index = 1;
		let acobrar = 0;
		const totcob = agrupaCuentas(totalcobro,'totcob',index);
		if(totcob[0].length > 0){
			titulo1 = `GASTOS EFECTUADOS EN EL DURANTE EL PERÍODO ${periodo[0]['Desde']} -- ${periodo[0]['Hasta']}`;
			subtitulo = filaSubtitulos(titulo1);
			tabfrag.appendChild(subtitulo);
			totcob[0].forEach(item => {tabfrag.appendChild(item[3]);}); // filas de detalles
			titulo1 = 'Subtotal de Gastos Realizados Período Anterior';
			subtotal = filaSubTotal(titulo1,totcob[1],1);
			tabfrag.appendChild(subtotal);
			index = totcob[2];
			acobrar += Number(totcob[1]);
		}
		//cuentas por pagar
		const ctapa = JSON.parse(datEdif['ctas_pagar'].value);
		const ctaspagar = agrupaCuentas(ctapa,'totcob',index);
		if(ctaspagar[0].length > 0){
			titulo1 = `CUENTAS POR PAGAR ADQUIRIDAS DURANTE EL PERÍODO ${periodo[0]['Desde']} -- ${periodo[0]['Hasta']}`;
			subtitulo = filaSubtitulos(titulo1);
			tabfrag.appendChild(subtitulo);
			ctaspagar[0].forEach(item => {tabfrag.appendChild(item[3]);}); // filas de detalles
			titulo1 = 'Subtotal de Cuentas Por Pagar Período Anterior';
			subtotal = filaSubTotal(titulo1,ctaspagar[1],1);
			tabfrag.appendChild(subtotal);
			index = ctaspagar[2];
			acobrar += Number(ctaspagar[1]);
		}
		//pagos hechos con el fondo de reserva
		const pafr = JSON.parse(datEdif['total_pagos_fr'].value);
		const pagosfr = agrupaCuentas(pafr,'totcob',index);
		if(pagosfr[0].length > 0){
			titulo1 = `PAGOS REALIZADOS CON EL FONDO DE RESERVA DURANTE EL PERÍODO ${periodo[0]['Desde']} -- ${periodo[0]['Hasta']}`;
			subtitulo = filaSubtitulos(titulo1);
			tabfrag.appendChild(subtitulo);
			pagosfr[0].forEach(item => {tabfrag.appendChild(item[3]);}); // filas de detalles
			titulo1 = 'Subtotal De Pagos Provenientes Del Fondo De Reserva ';
			subtotal = filaSubTotal(titulo1,pagosfr[1],1);
			tabfrag.appendChild(subtotal);
			index = pagosfr[2];
			acobrar += Number(pagosfr[1]);
		}
		
		//pagos de las provisiones periodo anterior
		const papro = JSON.parse(datEdif['total_provisiones'].value);
		const pagosprov = agrupaCuentas(papro,'totcob',index);
		if(pagosprov[0].length > 0){
			titulo1 = `PAGOS REALIZADOS CON PROVISIONES COBRO ANTERIOR`;
			subtitulo = filaSubtitulos(titulo1);
			tabfrag.appendChild(subtitulo);
			pagosprov[0].forEach(item => {tabfrag.appendChild(item[3]);}); // filas de detalles
			titulo1 = 'Subtotal De Pagos Realizados Provisiones Fondo Anterior ';
			subtotal = filaSubTotal(titulo1,pagosprov[1],1);
			tabfrag.appendChild(subtotal);
			titulo1 = 'Pagado En Cobro Anterior';
			subtotal = filaSubTotal(titulo1,-(pagosprov[1]),1);
			tabfrag.appendChild(subtotal);
			index = pagosprov[2];
			acobrar += Number(pagosprov[1]);
		}
		
		const provcumpl = JSON.parse(datEdif['prov_cumpl'].value);
		const pagosprovcumpl = agrupaCuentas(provcumpl,'totcob',index);
		if(pagosprovcumpl[0].length > 0){
			titulo1 = `PROVISIONES DEL PERÍODO ANTERIOR`;
			subtitulo = filaSubtitulos(titulo1);
			tabfrag.appendChild(subtitulo);
			pagosprovcumpl[0].forEach(item => {tabfrag.appendChild(item[3]);}); // filas de detalles
			titulo1 = 'Subtotal De Provisiones período Anterior ';
			subtotal = filaSubTotal(titulo1,pagosprovcumpl[1],1);
			tabfrag.appendChild(subtotal);
			titulo1 = 'Pagado En Cobro Anterior';
			subtotal = filaSubTotal(titulo1,-(pagosprovcumpl[1]),1);
			tabfrag.appendChild(subtotal);
			index = pagosprovcumpl[2];
			acobrar += Number(pagosprovcumpl[1]);
		}	
		graficaTabla(tabfrag,acobrar);
		
	}
	
	function graficaTabla(tabfrag,acobrar){
		const fippag = 26; //filas por pagina
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
					for(let j=0;j<7;j++){
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
		const tabhe = ['#','CÓDIGO','CONTROL','FECHA','DESCRIPCIÓN DE GASTOS','MONTO','TOTAL'];
		tr = formTemp.crearNodo('tr',[],false);
		tabhe.forEach(item => {
			txt = document.createTextNode(item);
			th = formTemp.crearNodo('th',[],txt);
			tr.appendChild(th);
		});
		const table = formTemp.crearNodo('table',[['class','cuerpoAC']],tr);
		const thTabd = ['Saldo Anterior','Cargos del mes','Abono del mes','Saldo Actual'];
		currBody.appendChild(header);
		currBody.appendChild(subHeader);
		currBody.appendChild(table);
		headerData(n);
		subHeaderData(n);
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
				for(let j=0;j<7;j++){
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
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td); //columna TRES
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td); //columna TRES
		txt = document.createTextNode(texto);
		b = formTemp.crearNodo('b',[],txt);
		td = formTemp.crearNodo('td',[],b);
		tr.appendChild(td); //columna CUATRO
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td); //columna CINCO
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td); //columna SEIS
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
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td);//columna tres
		td = formTemp.crearNodo('td',[],false);
		tr.appendChild(td);//columna tres
		txt = document.createTextNode(texto);
		b = formTemp.crearNodo('b',[],txt);
		td = formTemp.crearNodo('td',[],b);
		tr.appendChild(td); // columna cuatro
		tr.appendChild(td4); //columna cinco
		tr.appendChild(td5); // columna seis
		return tr;
	}
	
	function agrupaCuentas(cta,cas,index){
	let flag = true;// la primera cuenta no existe
		let fragcol,fragfil,txt,b,td,tr;
		let total = 0;
		let ordcol1,ordcol2;
		let vares = new Array();
		switch (cas){
			case 'totcob':
			vares[0] = 'tipo_gasto';
			vares[1] = 'fecha';
			vares[2] = 'nombre_cta';
			vares[3] = 'monto';
			vares[4] = 'concepto';
			vares[5] = 'control';
			ordcol1 = ['index',vares[0],'','',vares[2],'',''];
			ordcol2 = ['','',vares[5],vares[1],vares[4],vares[3],''];
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
	
	

