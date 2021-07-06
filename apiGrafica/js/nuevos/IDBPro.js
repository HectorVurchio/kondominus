class IndexedDBProcess{
	/* url = "/indexedDBProcess"; dbName = 'admin_tools'; vers = 1, method = GET ,object = ''*/
	constructor(url,dbName,vers,meth,object){
		this.url = url;
		this.dbName = dbName;
		this.vers = vers;
		this.meth = meth;
		this.object = object;
	}
	#fetchRequest(){
		let req;
		if(this.meth == 'GET'){
			 req = {method: 'GET', 
					mode: 'no-cors',
					credentials: 'same-origin',
					headers: {'Content-Type': 'application/json'}};
		}else if(this.meth == 'POST'){
			 req = {method: 'POST', 
					mode: 'no-cors',
					credentials:'same-origin',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(this.object)};
		}
		return req;
	}
	
	async getDataBase(){
		let neArr = new Array();
		await fetch(this.url,this.#fetchRequest())
		.then(response => {
			return response.json();
		})
		.then(data =>{
			let arrKeys = Object.keys(data);
			for(let i = 0;i<arrKeys.length;i++){
				neArr.push([arrKeys[i],data[arrKeys[i]]]);
			}
		}).then(()=>{
			this.#abrirOcrearDB(this.dbName,this.vers,neArr);		
		}).catch((error) => {
			console.log(error);
		});	
		return;
	}	
	
	#abrirOcrearDB(nombre,version,datos){
		const nombreBD = nombre;
		let baseDatos = indexedDB.open(nombre,version);
		baseDatos.onerror = (e)=>{console.log(e.target.error);}
		baseDatos.onsuccess = (e)=>{
			let db = e.target.result;
			datos.forEach((item,index,array)=>{
				for(let i=0;i<item[1].length;i++){
					this.#add(db,item[0],item[1][i]);
				}
			});
		}
		baseDatos.onupgradeneeded =(e)=>{
			let db = e.target.result;
			datos.forEach((item,index,array)=>{
				let keyPath = Object.keys(Object.values(item[1])[0])[0];
				let ind = Object.keys(Object.values(item[1])[0])[1];
				this.#crearTablaDB(db,item[0],keyPath,ind);
			});
		}
	return;
	}
	
	
	#add(db,tabla,datos){
		let request = db.transaction([tabla],"readwrite")
		.objectStore(tabla)
		.add(datos);
	}
	#crearTablaDB(db,nombre,kp,index){
		const objName = nombre;  //nombre tabla
		let objectStore = db.createObjectStore(objName,{keyPath:kp});
	    objectStore.createIndex(index,index,{unique:false});
	}
	
	retrieveAllTableDataArr(tabla){
		let openRequest = indexedDB.open(this.dbName,this.vers);
		openRequest.onerror = ()=>{console.error("Error", openRequest.error);};
		openRequest.onsuccess = ()=> {
			let db = openRequest.result;
			let transaction = db.transaction([tabla], "readwrite"); 
			let objStore = transaction.objectStore(tabla); 
			let request = objStore.getAll(); 
			request.onsuccess = ()=> {
				/*request.result.forEach((item,index,array)=>{
					respuesta[index] = '';
					for(let i=0;i<claves.length;i++){
						respuesta[index] += item[claves[i]]+' ';
					}
				});
			console.log(respuesta[0]);*/
			};
			
			request.onerror = ()=> {console.log("Error", request.error);};
		};
		openRequest.onupgradeneeded = ()=> {let db = openRequest.result;};
	}
	
	retrieveSomeDBTableData(tabla){
		let respuesta = new Array();
		let baseDatos = indexedDB.open(this.dbName,this.vers);
		baseDatos.onerror = (e)=>{console.log(e.target.error);}
		baseDatos.onsuccess = (e)=>{
			let db = e.target.result;
			let transaction = db.transaction([tabla], "readonly");
			let objectStore = transaction.objectStore(tabla);
			let request = objectStore.openCursor();
			request.onsuccess =(event)=>{
				let cursor = event.target.result;
				if(cursor) {
					respuesta.push(cursor.value);
					//hacer algo con:
					//console.log(cursor);
				cursor.continue();
				} else {
				console.log('nada');
				}
			};
		}
		return respuesta;
	}
	
	deleteDB(){
		window.indexedDB.deleteDatabase(this.dbName);
	}
}

export{IndexedDBProcess}
