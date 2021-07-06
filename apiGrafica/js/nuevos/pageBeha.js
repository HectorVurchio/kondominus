class PageBehavior{
	constructor(stringID){
		if(stringID == undefined){
			this.stringID = '';
		}else{
			this.stringID = stringID;
		}
	}
	
	logHeaderOne(nombre,contMen,contOpt){
		// menu 
		//const contMen = [['Mi Perfil','miPer'],['Cerrar Sesión','loOt']];
		//const contOpt = [['Mis Cuentas','princ']];
		let hijo,hiHi,txt,txtOpt;
		let menu = document.getElementsByClassName('menu')[0];
		let menuItems = document.createDocumentFragment();
		let textos = new Array();
		contMen.forEach((item,index,array)=>{
			textos.push([item[0],[['class',item[1]],['href','javascript:void(0)']]]);
		});
		textos.forEach((item,index,array)=>{
			hijo = document.createElement('a');
			item[1].forEach((it,ind,arr)=>{hijo.setAttribute(it[0],it[1]);});
			txt = document.createTextNode(item[0]);
			hijo.appendChild(txt);
			hiHi = document.createElement('li');
			hiHi.appendChild(hijo);
			menuItems.appendChild(hiHi);
		});
		const liNod = document.createElement('li');
		liNod.setAttribute('id','imagen');
		menuItems.appendChild(liNod);
		menu.appendChild(menuItems);
		//opciones
		let opciones = document.getElementsByClassName('opciones')[0];
		let opcionesItems = document.createDocumentFragment();
		txtOpt = new Array();
		contOpt.forEach((item,index,array)=>{
			txtOpt.push([item[0],[['id','imagen'],['class',item[1]]]]);
		});
		txtOpt.forEach((item,index,array)=>{
			hijo = document.createElement('a');
			item[1].forEach((it,ind,arr)=>{hijo.setAttribute(it[0],it[1]);});
			txt = document.createTextNode(item[0]);
			hijo.appendChild(txt);
			opcionesItems.appendChild(hijo);
		});
		let cont = document.createElement('div');
		cont.setAttribute('class','opciones-content');
		cont.appendChild(opcionesItems);
		opciones.appendChild(cont);
		// dropdown
		let dropdown = document.getElementsByClassName('dropdown')[0];
		let dropdownItems = document.createDocumentFragment();
		let padre = document.createElement('button');
		padre.setAttribute('class','dropbtn');
		txt = document.createTextNode(nombre);
		padre.appendChild(txt);
		dropdownItems.appendChild(padre);
		let hijos = document.createDocumentFragment();
		textos.forEach((item,index,array)=>{
			hijo = document.createElement('a');
			item[1].forEach((it,ind,arr)=>{hijo.setAttribute(it[0],it[1]);});
			txt = document.createTextNode(item[0]);
			hijo.appendChild(txt);
			hijos.append(hijo);
		});
		// contenedor 
		cont = document.createElement('div');
		cont.setAttribute('class','dropdown-content');
		cont.appendChild(hijos);
		dropdownItems.appendChild(cont);
		dropdown.appendChild(dropdownItems);
	}
	
	keyDPressEnt(e){
		let x = e.which;
		if(x === 13){
			e.preventDefault();
			let flag = 0;
			let num = 0;
			let currElem = e.target;
			if(currElem.form != null){
				for(let i = 0;i<currElem.form.elements.length;i++){
					if(currElem.form.elements[i] == currElem){num = i;break;}
				}
				if(currElem.nodeName.toLowerCase() == 'button' || currElem.type == 'button'){
					currElem.click();
					return;
				}
				num++;
				let nextSib = e.target.form.elements[num];
				if(nextSib != undefined){
					let neSibNa = nextSib.nodeName.toLowerCase();
					if(neSibNa == 'input' && nextSib.type != 'hidden' && nextSib.disabled != true){flag = 1;}		
					if(neSibNa =='select' || neSibNa =='button' && nextSib.disabled != true){flag = 1;}
					if(flag == 0){
						for(let i = num + 1; i < e.target.form.elements.length;i++){
							nextSib = e.target.form.elements[i];
							neSibNa = nextSib.nodeName.toLowerCase();
							if(neSibNa == 'input' && nextSib.type != 'hidden'){flag = 1;break;}
							if(neSibNa =='select' || neSibNa =='button'){flag = 1;break;}
						}
					}
					if(flag == 1){
						nextSib.focus();
						try {nextSib.select();}catch(err){}
						
					}
				}
			}
			
		}
	}
	/* opreracion con SELECT*/
	rifLetraOrden(rl){
		let flag;
		const rif = ['V','J','E','G'];
		const arrRif = new Array();
		arrRif.push(rl);
		rif.forEach(item => {if(item != rl){arrRif.push(item)}});
		const seAtt = new Array();
		arrRif.forEach(item => {seAtt.push([`${item}-`,`${item}-`]);});
		return seAtt;
	}	
	retiracoma(val){
		let w,sPto = '';
		if(val.includes(',')){
			w = val.split(',');
			for(let i=0;i<w.length;i++){
				sPto += w[i];
			}
		}else{
			sPto = val;
		}
		return sPto;		
	}
		
	getCookie(strNam){
		var name = strNam + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' '){
				c = c.substring(1);
			}
 
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
	
	setCookie(stringID,cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = stringID + "=" + cvalue + ";" + expires + ";path=/";
	}
	
	getURL(nam){
		let protocol = window.location.protocol;
		let domain = window.location.hostname;
		let url = protocol+'//'+domain+nam;
		return url;
	}

	logOut(respuesta){ 
		sessionStorage.clear();
		window.indexedDB.databases().then((r) => {
			for (var i = 0; i < r.length; i++){window.indexedDB.deleteDatabase(r[i].name);} 
		});
		respuesta.then((r)=>{
			console.log(r);
			if (r == 'Afirmativo'){
				alert('Sesión cerrada con normalidad');
			}else if (r ==  'Negativo'){
				alert('Sesión cerrada con problemas');
			}else if (r ==  'Error'){
				alert('Error');
			}
		}).then(()=>{
			this.#logOutComplement();
		});
		
	}
	async #logOutComplement(){
		let cookObj = document.cookie.split(';');
			for(let i=0;i<cookObj.length;i++){
				let cname = cookObj[i].split('=')[0].trim();
				this.setCookie(cname,"", -1);
			}
			let promise = new Promise((resolve,reject) =>{
				setTimeout(()=> resolve(window.location.assign(this.getURL('/'))),250)
			});
			let result = await promise;	
	}
	/* Operacion con fechas*/
	getFechaHoyNum(){
		const fec = new Date();
		const dia = new String(fec.getDate()).padStart(2, '0');
		const mes = new String(fec.getMonth()+1).padStart(2, '0');
		const ano = `${fec.getFullYear()}`;
		const arrFecha = new Array(ano,mes,dia);
		return arrFecha;
	}
	/* fechaArr = [ano,mes,dia]*/
	getFechaLet(fechaArr){ 
		const dia = fechaArr[2];
		let mes = Number(fechaArr[1]);
		switch (mes){
			case 1:
				mes = 'Enero';
				break;
			case 2:
				mes = 'Febrero';
				break;
			case 3:
				mes = 'Marzo';
				break;
			case 4:
				mes = 'Abril';
				break;
			case 5:
				mes = 'Mayo';
				break;
			case 6:
				mes = 'Junio';
				break;
			case 7:
				mes = 'Julio';
				break;
			case 8:
				mes = 'Agosto';
				break;
			case 9:
				mes = 'Septiembre';
				break;
			case 10:
				mes = 'Octubre';
				break;
			case 11:
				mes = 'Noviembre';
				break;
			case 12:
				mes = 'Diciembre';
				break;
		}
		const ano = fechaArr[0];;
		const arrFecha = new Array(ano,mes,dia);
		return arrFecha;
	}
	/* fechaArr = [ano,mes,dia],nDias=int*/
	getNuevaFecha(fechaArr,nDias){
		const anoHoy = fechaArr[0];
		const mesHoy = Number(fechaArr[1])-1;
		const diaHoy = fechaArr[2];
		const fec = new Date(anoHoy, `${mesHoy}`, diaHoy);
		fec.setDate(fec.getDate() + nDias); // minus the date
		const nueFec = new Date(fec);
		const nueano = `${nueFec.getFullYear()}`;
		const nuemes = new String(nueFec.getMonth()+1).padStart(2, '0');
		const nuedia = new String(nueFec.getDate()).padStart(2, '0');
		const arrFecha = new Array(nueano,nuemes,nuedia);
		return arrFecha;
	}

	vencENdias(fechaVenc){  // fechaVenc mm/dd/aaaa
		const d = new Date();
		const hoy = (d.getMonth()+1)+'/'+d.getDate()+'/'+d.getFullYear();
		const date1 = new Date(hoy);
		const date2 = new Date(fechaVenc);
		const diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
		return diffDays;  //resultado en dias. si es < 0 ya pasaron x dias desde fechaVenc hasta hoy
	}
	
	/* ***********************************************************************/
	/* PARA ELIMINAR*/
	
	logeado(stringID,tit,atrib){
		const menu = document.getElementsByClassName('menu')
		const opciones = document.getElementsByClassName('opciones')
		const dropdown = document.getElementsByClassName('dropdown');
		let menuItems = '';
		atrib.forEach((item,index,array)=>{
			menuItems += "<li><a href='javascript:void(0);' class='"+item[0]+"'>"+item[1]+"</a></li>";
		});
		menuItems += "<li id='imagen'></li>";
		let opcionesItems ='<div class="opciones-content">'+
							"<a href='javascript:void(0);' class='"+atrib[1][0]+"'>"+tit+"</a>"+
							'</div>';
		let dropDownItems = `<button class='dropbtn'>${stringID}`+
		/*"<i class='fas fa-sort-down'><img src='/apiGrafica/imagenes/dropDown.jpg' style='height:10px;'></i>"+*/
		"</button>"+"<div class='dropdown-content'>"+
		"<a href='javascript:void(0);' class='"+atrib[0][0]+"'>"+atrib[0][1]+"</a>"+
		"<a href='javascript:void(0);' class='"+atrib[2][0]+"'>"+atrib[2][1]+"</a>'+'</div>";
		menu[0].innerHTML = menuItems;
		opciones[0].innerHTML = opcionesItems;
		dropdown[0].innerHTML = dropDownItems;
	}
	
	setValue(stringID,val){
		document.getElementById(`${stringID}`).value = val;
	}
	setFocus(stringID){
		document.getElementById(`${stringID}`).focus();
	}
	setSelect(){
		let object = document.getElementById(`${this.stringID}`);
		object.select();
	}
	setMaxLength(strID,val){
		let object = document.getElementById(strID);
		object.maxLength = val;
	}
	
	setStyle(arrIds){
		//[id,atrib,value]
		let elem;
		arrIds.forEach((item,index,array)=>{
			elem = document.getElementById(item[0]);
			elem.style = item[1]+':'+item[2];
		})
	}
	
	borrar(tipo,identif){
		if (tipo == 'clase'){
			let objectClass = document.getElementsByClassName(identif);
			objectClass[0].innerHTML='';
		}else if(tipo == 'ident'){
			let objectID = document.getElementById(identif);
			objectID.innerHTML='';
		}
		return 
	}

}

export {PageBehavior}