class RetrieveDBEgresos{
	constructor(dbName,vers){
		this.dbName = dbName;
		this.vers = vers;
	}
	
	retrieveAllTableDataArr(tabla,method){
		let openRequest = indexedDB.open(this.dbName,this.vers);
		openRequest.onerror = ()=>{console.error("Error", openRequest.error);};
		openRequest.onsuccess = ()=> {
			let db = openRequest.result;
			let transaction = db.transaction([tabla], "readwrite"); 
			let objStore = transaction.objectStore(tabla); 
			let request = objStore.getAll(); 
			request.onsuccess = ()=> {
				let respuesta = request.result;
				this.#procesoRespuesta(method,respuesta);
			};
			request.onerror = ()=> {console.log("Error", request.error);};
		};
		openRequest.onupgradeneeded = ()=> {let db = openRequest.result;};
	}
	
	retrieveSomeTableDataArr(tabla,indice,method){
		let openRequest = indexedDB.open(this.dbName,this.vers);
		openRequest.onerror = ()=>{console.error("Error", openRequest.error);};
		openRequest.onsuccess = ()=> {
			let db = openRequest.result;
			let transaction = db.transaction([tabla], "readwrite"); 
			let objStore = transaction.objectStore(tabla); 
			let request = objStore.get(indice); 
			request.onsuccess = ()=> {
				let respuesta = request.result;
				this.#procesoRespuesta(method,respuesta);
			};
			request.onerror = ()=> {console.log("Error", request.error);};
		};
		openRequest.onupgradeneeded = ()=> {let db = openRequest.result;};
	}
	
	#procesoRespuesta(metodo,respuesta){
		return metodo(respuesta);
	}
	
	retrieveDataByIdex(tabla,key,param,method){
		const openRequest = indexedDB.open(this.dbName,this.vers);
		openRequest.onerror = ()=>{console.error("Error", openRequest.error);};
		openRequest.onsuccess = ()=> {
			const db = openRequest.result;
			const transaction = db.transaction([tabla]); 
			const objStore = transaction.objectStore(tabla);
			const index = objStore.index(key);
			index.get(param).onsuccess = (e)=> {
				let respuesta = e.target.result;
				this.#procesoRespuesta(method,respuesta);
			};	
		};
		openRequest.onupgradeneeded = ()=> {
			const db = openRequest.result;
		};
	}
	
	retriMultDataByIdex(tabla,key,param,method){
		const openRequest = indexedDB.open(this.dbName,this.vers);
		openRequest.onerror = ()=>{console.error("Error", openRequest.error);};
		openRequest.onsuccess = ()=> {
			const db = openRequest.result;
			const transaction = db.transaction([tabla]); 
			const objStore = transaction.objectStore(tabla);
			const index = objStore.index(key);
			index.getAll(param).onsuccess = (e)=> {
				let respuesta = e.target.result;
				this.#procesoRespuesta(method,respuesta);
			};	
		};
		openRequest.onupgradeneeded = ()=> {
			const db = openRequest.result;
		};
	}
	
	addDataToTable(tabla,objData){
		const openRequest = indexedDB.open(this.dbName,this.vers);
		openRequest.onerror = ()=>{console.error("Error", openRequest.error);};
		openRequest.onsuccess = ()=> {
			const db = openRequest.result;
			const transaction = db.transaction([tabla], "readwrite");			
			const objStore = transaction.objectStore(tabla);			
			const request = objStore.add(objData); 
			request.onsuccess = ()=> {
				console.log("Success", request.error);
			};
			request.onerror = ()=> {console.log("Error", request.error);};
		};
		openRequest.onupgradeneeded = ()=> {const db = openRequest.result;};
	}
	
	updateDataInTable(tabla,objData,key,newval){
		const openRequest = indexedDB.open(this.dbName,this.vers);
		openRequest.onerror = ()=>{console.error("Error", openRequest.error);};
		openRequest.onsuccess = ()=> {
			const db = openRequest.result;
			const transaction = db.transaction([tabla],"readwrite"); 
			const objStore = transaction.objectStore(tabla); //objectStore
			const request = objStore.get(objData);
			request.onerror = (e) => {console.log('error on get');};
			request.onsuccess = (e) => {
				 // Get the old value that we want to update
				 const data = e.target.result;
				 // update the value(s) in the object that you want to change
				 data[`${key}`] = newval;
				 // Put this updated object back into the database.
				 const requestUpdate = objStore.put(data);
				 requestUpdate.onerror = (e) => {console.log('error en update');};
				 requestUpdate.onsuccess = (e) => {console.log('success!');};
			};
		};
		openRequest.onupgradeneeded = ()=> {
			const db = openRequest.result;
		};		
	}
	
	removeDataInTable(tabla,objData){
		const openRequest = indexedDB.open(this.dbName,this.vers);
		openRequest.onerror = ()=>{console.error("Error", openRequest.error);};
		openRequest.onsuccess = ()=> {
			const db = openRequest.result;
			const transaction = db.transaction([tabla], "readwrite"); 
			const objStore = transaction.objectStore(tabla); //objectStore
			const request = objStore.delete(objData);
			request.onsuccess = (e)=> {console.log('eliminado');};
		}
	}

}

export{RetrieveDBEgresos}