<?php
class ControlAccesosObject{
	private $nombreTabla = "accesos_diarios";
	private $conexion;	
	private $infoError;
	private $totalCuentas;
	
	private $cedula;
    private $cod_propietario;
    private $numero_acceso;
    private $dir_IP;
    private $sist_oper;
    private $navegador;
	private $dispositivo;
    private $fecha_hora;
	private $estatus;
	private $registro;
	
	
	
	public function __construct($bd){
       $this->conexion = $bd;
    }
	
	public function setCedula($ced){
		$this->cedula = $ced;
	}
	public function setCodPropietario($cod_prop){
		$this->cod_propietario = $cod_prop;
	}
	public function setNumeroAcceso($numero_ac){
		$this->numero_acceso = $numero_ac;
	}
	public function setIP($d_IP){
		$this->dir_IP = $d_IP;
	}
	public function setSistOper($sist_op){
		$this->sist_oper = $sist_op;
	}
	public function setNavegador($nav){
		$this->navegador = $nav;
	}
	public function setDispositivo($disp){
		$this->dispositivo = $disp;
	}
	public function setFechaHora($fecHor){
		$this->fecha_hora = $fecHor;
	}
	public function setEstatus($est){
		$this->estatus = $est;
	}
	
	public function getInfoError(){
		return $this->infoError;
	}
	public function getRegistro(){
		return $this->registro;
	}
	
	
    public function setControlDeAcceso(){
		$consulta = "INSERT INTO ". $this->nombreTabla." SET cedula = :ced, cod_propietario = :cop, numero_acceso = :nua, dir_IP = :dip, sist_oper = :sio, navegador = :nav, dispositivo = :dis,
		fecha_hora = :fec, estatus = :est";
		$declaracionPDO = $this->conexion->prepare($consulta);	
		
		$this->cedula=htmlspecialchars(strip_tags($this->cedula));
		$this->cod_propietario=htmlspecialchars(strip_tags($this->cod_propietario));
		$this->numero_acceso=htmlspecialchars(strip_tags($this->numero_acceso));
		$this->dir_IP=htmlspecialchars(strip_tags($this->dir_IP));
		$this->sist_oper=htmlspecialchars(strip_tags($this->sist_oper));
		$this->navegador=htmlspecialchars(strip_tags($this->navegador));
		$this->dispositivo=htmlspecialchars(strip_tags($this->dispositivo));
		$this->fecha_hora=htmlspecialchars(strip_tags($this->fecha_hora));
		$this->estatus=htmlspecialchars(strip_tags($this->estatus));
	
        $declaracionPDO->bindParam(':ced', $this->cedula);
		$declaracionPDO->bindParam(':cop', $this->cod_propietario);
        $declaracionPDO->bindParam(':nua', $this->numero_acceso);
		$declaracionPDO->bindParam(':dip', $this->dir_IP);
        $declaracionPDO->bindParam(':sio', $this->sist_oper);
		$declaracionPDO->bindParam(':nav', $this->navegador);
		$declaracionPDO->bindParam(':dis', $this->dispositivo);			 
		$declaracionPDO->bindParam(':fec', $this->fecha_hora);	
		$declaracionPDO->bindParam(':est', $this->estatus);	
        		
        if($declaracionPDO->execute()){  	
		 return true; 
		}else{
          $this->showError($declaracionPDO);
		  return false;
		}  				
	}
	public function ControlDeAcceso(){
		$consulta = "SELECT id,cedula,cod_propietario,dir_IP,sist_oper,navegador,dispositivo,fecha_hora,estatus FROM " 
		. $this->nombreTabla . " WHERE numero_acceso = ? LIMIT 0,1";
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->numero_acceso=htmlspecialchars(strip_tags($this->numero_acceso));
		$declaracionPDO->bindParam(1, $this->numero_acceso);
		$declaracionPDO->execute(); 
		$numFilas = $declaracionPDO->rowCount();
		if($numFilas>0){
			$fila = $declaracionPDO->fetch(PDO::FETCH_ASSOC);
			$this->registro = $fila;
			return true;
		}else{

			return false;
		}
	}
	
	public function cambiarEstatusCero(){
		$consulta = "UPDATE ". $this->nombreTabla . " SET estatus = '0' WHERE  numero_acceso = ?";
		$declaracionPDO = $this->conexion->prepare($consulta);
		$this->numero_acceso=htmlspecialchars(strip_tags($this->numero_acceso));
		$declaracionPDO->bindParam(1, $this->numero_acceso);
		if($declaracionPDO->execute()){
			return true;
		}else{
			return false;
		}
	}

	private function showError($declaracionPDO){
          $this->infoError =$declaracionPDO->errorInfo();
	}

}


?>