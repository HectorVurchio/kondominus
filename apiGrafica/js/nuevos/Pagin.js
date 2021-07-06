/* 
Class Pagination
	
	**********HTML: **************
	
	<div class='container class'>
		<table id='table class name'></table>
		<div id='button panel id'></div>
	</div>
	
	*******End of HTML*************

	ite_por_pag = items per page;
	num_bot = number of buttons;
	contCL = container class;
	botID = button panel id;
	arrTabHe = an array that contains all table headers;
	result = the result set of a db query;
	curPag = the current page tho show;
	tabCL = table class name;

*/

class Pagination{
	constructor(ite_por_pag,num_bot,contCL,botID,arrTabHe){
		this.ite_por_pag = ite_por_pag; 
		this.num_bot = num_bot;  
		this.contCL = contCL;
		this.botID = botID;
		this.arrTabHe = arrTabHe;
	}
	paginacionParam(result,curPag,tabCL){ 
		this.result = result;
		this.num_items = result.length;
		this.tot_pag = Number(Math.ceil(this.num_items/this.ite_por_pag));
		this.curPag = curPag;
		this.tabCL = tabCL;
		this.setItemShow();
		if(this.num_items > this.ite_por_pag){
			this.#setBotShow();
		}
	}
	setItemShow(){
		const itePPag = Number(this.ite_por_pag);
		const totItem = Number(this.num_items);
		const pis_ite = +this.curPag*itePPag-(itePPag);
		let tec_ite = +pis_ite+itePPag;
		if(tec_ite>totItem){tec_ite = totItem;}
		let table = document.getElementsByClassName(this.tabCL)[0]; 
		if(table != undefined){
			table.remove();
		}
		let tabla = document.createElement('table');
		tabla.setAttribute('class',this.tabCL);
		let txt,datTab;
		let resObj,filTab,fragmento,noNa;
		const cant = tabla.childNodes.length;
		fragmento = document.createDocumentFragment();
		this.arrTabHe.forEach((it,ind,ar)=>{
			datTab = document.createElement('th');
			txt = document.createTextNode(it);
			datTab.appendChild(txt);
			fragmento.appendChild(datTab);
		});
		filTab = document.createElement('tbody');
		filTab.appendChild(fragmento);
		tabla.appendChild(filTab);	
		for(let i=pis_ite;i<tec_ite;i++){
			resObj = Object.values(this.result[i]);
			filTab = document.createElement('tr');
			fragmento = document.createDocumentFragment();
			resObj.forEach((item,index,array)=>{
				txt = document.createTextNode(item);
				datTab = document.createElement('td');
				datTab.appendChild(txt);
				fragmento.appendChild(datTab);
			});
			filTab.appendChild(fragmento);
			tabla.appendChild(filTab);	
		}	
		let pantalla = document.getElementsByClassName(this.contCL)[0];
		pantalla.appendChild(tabla);
	}
	#setBotShow(){
		const numBot = this.num_bot;
		const pis_bot = Math.ceil(this.curPag/numBot)*numBot-(numBot-1);
		let tec_bot = pis_bot+numBot;
		if(tec_bot>this.tot_pag){tec_bot = this.tot_pag}
		let adelante,atras;
		if(this.curPag==1){atras=false;}else{atras=true;}
		if(this.curPag==this.tot_pag){adelante=false;}else{adelante=true;}
		let panelbot = document.getElementsByClassName(this.contCL)[0];
		let botoniera = document.getElementById(this.botID);
		botoniera.removeEventListener('click',(e)=>{this.#buttonFire(e);});
		botoniera.remove();
		let botonera = document.createElement('div');
		botonera.setAttribute('id',this.botID);
		let fragmento = document.createDocumentFragment();
		let boton,txt;
		boton = document.createElement('button');
		boton.setAttribute('id','atras');
		txt = document.createTextNode('Atras');
		boton.appendChild(txt);
		fragmento.appendChild(boton);
		if(atras){
			boton.setAttribute('style','visibility:visible;');
		}else{
			boton.setAttribute('style','visibility: hidden;');
		}
		for(let i= pis_bot;i<tec_bot;i++){
			boton = document.createElement('button');
			boton.setAttribute('id','b-'+i);
			boton.setAttribute('class','botonPag');
			txt = document.createTextNode(i);
			boton.appendChild(txt);
			fragmento.appendChild(boton);
		}
		boton = document.createElement('button');
		boton.setAttribute('id','siguiente');
		txt = document.createTextNode('Siguiente');
		boton.appendChild(txt);
		fragmento.appendChild(boton);
		if(adelante){
			boton.setAttribute('style','visibility:visible;');
		}else{
			boton.setAttribute('style','visibility:hidden;');
		}
		botonera.appendChild(fragmento);
		panelbot.appendChild(botonera);
		botonera.addEventListener('click',(e)=>{this.#buttonFire(e);});
	}
	#buttonFire(event){
		let newPage;
		let elemento = event.target;
		let ident = elemento.id;
		const currPag = Number(sessionStorage.getItem('curr_page'));
		switch(ident){
			case 'atras':
				newPage = currPag-1;
				if(newPage > 0){
					sessionStorage.setItem('curr_page',newPage);
					this.paginacionParam(this.result,newPage,this.tabCL,this.contCL);
				}
				break;
			case 'siguiente':
				newPage = currPag+1;
				if(newPage <= this.tot_pag){
					sessionStorage.setItem('curr_page',newPage);
					this.paginacionParam(this.result,newPage,this.tabCL,this.contCL);
				}
				break;
			default:
			const num = ident.split('-')[1];
			sessionStorage.setItem('curr_page',num);
			this.paginacionParam(this.result,num,this.tabCL,this.contCL);
			break;
		}	
	}
}

export {Pagination}