<?php
class GeneralObject{
	private $conexion;
	private $registros;
	private $infoError;
	private $numRegistros;
	
	public function __construct($bd){
		$this->conexion = $bd;
	}
	
	private function showError($declaracionPDO){
        $this->infoError =$declaracionPDO->errorInfo();
    }
	
	public function getRegistros(){
		return $this->registros;
	}
	public function getNumRegistros(){
		return $this->numRegistros;
	}
	public function getInfoError(){
		return $this->infoError;
	}
	
	public function selectDataOne($consulta,$arrParam){
		$declaracionPDO = $this->conexion->prepare($consulta);
		//$arrParam=[':coe'=>$codigoEdificio,':nua'=>$numeroAcceso];
		foreach($arrParam as $key => $value){
			$declaracionPDO->bindValue($key,htmlspecialchars(strip_tags($value)));
		}
		if($declaracionPDO->execute()){  
			$numFilas = $declaracionPDO->rowCount();
            $fila = $declaracionPDO->fetchAll(PDO::FETCH_ASSOC);
			$this->registros = $fila;
			$this->numRegistros = $numFilas;	
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
	}
	
	public function selectDataTwo($consulta){
		$declaracionPDO = $this->conexion->prepare($consulta);
		/*no hay bind value o param*/
		if($declaracionPDO->execute()){  
			$numFilas = $declaracionPDO->rowCount();
            $fila = $declaracionPDO->fetchAll(PDO::FETCH_ASSOC);
			$this->registros = $fila;
			$this->numRegistros = $numFilas;	
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
	}
	
	public function selectDataThree($consulta,$arrParam){
		$declaracionPDO = $this->conexion->prepare($consulta);
		foreach($arrParam as $key => $value){
			$declaracionPDO->bindValue($key,htmlspecialchars(strip_tags($value)));
		}
		if($declaracionPDO->execute()){  
			$numFilas = $declaracionPDO->rowCount();
            $fila = $declaracionPDO->fetch(PDO::FETCH_ASSOC);
			$this->registros = $fila;
			$this->numRegistros = $numFilas;	
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
	}
	
	public function insertDataOne($consulta,$arrParam){
		$declaracionPDO = $this->conexion->prepare($consulta);
		//$arrParam=[':coe'=>$codigoEdificio,':nua'=>$numeroAcceso];
		foreach($arrParam as $key => $value){
			$declaracionPDO->bindValue($key,htmlspecialchars(strip_tags($value)));
		}
		if($declaracionPDO->execute()){  	
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
	}
	
	public function dataTransactionInsert($arrQue){
	   try{	
			$this->conexion->beginTransaction();
			for($i = 0;$i<count($arrQue);$i++){
				$declaracionPDO = $this->conexion->prepare($arrQue[$i][0]);
				foreach($arrQue[$i][1] as $key => $value){
					$declaracionPDO->bindValue($key,htmlspecialchars(strip_tags($value)));
				}
				if(!$declaracionPDO->execute()){
					$this->showError($declaracionPDO);
					return false;
				}
				$declaracionPDO->closeCursor();
			}
			$this->conexion->commit();
		    return true;
	   }catch(Exception $e){
		  $this->infoError = $e;
		  $this->conexion->rollBack();
          return false;		   
	   } 
	}
}
?>
