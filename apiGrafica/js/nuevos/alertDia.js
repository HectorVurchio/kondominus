class AlertDialog{
	constructor(arrMsj){
		this.arrMsj = Array.from(arrMsj);
	}
	
	dialogoUno(){
		let contenido = '';
		this.arrMsj.forEach((item,index,array)=>{
			contenido += "<div class='cont'>"+item+"</div>";
		})
		let reg ="<div class='alerta'>" +
					"<div class='subAlerta'>"+contenido+
						"<button  class='botonAlert' id='botonAlert'>Entendido</button>"+
					"</div>"+
	          "</div>";
		return reg;
	}
	
}

export {AlertDialog}