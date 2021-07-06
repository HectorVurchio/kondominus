class BackQuery{
	constructor(url,object){
		this.url = url;
		this.object = object;
	}
	
	async afirma(){
		let respuesta;
		const resp = await fetch(this.url,{method: 'POST', mode: 'no-cors',credentials: 'same-origin',
									 headers: {'Content-Type': 'application/json'},
									 body: JSON.stringify(this.object)})
		.then(resp => resp.status).then(data => {			
			if(data == 200){
				respuesta = 'Afirmativo';
			}else{
				respuesta = 'Negativo';
			}
		}).catch((error) => {
			respuesta = 'Error';
		});	
		return respuesta;
	}
	
	async afirmaPU(){
		let respuesta;
		const resp = await fetch(this.url,{method: 'PUT',credentials: 'same-origin',
									 headers: {'Content-Type': 'application/json'},
									 body: JSON.stringify(this.object)})
		.then(resp => resp.status).then(data => {			
			if(data == 200){
				respuesta = 'Afirmativo';
			}else{
				respuesta = 'Negativo';
			}
		}).catch((error) => {
			respuesta = 'Error';
		});	
		return respuesta;
	}

	
	async getServDatPO(){
		let respuesta;
		const resp = await fetch(this.url,{method: 'POST', mode: 'no-cors',credentials: 'same-origin',
									 headers: {'Content-Type': 'application/json'},
									 body: JSON.stringify(this.object)})
		.then(resp => resp.json()).then(data => {			
				respuesta = data;
		}).catch((error) => {
			respuesta = 'Error';
		});	
		return respuesta;		
	}
	
	async eliminaRequest(){
		let respuesta;
		const resp = await fetch(this.url,{method: 'DELETE', mode: 'cors',credentials: 'same-origin',
									 headers: {'Content-Type': 'application/json'},
									 body: JSON.stringify(this.object)})
		.then(resp => resp.status).then(data => {			
			if(data == 200){
				respuesta = 'Afirmativo';
			}else{
				respuesta = 'Negativo';
			}
		}).catch((error) => {
			respuesta = 'Error';
		});	
		return respuesta;		
	}
	
}

export{BackQuery}