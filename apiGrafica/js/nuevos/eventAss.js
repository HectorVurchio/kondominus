class EventAsigner{
	constructor(stringID,tip,methToAf){
		if(stringID == undefined || tip == undefined || methToAf == undefined){
			this.stringID = '';
			this.methToAf = '';
			this.tip = '';			
		}else{
			this.stringID = stringID;
			this.methToAf = methToAf;
			this.tip = tip;
		}
	}
	
	clickAsign(objID,tip,method){
		if(tip == 'ID'){
			let objectID = document.getElementById(objID);
			objectID.addEventListener('click',method);
		}else if(tip == 'CL'){
			let objCl = document.getElementsByClassName(objID);
			for(let i = 0; i<objCl.length;i++){
				objCl[i].addEventListener('click',method);
			}
		}
	}
	
	clickRetire(objID,tip,method){
		if(tip == 'ID'){
			let objectID = document.getElementById(objID);
			objectID.removeEventListener('click',method);
		}else if(tip == 'CL'){
			let objCl = document.getElementsByClassName(objID);
			for(let i = 0; i<objCl.length;i++){
				objCl[i].removeEventListener('click',method);
			}
		}
	}
	
	inpTexMethGen(stringID,tip,methToAf){
		let obj = document.getElementsByClassName(stringID)[0].childNodes;
		obj.forEach((item,index,array)=>{
			if(item.tagName == 'INPUT' && item.type == 'text'){
				this.#methCallLat(item.id,methToAf);
			}
		});
	}

	#methCallLat(item,metodo){
		return metodo(item);
	}

	
	changeAsign(stringID,tip,methToAf){
		if(tip == 'ID'){
			let objectID = document.getElementById(stringID);
			objectID.addEventListener('change', methToAf);
		}else if(tip == 'CL'){
			let objCl = document.getElementsByClassName(stringID);
			for(let i = 0; i<objCl.length;i++){
				objCl[i].addEventListener('change', methToAf);
			}
		}
	}
	inputAsign(stringID,tip,methToAf){
		let method;
		switch(methToAf){
			case 'Number':
				method = this.#numberValidation;
				break;
			case 'Decimal':
				method = this.#decNumbValidation;
				break;
		}
		if(tip == 'ID'){
			let objectID = document.getElementById(stringID);
			objectID.addEventListener('input', method);
		}else if(tip == 'CL'){
			let objCl = document.getElementsByClassName(stringID);
			for(let i = 0; i<objCl.length;i++){
				objCl[i].addEventListener('input', method);
			}
		}		
	}
	
	windowLoad(method){
		window.addEventListener('load',method,false);
	}
	
	submitAssign(stringID,tip){
		if(tip == 'ID'){
			let objectID = document.getElementById(stringID);
			objectID.addEventListener('submit', (event)=>{event.preventDefault();});
		}else if(tip == 'CL'){
			let objCl = document.getElementsByClassName(stringID);
			for(let i = 0; i<objCl.length;i++){
				objCl[i].addEventListener('submit', (event)=>{event.preventDefault();});
			}
		}
	}
	
	formFocusEnterKD(stringID,tip){
		let tags = new Array();
		let formul;
		if(tip == 'ID'){
			formul = document.getElementById(stringID);
		}else if(tip == 'CL'){
			formul = document.getElementsByClassName(stringID)[0];
		}	
			for(let i=0;i<formul.length;i++){
				let elm = formul[i];
				if(elm.tagName.toLowerCase() == 'input' && elm.type != 'hidden'){
					tags.push([elm.tagName,elm.id]);
				}
				if(elm.tagName == 'SELECT'){
					tags.push([elm.tagName,elm.id]);
				}
				if(elm.tagName == 'BUTTON'){
					tags.push([elm.tagName,elm.id]);
				}
			}
			for(let i=0;i<tags.length;i++){
				if(i<tags.length-1 || tags[i][0]!='BUTTON'){
					this.#asignaFormFocusEnterKD(tags,i);
				}
			}
			document.getElementById(tags[0][1]).focus();
	}
	
	divFocusEnterKD(stringID,tip,n){
		let tags = new Array();
		let division;
		if(tip == 'ID'){division = document.getElementById(stringId).childNodes;
		}else if(tip == 'CL'){division = document.getElementsByClassName(stringID)[n].childNodes;}
		division.forEach((item,index,array)=>{
			if(item.tagName.toLowerCase() == 'input' && item.type != 'hidden'){tags.push([item.tagName,item.id]);}
			if(item.tagName == 'SELECT'){tags.push([item.tagName,item.id]);}
			if(item.tagName == 'BUTTON'){tags.push([item.tagName,item.id]);}
		});
		tags.forEach((item,index,array)=>{
			if(index<tags.length-1 || item[0]!='BUTTON'){this.#asignaFormFocusEnterKD(tags,index);}			
		});
		document.getElementById(tags[0][1]).focus();
	}
		
	#asignaFormFocusEnterKD(tags,index){
		document.getElementById(tags[index][1]).addEventListener('keypress',(event)=>{
			let x = event.which;
			if(x === 13){
				event.preventDefault();
				let nextInd = Number(index)+1;
				let flag = true;
				while(flag){	
					if(tags[nextInd] != undefined){
						if(document.getElementById(tags[nextInd][1]).disabled){
							nextInd++
						}
						else{
							flag = false;
						}
					}else{
						flag = false;
					}
				}
				if(tags[nextInd] != undefined){
					document.getElementById(tags[nextInd][1]).focus();
				}
			}
		});
	}
	
	numericInput(e){
		this.#numberValidation(e);
	}
	
	decimalInput(e){
		this.#decNumbValidation(e);
	}
	
	#numberValidation(event){
		let x = event.target;
		let z = x.value;
		if(z != ''){
			const ZRGEX = /^(\d*\.)?\d+$/;
			let ZResult = ZRGEX.test(z);
			if (isNaN(z) || !ZResult) {
				alert("No Es Numero");
				let str = x.value;
				let n = str.length;
				let res = str.substr(0,n-1);
				x.value=res;
			}
		}
	}
	
	#decNumbValidation(event){
		let z = event.target.value;
		let n = z.length;
		let sPto = '';
		let w,x;
		if(isNaN(z.slice(n-1,n))){alert("No Es Numero");event.target.value=z.substr(0,n-1);
		}else{
			if(z.includes('.')){w = z.split('.');for(let i=0;i<w.length;i++){sPto += w[i];}}
			if(z.includes(',')){w = sPto.split(',');sPto = '';for(let i=0;i<w.length;i++){sPto += w[i];}}
			
			if(n == 1){
					event.target.value = '0.0'+z;
			}else{
				let antfin = (Number(sPto)*.01).toFixed(2);
				let cut = antfin.split('.');
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
						x = antfin;
				}
				event.target.value = x;
			}
		}
	}
	
	indKeyPresInpAssign(stringID,tip,methToAf){
		let elemt;
		if(tip == 'ID'){
			elemt = document.getElementById(stringID);
		}else if(tip == 'CL'){
			elemt = document.getElementsByClassName(stringID)[0];
		}
		elemt.addEventListener('keypress',(event)=>{this.#methCallLat(event,methToAf);});
	}
}

export {EventAsigner}