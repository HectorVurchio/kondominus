class TablasMuestras{
	constructor(title,dataArr){
		if(title == undefined){this.title = '';}else{this.title = title;}
		if(dataArr == undefined){this.dataArr = '';}else{this.dataArr = dataArr;}	
	}
	
	tableProfUnBoton(idBut,nomBot){
		let contenido = "<div class='"+this.dataArr[0][0]+"'>"+this.title+"</div>";
		for(let j=1;j<this.dataArr.length;j++){
			let fila = '';
			for(let i=1;i<this.dataArr[0].length;i++){
				fila += "<div class='"+this.dataArr[0][i]+"'>"+this.dataArr[j][i]+"</div>";
			}
			contenido += "<div class='"+this.dataArr[j][0]+"'>"+fila+"</div>";
		}
		let boton = "<div class='rowProf'><button id='"+idBut+"'>"+nomBot+"</button></div>";
		let tabla =`<div class='tableProf' id='tableProf'>${contenido+boton}</div>`;
		return tabla;
	}
	
	botonUno(idBut,nomBot){
		let boton = "<div class='rowProf'><button id='"+idBut+"'>"+nomBot+"</button></div>";
		return boton;			  
	}
	/* tabHeTe = ['Nombre','Apellido','Cédula','Correo Electrónico','Eliminar'] */
	/* tabDatCL = ['nombre','apellido','cedula','correo','imag']*/
	/* n = numero de filas*/
	createTableOne(tabHeTe,tabDatCL,n){
		const tabla = document.createElement('table');
		let fragmento = document.createDocumentFragment();
		let tableHead,tableData,txt;
		tabHeTe.forEach((item,index,array)=>{
			tableHead = document.createElement('th');
			txt = document.createTextNode(item);
			tableHead.appendChild(txt);
			fragmento.appendChild(tableHead);
		});
		let tableRow = document.createElement('tr');
		tableRow.appendChild(fragmento);
		tabla.appendChild(tableRow);
		for(let i=0;i<n;i++){
			fragmento = document.createDocumentFragment();
			tabDatCL.forEach((item,index,array)=>{
				tableData = document.createElement('td');
				tableData.setAttribute('class',item);
				tableData.setAttribute('id',`${item}-${i}`);
				fragmento.appendChild(tableData);
			});
			tableRow = document.createElement('tr');
			tableRow.appendChild(fragmento);
			tabla.appendChild(tableRow);
		}
		return tabla;
	}
	
	crearTablaForm(arrElm){/* tabladinamica.css*/
		let tabdat,fragOne,filtab,filattr,colattrOn;
		let fragTwo = document.createDocumentFragment();
		arrElm.forEach((item,index,array)=>{
			colattrOn = '',filattr='';
			fragOne = document.createDocumentFragment();
			item.forEach((it,ind,arr)=>{
				tabdat = this.crearNodo('div',[['class','coltab'],['style',colattrOn]],false,it);
				fragOne.appendChild(tabdat);
			});
			filtab = this.crearNodo('div',[['class','filtab'],['style',filattr]],false,fragOne);
			fragTwo.appendChild(filtab);
		});
		let button = this.crearNodo('button',[['class','renovar'],['id','renueva']],'Renovar',false);
		filtab = this.crearNodo('div',[['class','filtabDos']],false,button);
		fragTwo.appendChild(filtab);
		let formato = this.crearNodo('form',[['class','tabform']],false,fragTwo);
		return formato;
	}
	crearNodo(tgna,arrAt,txt,hijElm){
		const element = document.createElement(tgna);
		let textnod;
		arrAt.forEach((item,index,array)=>{
			element.setAttribute(item[0],item[1]);
		});
		if(txt != false){
			textnod = document.createTextNode(txt);
			element.appendChild(textnod);
		}
		if(hijElm != false){
			element.appendChild(hijElm);
		}
		return element;
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
}
export {TablasMuestras}

