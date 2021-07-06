class Avisos{
	constructor(){}
	/* dialogAvisoOne(arrRows,botID,arrAttCont)
	arrRows = [[col,col],[col,col]]
	botID = 'buttID'
	arrAttCont = [[contCL,contID],[subContCL,subContID]]
	*/
	dialogAvisoOne(arrRows,botID,arrAttCont){/* avisoDos.css*/
		let rows,cols,txt,fragmento;
		const fragmentoDos = document.createDocumentFragment();
		arrRows.forEach((item,index,array)=>{
			rows = document.createElement('div');
			rows.setAttribute('class','saRowDos');
			fragmento = document.createDocumentFragment();
			item.forEach((it,ind,arr)=>{
				cols = document.createElement('div');
				cols.setAttribute('class','avColOn');
				txt = document.createTextNode(it);
				cols.appendChild(txt);
				fragmento.appendChild(cols);
			});
			rows.appendChild(fragmento);
			fragmentoDos.appendChild(rows);
		});
		const button = document.createElement('button');
		button.setAttribute('class','botonAviso');
		button.setAttribute('id',botID);
		txt = document.createTextNode('Aceptar');
		button.appendChild(txt);
		rows = document.createElement('div');
		rows.setAttribute('class','saRow');
		rows.appendChild(button);
		fragmentoDos.appendChild(rows);
		const conOn = document.createElement('div');
		conOn.setAttribute('class',arrAttCont[1][0]);
		conOn.setAttribute('id',arrAttCont[1][1]);
		conOn.appendChild(fragmentoDos);
		const dia = document.createElement('div');
		dia.setAttribute('class',arrAttCont[0][0]);
		dia.setAttribute('id',arrAttCont[0][1]);
		dia.appendChild(conOn);
		return dia;
	}
	
	
	
	dialogAvisoTwo(arrRows,botID,arrAttCont){
		let rows,cols,txt,fragmento;
		const fragmentoDos = document.createDocumentFragment();
		arrRows.forEach((item,index,array)=>{
			rows = document.createElement('div');
			rows.setAttribute('class','saRowDos');
			fragmento = document.createDocumentFragment();
			item.forEach((it,ind,arr)=>{
				cols = document.createElement('div');
				cols.setAttribute('class','avColOn');
				txt = document.createTextNode(it);
				cols.appendChild(txt);
				fragmento.appendChild(cols);
			});
			rows.appendChild(fragmento);
			fragmentoDos.appendChild(rows);
		});
		//boton
		const button = document.createElement('button');
		button.setAttribute('class','botonAviso');
		button.setAttribute('id',botID);
		txt = document.createTextNode('Aceptar');
		button.appendChild(txt);
		cols = document.createElement('div');
		cols.setAttribute('class','avColOn');
		cols.appendChild(button);
		rows = document.createElement('div');
		rows.setAttribute('class','saRow');
		rows.appendChild(cols);
		fragmentoDos.appendChild(rows);
		const conOn = document.createElement('div');
		conOn.setAttribute('class',arrAttCont[1][0]);
		conOn.setAttribute('id',arrAttCont[1][1]);
		conOn.appendChild(fragmentoDos);
		const dia = document.createElement('div');
		dia.setAttribute('class',arrAttCont[0][0]);
		dia.setAttribute('id',arrAttCont[0][1]);
		dia.appendChild(conOn);
		return dia;
	}
	/*dialogAvisoThree(arrRows,arrBot,arrContAtt)
		arrRows = [[col,col],[col,col]]
		arrBot = [[botNoId,botNOtxt],[botSiId,botSItxt]]
		arrContAtt = [[contCL,contID],[subContCL,subContID]]
	*/
	dialogAvisoThree(arrRows,arrBot,arrContAtt){/* avisoDos.css o avisoCuatro.css*/
		let txt,cols,fragmento,row,fragmentoDos,fragmentoTres,btn;
		const dialg = document.createElement('div');
		dialg.setAttribute('class',arrContAtt[0][0]);
		dialg.setAttribute('id',arrContAtt[0][1]);
		const diaCont = document.createElement('div');
		diaCont.setAttribute('class',arrContAtt[1][0]);
		diaCont.setAttribute('id',arrContAtt[1][1]);
		fragmentoDos = document.createDocumentFragment();
		arrRows.forEach((item,index,array)=>{
			fragmento = document.createDocumentFragment();
			for(let i=0;i<item.length;i++){
				cols = document.createElement('div');
				cols.setAttribute('class','avCol');
				cols.setAttribute('id','avCol-'+i);
				txt = document.createTextNode(item[i]);
				cols.appendChild(txt);
				fragmento.appendChild(cols);
			}
			row = document.createElement('div');
			row.setAttribute('class','saRowDos');
			row.appendChild(fragmento);
			fragmentoDos.appendChild(row);
		});
		row = document.createElement('div');
		row.setAttribute('class','butRowOne');
		fragmentoTres = document.createDocumentFragment();
		arrBot.forEach((item,index) => {
			cols = document.createElement('div');
			cols.setAttribute('class','avColBut');
			cols.setAttribute('id',`avColBut-${index}`);
			btn = document.createElement('button');
			btn.setAttribute('class','botAvDos');
			btn.setAttribute('id',item[0]);
			txt = document.createTextNode(item[1]);
			btn.appendChild(txt);
			cols.appendChild(btn);
			fragmentoTres.appendChild(cols);
		});

		row.appendChild(fragmentoTres);
		fragmentoDos.appendChild(row);
		diaCont.appendChild(fragmentoDos);
		dialg.appendChild(diaCont);
		return dialg;
	}

	/* USADO EN datosCondominio.js L552
		const arrFil = ['Ingrese La Cédula o RIF del Nuevo Administrador'];
		const optVals = ['V-','E-','J-','G-'];
		const arrHidInpVal = [['saiAsig','ingreadm'],['codEd',rifEd],['jwt',tok],['codProp',codProp]];
		const avisTwo = new Avisos().dialogAvisoFour(arrFil,optVals,'rifLetra',arrHidInpVal,'rif','botonAviso'
		
		1a POSIBLE mejora en dialogAvisoSeven
	*/

	dialogAvisoFour(arrFil,optVals,selID,arrInpVal,inpID,botID){/* avisoCuatro.css*/
		const chidrs = new Array();
		let saRowCu,saColCu,txt,indice;
		for(let i=0;i<arrFil.length+3;i++){
			saRowCu = document.createElement('div');
			saRowCu.setAttribute('class','saRowCu');
			chidrs.push(saRowCu);
		}
		const cnclBtn = document.createElement('button');
		cnclBtn.setAttribute('class','cnclBtn');
		cnclBtn.setAttribute('id','cnclBtn');
		txt = document.createTextNode('X');
		cnclBtn.appendChild(txt);
		saColCu = document.createElement('div');
		saColCu.setAttribute('class','saColCu');
		saColCu.appendChild(cnclBtn);
		chidrs[0].appendChild(saColCu);
		arrFil.forEach((item,index,array)=>{
			indice = index+1;
			txt = document.createTextNode(item);
			chidrs[indice].appendChild(txt);
		});
		indice++;
		const ceFiFo = document.createElement('select');
		ceFiFo.setAttribute('class','ceFiFo');
		ceFiFo.setAttribute('id',selID);
		const fragmento = document.createDocumentFragment();
		let opt,inp;
		optVals.forEach((item,index,array)=>{
				opt = document.createElement('option');
				opt.setAttribute('value',item);
				txt = document.createTextNode(item);
				opt.appendChild(txt);
				fragmento.appendChild(opt);
		});
		ceFiFo.appendChild(fragmento);
		inp = document.createElement('input');
		inp.setAttribute('class','ceFiTw');
		inp.setAttribute('type','text');
		inp.setAttribute('id',inpID);
		inp.maxLength = 9;
		chidrs[indice].appendChild(ceFiFo);
		chidrs[indice].appendChild(inp);
		arrInpVal.forEach((item,index,array)=>{
			inp = document.createElement('input');
			inp.setAttribute('type','hidden');
			inp.setAttribute('id',item[0]);
			inp.setAttribute('value',item[1]);
			chidrs[indice].appendChild(inp);
		});
		const but = document.createElement('button');
		but.setAttribute('class','botAvCu');
		but.setAttribute('id',botID);
		txt = document.createTextNode('Ingresar');
		but.appendChild(txt);
		indice++;
		chidrs[indice].appendChild(but);
		const formOne = document.createElement('form');
		formOne.setAttribute('class','subContCu');
		chidrs.forEach((item,index,array)=>{
				formOne.appendChild(item);
		});
		const avisTwo = document.createElement('div');
		avisTwo.setAttribute('class','contCu');
		avisTwo.appendChild(formOne);
		return avisTwo;
	}
	
	dialogAvisoFive(arrFil,botID,butTXT){/* avisoCuatro.css*/
		const chidrs = new Array();
		let saRowCu,saColCu,txt,indice;
		for(let i=0;i<arrFil.length+3;i++){
			saRowCu = document.createElement('div');
			saRowCu.setAttribute('class','saRowCu');
			chidrs.push(saRowCu);
		}
		const cnclBtn = document.createElement('button');
		cnclBtn.setAttribute('class','cnclBtn');
		cnclBtn.setAttribute('id','cnclBtn');
		txt = document.createTextNode('X');
		cnclBtn.appendChild(txt);
		saColCu = document.createElement('div');
		saColCu.setAttribute('class','saColCu');
		saColCu.appendChild(cnclBtn);
		chidrs[0].appendChild(saColCu);
		arrFil.forEach((item,index,array)=>{
			indice = index+1;
			txt = document.createTextNode(item);
			chidrs[indice].appendChild(txt);
		});
		indice++;
		const but = document.createElement('button');
		but.setAttribute('class','botAvCu');
		but.setAttribute('id',botID);
		txt = document.createTextNode(butTXT);
		but.appendChild(txt);
		saColCu = document.createElement('div');
		saColCu.setAttribute('class','saColCu');
		saColCu.appendChild(but);
		indice++;
		chidrs[indice].appendChild(saColCu);
		const formOne = document.createElement('form');
		formOne.setAttribute('class','subContCu');
		chidrs.forEach((item,index,array)=>{
				formOne.appendChild(item);
		});
		const avisTwo = document.createElement('div');
		avisTwo.setAttribute('class','contCu');
		//formOne.removeEventListener('click',(e)=>{e.preventDefault();});
		//formOne.addEventListener('click',(e)=>{e.preventDefault();});
		avisTwo.appendChild(formOne);
		return avisTwo;
	}
	
	dialogAvisoSix(arrFil,botID,butTXT){ /*array de textos, avisoTres.css*/
		//botID=['cerInf1','cerInf2']
		const chidrs = new Array();
		let saRowDos,txt,indice,fragmento,colum;
		/* filas del aviso +2 */
		for(let i=0;i<arrFil.length+2;i++){
			saRowDos = document.createElement('div');
			saRowDos.setAttribute('class','avisThrFil');
			chidrs.push(saRowDos);
		}
		/* boton cerrar arriba*/
		const cnclBtn = document.createElement('button');
		cnclBtn.setAttribute('class','cnclBtn');
		cnclBtn.setAttribute('id',botID[0]);
		txt = document.createTextNode('X');
		cnclBtn.appendChild(txt);
		chidrs[0].appendChild(cnclBtn);
		/* filas de texto*/
		arrFil.forEach((item,index,array)=>{
			indice = index+1;
			/* columnas de cada fila*/
			fragmento = document.createDocumentFragment();
			item.forEach((it,ind,arr)=>{
				colum = document.createElement('div');
				colum.setAttribute('class','avisThrCol-'+ind);
				txt = document.createTextNode(it);
				colum.appendChild(txt);
				fragmento.appendChild(colum);
			});
			chidrs[indice].appendChild(fragmento);
		});
		indice++;
		/* creacion del boton*/
		const but = document.createElement('button');
		but.setAttribute('class','botAvTh1');
		but.setAttribute('id',botID[1]);
		txt = document.createTextNode(butTXT);
		but.appendChild(txt);
		chidrs[indice].appendChild(but);
		/* creacion del form */
		const formOne = document.createElement('form');
		formOne.setAttribute('class','avisThreeSubCont');
		chidrs.forEach((item,index,array)=>{
				formOne.appendChild(item);
		});
		/* creacion del contenedor*/
		const avisThree = document.createElement('div');
		avisThree.setAttribute('class','avisThreeCont');
		formOne.addEventListener('click',(e)=>{e.preventDefault();});
		avisThree.appendChild(formOne);
		return avisThree;
	}
	
	/* 
		METODO A SER USADO EN egresoEfectivo.js PERO NO USADO HASTA AHORA
		attCont = [[contClassname,contID],[subContClassname,subContID]]
		arrFil => array de fragmentos para cada fila
		arrAtr =[[['class','clnameFila'],['id','idnameFila']],
		         [['class','clnameColumn'],['id','idnameColumn']]];
		arrBut = ['Cancelar',classname,idname],['Aceptar',classname,idname]
	*/
	dialogAvisoSeven(attCont,arrFil,arrAtr,arrBut){/* avisoCuatro.css*/
		const chidrs = new Array();
		let saRowCu,txt,indice,but,col,fragmento;
		for(let i=0;i<arrFil.length+2;i++){
			saRowCu = document.createElement('div');
			arrAtr[0].forEach(item =>{saRowCu.setAttribute(item[0],item[1]);});
			chidrs.push(saRowCu);
		}
		const cnclBtn = document.createElement('button');
		cnclBtn.setAttribute('class','cnclBtn');
		cnclBtn.setAttribute('id','cnclBtn');
		txt = document.createTextNode('X');
		cnclBtn.appendChild(txt);
		chidrs[0].appendChild(cnclBtn);
		arrFil.forEach((item,index,array)=>{
			fragmento = document.createDocumentFragment();
			item.forEach(it => {
				col = document.createElement('div');
				arrAtr[1].forEach(it =>{col.setAttribute(it[0],it[1]);});
				col.appendChild(it);
				fragmento.appendChild(col);
			});
			indice = index+1;
			chidrs[indice].appendChild(fragmento);
		});
		indice++;
		fragmento = document.createDocumentFragment();
		arrBut.forEach(item =>{
			but = document.createElement('button');
			but.setAttribute('class',item[1]);
			but.setAttribute('id',item[2]);
			txt = document.createTextNode(item[0]);
			but.appendChild(txt);
			col = document.createElement('div');
			arrAtr[1].forEach(it =>{col.setAttribute(it[0],it[1]);});
			col.appendChild(but);
			fragmento.appendChild(col);
		})
		indice++;
		chidrs[indice].appendChild(fragmento);
		const formOne = document.createElement('form');
		formOne.setAttribute('class',attCont[1][0]);
		formOne.setAttribute('id',attCont[1][1]);
		chidrs.forEach((item,index,array)=>{
				formOne.appendChild(item);
		});
		const avisTwo = document.createElement('div');
		avisTwo.setAttribute('class',attCont[0][0]);
		avisTwo.setAttribute('class',attCont[0][1]);
		avisTwo.appendChild(formOne);
		return avisTwo;
	}

}

export {Avisos}