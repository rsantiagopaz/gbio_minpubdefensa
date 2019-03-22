<?php

require("Base.php");

class class_Empleados extends class_Base
{
  function __construct() {
    parent::__construct();
  }
  
  
  public function method_getEmpleadosLugarTrabajo($params, $error) {
  	$p = $params[0];
  	
  	$lugar_trabajo = "";
  	for ($i = 0; $i<count($p->lugar_trabajo); $i++) {
  		if ($lugar_trabajo == "") {
  			$lugar_trabajo .= $p->lugar_trabajo[$i];
  		} else {
  			$lugar_trabajo .= ", " . $p->lugar_trabajo[$i];
  		}
  	}
  	
  	$q = $this->mysqli->query("
  	SELECT id_empleado,
  	name
  	FROM empleado
  	WHERE id_lugar_trabajo IN ('" . $lugar_trabajo . "')
  	ORDER BY name
  	");
  	
//   	return "SELECT id_empleado,
//   	name
//   	FROM empleado
//   	WHERE id_lugar_trabajo IN ('" . $lugar_trabajo . "')";
  	
  	$res = array();
  	while ($r = $q->fetch_object()) {
  		$res []= $r;
  	}
  	
  	return $res;
  }
  
  
  public function method_eliminar_reloj($params, $error) {
	$p = $params[0];
	
	$this->mysqli->query("START TRANSACTION");
	
	foreach ($p->id_empleado_reloj as $id_empleado_reloj) {
		$sql = "DELETE FROM empleado_reloj WHERE id_empleado_reloj=" . $id_empleado_reloj;
		$this->mysqli->query($sql);
		
		$sql = "DELETE FROM fichaje WHERE id_empleado_reloj=" . $id_empleado_reloj;
		$this->mysqli->query($sql);
	}
	
	$this->mysqli->query("COMMIT");
	
  }
  
  
  public function method_asignar_reloj($params, $error) {
	$p = $params[0];

	foreach ($p->id_empleado as $id_empleado) {
		foreach ($p->id_reloj as $id_reloj) {
			$sql = "SELECT id_empleado_reloj FROM empleado_reloj WHERE id_empleado=" . $id_empleado . " AND id_reloj=" . $id_reloj;
			$rs = $this->sql_query($sql);
			if ($rs->num_rows == 0) {
				$sql = "INSERT empleado_reloj SET id_empleado=" . $id_empleado . ", id_reloj=" . $id_reloj;
				$this->sql_query($sql);
			}
		}
	}
  }
  
  
  public function method_eliminar_permiso($params, $error) {
	$p = $params[0];
	
	foreach ($p->id_empleado_permiso as $id_empleado_permiso) {
		$sql = "DELETE FROM empleado_permiso WHERE id_empleado_permiso=" . $id_empleado_permiso;
		$this->sql_query($sql);
	}

	//$sql = "DELETE FROM empleado_permiso WHERE id_empleado_permiso=" . $p->id_empleado_permiso;
	//$this->sql_query($sql);
  }
  
  
  public function method_asignar_permiso($params, $error) {
	$p = $params[0];
	
	$p->fecha = substr($p->fecha, 0, 10);
	
	$resultado = new stdClass;
	$resultado->primer_aviso = array();
	$resultado->segundo_aviso = array();
	
	$sql = "SELECT * FROM permiso WHERE id_permiso=" . $p->id_permiso;
	$rsPermiso = $this->sql_query($sql);
	$rowPermiso = $rsPermiso->fetch_object();
	$rowPermiso->primer_aviso = (int) $rowPermiso->primer_aviso;
	$rowPermiso->segundo_aviso = (int) $rowPermiso->segundo_aviso;
	
	$resultado->permiso = $rowPermiso;
	
	foreach ($p->id_empleado_turno as $id_empleado_turno) {
		$sql = "SELECT id_empleado_permiso FROM empleado_permiso WHERE id_empleado_turno=" . $id_empleado_turno . " AND id_permiso=" . $p->id_permiso . " AND fecha='" . substr($p->fecha, 0, 10) . "'";
		$rs = $this->sql_query($sql);
		if ($rs->num_rows == 0) {
			$sql = "SELECT empleado.id_empleado, CONCAT(empleado.apellido, ', ', empleado.nombre) AS apenom FROM empleado_turno INNER JOIN empleado USING(id_empleado) WHERE id_empleado_turno=" . $id_empleado_turno;
			$rsEmpleado = $this->sql_query($sql);
			$rowEmpleado = $rsEmpleado->fetch_object();
			
			
			$sql = "INSERT empleado_permiso SET id_empleado_turno=" . $id_empleado_turno . ", id_permiso=" . $p->id_permiso . ", fecha='" . $p->fecha . "'";
			$this->sql_query($sql);
			$insert_id = $this->mysqli->insert_id;
			
			$json = new stdClass;
			$json->permiso = $rowPermiso;
			$json->empleado = $rowEmpleado;
			
			$this->auditoria($sql, "Asignar permiso", "asignar_permiso", $insert_id, $json);
 			

			
			$sql = "SELECT id_empleado_permiso FROM empleado_permiso INNER JOIN empleado_turno USING(id_empleado_turno) WHERE id_empleado=" . $rowEmpleado->id_empleado . " AND id_permiso=" . $p->id_permiso . " AND YEAR(empleado_permiso.fecha)=" . substr($p->fecha, 0, 4);
			$rs = $this->sql_query($sql);

			if ($rs->num_rows == $rowPermiso->primer_aviso) {
				$resultado->primer_aviso[] = $rowEmpleado;
			} else if ($rs->num_rows == $rowPermiso->segundo_aviso) {
				$resultado->segundo_aviso[] = $rowEmpleado;
			}
		}		
	}
	
	if (count($resultado->primer_aviso) > 0 || count($resultado->segundo_aviso) > 0) return $resultado;
  }
  
  
  public function method_eliminar_turno($params, $error) {
	$p = $params[0];

	foreach ($p->id_empleado_turno as $id_empleado_turno) {
		$sql = "DELETE FROM empleado_turno WHERE id_empleado_turno=" . $id_empleado_turno;
		$this->sql_query($sql);
		
		$sql = "DELETE FROM empleado_permiso WHERE id_empleado_turno=" . $id_empleado_turno;
		$this->sql_query($sql);
	}
  }
  
  
  public function method_asignar_turno($params, $error) {
	$p = $params[0];

	foreach ($p->id_empleado as $id_empleado) {
		$sql = "SELECT id_empleado_turno FROM empleado_turno";
		$sql.= " WHERE id_empleado=" . $id_empleado;
		$sql.= "  AND id_turno=" . $p->id_turno;
		$sql.= "  AND desde='" . substr($p->desde, 0, 10) . "'";
		$sql.= "  AND " . ((is_null($p->hasta)) ? "ISNULL(hasta)" : "hasta='" . substr($p->hasta, 0, 10) . "'");
		$rs = $this->sql_query($sql);
		if ($rs->num_rows == 0) {
			$sql = "INSERT empleado_turno SET id_empleado=" . $id_empleado . ", id_turno=" . $p->id_turno . ", desde='" . $p->desde . "', hasta=" . ((is_null($p->hasta)) ? "NULL" : "'" . $p->hasta . "'");
			$this->sql_query($sql);
		}			
	}
  }
  
  
  public function method_leer_asignaciones($params, $error) {
	$p = $params[0];
	
	$resultado = array();
	
  	function functionAux(&$row, $col) {
  		$desde = date_create($row->desde);
  		$hasta = date_create($row->hasta);
  		$row->turno = $row->turno . " (" . $desde->format("j/n/Y") . ((is_null($row->hasta)) ? "" : " - " . $hasta->format("j/n/Y")) . ")";
  	};
	  	
  	$opciones = new stdClass;
	$opciones->functionAux = functionAux;
	
	//$where = ((count($p->lugar_trabajo) > 0) ? " WHERE id_lugar_trabajo IN (" . implode(", ", $p->lugar_trabajo) . ")" : " WHERE FALSE");
	
	$sql = "SELECT empleado.id_empleado, CONCAT(empleado.apellido, ', ', empleado.nombre) AS apenom, empleado.name, empleado.enroll_number FROM empleado INNER JOIN tolerancia USING(id_tolerancia)";
	$sql.= " WHERE empleado.id_lugar_trabajo IN (" . implode(", ", $p->id_lugar_trabajo) . ")";
	
	if (isset($p->texto)) {
		$aux = explode(" ", $p->texto);
		
		foreach ($aux as $item) {
			if ($item != "") {
				if (is_numeric($item)) {
					$sql.= " AND empleado.enroll_number LIKE '" . $item . "%'";
				} else {
					$sql.= " AND (empleado.apellido LIKE '%" . $item . "%' OR empleado.nombre LIKE '%" . $item . "%')";
				}
			}
		}
	}
	
	$sql.= " ORDER BY apenom, name, enroll_number";

	$rs = $this->sql_query($sql);
	while ($row = $rs->fetch_object()) {
		$sql = "SELECT empleado_turno.*, turno.descrip AS turno FROM empleado_turno INNER JOIN turno USING(id_turno) WHERE id_empleado=" . $row->id_empleado . " ORDER BY id_empleado_turno DESC";
		$row->turnos = $this->toJson($sql);
		
		$sql = "SELECT empleado_permiso.*, permiso.descrip AS permiso, turno.descrip AS turno, empleado_turno.* FROM ((empleado_permiso INNER JOIN permiso USING(id_permiso)) INNER JOIN empleado_turno USING(id_empleado_turno)) INNER JOIN turno USING(id_turno) WHERE id_empleado=" . $row->id_empleado . " ORDER BY id_empleado_permiso DESC";
		$row->permisos = $this->toJson($sql, $opciones);
		
		$sql = "SELECT empleado_reloj.*, reloj.descrip AS reloj FROM empleado_reloj INNER JOIN reloj USING(id_reloj) WHERE id_empleado=" . $row->id_empleado . " ORDER BY id_empleado_reloj DESC";
		$row->relojes = $this->toJson($sql);
				
		$resultado[] = $row;
	}
	
	//return $this->toJson("SELECT id_empleado_turno, empleado_turno.desde, empleado_turno.hasta, turno.descrip AS turno FROM empleado_turno INNER JOIN turno USING(id_turno) WHERE empleado_turno.id_empleado=" . $p->id_empleado);
	return $resultado;
  }
  
  
  public function method_leer_empleados($params, $error) {
  	$p = $params[0];
  	
  	function functionAux(&$row, $col) {
  		$row->enabled = (bool) $row->enabled;
  		$row->privilege = (int) $row->privilege;
  		
  		$row->apenom = (empty($row->apellido) && empty($row->nombre)) ? "" : $row->apellido . ", " . $row->nombre;
  	};
  	
  	$opciones = new stdClass;
  	$opciones->salida = functionAux;
  	
  	$where = ((count($p->id_lugar_trabajo) > 0) ? " WHERE empleado.id_lugar_trabajo IS NULL OR empleado.id_lugar_trabajo IN (" . implode(", ", $p->id_lugar_trabajo) . ")" : " WHERE FALSE");
  	
  	$sql = "SELECT empleado.*, lugar_trabajo.descrip AS lugar_trabajo_descrip, tolerancia.descrip AS tolerancia_descrip FROM empleado LEFT JOIN lugar_trabajo USING(id_lugar_trabajo) LEFT JOIN tolerancia USING(id_tolerancia) " . $where . " ORDER BY apellido, nombre, name";
  	
	return $this->toJson($sql, $opciones);
  }
  
  
  public function method_alta_modifica_empleado($params, $error) {
	$p = $params[0];
  	
	$resultado = false;
  	
	$set = $this->prepararCampos($p, "empleado");
  	
	if ($p->id_empleado=="0") {
		$sql = "INSERT empleado SET " . $set;
		$this->sql_query($sql);
		$resultado = $this->mysqli->insert_id;
  	} else {
  		if ($p->cambio_lugar_trabajo) {
			$sql = "DELETE FROM empleado_permiso WHERE id_empleado_turno IN (SELECT id_empleado_turno FROM empleado_turno WHERE id_empleado = " . $p->id_empleado . ")";
			$this->sql_query($sql);

			$sql = "DELETE FROM empleado_turno WHERE id_empleado = " . $p->id_empleado;
			$this->sql_query($sql);
		}
		$sql = "UPDATE empleado SET " . $set . " WHERE id_empleado = " . $p->id_empleado;
		$this->sql_query($sql);
		$resultado = $p->id_empleado;
	}
  	
	return $resultado;
  }
  
  
  public function method_alta_modifica_datos_empleado($params, $error) {
	$p = $params[0];
  	
	$resultado = false;
  	
	$set = $this->prepararCampos($p, "empleado_datos");
	
	$this->mysqli->query("START TRANSACTION");
  	
	if ($p->id_empleado=="0") {
		//$sql = "INSERT empleado SET " . $set;
		//$this->mysqli->query($sql);
		//$resultado = $this->mysqli->insert_id;
  	} else {
  		if ($p->cambio_lugar_trabajo) {
			$sql = "DELETE FROM empleado_permiso WHERE id_empleado_turno IN (SELECT id_empleado_turno FROM empleado_turno WHERE id_empleado = " . $p->id_empleado . ")";
			$this->mysqli->query($sql);

			$sql = "DELETE FROM empleado_turno WHERE id_empleado = " . $p->id_empleado;
			$this->mysqli->query($sql);
		}

		$sql = "INSERT empleado_datos SET " . $set . " ON DUPLICATE KEY UPDATE " . $set;
		$this->mysqli->query($sql);
		$resultado = $p->id_empleado;
	}
	
	$this->mysqli->query("COMMIT");
  	
	return $resultado;
  }
}

?>