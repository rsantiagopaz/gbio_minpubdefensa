<?php

require("Base.php");

class class_Relojes extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
 
  
  public function method_escribir_empleados($params, $error) {
  	$p = $params[0];
  	
  	set_time_limit(0);
  	
  	$resultado = array();
  	
	$reloj = $this->toJson("SELECT * FROM reloj");
  	foreach ($reloj as $rowReloj) {
		$path = "";
		$output = null;
		$fp = fopen("userinfobatch.dat", "w");
		
		$sql = "SELECT empleado.* FROM empleado INNER JOIN empleado_reloj USING(id_empleado) WHERE id_reloj=" . $rowReloj->id_reloj;
		$rsEmpleado = $this->mysqli->query($sql);
		while ($rowEmpleado = $rsEmpleado->fetch_object()) {
			fwrite($fp, '<row');
			fwrite($fp, ' enroll_number="' . $rowEmpleado->enroll_number . '"');
			fwrite($fp, ' name="' . $rowEmpleado->name . '"');
			fwrite($fp, ' password="' . $rowEmpleado->password . '"');
			fwrite($fp, ' privilege="' . $rowEmpleado->privilege . '"');
			fwrite($fp, ' enabled="' . (($rowEmpleado->enabled=="1") ? "True" : "False") . '"');
			
			fwrite($fp, '>');
			
			$sql = "SELECT * FROM huella WHERE id_empleado=" . $rowEmpleado->id_empleado;
			$rsHuella = $this->mysqli->query($sql);
			while ($rowHuella = $rsHuella->fetch_object()) {
				fwrite($fp, '<row');
				fwrite($fp, ' finger_index="' . $rowHuella->finger_index . '"');
				fwrite($fp, ' flag="' . $rowHuella->flag . '"');
				fwrite($fp, ' tmp_length="' . $rowHuella->tmp_length . '"');
				fwrite($fp, ' tmp_data="' . $rowHuella->tmp_data . '"');
				
				fwrite($fp, ' />');
			}
			
			fwrite($fp, '</row>' . "\r\n");
			
			$resultado[] = "emple";
		}
		
		fclose($fp);
		
		exec('"' . $path . 'UserInfoBatch.exe' . '"' . ' ' . $rowReloj->host . ' ' . 'userinfobatch.dat', $output);
  	}
  	
  	return $resultado;
  }
  
  
  public function method_recuperar_empleados($params, $error) {
  	$p = $params[0];
  	
  	set_time_limit(0);

	//$reloj = $this->toJson("SELECT * FROM reloj WHERE id_reloj LIKE '" . $p-id_reloj . "'");
	$reloj = $this->toJson("SELECT * FROM reloj");
  	foreach ($reloj as $rowReloj) {
		$path = "";
		$output = null;
		$fp = fopen("userinfo.dat", "w");
		fclose($fp);
		exec('"' . $path . 'UserInfo.exe' . '"' . ' ' . $rowReloj->host, $output);
		$fp = fopen("userinfo.dat", "r");
		
	    while ($linea = stream_get_line($fp, 50000, "\r\n")) {
			$xml = new SimpleXMLElement($linea);
			
			$sql = "SELECT id_empleado FROM empleado WHERE enroll_number=" . $xml['enroll_number'];
			$rsEmpleado = $this->mysqli->query($sql);
			if ($rsEmpleado->num_rows == 0) {
				$sql = "INSERT empleado SET";
				$sql.= " enroll_number=" . $xml['enroll_number'];
				$sql.= ", name='" . $xml['name'] . "'";
				$sql.= ", password='" . $xml['password'] . "'";
				$sql.= ", privilege=" . $xml['privilege'];
				$sql.= ", enabled=" . (($xml['enabled']=="True") ? "TRUE" : "FALSE");
				
				//$this->mysqli->query($sql);
				$id_empleado = $this->mysqli->insert_id;
			} else {
				$rowEmpleado = $rsEmpleado->fetch_object();
				$id_empleado = $rowEmpleado->id_empleado;
				
				$sql = "UPDATE vista_empleado SET";
				//$sql.= " enroll_number=" . $xml['enroll_number'];
				$sql.= " name='" . $xml['name'] . "'";
				//$sql.= ", password='" . $xml['password'] . "'";
				//$sql.= ", privilege=" . $xml['privilege'];
				//$sql.= ", enabled=" . (($xml['enabled']=="True") ? "TRUE" : "FALSE");
				$sql.= " WHERE id_empleado=" . $id_empleado;
				
				//$this->mysqli->query($sql);
				
				$sql = "UPDATE empleado_datos SET";
				//$sql.= " enroll_number=" . $xml['enroll_number'];
				//$sql.= " name='" . $xml['name'] . "'";
				$sql.= " password='" . $xml['password'] . "'";
				$sql.= ", privilege='" . $xml['privilege'] . "'";
				//$sql.= ", enabled=" . (($xml['enabled']=="True") ? "TRUE" : "FALSE");
				$sql.= " WHERE id_empleado=" . $id_empleado;
				
				$this->mysqli->query($sql);
			}
			
			foreach ($xml->row as $row) {
				$sql = "SELECT id_huella FROM huella WHERE id_empleado=" . $id_empleado . " AND finger_index=" . $row['finger_index'];
				$rsHuella = $this->mysqli->query($sql);
				if ($rsHuella->num_rows == 0) {
					$sql = "INSERT huella SET";
					$sql.= " id_empleado=" . $id_empleado;
					$sql.= ", finger_index=" . $row['finger_index'];
					$sql.= ", flag=" . $row['flag'];
					$sql.= ", tmp_length=" . $row['tmp_length'];
					$sql.= ", tmp_data='" . $row['tmp_data'] . "'";
					
					$this->mysqli->query($sql);
				} else {
					$rowHuella = $rsHuella->fetch_object();
					
					$sql = "UPDATE huella SET";
					$sql.= " id_empleado=" . $id_empleado;
					$sql.= ", finger_index=" . $row['finger_index'];
					$sql.= ", flag=" . $row['flag'];
					$sql.= ", tmp_length=" . $row['tmp_length'];
					$sql.= ", tmp_data='" . $row['tmp_data'] . "'";
					$sql.= " WHERE id_huella=" . $rowHuella->id_huella;
					
					$this->mysqli->query($sql);
				}
			}
			
			$sql = "SELECT id_empleado_reloj FROM empleado_reloj WHERE id_empleado=" . $id_empleado . " AND id_reloj=" . $rowReloj->id_reloj;
			$rsHuella = $this->mysqli->query($sql);
			if ($rsHuella->num_rows == 0) {
				$sql = "INSERT empleado_reloj SET id_empleado=" . $id_empleado . ", id_reloj=" . $rowReloj->id_reloj;
				$this->mysqli->query($sql);
			}
	    }
	    
	    fclose($fp);
  	}
  }
  
  
  public function method_recuperar_fichajes($params, $error) {
  	$p = $params[0];
  	
  	set_time_limit(0);
  	$resultado = array();
	$reloj = $this->toJson("SELECT * FROM reloj");
  	foreach ($reloj as $row) {
		$path = "";
		$output = null;
		$fp = fopen("attlogs.dat", "w");
		fclose($fp);
		exec('"' . $path . 'AttLogs.exe' . '"' . ' ' . $row->host, $output);
		$fp = fopen("attlogs.dat", "r");
		
	    while ($linea = stream_get_line($fp, 20000, "\r\n")) {
			$xml = new SimpleXMLElement($linea);
			
			$sql = "SELECT empleado_reloj.* FROM empleado INNER JOIN empleado_reloj USING(id_empleado) WHERE empleado.enroll_number='" . $xml['enroll_number'] . "' AND empleado_reloj.id_reloj='" . $row->id_reloj . "'";
			$rs = $this->mysqli->query($sql);
			if ($rs->num_rows > 0) {
				$rowEmpleado_reloj = $rs->fetch_object();
				
				$sql = "SELECT fichaje.id_fichaje FROM fichaje INNER JOIN empleado_reloj USING(id_empleado_reloj) WHERE empleado_reloj.id_empleado='" . $rowEmpleado_reloj->id_empleado . "' AND empleado_reloj.id_reloj='" . $row->id_reloj . "' AND fichaje.fecha_hora='" . $xml['fecha_hora'] . "'";
				$rs = $this->mysqli->query($sql);
				$resultado[] = $this->mysqli->error;
				if ($rs->num_rows == 0) {
					$sql = "INSERT fichaje SET";
					$sql.= " id_empleado_reloj='" . $rowEmpleado_reloj->id_empleado_reloj . "'";
					$sql.= ", verify_mode='" . $xml['verify_mode'] . "'";
					$sql.= ", inout_mode='" . $xml['inout_mode'] . "'";
					$sql.= ", fecha_hora='" . $xml['fecha_hora'] . "'";
					$sql.= ", workcode='" . $xml['workcode'] . "'";
					$sql.= ", tipo='R'";
					
					$this->mysqli->query($sql);
				}
			}
	    }
	    
	    fclose($fp);
  	}
  	return $resultado;
  }
}

?>