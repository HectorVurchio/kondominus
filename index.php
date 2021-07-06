<?php
include_once 'Request.php';
include_once 'Router.php';
$request = new Request();
$router = new Router($request);
$redir = isset($_COOKIE['redir']) ? $_COOKIE['redir'] : "";

if($redir != ""){
	$redirDos = explode(',',$redir);
	$string = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ");
	$egresos = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/egresos';
	$proveedores = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/proveedores';
	$personas = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/personas';
	$imprime = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/imprime';
	$proyecta = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/proyecciones';
	$cobro = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/cobro';
	$ingresos = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/ingresos'; 
	$condo = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/condominio';
	$ctasPCob = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/cuentas';
	$recibo = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/recibo';
	$resumen = '/'.rtrim($redirDos[1]," ").'/'.rtrim($redirDos[0]," ").'/resumen';
}else{
	$redirDos = $request->generaString(6);
	$string = '/admin/'.$redirDos;
	$egresos = '/egresos/'.$redirDos;
	$proveedores = '/proveedores'.$redirDos;
	$personas = '/personas'.$redirDos;
	$imprime = '/imprime'.$redirDos;
	$proyecta = '/proyecta'.$redirDos;
	$cobro = '/cobro'.$redirDos;
	$ingresos = '/ingresos'.$redirDos;
	$condo = '/condominio'.$redirDos;
	$ctasPCob = '/cuentas'.$redirDos;
	$recibo = '/recibo'.$redirDos;
	$resumen = '/resumen'.$redirDos;
}

$router->get('/', function() {
  readfile('apiGrafica/land.html',true);
});

$router->get('/ingreso', function() {
  readfile('apiGrafica/ingreso.html',true);
});

$router->get('/registro', function() {
  readfile('apiGrafica/registroUsuario.html',true);
});

$router->get('/codigoacceso', function() {
  readfile('apiGrafica/codigoAcceso.html',true);
});

$router->get('/registro/inmueble', function() {
  readfile('apiGrafica/registroEdificio.html',true);
});

$router->get('/micuenta', function() {
  readfile('apiGrafica/todasLasCuentas.html',true);
});

$router->get('/indexedDBProcess',function($request){
	$request->buscaIndexedDB();
});


$router->get($proveedores, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/formatoDos.html',true);
	}elseif($normalPermission == true){
		header("HTTP/1.0 404 Not Found");
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}	
});

$router->get($personas, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/formatoDos.html',true);
	}elseif($normalPermission == true){
		header("HTTP/1.0 404 Not Found");
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}	
});

$router->get($imprime, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/recibo.html',true);
	}elseif($normalPermission == true){
		readfile('prueba/probando.php',true);
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}

});

$router->get($proyecta, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/formatoTres.html',true);
	}elseif($normalPermission == true){
		readfile('prueba/probando.php',true);
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}

});

$router->get($cobro, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/avisoCobroInicio.html',true);
	}elseif($normalPermission == true){
		readfile('prueba/probando.php',true);
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}

});

$router->get($ingresos, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/ingresosInicio.html',true);
	}elseif($normalPermission == true){
		readfile('prueba/probando.php',true);
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}

});

$router->get($string, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/administrador.html',true);
	}elseif($normalPermission == true){
		readfile('prueba/probando.php',true);
	}elseif($nuevo == true){
		readfile('apiGrafica/redir.html',true);
		//header("Location: /registro/inmueble"); //Ojo puede no funcionar en el servidor
		//https://www.ionos.es/digitalguide/dominios/gestion-de-dominios/metodos-para-redireccionar-una-pagina-web/
		// google: php redireccionar a otra pagina
			
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}

});

$router->get($condo, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/datosCondominioInicio.html',true);
	}elseif($normalPermission == true){
		readfile('prueba/probando.php',true);
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}
});

$router->get($ctasPCob, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/ctasPorCobrar.html',true);
	}elseif($normalPermission == true){
		readfile('prueba/probando.php',true);
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}
});

$router->get($egresos, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/egresosInicio.html',true);
	}elseif($normalPermission == true){
		readfile('prueba/probando.php',true);
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}	
  
});

$router->get($recibo, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/avisoCobro-modelo.html',true);
	}elseif($normalPermission == true){
		readfile('prueba/probando.php',true);
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}
});

$router->get($resumen, function() {
	include_once 'condominio/config/core.php';
	include_once 'condominio/objects/UserInfo.php';
	include_once 'condominio/config/database.php';
	include_once 'condominio/objects/controlAccesosObject.php';
	include_once 'condominio/objects/propietariosObject.php';
	include_once 'condominio/controler/verifAdminUno.php';
	if($adminPermission == true){
		readfile('apiGrafica/avisoCobro-resumen.html',true);
	}elseif($normalPermission == true){
		readfile('prueba/probando.php',true);
	}else{
		readfile('apiGrafica/sesionVencida.html',true);
	}
});


$router->put('/accessCode', function($request) {
   $request->setAccessCode();
});

$router->post('/agregarAdministrador',function($request){
	$request->agregarAdministrador();
});

$router->post('/agregarJuntaDeCondominio',function($request){
	$request->agregarJuntaDeCondominio();
});

$router-> post('/cedulaverification',function($request){
	$request->verificarCedula();
});

$router-> post('/consulta/edificio',function($request){
	$request->verificarEdificio();
});

$router->post('/consulta/egresos', function($request) {
   $request->consultarEgresos();
});

$router->post('/consulta/cobro', function($request) {
   $request->consultarCobro();
});

$router->post('/edificioInfo', function($request) {
   $request->getInfoEdificio();
});

$router->post('/login', function($request) {
   $request->setLogin();  
});

$router->post('/logOut', function($request) {
   $request->vencerAccesoDiario();
});

$router->post('/newuser', function($request) {
   $request->setNewUser();  
});

$router->post('/registramulta', function($request) {
   $request->registraMultaEinteres();
});

$router->post('/registro/cobro', function($request) {
   $request->registrarCobros();
});

$router->post('/registro/edificio', function($request) {
   $request->registrarEdificio();
});

$router->post('/registro/egresos', function($request) {
   $request->registrarEgresos();
});

$router->post('/registroEmpleados', function($request) {
   $request->registrarEmpleados();
});

$router->post('/registro/ingresos', function($request) {
   $request->registrarIngresos();
});

$router->post('/registroProveedores', function($request) {
   $request->registrarProveedores();
});

$router-> post('/rifverification',function($request){
	$request->verificarRif();
});

$router->post('/verifica', function($request) {
   $request->verificarToken();
});


$router->post('/recupera', function($request) {
   $request->rememberPass();
});

$router->delete('/eliminarAdministrador', function($request) {
   $request->eliminarAdministrador();
});

?>