<?php

require("Base.php");

class class_Parametros extends class_Base
{
	
	
  public function method_leer_listado($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->width = "int";
  	$opciones->height = "int";
  	
  	$sql = "SELECT * FROM listado";
  	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_escribir_contrasena($params, $error) {
  	$p = $params[0];
  	
	$set = $this->prepararCampos($p->model);
	
	$sql = "SELECT * FROM usuario WHERE id_usuario=" . $p->model->id_usuario . " AND password=MD5('" . $p->model->password . "')";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
  		$sql = "UPDATE usuario SET password=MD5('" . $p->model->passnueva . "') WHERE id_usuario=" . $p->model->id_usuario;
  		$this->mysqli->query($sql);
	} else {
		$error->SetError(0, "password");
		return $error;
	}
  }
  
  
  public function method_leer_usuario($params, $error) {
	$p = $params[0];
	
	$sql = "SELECT * FROM usuario WHERE usuario LIKE '" . $p->nick . "'";
	$rs = $this->mysqli->query($sql);
	if ($rs->num_rows > 0) {
		$row = $rs->fetch_object();
		if ($row->password == md5($p->password)) {
			
			unset($row->password);
			
			$row->lugar_trabajo = array();
			$row->id_lugar_trabajo = array();
			
			$sql = "SELECT lugar_trabajo.id_lugar_trabajo, lugar_trabajo.descrip FROM usuario_lugar_trabajo INNER JOIN lugar_trabajo USING(id_lugar_trabajo) WHERE id_usuario=" . $row->id_usuario . " ORDER BY descrip";
			$rsLugar_trabajo = $this->mysqli->query($sql);
			while ($rowLugar_trabajo = $rsLugar_trabajo->fetch_object()) {
				$row->lugar_trabajo[] = $rowLugar_trabajo;
				$row->id_lugar_trabajo[] = $rowLugar_trabajo->id_lugar_trabajo;
			}
			
			$_SESSION['usuario'] = $row;
			
			return $row;
		} else {
			$error->SetError(0, "password");
			return $error;
		}
	} else {
		$error->SetError(0, "nick");
		return $error;
	}
  }
  
  
  public function method_leer_ubicaciones($params, $error) {
  	$p = $params[0];
  	
  	$sql = "SELECT * FROM ubicacion WHERE id_ubicacion=" . $p->id_ubicacion;
  	$rs = $this->mysqli->query($sql);
	$nodo = $rs->fetch_object();
	
	$nodo->padre = "";
	$nodo->labelLargo = "";
	$nodo->hijos = array();
	
  	$sql = "SELECT id_ubicacion FROM ubicacion WHERE id_padre=" . $p->id_ubicacion . " ORDER BY descrip";
  	$rs = $this->mysqli->query($sql);
  	while ($row = $rs->fetch_object()) {
  		$p->id_ubicacion = $row->id_ubicacion;
  		$nodo->hijos[] = $this->method_leer_ubicaciones($params, $error);
  	}
	
	return $nodo;
  }
  
  
  public function method_leer_tolerancias($params, $error) {
  	$p = $params[0];
  	
  	$opciones = new stdClass;
  	$opciones->entrada_extras = "bool";
  	$opciones->e_fichada = "int";
  	$opciones->e_tolerable = "int";
  	$opciones->e_tardanza = "int";
  	$opciones->e_30minutos = "int";
  	$opciones->e_60minutos = "int";
  	$opciones->salida_extras = "bool";
  	$opciones->s_fichada = "int";
  	$opciones->s_tolerable = "int";
  	$opciones->s_abandono = "int";
  	$opciones->control_entrada = "bool";
  	$opciones->control_salida = "bool";
  	$opciones->total_minutos = "int";
  	$opciones->limite_tardanzas = "int";
  	
  	return $this->toJson("SELECT tolerancia.*, lugar_trabajo.descrip AS lugar_trabajo_descrip FROM tolerancia INNER JOIN lugar_trabajo USING(id_lugar_trabajo) WHERE tolerancia.id_lugar_trabajo IN (" . implode(", ", $p->id_lugar_trabajo) . ") ORDER BY descrip", $opciones);
  }
  
  
  public function method_escribir_tolerancia($params, $error) {
  	$p = $params[0];
  	
	$set = $this->prepararCampos($p->model, "tolerancia");
  	
  	if (is_null($p->model->id_tolerancia)) {
  		$sql = "INSERT tolerancia SET " . $set . "";
  		$this->mysqli->query($sql);
		$id_tolerancia = $this->mysqli->insert_id;
  	} else{
  		$sql = "UPDATE tolerancia SET " . $set . " WHERE id_tolerancia=" . $p->model->id_tolerancia . "";
  		$this->mysqli->query($sql);
  		$id_tolerancia = $p->model->id_tolerancia;
  	}
  	
  	return $id_tolerancia;
  }
  
  
  public function method_leer_permisos($params, $error) {
  	$p = $params[0];
  	
  	function functionAux(&$row, $col) {
	  	$row->entrada = (bool) $row->entrada;
	  	$row->salida = (bool) $row->salida;
	  	$row->pagas = (bool) $row->pagas;
	  	$row->activo = (bool) $row->activo;
	  	$row->hora_asignacion_limite = substr($row->hora_asignacion_limite, 0, 5);
	  	$row->primer_aviso = (int) $row->primer_aviso;
	  	$row->segundo_aviso = (int) $row->segundo_aviso;
  	};
	  	
  	$opciones = new stdClass;
	$opciones->functionAux = functionAux;

  	if ($p->todos) {
  		$resultado = $this->toJson("SELECT * FROM permiso WHERE TRUE AND id_lugar_trabajo IN (" . implode(", ", $p->id_lugar_trabajo) . ")", $opciones);
  	} else {
  		$resultado = $this->toJson("SELECT * FROM permiso WHERE activo AND id_lugar_trabajo IN (" . implode(", ", $p->id_lugar_trabajo) . ")", $opciones);
  	}
  	
  	return $resultado;
  }
  
  
  public function method_escribir_permiso($params, $error) {
  	$p = $params[0];
  	
	$set = $this->prepararCampos($p->model, "permiso");
  	
  	if (is_null($p->model->id_permiso)) {
  		$sql = "INSERT permiso SET " . $set . "";
  		$this->mysqli->query($sql);
		$id_permiso = $this->mysqli->insert_id;
  	} else{
  		$sql = "UPDATE permiso SET " . $set . " WHERE id_permiso=" . $p->model->id_permiso . "";
  		$this->mysqli->query($sql);
  		$id_permiso = $p->model->id_permiso;
  	}
  	
  	return $id_permiso;
  }
  
  
  
  
  public function method_escribir_turno($params, $error) {
  	$p = $params[0];
  	
	$set = $this->prepararCampos($p->model, "turno");
  	
  	if (is_null($p->model->id_turno)) {
  		$sql = "INSERT turno SET " . $set . "";
  		$this->mysqli->query($sql);
  	} else{
  		$sql = "UPDATE turno SET " . $set . " WHERE id_turno=" . $p->model->id_turno . "";
  		$this->mysqli->query($sql);
  	}
  }
  
  
  public function method_leer_turnos($params, $error) {
  	$p = $params[0];
  	
 	
  	function functionAux(&$row, $col) {
  		$row->$col = substr($row->$col, 0, 5);
  	};
  	
  	$opciones = array("cant_horas"=>"int", "activo"=>"bool", "lu"=>"bool", "ma"=>"bool", "mi"=>"bool", "ju"=>"bool", "vi"=>"bool", "sa"=>"bool", "do"=>"bool", "entrada"=>functionAux, "salida"=>functionAux, "control_entrada"=>"bool", "control_salida"=>"bool", "total_minutos"=>"int");
	if ($p->todos) {
		$respuesta = $this->toJson("SELECT turno.*, lugar_trabajo.descrip AS lugar_trabajo_descrip FROM turno INNER JOIN lugar_trabajo USING(id_lugar_trabajo) WHERE TRUE AND turno.id_lugar_trabajo IN (" . implode(", ", $p->id_lugar_trabajo) . ")", $opciones);
	} else {
		$respuesta = $this->toJson("SELECT turno.*, lugar_trabajo.descrip AS lugar_trabajo_descrip FROM turno INNER JOIN lugar_trabajo USING(id_lugar_trabajo) WHERE activo AND turno.id_lugar_trabajo IN (" . implode(", ", $p->id_lugar_trabajo) . ")", $opciones);
	}
	
	return $respuesta;
  }
  
  
  public function method_leer_usuarios($params, $error) {
  	$p = $params[0];
  	
  	$resultado = $this->toJson("SELECT * FROM usuario ORDER BY usuario");
  	foreach ($resultado as $item) {
  		$item->lugar_trabajo = $this->toJson("SELECT lugar_trabajo.id_lugar_trabajo, lugar_trabajo.descrip FROM usuario_lugar_trabajo INNER JOIN lugar_trabajo USING(id_lugar_trabajo) WHERE id_usuario=" . $item->id_usuario . " ORDER BY descrip");
  	}
  	
  	return $resultado;
  }
  
  
  public function method_escribir_usuarios($params, $error) {
  	$p = $params[0];
  	
  	
  	try {
		$this->mysqli->query("START TRANSACTION");
		
	  	if (is_null($p->model->id_usuario)) {
	  		$sql = "INSERT usuario SET usuario='" . $p->model->usuario . "', password=MD5('" . $p->model->password . "'), tipo='" . $p->model->tipo . "'";
	  		$this->mysqli->query($sql);
	  		
	  		$p->model->id_usuario = $this->mysqli->insert_id;
	  	} else{
	  		$sql = "DELETE FROM usuario_lugar_trabajo WHERE id_usuario=" . $p->model->id_usuario;
	  		$this->mysqli->query($sql);
	  		
	  		$sql = "UPDATE usuario SET usuario='" . $p->model->usuario . "', tipo='" . $p->model->tipo . "' WHERE id_usuario=" . $p->model->id_usuario;
	  		$this->mysqli->query($sql);
	  	}
	  	
	  	foreach ($p->lugar_trabajo as $item) {
			$sql = "INSERT usuario_lugar_trabajo SET id_usuario=" . $p->model->id_usuario . ", id_lugar_trabajo=" . $item;
			$this->mysqli->query($sql);
	  	}
	
		$this->mysqli->query("COMMIT");
	
	} catch (Exception $e) {
		$this->mysqli->query("ROLLBACK");
	}
  }
  
  
  public function method_leer_lugar_trabajo($params, $error) {
  	$p = $params[0];
  	
  	return $this->toJson("SELECT * FROM lugar_trabajo ORDER BY descrip");
  }
  
  
  public function method_escribir_lugar_trabajo($params, $error) {
  	$p = $params[0];
  	
  	$cambios = $p->cambios;
  	
  	try {
		$this->mysqli->query("START TRANSACTION");
		
		foreach ($cambios->altas as $item) {
			$sql="INSERT INTO lugar_trabajo SET descrip='" . $item->descrip . "'";
			$this->mysqli->query($sql);
		}
	
		foreach ($cambios->modificados as $item) {
			$sql="UPDATE lugar_trabajo SET descrip='" . $item->descrip . "' WHERE id_lugar_trabajo='" . $item->id_lugar_trabajo . "'";
			$this->mysqli->query($sql);
		}	
	
		$this->mysqli->query("COMMIT");
	
	} catch (Exception $e) {
		$this->mysqli->query("ROLLBACK");
	}
  }
  
  
  public function method_leer_relojes($params, $error) {
  	$p = $params[0];
  	
  	return $this->toJson("SELECT * FROM reloj");
  }
  
  
  public function method_escribir_relojes($params, $error) {
  	$p = $params[0];
  	
  	$cambios = $p->cambios;
  	
  	try {
		$this->mysqli->query("START TRANSACTION");
		
		foreach ($cambios->altas as $item) {
			$sql="INSERT INTO reloj SET descrip='" . $item->descrip . "', host='" . $item->host . "'";
			$this->mysqli->query($sql);
		}
	
		foreach ($cambios->modificados as $item) {
			$sql="UPDATE reloj SET descrip='" . $item->descrip . "', host='" . $item->host . "' WHERE id_reloj='" . $item->id_reloj . "'";
			$this->mysqli->query($sql);
		}	
	
		$this->mysqli->query("COMMIT");
	
	} catch (Exception $e) {
		$this->mysqli->query("ROLLBACK");
	}
  }
  
  
  public function method_escribir_paramet($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT json FROM paramet WHERE id_paramet = 1";
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	$json = $row->json;
	
	$json = json_decode($json);
	
	foreach ($p->json as $key => $value) {
		$json->{$key} = $value;
	}
	
	$json = json_encode($json);
	
	$sql = "UPDATE paramet SET json='" . $json . "'" . " WHERE id_paramet = 1";
	$this->mysqli->query($sql);

  }
  
  
  public function method_leer_paramet($params, $error) {
	
	$sql = "SELECT * FROM paramet WHERE id_paramet = 1";
	$rs = $this->mysqli->query($sql);
	$row = $rs->fetch_object();
	$row->json = json_decode($row->json);
	
	return $row;
  }
  
  
  public function method_leer_hora_servidor($params, $error) {
  	
  	date_default_timezone_set("America/Argentina/Buenos_Aires");
  	$resultado = new stdClass;
  	$resultado->hora = date("H:i");
	
	return $resultado;
  }
  
  
  public function method_autocompletarEmpleado($params, $error) {
  	$p = $params[0];
  	
	$sql = "SELECT name AS label, id_empleado AS model FROM empleado WHERE name LIKE '%" . $p->texto . "%' OR apellido LIKE '%" . $p->texto . "%' OR nombre LIKE '%" . $p->texto . "%' ORDER BY label";
	return $this->toJson($sql);
  }
}

?>