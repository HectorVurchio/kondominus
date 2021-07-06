import{FormTemp} from './formTemp.js';
import{EventAsigner} from './eventAss.js';
import {Avisos} from './avisos.js';
import {BackQuery} from './backQ.js';
import {PageBehavior} from './pageBeha.js';
	var eventAsigner = new EventAsigner();
	var formTemp = new FormTemp('imageContainer');
	var pageBehavior = new PageBehavior();
	
	eventAsigner.windowLoad(()=>{
		const element = document.getElementsByClassName('imageContainer')[0];
		const elementDos = document.getElementsByClassName('regFormular')[0];
		formTemp.retiraNodoTextoDos(elementDos);
		element.addEventListener('click',(e)=>{e.preventDefault();regclicks(e,{});});
		element.addEventListener('submit', (e)=>{e.preventDefault();});
		element.addEventListener('keypress', (e)=>{keyDPressEnt(e);});
		document.forms[0].elements[0].focus();
	});
	
	function regclicks(e,obj){
		const clName = e.target.className;
		const idName = e.target.id;
		console.log(idName,clName);
		if(clName == 'botonIng' && idName == 'botEnv'){
			enviar(e);
		}
		if(clName == 'botonAviso' && idName == 'seguir'){
			window.location.assign(pageBehavior.getURL('/ingreso'));
		} 
	}
	
	function keyDPressEnt(e){
		let x = e.which;
		if(x === 13){
			e.preventDefault();
			const nextSib = e.target.nextSibling
			if(nextSib != null){
				nextSib.focus();
			}else{
				regclicks(e,{});
			}
		}
	}
	
	function enviar(e){
		let padre = e.target;
		for(let i=0;i<3;i++){padre = padre.parentElement;}
		let flag = true,arrFil,butID;
		let allVal = formTemp.getInpValAllTwo('regFormular');
		allVal.forEach((item,index,array)=>{if(flag){if(item == ''){flag=false;}}});
		const objeto = formTemp.formObjVal('regFormular').then((result)=>{
			if(flag){
				const respuesta = new BackQuery('/accessCode',result).afirmaPU();
				respuesta.then(respuesta => {
					if(respuesta == 'Afirmativo'){
						arrFil = [['Su Clave Fue Asignada Satisfactoriamente'],['Ya Puede Ingresar']];
						butID = 'seguir';
					}else{
						arrFil = [['Su Clave No Pudo Ser Asignada'],['Por Favor Intente De Nuevo']];
						butID = 'seguir';
					}
					const arrAttCont = [['avisoDos','contEnvCla1'],['subAvisoDos','suCoEnCla1']];
					const avis = new Avisos().dialogAvisoOne(arrFil,butID,arrAttCont);
					padre.removeChild(padre.lastChild);
					padre.removeChild(padre.lastChild);
					padre.append(avis);
				});
			}
		});
	}
	
	