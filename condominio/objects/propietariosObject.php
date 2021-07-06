<?php
class PropietariosObject{
private $conexion;
private $nombreTabla = "propietarios";
private $tablaUsuarios = "usuarios";
private $tablaBorrados = "propietarios_removidos";
private $junta = "junta_de_condominio";
private $ctaPropietario;
private $numRegistros;
private $codigoPropietario;
private $registros;
private $infoError;
private $cod_edificio;
private $numero_acceso;

// constructor
	public function __construct($bd){
		$this->conexion = $bd;
	}
 
	public function setCtaPropietario($cupro){
		$this->ctaPropietario=$cupro;
	}
	public function getCtaPropietario(){
		return $this->ctaPropietario;
	}
	public function setCodigoPropietario($copro){
		$this->codigoPropietario=$copro;
	}
	 
	public function getNumRegistros(){
		return $this->numRegistros;
	}
	public function getRegistros(){
		return $this->registros;
	}
	 public function getInfoError(){
		return $this->infoError;
	 }
	 
	public function setCod_Edificio($coed){
		$this->cod_edificio = $coed;
	}
	
	public function setNumero_acceso($nua){
		$this->numero_acceso=$nua;
	}
	 
	function consultaPropiedad(){	
        $strOne = "SELECT edificios.nombre_edificio," . $this->nombreTabla . ".cod_propietario," . $this->nombreTabla . ".cod_edificio,";
		$strTwo = $this->nombreTabla . ".unidad," . $this->nombreTabla . ".alicuota FROM edificios RIGHT JOIN ";
		$strThree = $this->nombreTabla . " ON edificios.cod_edificio = " . $this->nombreTabla . ".cod_edificio WHERE ";
		$strFour = $this->nombreTabla . ".cuenta_propietario = ?";
		$consulta = $strOne.$strTwo.$strThree.$strFour;
        $declaracionPDO = $this->conexion->prepare($consulta);
        $this->ctaPropietario=htmlspecialchars(strip_tags($this->ctaPropietario));	 
        $declaracionPDO->bindParam(1, $this->ctaPropietario);
        if($declaracionPDO->execute()){ 	
			$numFilas = $declaracionPDO->rowCount();
			$this->numRegistros=$numFilas;
			$fila = $declaracionPDO->fetchAll(PDO::FETCH_ASSOC);
			$this->registros=$fila;	
			return true; 
		}else{
			$this->showError($declaracionPDO);
			return false;
		}  			
	}
	
	public function consultaAdministrador(){
		$consulta = "SELECT cuenta_propietario FROM " . $this->nombreTabla . " WHERE cod_propietario = ? LIMIT 0,1";
		$declaracionPDO = $this->conexion->prepare($consulta);
        $this->codigoPropietario=htmlspecialchars(strip_tags($this->codigoPropietario));
		$declaracionPDO->bindParam(1, $this->codigoPropietario);	
        $declaracionPDO->execute(); 
		$numFilas = $declaracionPDO->rowCount();
		if($numFilas>0){  
			$fila = $declaracionPDO->fetch(PDO::FETCH_ASSOC);
			$this->ctaPropietario = $fila;
			return true; 
		}else{
			return false;
	    }  
	}
	
	public function generaString($strenght){
		$input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
		   $input_lenght=strlen($input);
		   $random_string="";
		   for($i=0;$i<$strenght;$i++){
			   $random_character=$input[mt_rand(0,$input_lenght-1)];
			   $random_string.=$random_character;
		   }
	 return $random_string;
	}
	
	public function showError($declaracionPDO){
        $this->infoError =$declaracionPDO->errorInfo();
    }
	
	public function mostrarAdministradores(){
		$consulta = "SELECT id_prop,cuenta_propietario,cod_propietario, ".$this->tablaUsuarios.".Nombre, ".
					$this->tablaUsuarios.".Apellido, ".$this->tablaUsuarios.".Correo ".
					"FROM ".$this->nombreTabla." INNER JOIN ".$this->tablaUsuarios. " ON ".$this->nombreTabla.".cuenta_propietario ".
					"= ".$this->tablaUsuarios.".Cedula WHERE unidad = 'ADMIN' AND cod_edificio = ?";
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->cod_edificio=htmlspecialchars(strip_tags($this->cod_edificio));
		$declaracionPDO->bindParam(1, $this->cod_edificio);
		if($declaracionPDO->execute()){ 
			$numFilas = $declaracionPDO->rowCount();
            $fila = $declaracionPDO->fetchAll(PDO::FETCH_ASSOC);
			$this-> registros = $fila;
			$this-> numRegistros = $numFilas;			
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
	}
	
	public function cambiarPropietario(){
		$consultaUno = "INSERT INTO " . $this->tablaBorrados .
		" (cod_propietario,cod_edificio,cuenta_propietario,unidad,alicuota,acceso_anterior,creada_anterior,numero_acceso)
		(SELECT cod_propietario,cod_edificio,cuenta_propietario,unidad,alicuota,numero_acceso,creada,
		:nuac FROM ".$this->nombreTabla." WHERE cod_propietario = :codpr)";
		
		$consultaDos = "UPDATE ".$this->nombreTabla." SET cuenta_propietario = :cupro WHERE cod_propietario = :codpr";
		try{
			$this->conexion->beginTransaction();
			$declaracionPDO = $this->conexion->prepare($consultaUno);
			$this->numero_acceso = htmlspecialchars(strip_tags($this->numero_acceso));
			$this->codigoPropietario = htmlspecialchars(strip_tags($this->codigoPropietario));
			$this->ctaPropietario = htmlspecialchars(strip_tags($this->ctaPropietario));
			$declaracionPDO->bindParam(':nuac',$this->numero_acceso);
			$declaracionPDO->bindParam(':codpr',$this->codigoPropietario);
			if(!$declaracionPDO->execute()){
				$this->showError($declaracionPDO);
				return false;
			}
			$declaracionPDO->closeCursor();
			$declaracionPDO = $this->conexion->prepare($consultaDos);
			$declaracionPDO->bindParam(':cupro',$this->ctaPropietario);
			$declaracionPDO->bindParam(':codpr',$this->codigoPropietario);
			if(!$declaracionPDO->execute()){
				$this->showError($declaracionPDO);
				return false;
			}		
			$this->conexion->commit();
		    return true;
		}catch(Exception $e){
		  $this->infoError = $e;
		  $this->conexion->rollBack();
          return false;
		}
		
	}
	
	public function insertarAdministrador(){
		$unidad = "ADMIN";
		$alicuota = "1";
		$consulta = "INSERT INTO ".$this->nombreTabla." SET cod_propietario = :copr, cod_edificio = :coEd, ".
					"cuenta_propietario = :cupr, unidad = :uni, alicuota = :alic, numero_acceso = :nuac";
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->codigoPropietario=htmlspecialchars(strip_tags($this->codigoPropietario));
		$this->cod_edificio=htmlspecialchars(strip_tags($this->cod_edificio));
		$this->ctaPropietario = htmlspecialchars(strip_tags($this->ctaPropietario));
		$this->numero_acceso = htmlspecialchars(strip_tags($this->numero_acceso));				
		$declaracionPDO->bindParam(":copr", $this->codigoPropietario);
		$declaracionPDO->bindParam(":coEd", $this->cod_edificio);
		$declaracionPDO->bindParam(":cupr", $this->ctaPropietario);
		$declaracionPDO->bindParam(":nuac", $this->numero_acceso);
		$declaracionPDO->bindParam(":uni", $unidad);
		$declaracionPDO->bindParam(":alic", $alicuota);
		if($declaracionPDO->execute()){
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
	}
	
	public function eliminarAdministrador(){
		$consultaUno = "INSERT INTO " . $this->tablaBorrados .
		" (cod_propietario,cod_edificio,cuenta_propietario,unidad,alicuota,acceso_anterior,creada_anterior,numero_acceso)
		(SELECT cod_propietario,cod_edificio,cuenta_propietario,unidad,alicuota,numero_acceso,creada,
		:nuac FROM ".$this->nombreTabla." WHERE cod_propietario = :codpr)";
		
		$consultaDos = "DELETE FROM ".$this->nombreTabla." WHERE cod_propietario = :codpr";
		try{
			$this->conexion->beginTransaction();
			$declaracionPDO = $this->conexion->prepare($consultaUno);
			$this->numero_acceso = htmlspecialchars(strip_tags($this->numero_acceso));
			$this->codigoPropietario = htmlspecialchars(strip_tags($this->codigoPropietario));
			$this->ctaPropietario = htmlspecialchars(strip_tags($this->ctaPropietario));
			$declaracionPDO->bindParam(':nuac',$this->numero_acceso);
			$declaracionPDO->bindParam(':codpr',$this->codigoPropietario);
			if(!$declaracionPDO->execute()){
				$this->showError($declaracionPDO);
				return false;
			}
			$declaracionPDO->closeCursor();
			$declaracionPDO = $this->conexion->prepare($consultaDos);
			$declaracionPDO->bindParam(':codpr',$this->codigoPropietario);
			if(!$declaracionPDO->execute()){
				$this->showError($declaracionPDO);
				return false;
			}		
			$this->conexion->commit();
		    return true;
		}catch(Exception $e){
		  $this->infoError = $e;
		  $this->conexion->rollBack();
          return false;
		}
		
	}
	
	public function mostrarJuntaCondominio(){				
		$consulta = "SELECT id,inicio,vencimiento,presidente,tesorero,vocal,suplente_uno,".
					"suplente_dos,suplente_tres FROM ".$this->junta." WHERE cod_edificio = ? LIMIT 1"; 
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->cod_edificio=htmlspecialchars(strip_tags($this->cod_edificio));
		$declaracionPDO->bindParam(1, $this->cod_edificio);
		if($declaracionPDO->execute()){ 
			$numFilas = $declaracionPDO->rowCount();
            $fila = $declaracionPDO->fetchAll(PDO::FETCH_ASSOC);
			$this-> registros = $fila;
			$this-> numRegistros = $numFilas;			
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
	}
	
}