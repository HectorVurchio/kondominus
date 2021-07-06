<?php

class Router{
  private $request;
  private $supportedHttpMethods = array("GET","POST","PUT","DELETE");

  function __construct($request){
   $this->request = $request;
  }

  function __call($name, $args){
    list($route, $method) = $args;
    if(!in_array(strtoupper($name), $this->supportedHttpMethods)){
      $this->invalidMethodHandler();
    }
    $this->{strtolower($name)}[$this->formatRoute($route)] = $method;
  }

  private function formatRoute($route){
    $result = rtrim($route, '/');
    if ($result === '')
    {
      return '/';
    }
    return $result;
  }

  private function invalidMethodHandler(){
    header("{$this->request->protocolo} 405 Method Not Allowed");
  }

  private function defaultRequestHandler(){
    header("{$this->request->protocolo} 404 Not Found");
  }

  function resolve(){
      $methodDictionary = $this->{strtolower($this->request->method)};
      $formatedRoute = $this->formatRoute($this->request->uri);
	  if(isset($methodDictionary[$formatedRoute])){
		  $method = $methodDictionary[$formatedRoute];
		  //echo call_user_func_array($method, array($this->request));
		  call_user_func_array($method, array($this->request));
	  }else{
		  $this->defaultRequestHandler();
	  }
    }
    function __destruct(){$this->resolve();} 
}

?>
