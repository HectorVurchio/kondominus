class FormTemp{
	constructor(formCLName){
		if(formCLName == undefined){
			this.formCLName = '';
		}else{
			this.formCLName = formCLName;
		}
	}
	checkEmptyElem(parent){
		let inpEl,aviso=false,avisDos = false,flag=true,val,rifVal,telVal,totval,neval;
		let object = new Object;
		for(let i=0;i<parent.elements.length;i++){
			inpEl = parent.elements[i];
			val = inpEl.value;
			switch(inpEl.id){
				case 'rifLetra':
						rifVal = val;
						object['rif'] = rifVal ;
						break;
				case 'rif':
						rifVal += val;
						object['rif'] = rifVal ;
						break;
				case 'telI':
						telVal = val;
						object['telef'] = telVal;
						break;
				case 'telef':
						telVal += val;
						object['telef'] = telVal;
						break;
				case 'email':
					if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)){
						object['email'] = val;
					}else{
						object['email'] = '';
						avisDos = true;
						inpEl.style='border-color:red';
						flag = false;
					}
					break;
				case 'total':
				case 'monto':
					totval = val.split(',');
					neval = '';
					totval.forEach((item)=>{neval += item});
					(neval != '') ? object['total'] = +(neval) : object['total'] = +val;
					break;
				default:
					object[inpEl.id] = val;
			}
			if(inpEl.tagName.toLowerCase() == 'input'){
				if(inpEl.value == ''){
					inpEl.style='border-color:red';
					inpEl.placeholder += ' ** Incompleto';
					aviso = true;
					flag = false;
				}else{
					inpEl.style='border-color:default';
				}
			}
			if(inpEl.tagName.toLowerCase() == 'select'){
				if(inpEl.value == ''){
					inpEl.style='border-color:red';
					aviso = true;
					flag = false;
				}else{
					inpEl.style='border-color:default';
				}
			}
		}
		if(aviso){setTimeout(()=> (alert('Rellene los campos marcados en rojo')),250)}
		if(avisDos){setTimeout(()=> (alert('Correo No Válido')),250)}
		
		return [object,flag];
	}
	
	
	checkEmptyElemPartial(parent,element){
		let inpEl,aviso=false,flag=true,val,rifVal,telVal;
		let object = new Object;
		for(let i=0;i<parent.elements.length;i++){
			inpEl = parent.elements[i];
			val = inpEl.value;
			switch(inpEl.id){
				case 'rifLetra':
						rifVal = val;
						object['rif'] = rifVal ;
						break;
				case 'rif':
						rifVal += val;
						object['rif'] = rifVal ;
						break;
				case 'telI':
						telVal = val;
						object['telef'] = telVal;
						break;
				case 'telef':
						telVal += val;
						object['telef'] = telVal;
						break;
				case 'email':
					if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)){
						object['email'] = val;
					}else{
						object['email'] = 'nulo';
					}
						break;
				default:
					object[inpEl.id] = val;
			}
			if(inpEl.tagName.toLowerCase() == 'input' && inpEl === element){
				if(inpEl.value == ''){
					inpEl.style='border-color:red';
					inpEl.placeholder += ' ** Incompleto';
					aviso = true;
					flag = false;
				}else{
					inpEl.style='border-color:default';
				}
			}
			if(inpEl.tagName.toLowerCase() == 'select' && inpEl === element){
				if(inpEl.value == ''){
					inpEl.style='border-color:red';
					aviso = true;
					flag = false;
				}else{
					inpEl.style='border-color:default';
				}
			}
		}
		if(aviso){setTimeout(()=> (alert('Rellene los campos marcados en rojo')),250)}
		return [object,flag];		
	}

	crearNodo(tagName,arrAttrb,nodHijo){
		let elemt = document.createElement(tagName.toLowerCase());
		if(Array.isArray(arrAttrb)){
			arrAttrb.forEach((item,index,array)=>{
				elemt.setAttribute(item[0],item[1]);
			});
		}
		if(nodHijo != false){
			elemt.appendChild(nodHijo);
		}
		return elemt;
	}
	
	crearNodoTexto(tagName,textoUno,textoDos,nodPadre){
		if(tagName != false){
			const txt = document.createTextNode(textoUno);
			const elemt = document.createElement(tagName.toLowerCase());
			const txtD = document.createTextNode(textoDos);
			if(tagName == 'br'){
				nodPadre.appendChild(txt);	
			}else{
				elemt.appendChild(txt);				
			}
			nodPadre.appendChild(elemt);
			nodPadre.appendChild(txtD);
			elemt.normalize();
		}else{
			let txtD = document.createTextNode(textoDos);
			nodPadre.appendChild(txtD);	
		}
	}
	
	
	crearNodoTextoDos(texto,padreCL,cas){
		let poise;
		const nodoPadre = document.getElementsByClassName(padreCL)[0];
		switch(cas){
			case 1:
				poise = 'beforebegin';
				break;
			case 2:
				poise = 'afterbegin';
				break;
			case 3:
				poise = 'beforeend';
				break;
			case 4:
				poise = 'afterend';
				break;
		}
		//let txt = document.createTextNode(texto);
		nodoPadre.insertAdjacentHTML(poise,texto);
	}
	
	crearNodoTextoTres(texto,nodPadre,req){
		if(req == true){
			const txt = document.createTextNode(texto);
			nodPadre.appendChild(txt);	
		}
	}
	
	asignStorVal(arrOfInp){
		arrOfInp.forEach((item,index,array)=>{
			document.getElementById(item).value = sessionStorage.getItem(item);
		})
	}
	setStorInpVal(arrOfInp){
		let valor;
		arrOfInp.forEach((item,index,array)=>{
			valor = document.getElementById(item).value;
			sessionStorage.setItem(item,valor);
		})
	}
	
	createSelect(arSeAt,arOpt){
		const seleccion = document.createElement('select');
		arSeAt.forEach((item,index,array)=>{
			seleccion.setAttribute(item[0],item[1]);
		});
		let opt;
		arOpt.forEach((item,index,array)=>{
			opt = new Option(item[0],item[1]);
			seleccion.appendChild(opt);
		});
		return seleccion;
	}
	
	insertSelOptions(selID,arOpt){
		const seleccion = document.getElementById(selID);
		let opt;
		arOpt.forEach((item,index,array)=>{
			opt = new Option(item[0],item[1]);
			seleccion.appendChild(opt);
		});
	}
	
	inpNumbForm(numb){
		if(numb.includes('.')){
			let x;
			let cut = numb.split('.');
			let lon = cut[0].length;
			switch(lon){
				case 4:
				case 5:
				case 6:
					x = cut[0].slice(0,lon-3)+','+cut[0].slice(lon-3,lon)+'.'+cut[1];
					break;   //hasta aqui con una coma
				case 7:
				case 8:
				case 9:
					x = cut[0].slice(0,lon-6)+','+cut[0].slice(lon-6,lon-3)+','+cut[0].slice(lon-3,lon)+'.'+cut[1];  
					break;   // hasta aqui co dos comas
				case 10:
				case 11:
				case 12:
						x = cut[0].slice(0,lon-9)+','+cut[0].slice(1,lon-6)+','+cut[0].slice(lon-6,lon-3)+','+cut[0].slice(lon-3,lon)+'.'+cut[1];
						break;  //hasta aqui con tres comas
				default:
						x = numb;
			}
			return x;
		}else{return numb}
	}

	pareHijo(nodoHijo){
		let madre = document.getElementsByTagName(this.formCLName.toLowerCase());
		madre[0].appendChild(nodoHijo);
	}

	sacaHijos(){
		let elemt = document.getElementsByTagName(this.formCLName.toLowerCase());
		while(elemt[0].hasChildNodes()){
			elemt[0].removeChild(elemt[0].firstChild);
		}
	}	
	
	retiraNodoTexto(typ,n){
		let elm,chno;
		switch(typ){
			case 'TG':
			elm = document.getElementsByTagName(this.formCLName.toLowerCase())[n];
			break;
			case 'CL':
			elm = document.getElementsByClassName(this.formCLName)[n];
			break;
		}
		let elementos = elm.childNodes;
		for(let i =0; i<elementos.length;i++){
			chno = elementos[i];
			let chnoNa = chno.nodeName;
			if(chnoNa == "#text" && chnoNa != undefined){
				chno.remove();
			}else{
				console.log('falso');
			}
		}
	}
	
	retiraUltNodo(tgName,typ,n){
		let elm;
		switch(typ){
			case 'TG':
			elm = document.getElementsByTagName(tgName.toLowerCase())[n];
			break;
			case 'CL':
			elm = document.getElementsByClassName(this.formCLName)[n];
			break;
		}
		elm.lastElementChild.remove();
	}
	
	
	/* contPar = [titulo,className,idName]
	   formPar = [clName,idName,filaClName]
	   filPar = [[filaElm1,filaElm2,...filaElmN],...,[filaElmN,...,filaElmN]]
	 */
	formularioUno(contPar,formPar,filPar){/* avisoCuatro.css*/
		let txt,fil;
		//contenedor
		const contenedor = document.createElement('div');
		contenedor.setAttribute('class',contPar[1]);
		contenedor.setAttribute('id',contPar[2]);
		//titulo
		const titulo = document.createElement('p');
		txt = document.createTextNode(contPar[0]);
		titulo.appendChild(txt);
		contenedor.appendChild(titulo);
		// form
		const formul = document.createElement('form');
		formul.setAttribute('class',formPar[0]);
		formul.setAttribute('id',formPar[1]);
		//filas
		filPar.forEach((item,index) =>{
			fil = document.createElement('div');
			fil.setAttribute('class',formPar[2]);
			fil.setAttribute('id',`${formPar[2]}-${index}`);
			item.forEach(it => {fil.appendChild(it);});
			formul.appendChild(fil);
		});
		contenedor.appendChild(formul);
		return contenedor;
	}

	

/* ************************************************* */	
/* DESDE AQUI */
	/* revisar para eliminar */
	
	crearFormulario(formCL,contenedor){
		let arrAttrb = new Array(['class',formCL]);
		let formular = this.crearNodo('form',arrAttrb,contenedor);
		return formular;
	}
	
	crearFormDos(formCL,arrNods){
		let arrAttrb = new Array(['class',formCL]);
		let formular = this.crearNodo('form',arrAttrb,false);
		arrNods.forEach((item,index,array)=>{
			formular.appendChild(item);
		});
		return formular;
	}
	
	crearFormTres(formID,arrNods){
		let arrAttrb = new Array(['id',formID]);
		let formular = this.crearNodo('form',arrAttrb,false);
		arrNods.forEach((item,index,array)=>{
			formular.appendChild(item);
		});
		return formular;
	}
	
	getContElm(){
		let elmt = document.getElementsByTagName(this.formCLName.toLowerCase())[0];
		return elmt;
	}
	
	getContElmDos(){
		let elmt = document.getElementsByClassName(this.formCLName)[0];
		return elmt;
	}
	

	
	pareHijosDos(clName,arrNodHijos){
		let madre = document.getElementsByClassName(clName);
		arrNodHijos.forEach((item,index,array)=>{
			madre[0].appendChild(item);
		});
	}
	
	pareMasHijos(arrNodHijos){
		let madre = document.getElementsByClassName(this.formCLName);
		let fragmento = document.createDocumentFragment();
		arrNodHijos.forEach((item,index,array)=>{
			fragmento.appendChild(item);
		});
		madre[0].appendChild(fragmento);
	}
	

	
	sacaHijosDos(){
		let elemt = document.getElementsByClassName(this.formCLName);
		if(elemt[0] != undefined){
			while(elemt[0].hasChildNodes()){
				elemt[0].removeChild(elemt[0].firstChild);
			}			
		}
	}

	sacaHijostres(elem){
		if(elem != undefined && elem.hasChildNodes()){
			while(elem.hasChildNodes()){
				elem.removeChild(elem.firstChild);
			}
		}
	}


	retiraNodoTextoDos(elm){
		let chno;
		let elementos = elm.childNodes;
		for(let i =0; i<elementos.length;i++){
			chno = elementos[i];
			let chnoNa = chno.nodeName;
			if(chnoNa == "#text" && chnoNa != undefined){
				chno.remove();
			}else{
				console.log('falso');
			}
		}
	}

	
	
	creaContenedor(tagName,clName,arrNodHijos){
		let elemt = document.createElement(tagName.toLowerCase());
		elemt.setAttribute('class',clName);
		//elemt.setAttribute('id',clName);
		let fragmento = document.createDocumentFragment();
		arrNodHijos.forEach((item,index,array)=>{
			fragmento.appendChild(item);
		});
		elemt.appendChild(fragmento);
		return elemt;
	}
	
	containerDisplay(tipo){
		let elemt = document.getElementsByTagName(this.formCLName.toLowerCase());
		elemt[0].style.display = tipo;
	}

	creaContenedorDos(tagName,clName,idName,arrNodHijos){
		let elemt = document.createElement(tagName.toLowerCase());
		elemt.setAttribute('class',clName);
		elemt.setAttribute('id',idName);
		let fragmento = document.createDocumentFragment();
		arrNodHijos.forEach((item,index,array)=>{
			fragmento.appendChild(item);
		});
		elemt.appendChild(fragmento);
		return elemt;
	}

	botonNavThree(foID,compArr){
		let ctr = '';
		let cen = '';
		compArr.forEach((item,index,array)=>{
			cen = '';
			item[3].forEach((it,ind,arr)=>{
				cen += "<div class='"+it[0]+"' id='"+it[0]+"'>"+it[1]+"<div class='"+it[2]+"' id='"+it[2]+"'></div></div>";
			});
			ctr += "<div class='"+item[0]+"'>"+item[1]+"</div><div class='"+item[2]+"'>"+cen+"</div>";
		});
		const nave = `<div class='${this.formCLName}' id='${foID}'>${ctr}</div>`;
		return nave;	
	}	
	
	ingresoFormOne(inpArrID,arrButID,otros){
		// inpArrID = [type,id,autocomplete,placeholder,value]
		// arrButID = [id,nombre]

		let inp = '';
		inpArrID.forEach((item,index,array)=>{
			inp += "<input type='"+item[0]+"' id='"+item[1]+"' class='campoFormular' autocomplete='"+item[2]+"' placeholder='"+item[3]+"' value='"+item[4]+"'/>";
		});
		let reg = "<form class='"+this.formCLName+"' id='"+this.formCLName+"'>"+inp+
		"<button class='botonIng' id='"+arrButID[0]+"'>"+arrButID[1]+"</button>"+otros+"</form>";
		return reg;
	}
	/* buscar de eliminar */
	proveedorFormOne(formCLName,selAtt,inpArrID,n,btnID){
		let contenido = "<select name='"+selAtt[0]+"' id='"+selAtt[0]+"'></select>";
		for(let i =0;i<n;i++){
			contenido += "<input type='"+inpArrID[i][0]+"' name='"+inpArrID[i][1]+"' id='"+inpArrID[i][1]+"' placeholder='"+inpArrID[i][2]+"' value='"+inpArrID[i][3]+"'/>";
			if(inpArrID[i][0] != 'hidden'){contenido += "<br/>";}
		}
		for(let i=1;i<selAtt.length-1;i++){
			contenido += "<select name='"+selAtt[i]+"' id='"+selAtt[i]+"'></select><br/>";
		}
		for(let i = n;i<inpArrID.length;i++){
			contenido += "<input type='"+inpArrID[i][0]+"' name='"+inpArrID[i][1]+"' id='"+inpArrID[i][1]+"' placeholder='"+inpArrID[i][2]+"' value='"+inpArrID[i][3]+"'/>";
			if(inpArrID[i][0] != 'hidden'){contenido += "<br/>";}
		}
		contenido += "<select name='"+selAtt[selAtt.length-1]+"' id='"+selAtt[selAtt.length-1]+"'></select><br/>";
        contenido += "<button  id='"+btnID+"' >Ingresar</button>";
        let formulario = "<form class='"+formCLName+"'><div class='formFacturas'>"+contenido+"</div></form>"; 
		return formulario;
	}
	
	reporteFormOne(subFor,selAtt,inpArrID,n,arPs,btnID){
		let contenido = '';
		if(selAtt[0] != undefined){
			contenido += "<select name='"+selAtt[0]+"' id='"+selAtt[0]+"'></select><br/>";
		}
		for(let i =0;i<n;i++){
			contenido += "<input type='"+inpArrID[i][0]+"' name='"+inpArrID[i][1]+"' id='"+inpArrID[i][1]+"' placeholder='"+inpArrID[i][2]+"' value='"+inpArrID[i][3]+"'/>";
			if(inpArrID[i][0] != 'hidden'){contenido += "<br/>";}
		}	
		for(let i = n;i<inpArrID.length;i++){
			if(arPs[i-n] != undefined && inpArrID[i][0] != 'hidden'){
				contenido += "<p>"+arPs[i-n]+"</p>";
			}
			contenido += "<input type='"+inpArrID[i][0]+"' name='"+inpArrID[i][1]+"' id='"+inpArrID[i][1]+"' placeholder='"+inpArrID[i][2]+"' value='"+inpArrID[i][3]+"'/>";
			if(inpArrID[i][0] != 'hidden'){contenido += "<br/>";}
		}
        contenido += "<button  id='"+btnID+"' >Reportar</button>";
        let formulario = "<form class='"+this.formCLName+"'><div class='"+subFor+"'>"+contenido+"</div></form>"; 
		return formulario;
	}		
	
	disabInpInForm(arrOfInp){
		arrOfInp.forEach((item,index,array)=>{
			document.getElementById(item).disabled = true;
		})
	}
	
	disabAllElmInDiv(divID,tip,n){
		let allElm;
		if(tip == 'ID'){allElm = document.getElementById(divID).childNodes;
		}else if(tip == 'CL'){allElm = document.getElementsByClassName(divID)[n].childNodes;}
		allElm.forEach((item,index,array)=>{
			item.disabled = true;
		});
	}
	
	enableAllElmInDiv(divID,tip,n){
		let allElm;
		if(tip == 'ID'){allElm = document.getElementById(divID).childNodes;
		}else if(tip == 'CL'){allElm = document.getElementsByClassName(divID)[n].childNodes;}
		allElm.forEach((item,index,array)=>{
			item.disabled = false;
		});
	}	

	getInpValAll(formCLName){
		let allVal = new Array();
		let obj = document.getElementsByClassName(formCLName)[0].childNodes;
		obj.forEach((item,index,array)=>{
			if(item.tagName == 'INPUT' && item.type != 'hidden'){
				allVal.push(item.value);
			}
			if(item.tagName == 'SELECT'){
				allVal.push(item.value);
			}
		});
		return allVal;
	}
	
	getInpValAllTwo(formCLName){
		let allVal = new Array();
		let obj = document.forms;
		let objeto,formElem;
		for(let i = 0; i<obj.length;i++){
			objeto = obj[i];
			if(objeto.className == formCLName){
				formElem = objeto.elements;
				break;				
			}
		}
		for(let i = 0;i < formElem.length;i++){
			if(formElem[i].tagName.toLowerCase() == 'input' || formElem[i].type.toLowerCase() == 'hidden'){
				allVal.push(formElem[i].value);
			}
			if(formElem[i].tagName.toLowerCase() == 'select'){
				allVal.push(formElem[i].value);
			}
		}
		return allVal;
	}

	getInpValAllThree(divID){
		let allVal = new Array();
		const divElem = document.getElementById(divID).childNodes;
		for(let i = 0;i < divElem.length;i++){
			if(divElem[i].tagName.toLowerCase() == 'input'){
				if(divElem[i].type != 'image'){allVal.push(divElem[i].value);}
			}
			if(divElem[i].tagName.toLowerCase() == 'select'){
				allVal.push(divElem[i].value);
			}
		}
		return allVal;
	}
	
	formTxtFormatTwo(formCLName,newSaiAsig){
		let ingFormular = document.getElementsByClassName(`${formCLName}`);
		let numEl = ingFormular[0].length;
		let elem = new Array();
		let inpElem;
		let rifVal = '';
		for(let i =0;i<numEl;i++){
			inpElem = ingFormular[0][i];
			if(inpElem.tagName == "INPUT" || inpElem.tagName == "SELECT"){
				elem.push(inpElem);
			}
		}
		let object = {};
		object = this.#entradasVisibles(object,elem,2)[0];
		const formObj = Object.create(object);
		return formObj;
	}
	
	
	async formObjVal(formCLName){
		const formuls = document.forms;
		let formElem;
		let elem = new Array();
		let hidElmt = new Array();
		let objeto = {};
		let aviso = false;
		for(let i = 0; i<formuls.length;i++){
			if(formuls[i].className == formCLName){
				formElem = formuls[i].elements;
				break;
			}
		}
		for (let i = 0; i<formElem.length; i++){
			if((formElem[i].tagName.toLowerCase() == "input" && formElem[i].type != 'hidden') || formElem[i].tagName.toLowerCase() == "select"){
				elem.push(formElem[i]);
			}
			if(formElem[i].tagName.toLowerCase() == "input" && formElem[i].type == 'hidden'){
				hidElmt.push(formElem[i]);
			}			
		}
		const arrResp = this.#entradasVisibles(objeto,elem,1);
		const objetoUno = arrResp[0];
		aviso = arrResp[1];
		const objetoDos = this.#entradasInvisibles(objeto,hidElmt);
		const formObj = Object.assign(objetoUno,objetoDos);
		if(aviso == true){
			let promise = new Promise((resolve,reject) =>{
				setTimeout(()=> resolve(alert('Rellene los campos incompletos')),250)
			});
			let result = await promise;
			
		}
		return formObj;
	}
	
	async divObjVal(divIdName){
		const divElem = document.getElementById(divIdName).childNodes;
		let elem = new Array();
		let hidElmt = new Array();
		let aviso = false;
		let object = {};
		divElem.forEach((item,index,array)=>{
			if(item.tagName.toLowerCase() == "input"){
				if(item.type.toLowerCase == 'hidden'){hidElmt.push(item);}
				if(item.type.toLowerCase() == 'text'){elem.push(item);}
			}
			if(item.tagName.toLowerCase() == "select"){elem.push(item);}
		});
		const arrResp = this.#entradasVisibles(object,elem,1);
		const objetoUno = arrResp[0];
		aviso = arrResp[1];
		const objetoDos = this.#entradasInvisibles(object,hidElmt);
		const divObj = Object.assign(objetoUno,objetoDos);
		if(aviso == true){
			let promise = new Promise((resolve,reject) =>{
				setTimeout(()=> resolve(alert('Rellene los campos incompletos')),250)
			});
			let result = await promise;
		}
		return divObj;
	}
	
	#entradasVisibles(object,elem,caso){
		let rifVal = '';
		let telVal = '';
		let aviso = false;
		elem.forEach((item,index,array)=>{
			let val = item.value;
			if(val == ''){
				if(caso == 1){
					aviso = true;
					item.style='border-color:red';
					if(item.tagName.toLowerCase() == "input"){
						if(item.type.toLowerCase() == 'text'){item.placeholder = 'Campo incompleto **';}
					}
				}
				object[item.id] = 'nulo';
			}else{
				if(val.includes(',')){
					let w = val.split(',');
					let sPto = '';
					w.forEach((it,ind,ar)=>{sPto += it;});
					if(!isNaN(sPto)){val = Number(sPto);}
				}
				switch(item.id){
					case 'rifLetra':
							rifVal += val;
							object['rif'] = rifVal ;
							break;
					case 'rif':
							rifVal += val;
							object['rif'] = rifVal ;
							break;
					case 'telI':
							telVal += val;
							object['telef'] = telVal;
							break;
					case 'telef':
							telVal += val;
							object['telef'] = telVal;
							break;
					case 'email':
						if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)){
							object['email'] = val;
						}else{
							object['email'] = 'nulo';
						}
						break;
					case 'estado':
						object[item.id] = val;
						object['estLetr'] = item.selectedOptions[0].text;
						break;
					case 'ciudad':
						object[item.id] = val;
						object['ciuLetr'] = item.selectedOptions[0].text;
						break;
					default:
						object[item.id] = val;
				}
			}
		});
		return new Array(object,aviso);
	}
	
	defaultBordC(divID,tip,n){
		let allElm;
		if(tip == 'ID'){allElm = document.getElementById(divID).childNodes;
		}else if(tip == 'CL'){allElm = document.getElementsByClassName(divID)[n].childNodes;}
		allElm.forEach((item,index,array)=>{
			item.style = 'border-color:default';
		});		
	}
	
	#entradasInvisibles(object,hidElmt){
		hidElmt.forEach((item,index,array)=>{
			let val = item.value;
			if(val == ''){
				object[item.id] = 'nulo';
			}else{
				object[item.id] = val
			}
		});
		return object;
	}
	
	/* ELIMINAR */
	facturasFormOne(formCLName,subFor,selAtt,inpArrID,n,btnID){
		let contenido = '';
		if(selAtt[0] != undefined){
			contenido += "<select name='"+selAtt[0]+"' id='"+selAtt[0]+"'></select>";
		}
		for(let i =0;i<n;i++){
			contenido += "<input type='"+inpArrID[i][0]+"' name='"+inpArrID[i][1]+"' id='"+inpArrID[i][1]+"' placeholder='"+inpArrID[i][2]+"' value='"+inpArrID[i][3]+"'/>";
			if(inpArrID[i][0] != 'hidden'){contenido += "<br/>";}
		}
		if(selAtt[1] != undefined){
			contenido += "<select name='"+selAtt[1]+"' id='"+selAtt[1]+"'></select><br/>";
		}
		if(selAtt[2] != undefined){
			contenido += "<select name='"+selAtt[2]+"' id='"+selAtt[2]+"'></select><br/>"; 
		}
		for(let i = n;i<inpArrID.length;i++){
			contenido += "<input type='"+inpArrID[i][0]+"' name='"+inpArrID[i][1]+"' id='"+inpArrID[i][1]+"' placeholder='"+inpArrID[i][2]+"' value='"+inpArrID[i][3]+"'/>";
			if(inpArrID[i][0] != 'hidden'){contenido += "<br/>";}
		}
        contenido += "<button  id='"+btnID+"' >Ingresar</button>";
        let formulario = "<form class='"+formCLName+"'><div class='"+subFor+"'>"+contenido+"</div></form>"; 
		return formulario;
	}
	
	botonNavOne(fD,attrb){
		let ctr = "<div class='"+fD[0]+"' id='"+fD[1]+"'><img src='"+fD[3]+"' class='"+fD[2]+"'>"+fD[4]+"</div>";
		attrb.forEach((item,index,array)=>{
			ctr += "<a class='"+item[0]+"' id='"+item[0]+"' href='javascript:void(0)'><img src='"+item[1]+"' class='"+item[2]+"'>"+item[3]+"</a>";
		});
		const nave = `<nav class='${this.formCLName}'>`+ctr+"</nav>";
		return nave;
	}
	

/* revisar para eliminar */	
	async formTxtFormatOne(formCLName){
		let ingFormular = document.getElementsByClassName(`${formCLName}`);
		let numEl = ingFormular[0].length;
		let elem = new Array();
		let elemSel = new Array();
		let hidElmt = new Array();
		let inpElem;
		let rifVal = '';
		let telVal = '';
		let aviso = false;
		for(let i =0;i<numEl;i++){
			inpElem = ingFormular[0][i];
			if((inpElem.tagName == "INPUT" && inpElem.type != 'hidden') || inpElem.tagName == "SELECT"){
				elem.push(inpElem.id);
			}
			if(inpElem.tagName == "INPUT" && inpElem.type == 'hidden'){
				hidElmt.push(inpElem.id);
			}
		}
		let object = {};
		elem.forEach((item,index,array)=>{
			let val = document.getElementById(`${item}`).value;
			if(val == ''){
				aviso = true;
				let element = document.getElementById(`${item}`);
				element.style='border-color:red';
				if(element.tagName == "INPUT"){
					element.placeholder = 'Campo incompleto **';
				}
				object[item] = 'nulo';
			}else{
				if(val.includes(',')){
					let w = val.split(',');
					let sPto = '';
					for(let i=0;i<w.length;i++){sPto += w[i];}
					if(!isNaN(sPto)){val = Number(sPto);}
				}
				
				switch(item){
					case 'rifLetra':
							rifVal += val;
							object['rif'] = rifVal ;
							break;
					case 'rif':
							rifVal += val;
							object['rif'] = rifVal ;
							break;
					case 'telI':
							telVal += val;
							object['telef'] = telVal;
							break;
					case 'telef':
							telVal += val;
							object['telef'] = telVal;
							break;
					case 'email':
						if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)){
							object['email'] = val;
						}else{
							object['email'] = 'nulo';
						}
						break;
					default:
						object[item] = val;
				}
			}
		});
		hidElmt.forEach((item,index,array)=>{
			let val = document.getElementById(`${item}`).value;
			if(val == ''){
				object[item] = 'nulo';
			}else{
				object[item] = val
			}
		});
		const formObj = Object.create(object);
		if(aviso == true){
			let promise = new Promise((resolve,reject) =>{
				setTimeout(()=> resolve(alert('Rellene los campos incompletos')),250)
			});
			let result = await promise;
			
		}
		return formObj;
	}


}

export{FormTemp};