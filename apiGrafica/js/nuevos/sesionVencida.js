import {PageBehavior} from './pageBeha.js';
import{EventAsigner} from './eventAss.js';
import {BackQuery} from './backQ.js';

var pageBehavior = new PageBehavior();
var eventAsigner = new EventAsigner();

	eventAsigner.windowLoad(()=>{
		eventAsigner.clickAsign('cerrar','ID',logOut);
	});
	
	function logOut(){  
		let property = pageBehavior.getCookie('property').split(',');
		pageBehavior.logOut(new BackQuery('/logOut',{property}).afirma());
	}