<?php
class RegistroEdificiosObject{
	private $conexion;
	private $edificios = "edificios";
	private $propietarios = "propietarios";
	private $estados = "estados";
	private $ciudades = "ciudades";
	private $junta = "junta_de_condominio";
	private $codigoEdificio;
	private $nombreEdificio;
	private $direccion;
	private $estado;
	private $ciudad;
	private $telefono;
	private $correo;
	private $numeroAcceso;
	private $infoError;
	private $registros;
	private $codigoPropietario;
	private $cuentaPropietario;
	private $unidad;
	private $unidadArr;
	private $inicCedsArr;
	private $propietariosArr;
	private $alicuotasArr;
	
	public function __construct($bd){
		$this->conexion = $bd;
	}
	
	public function setCodigoEdificio($coEd){
		$this->codigoEdificio = $coEd;
	}
	public function setNombreEdificio($noEd){
		$this->nombreEdificio = $noEd;
	}
	public function setDireccion($dire){
		$this->direccion = $dire;
	}
	public function setEstado($esta){
		$this->estado = $esta;
	}
	public function setCiudad($ciud){
		$this->ciudad = $ciud;
	}
	public function setTelefono($tele){
		$this->telefono = $tele;
	}
	public function setCorreo($corr){
		$this->correo = $corr;
	}
	public function setNumeroAcceso($nuAc){
		$this->numeroAcceso = $nuAc;
	}
	public function getRegistros(){
		return $this->registros;
	}
	public function setCodigoPropietario($codPro){
		$this->codigoPropietario = $codPro;
	}
	public function setCuentaPropietario($cuePro){
		$this->cuentaPropietario = $cuePro;
	}
	public function setUnidad($unid){
		$this->unidad = $unid;
	}
	public function setUnidadArr($unidArr){
		$this->unidadArr = $unidArr;
	}
	public function setInicCedsArr($inicCed){
		$this->inicCedsArr = $inicCed;
	}
	public function setPropietariosArr($propArr){
		$this->propietariosArr = $propArr;
	}
	public function setAlicuotasArr($alicArr){
		$this->alicuotasArr = $alicArr;
	}
	public function getInfoError(){
		return $this->infoError;
	}
	
	public function registrarEdificio(){
		$consultaUno = "INSERT INTO ".$this->edificios." SET cod_edificio = :coEd,".
		" nombre_edificio = :noEd, direccion = :dire, id_estado = :esta,".
		" id_ciudad = :ciud, telefono = :tele, correo = :corr, numero_acceso = :nuac";
		
		$this->codigoEdificio=htmlspecialchars(strip_tags($this->codigoEdificio));
		$this->nombreEdificio = htmlspecialchars(strip_tags($this->nombreEdificio));
		$this->direccion = htmlspecialchars(strip_tags($this->direccion));
		$this->estado = htmlspecialchars(strip_tags($this->estado));
		$this->ciudad = htmlspecialchars(strip_tags($this->ciudad));
		$this->telefono = htmlspecialchars(strip_tags($this->telefono));
		$this->correo = htmlspecialchars(strip_tags($this->correo));
		$this->numeroAcceso = htmlspecialchars(strip_tags($this->numeroAcceso));
		$this->cuentaPropietario = htmlspecialchars(strip_tags($this->cuentaPropietario));
		
		$paramUCoDos = "INSERT INTO ".$this->propietarios.
					" (`cod_propietario`, `cod_edificio`, `cuenta_propietario`,".
					" `unidad`, `alicuota`,`numero_acceso`) VALUES ";
		$paramDcoDos = '';
		for($i=1;$i<count($this->unidadArr);$i++){
			//$paramDcoDos .= "('".$codProp."','".$this->codigoEdificio."','".$propiet."','".$unid."','".$alic."','".$this->numeroAcceso."'),";
			$paramDcoDos .= "(:copro".$i.",:coEd".$i.",:propi".$i.",:unid".$i.",:alic".$i.",:nuac".$i."),";	
		}			
		$paramTcoDos = "(:codPT,:coEd,:cuPr,'ADMIN','1',:nuac)";
		$consultaDos = $paramUCoDos.$paramDcoDos.$paramTcoDos;
		
		$inicio = date("Y-m-d");
		$vencimiento = date('Y-m-d', strtotime("+12 months $inicio"));
		$consultaTres = "INSERT INTO ".$this->junta." SET cod_edificio = :coEd, inicio = '".$inicio.
						"',vencimiento = '".$vencimiento."',presidente = :copri,tesorero = :copri,".
						"vocal = :copri, suplente_uno = :copri,suplente_dos = :copri,".
						"suplente_tres = :copri, numero_acceso = :nuac";
		try{
			$this->conexion->beginTransaction();
			$declaracionPDO = $this->conexion->prepare($consultaUno);
			$declaracionPDO->bindParam(":coEd", $this->codigoEdificio);
			$declaracionPDO->bindParam(":noEd", $this->nombreEdificio);
			$declaracionPDO->bindParam(":dire", $this->direccion);
			$declaracionPDO->bindParam(":esta", $this->estado);
			$declaracionPDO->bindParam(":ciud", $this->ciudad);
			$declaracionPDO->bindParam(":tele", $this->telefono);
			$declaracionPDO->bindParam(":corr", $this->correo);
			$declaracionPDO->bindParam(":nuac", $this->numeroAcceso);
			if(!$declaracionPDO->execute()){
				$this->showError($declaracionPDO);
				return false;
			}
			$declaracionPDO->closeCursor();
			$declaracionPDO = $this->conexion->prepare($consultaDos);
			for($i=1;$i<count($this->unidadArr);$i++){
				$unid[$i] = htmlspecialchars(strip_tags($this->unidadArr[$i]));
				$codProp[$i] = $this->codigoEdificio."-".$unid[$i];
				$propiet[$i] = htmlspecialchars(strip_tags($this->inicCedsArr[$i])).htmlspecialchars(strip_tags($this->propietariosArr[$i]));
				$alic[$i] = htmlspecialchars(strip_tags($this->alicuotasArr[$i]));
				$declaracionPDO->bindParam(":copro".$i,$codProp[$i]);
				$declaracionPDO->bindParam(":coEd".$i,$this->codigoEdificio);
				$declaracionPDO->bindParam(":propi".$i,$propiet[$i]);
				$declaracionPDO->bindParam(":unid".$i,$unid[$i]);
				$declaracionPDO->bindParam(":alic".$i,$alic[$i]);
				$declaracionPDO->bindParam(":nuac".$i,$this->numeroAcceso);
			}
			$codPropietar = $this->codigoEdificio.'-ADMIN-1';
			$declaracionPDO->bindParam(":codPT",$codPropietar);
			$declaracionPDO->bindParam(":coEd", $this->codigoEdificio);
			$declaracionPDO->bindParam(":cuPr", $this->cuentaPropietario);
			$declaracionPDO->bindParam(":nuac", $this->numeroAcceso);
			if(!$declaracionPDO->execute()){
				$this->showError($declaracionPDO);
				return false;
			}
			$declaracionPDO->closeCursor();
			$codPropietar = 'ADMIN-1';
			$declaracionPDO = $this->conexion->prepare($consultaTres);
			$declaracionPDO->bindParam(":coEd", $this->codigoEdificio);
			$declaracionPDO->bindParam(":nuac",$this->numeroAcceso);
			$declaracionPDO->bindParam(":copri",$codPropietar);
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
	
	public function showError($declaracionPDO){
        $this->infoError =$declaracionPDO->errorInfo();
	}
	
	public function consultaEdificio(){
		$consulta = "SELECT nombre_edificio,direccion, ".
		$this->estados.".estado, ".$this->ciudades.".ciudad, ".
		"telefono, correo FROM ".$this->edificios." INNER JOIN ".
		$this->estados." ON ".$this->edificios.".id_estado = ".$this->estados.".id_estado ".
		"INNER JOIN ".$this->ciudades." ON ".$this->edificios.".id_ciudad = ".$this->ciudades.".id_ciudad ".
		"WHERE cod_edificio = :coEd LIMIT 0,1";
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->codigoEdificio=htmlspecialchars(strip_tags($this->codigoEdificio));
		$declaracionPDO->bindParam(":coEd", $this->codigoEdificio);
		if($declaracionPDO->execute()){ 
            $fila = $declaracionPDO->fetch(PDO::FETCH_ASSOC);
			$this->registros=$fila;	
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}  
	}
	
	public function modificarEdificio(){
		$consulta = "UPDATE " . $this->edificios . " SET telefono = :tele, correo = :corr WHERE codigoEdificio = :coEd";
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->codigoEdificio=htmlspecialchars(strip_tags($this->codigoEdificio));
		$this->telefono = htmlspecialchars(strip_tags($this->telefono));
		$this->correo = htmlspecialchars(strip_tags($this->correo));		
		$declaracionPDO->bindParam(":coEd", $this->codigoEdificio);
		$declaracionPDO->bindParam(":tele", $this->telefono);
		$declaracionPDO->bindParam(":corr", $this->correo);
		if($declaracionPDO->execute){
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}
	}
	
	public function registraPropietario(){
		$consulta = "INSERT INTO ".$this->propietarios." SET cod_propietario = :copr, cod_edificio = :ceEd, ".
		"cuenta_propietario = :cupr, unidad = :unid, alicuota = :alic, numero_acceso = :nuac";
		$this->codigoPropietario=htmlspecialchars(strip_tags($this->codigoPropietario));
		$this->codigoEdificio=htmlspecialchars(strip_tags($this->codigoEdificio));
		$this->cuentaPropietario = htmlspecialchars(strip_tags($this->cuentaPropietario));
		$this->unidad = htmlspecialchars(strip_tags($this->unidad));
		$this->alicuota = htmlspecialchars(strip_tags($this->alicuota));
		$this->numeroAcceso = htmlspecialchars(strip_tags($this->numeroAcceso));
		$declaracionPDO->bindParam(":copr", $this->codigoPropietario);
		$declaracionPDO->bindParam(":coEd", $this->codigoEdificio);
		$declaracionPDO->bindParam(":cuPr", $this->cuentaPropietario);
		$declaracionPDO->bindParam(":unid", $this->unidad);
		$declaracionPDO->bindParam(":alic", $this->alicuota);
		$declaracionPDO->bindParam(":nuac", $this->numeroAcceso);
		if($declaracionPDO->execute){
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}		
	}
	
	public function actualizaPropietario(){
		$consulta = "UPDATE ".$this->propietarios." SET cuenta_propietario = :cupr WHERE cod_propietario = :copr";
		$this->codigoPropietario=htmlspecialchars(strip_tags($this->codigoPropietario));
		$this->cuentaPropietario = htmlspecialchars(strip_tags($this->cuentaPropietario));
		$declaracionPDO->bindParam(":copr", $this->codigoPropietario);
		$declaracionPDO->bindParam(":cuPr", $this->cuentaPropietario);
		if($declaracionPDO->execute){
			return true;
		}else{
			$this->showError($declaracionPDO);
			return false;
		}	
	}
}

?>