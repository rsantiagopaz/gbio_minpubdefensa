<?php
session_start();

class class_Base
{
	protected $mysqli;
	protected $rowParamet;
	protected $arraySucursal;
	
	function __construct() {
		require('Conexion.php');
		
		date_default_timezone_set("America/Argentina/Buenos_Aires");
		
		$aux = new mysqli_driver;
		$aux->report_mode = MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT;
		//$aux->report_mode = MYSQLI_REPORT_ERROR;
		
		$this->mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
		$this->mysqli->query("SET NAMES 'utf8'");
	}
	
	
  public function sql_query($query, &$lnk = null) {
  	$resultado = null;
  	$errno = 0;
  	if (is_null($lnk)) {
  		$resultado = $this->mysqli->query($query);
  		$errno = $this->mysqli->errno;
  		if ($errno) throw new Exception($this->mysqli->error, $errno);
  	} else {
  		$resultado = $lnk->query($query);
  		$errno = $lnk->errno;
  		if ($errno) throw new Exception($lnk->error, $errno);
  	}
  	return $resultado;
  }
  
  
  public function toJson($paramet, &$opciones = null) {
	if (is_string($paramet)) {
		$cadena = strtoupper(substr(trim($paramet), 0, 6));
		if ($cadena=="INSERT" || $cadena=="SELECT") {
			$paramet = $this->mysqli->query($paramet);
			if ($this->mysqli->errno > 0) {
				return $this->mysqli->errno . " " . $this->mysqli->error . "\n";
			} else if ($cadena=="INSERT"){ 
				//$nodo=$xml->addChild("insert_id", $this->mysqli->insert_id);
			} else {
				return $this->toJson($paramet, $opciones);
			}
		}
	} else if (is_a($paramet, "MySQLi_Result")) {
		$rows = array();
		if (is_null($opciones)) {
			while ($row = $paramet->fetch_object()) {
				$rows[] = $row;
			}
		} else {
			while ($row = $paramet->fetch_object()) {
				foreach($opciones as $key => $value) {
					if ($value=="int") {
						$row->$key = (int) $row->$key;
					} else if ($value=="float") {
						$row->$key = (float) $row->$key;
					} else if ($value=="bool") {
						$row->$key = (bool) $row->$key;
					} else {
						$value($row, $key);
					}
				}

				$rows[] = $row;
			}
		}
		return $rows;
	}
  }
  

  public function prepararCampos(&$model, $tabla = null) {
  	static $campos;
  	
  	if (is_null($campos)) $campos = array();
  		
	$set = array();
	$chequear = false;
	
	if (!is_null($tabla)) {
		$chequear = true;
		if (is_null($campos[$tabla])) {
			$campos[$tabla] = array();
			$rs = $this->mysqli->query("SHOW COLUMNS FROM " . $tabla);
			while ($row = $rs->fetch_assoc()) {
				$campos[$tabla][$row['Field']] = $row;
			}
		}
	}
	foreach($model as $key => $value) {
		if ($chequear) {
			if (!is_null($campos[$tabla][$key])) {
				//$set[] = $key . "='" . $value . "'";
				$set[] = $key . "=" . ((is_null($value)) ? "NULL" : "'" . $value . "'");
			}			
		} else {
			//$set[] = $key . "='" . $value . "'";
			$set[] = $key . "=" . ((is_null($value)) ? "NULL" : "'" . $value . "'");
		}
	}
	return implode(", ", $set);
  }
  
  
  public function auditoria($sqltext, $descrip = null, $tags = null, $id_registro = null, $json = null) {
  	
  	if (is_null($json)) $json = new stdClass;
  	$json->usuario = $_SESSION['usuario'];

  	
	if (! empty($_SERVER['HTTP_CLIENT_IP'])) 
		$ip = $_SERVER['HTTP_CLIENT_IP'];
	else if (! empty($_SERVER['HTTP_X_FORWARDED_FOR']))
		$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
	else 
		$ip = $_SERVER['REMOTE_ADDR'];


	$sql = "INSERT _auditoria SET usuario='" . $_SESSION['usuario']->usuario . "', tags='" . $tags . "', id_registro=" . ((is_null($id_registro)) ? "NULL" : $id_registro) . ", mysql_query='" . $this->mysqli->real_escape_string($sqltext) . "', descrip='" . $descrip . "', fecha_hora=NOW(), ip='" . $ip . "', json=" . ((is_null($json)) ? "NULL" : "'" . json_encode($json) . "'");
	$this->mysqli->query($sql);
  }
}

?>