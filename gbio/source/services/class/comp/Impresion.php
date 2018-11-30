<?php
session_start();

require("Conexion.php");
require("DateTimeEnhanced.php");

set_time_limit(0);

$mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
$mysqli->query("SET NAMES 'utf8'");



switch ($_REQUEST['rutina'])
{
	
case "permisos" : {
	
	?>
	<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>Listado</title>
	</head>
	<body>
	<table border="0" cellpadding="0" cellspacing="0" width="800" align="center">
	<tr><td>&nbsp;</td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>Ministerio Publico Fiscal</b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><b>Listado Tiempo de Permiso, <?php echo date("Y-m-d H:i:s"); ?></b></big></td></tr>
	<tr><td>&nbsp;</td></tr>
	<tr><td align="center" colspan="6"><big><?php
		if (! is_null($_REQUEST['desde']) && ! is_null($_REQUEST['hasta'])) {
			$desde = $_REQUEST['desde'];
			$hasta = $_REQUEST['hasta'];
			
			echo "Período: " . $desde . " / " . $hasta;
		} else if (! is_null($_REQUEST['desde'])) {
			$desde = $_REQUEST['desde'];
			$hasta = null;
			
			echo "Período: desde " . $desde;
		} else if (! is_null($_REQUEST['hasta'])) {
			$desde = null;
			$hasta = $_REQUEST['hasta'];
			
			echo "Período: hasta " . $hasta;
		}
	?></big></td></tr>

	<?php
	
	$fecha = date("Y-m-d");
	
	$meses = array();
	$meses[1] = "Enero";
	$meses[2] = "Febrero";
	$meses[3] = "Marzo";
	$meses[4] = "Abril";
	$meses[5] = "Mayo";
	$meses[6] = "Junio";
	$meses[7] = "Julio";
	$meses[8] = "Agosto";
	$meses[9] = "Septiembre";
	$meses[10] = "Octubre";
	$meses[11] = "Noviembre";
	$meses[12] = "Diciembre";
	
	
	
	
	

	$sql = "SELECT * FROM turno";
	$rsTurno = $mysqli->query($sql);
	while ($rowTurno = $rsTurno->fetch_object()) {
		
		$rowTurno->lu = (bool) $rowTurno->lu;
		$rowTurno->ma = (bool) $rowTurno->ma;
		$rowTurno->mi = (bool) $rowTurno->mi;
		$rowTurno->ju = (bool) $rowTurno->ju;
		$rowTurno->vi = (bool) $rowTurno->vi;
		$rowTurno->sa = (bool) $rowTurno->sa;
		$rowTurno->do = (bool) $rowTurno->do;
		$rowTurno->activo = (bool) $rowTurno->activo;
		
		if (! $rowTurno->activo) continue;
		
		
		
		$sql = "SELECT empleado.*, empleado_turno.desde, empleado_turno.hasta";
		$sql.= " FROM empleado INNER JOIN empleado_turno USING(id_empleado)";
		$sql.= " WHERE id_turno=" . $rowTurno->id_turno;
		
		if (isset($_REQUEST['id_empleado'])) {
			$sql.= " AND id_empleado=" . $_REQUEST['id_empleado'];
		}
		
		$sql.= " ORDER BY name";
		
		$rsEmpleado = $mysqli->query($sql);
		
		while ($rowEmpleado = $rsEmpleado->fetch_object()) {
			
			if (empty($rowEmpleado->id_tolerancia)) continue;
			
			
			$sql = "SELECT * FROM tolerancia WHERE id_tolerancia=" . $rowEmpleado->id_tolerancia;
			$rsTolerancia = $mysqli->query($sql);
			$rowTolerancia = $rsTolerancia->fetch_object();

			$rowTolerancia->e_fichada = (int) $rowTolerancia->e_fichada;
			$rowTolerancia->e_tolerable = (int) $rowTolerancia->e_tolerable;
			$rowTolerancia->e_tardanza = (int) $rowTolerancia->e_tardanza;
			$rowTolerancia->e_30minutos = (int) $rowTolerancia->e_30minutos;
			$rowTolerancia->e_60minutos = (int) $rowTolerancia->e_60minutos;
			
			$rowTolerancia->control_entrada = (bool) $rowTolerancia->control_entrada;
			$rowTolerancia->control_salida = (bool) $rowTolerancia->control_salida;
			$rowTolerancia->total_minutos = (int) $rowTolerancia->total_minutos;
			$rowTolerancia->limite_tardanzas = (int) $rowTolerancia->limite_tardanzas;
			
			
			
			
			if (! is_null($rowEmpleado->desde)) {
				if (is_null($desde)) $desdeAux = $rowEmpleado->desde; else $desdeAux = (($desde > $rowEmpleado->desde) ? $desde : $rowEmpleado->desde);
			} else {
				$desdeAux = $desde;
			}
			
			if (! is_null($rowEmpleado->hasta)) {
				if (is_null($hasta)) $hastaAux = $rowEmpleado->hasta; else $hastaAux = (($hasta < $rowEmpleado->hasta) ? $hasta : $rowEmpleado->hasta);
			} else {
				$hastaAux = $hasta;
			}
			
			$desdeAux = new DateTime($desdeAux);
			$hastaAux = new DateTime($hastaAux);
			
			
			
			
			$ultimo_mes = null;
			$ultimo_ano = null;
			
			$total_minutos = null;
			$limite_tardanzas_contador = 0;
			
			$imprimir_encabezado = null;
			$imprimir_pie = null;
			
			
			?>
			<tr><td>&nbsp;</td></tr>
			<tr><td>&nbsp;</td></tr>
			<tr><td>&nbsp;</td></tr>
			<tr><td>&nbsp;</td></tr>
			<tr><td>&nbsp;</td></tr>
			<tr><td colspan="7"><hr/></td></tr>
			<tr><td>&nbsp;</td></tr>
			<tr><td>Empleado</td><td><?php echo $rowEmpleado->name; ?></td></tr>
			<tr><td>Turno</td><td><?php echo $rowTurno->descrip . " (" . $rowTurno->entrada . " - " . $rowTurno->salida . ")"; ?></td></tr>
			<tr><td>Tolerancia</td><td><?php echo $rowTolerancia->descrip; ?></td></tr>
			<?php

			
			
			do {
				
				$mes = $desdeAux->format("m");
				$ano = $desdeAux->format("Y");
				
				if ($mes != $ultimo_mes || $ano != $ultimo_ano) {
					if (! is_null($ultimo_mes) && $imprimir_pie) {
						?>
						<tr><td colspan="4">&nbsp;</td><td>Total</td><td><?php echo $total_minutos; ?></td></tr>
						</tbody>
						</table>
						</td></tr>
						<?php
						
						$imprimir_pie = false;
					}
					
					$imprimir_encabezado = true;
					

					
					
					$ultimo_mes = $mes;
					$ultimo_ano = $ano;
					
					$total_minutos = $rowTolerancia->total_minutos;
					$limite_tardanzas_contador = 0;
				}
				
				
				
				
				
				$aux = getdate($desdeAux->getTimestamp());
				
				if ($aux["wday"] == 0 && $rowTurno->do) $aux = true;
				else if ($aux["wday"] == 1 && $rowTurno->lu) $aux = true;
				else if ($aux["wday"] == 2 && $rowTurno->ma) $aux = true;
				else if ($aux["wday"] == 3 && $rowTurno->mi) $aux = true;
				else if ($aux["wday"] == 4 && $rowTurno->ju) $aux = true;
				else if ($aux["wday"] == 5 && $rowTurno->vi) $aux = true;
				else if ($aux["wday"] == 6 && $rowTurno->sa) $aux = true;
				else $aux = false;
				
				if ($aux) {
					
					$sql = "SELECT id_permiso";
					$sql.= " FROM (empleado_turno INNER JOIN empleado_permiso USING(id_empleado_turno)) INNER JOIN permiso USING(id_permiso)";
					$sql.= " WHERE empleado_turno.id_empleado=" . $rowEmpleado->id_empleado . " AND empleado_turno.id_turno=" . $rowTurno->id_turno . " AND permiso.entrada AND empleado_permiso.fecha='" . $desdeAux->format("Y-m-d") . "'";
					
					$rsPermiso = $mysqli->query($sql);
					if ($rsPermiso->num_rows == 0) {
					
						$sql = "SELECT fichaje.*";
						$sql.= " FROM fichaje INNER JOIN empleado_reloj USING(id_empleado_reloj)";
						$sql.= " WHERE id_empleado=" . $rowEmpleado->id_empleado . " AND inout_mode = 0";
						$sql.= " AND DATE(fecha_hora) = '" . $desdeAux->format("Y-m-d") . "'";
						//if (! is_null($hastaAux)) $sql.= " AND DATE(fecha_hora) <= '" . $hastaAux . "'";
						$sql.= " ORDER BY fecha_hora DESC";
						
						$rsEntrada = $mysqli->query($sql);
					
						if ($rowTolerancia->control_entrada && $rsEntrada->num_rows > 0) {
					
					
							$rsEntrada = $mysqli->query($sql);
							$rowEntrada = $rsEntrada->fetch_object();
						//while ($rowEntrada = $rsEntrada->fetch_object()) {
							//$datetime = new DateTime($row->fecha_hasta);
							//$datetime = $datetime->add(new DateInterval("P1D"));
							//$fecha_desde = $datetime->format("Y-m-d");
							
							//$rowFichaje->fecha_hora = substr_replace($rowFichaje->fecha_hora, "00", 17);
							
			
							$entrada = new DateTimeEnhanced($rowEntrada->fecha_hora);

							
							
							$hora_aux1 = clone $entrada;
							$hora_aux1->setTime((int) substr($rowTurno->entrada, 0, 2), (int) substr($rowTurno->entrada, 3, 2), (int) substr($rowTurno->entrada, 6, 2));
							$hora_aux2 = $hora_aux1->returnAdd(new DateInterval("PT" . ($rowTolerancia->e_tolerable) . "M"));
							//if ($hora_aux1 <= $entrada && $entrada <= $hora_aux2) {
							if ($entrada <= $hora_aux2) {
								
							} else {
							
								$hora_aux1 = $hora_aux2;
								$hora_aux2 = $hora_aux1->returnAdd(new DateInterval("PT" . $rowTolerancia->e_tardanza . "M"));
								if ($hora_aux1 <= $entrada && $entrada <= $hora_aux2) {
									$limite_tardanzas_contador = $limite_tardanzas_contador + 1;
									
									if ($limite_tardanzas_contador <= $rowTolerancia->limite_tardanzas) {
										imprimir_encabezado();
										
										?>
										<tr><td>Entrada</td><td><?php echo $entrada->format("Y-m-d"); ?></td><td><?php echo $hora_aux1->format("H:i:s"); ?></td><td><?php echo $hora_aux2->format("H:i:s"); ?></td><td><?php echo $entrada->format("H:i:s"); ?></td><td>Tardanza</td></tr>
										<?php
									} else {
										$total_minutos = $total_minutos - 30;
										
										imprimir_encabezado();
										
										?>
										<tr><td>Entrada</td><td><?php echo $entrada->format("Y-m-d"); ?></td><td><?php echo $hora_aux1->format("H:i:s"); ?></td><td><?php echo $hora_aux2->format("H:i:s"); ?></td><td><?php echo $entrada->format("H:i:s"); ?></td><td>Tardanza 30</td></tr>
										<?php
									}
								} else {
								
									$hora_aux1 = $hora_aux2;
									$hora_aux2 = $hora_aux1->returnAdd(new DateInterval("PT" . $rowTolerancia->e_30minutos . "M"));
									if ($hora_aux1 <= $entrada && $entrada <= $hora_aux2) {
										$total_minutos = $total_minutos - 30;
										
										imprimir_encabezado();
										
										?>
										<tr><td>Entrada</td><td><?php echo $entrada->format("Y-m-d"); ?></td><td><?php echo $hora_aux1->format("H:i:s"); ?></td><td><?php echo $hora_aux2->format("H:i:s"); ?></td><td><?php echo $entrada->format("H:i:s"); ?></td><td>30</td></tr>
										<?php
									} else {
									
										$hora_aux1 = $hora_aux2;
										$hora_aux2 = $hora_aux1->returnAdd(new DateInterval("PT" . $rowTolerancia->e_60minutos . "M"));
										if ($hora_aux1 <= $entrada && $entrada <= $hora_aux2) {
											$total_minutos = $total_minutos - 60;
											
											imprimir_encabezado();
											
											?>
											<tr><td>Entrada</td><td><?php echo $entrada->format("Y-m-d"); ?></td><td><?php echo $hora_aux1->format("H:i:s"); ?></td><td><?php echo $hora_aux2->format("H:i:s"); ?></td><td><?php echo $entrada->format("H:i:s"); ?></td><td>60</td></tr>
											<?php
										} else {
										
											if ($hora_aux2 < $entrada) {
												
												imprimir_encabezado();
												
												?>
												<tr><td>Entrada</td><td><?php echo $entrada->format("Y-m-d"); ?></td><td align="center"> - </td><td><?php echo $hora_aux2->format("H:i:s"); ?></td><td><?php echo $entrada->format("H:i:s"); ?></td><td>Sanción</td></tr>
												<?php
											}
										}
									}
								}
							}
						}
					}
					
					
					
					$sql = "SELECT id_permiso";
					$sql.= " FROM (empleado_turno INNER JOIN empleado_permiso USING(id_empleado_turno)) INNER JOIN permiso USING(id_permiso)";
					$sql.= " WHERE empleado_turno.id_empleado=" . $rowEmpleado->id_empleado . " AND empleado_turno.id_turno=" . $rowTurno->id_turno . " AND permiso.salida AND empleado_permiso.fecha='" . $desdeAux->format("Y-m-d") . "'";
					
					$rsPermiso = $mysqli->query($sql);
					if ($rsPermiso->num_rows == 0) {
					
						$sql = "SELECT fichaje.*";
						$sql.= " FROM fichaje INNER JOIN empleado_reloj USING(id_empleado_reloj)";
						$sql.= " WHERE id_empleado=" . $rowEmpleado->id_empleado . " AND inout_mode = 1";
						$sql.= " AND DATE(fecha_hora) = '" . $desdeAux->format("Y-m-d") . "'";
						//$sql.= " AND DATE(fecha_hora) = '" . $entrada->format("Y-m-d") . "'";
						$sql.= " ORDER BY fecha_hora";
						
						$rsSalida = $mysqli->query($sql);
						
						
						if ($rowTolerancia->control_salida && $rsSalida->num_rows > 0) {
		
							$rowSalida = $rsSalida->fetch_object();
							
							$salida = new DateTimeEnhanced($rowSalida->fecha_hora);
							
							$hora_aux2 = clone $salida;
							$hora_aux2->setTime((int) substr($rowTurno->salida, 0, 2), (int) substr($rowTurno->salida, 3, 2), (int) substr($rowTurno->salida, 6, 2));
							$hora_aux1 = $hora_aux2->returnSub(new DateInterval("PT" . ($rowTolerancia->s_tolerable) . "M"));
							
							if ($hora_aux1 <= $salida) {
								
							} else {
								
								$hora_aux2 = $hora_aux1;
								$hora_aux1 = $hora_aux2->returnSub(new DateInterval("PT" . $rowTolerancia->s_abandono . "M"));
								if ($hora_aux1 <= $salida && $salida <= $hora_aux2) {
									$interval = $salida->diff($hora_aux2);
									$minutos = (60 * (int) $interval->format('%h')) + (int) $interval->format('%i');
									$total_minutos = $total_minutos - $minutos;
									
									imprimir_encabezado();
									
									?>
									<tr><td>Salida</td><td><?php echo $salida->format("Y-m-d"); ?></td><td><?php echo $hora_aux1->format("H:i:s"); ?></td><td><?php echo $hora_aux2->format("H:i:s"); ?></td><td><?php echo $salida->format("H:i:s"); ?></td><td>Abandono <?php echo $minutos; ?></td></tr>
									<?php
								} else {
									$hora_aux2 = $hora_aux1;
									if ($hora_aux2 > $salida) {
										$interval = $salida->diff($hora_aux2);
										$minutos = (60 * (int) $interval->format('%h')) + (int) $interval->format('%i');
										$total_minutos = $total_minutos - $minutos;
										
										imprimir_encabezado();
										
										?>
										<tr><td>Salida</td><td><?php echo $salida->format("Y-m-d"); ?></td><td><?php echo $hora_aux1->format("H:i:s"); ?></td><td align="center"> - </td><td><?php echo $salida->format("H:i:s"); ?></td><td><?php echo $minutos; ?></td></tr>
										<?php
									}
								}
							}
						}
					}
				}
				
				
				$desdeAux = $desdeAux->add(new DateInterval("P1D"));
			} while ($desdeAux <= $hastaAux);
			
			if (! is_null($total_minutos) && $imprimir_pie) {
				?>
				<tr><td colspan="4">&nbsp;</td><td>Total</td><td><?php echo $total_minutos; ?></td></tr>
				</tbody>
				</table>
				</td></tr>
				<?php
				
				$imprimir_pie = false;
			}
		}
	}
	
	
	?>

	</table>
	</body>
	</html>
	<?php

	
break;
}

}



  function imprimir_encabezado() {
	global $meses, $mes, $ano, $imprimir_encabezado, $imprimir_pie;

	if ($imprimir_encabezado) {

		?>
		<tr><td>&nbsp;</td></tr>
		<tr><td>&nbsp;</td></tr>
		<tr><td colspan="6" align="center"><?php echo $meses[(int) $mes] . " " . $ano; ?></td></tr>
		<tr><td>&nbsp;</td></tr>
		<?php
	
		?>
		<tr><td colspan="20">
		<table border="1" rules="all" cellpadding="5" cellspacing="0" width="100%" align="center">
		<thead>
		<tr><th>modo</th><th>fecha</th><th colspan="2">intervalo</th><th>fichaje</th><th>descripcion</th></tr>
		</thead>
		<tbody>
		<?php

		$imprimir_encabezado = false;
		$imprimir_pie = true;
	}
  }

?>