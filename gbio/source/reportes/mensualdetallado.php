<?php
if( !ini_get('safe_mode') ) {
	set_time_limit(0);
}

require("../services/class/comp/Conexion.php");
$mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
$mysqli->query("SET NAMES 'utf8'");

if ($mysqli->error) die($mysqli->error);

?>
<input type="button" value="Imprimir" onclick="window.print()" /><br /><br />
<?php


$_REQUEST["id_lugar_trabajo"] = 1;
$DESDE = $_REQUEST["ANO"] . "-" . $_REQUEST["MES"] . "-01";
$HASTA = $_REQUEST["ANO"] . "-" . $_REQUEST["MES"] . "-31";
// $_REQUEST["MES"] = '11';
// $_REQUEST["ANO"] = "2014";
$_REQUEST["id_turno"] = 1;
$ENTRADA = 0;
$SALIDA = 1;

$qTO = $mysqli->query("
SELECT * FROM tolerancia
LIMIT 1
");
$rTO = $qTO->fetch_object();

$qTURNO = $mysqli->query("
SELECT * FROM turno
WHERE id_turno = '" . $_REQUEST["id_turno"] . "'
");
$rTURNO = $qTURNO->fetch_object();

?>
LISTANDO ASISTENCIA DE LA FECHA 01/<?php echo $_REQUEST["MES"] . "/" . $_REQUEST["ANO"]; ?> AL 31/<?php echo $_REQUEST["MES"] . "/" . $_REQUEST["ANO"]; ?>
<table border="1" cellpadding="1" cellspacing="0" width="850px">
	<tr style="font-size:12; font-weight: bold;">
		<td>Nombre Emplado</td>
		<?php
		for ($i=1; $i<=31; $i++) {
		
		if ($i < 10) {
			$dia = "0" . $i;
		} else {
			$dia = $i;
		}
		
		$dia_semana = date("N", strtotime($_REQUEST["ANO"] . "-" . $_REQUEST["MES"] . "-" . $dia));
		switch ($dia_semana) {
			case "1":
				$dia_semana = "Lu";
				break;
			case "2":
				$dia_semana = "Ma";
				break;
			case "3":
				$dia_semana = "Mi";
				break;
			case "4":
				$dia_semana = "Ju";
				break;
			case "5":
				$dia_semana = "Vi";
				break;
			case "6":
				$dia_semana = "Sa";
				break;
			case "7":
				$dia_semana = "Do";
				break;
		}
		?>
					<td align="center"><?php echo $dia . "<br />" . $dia_semana; ?></td>
				
				
<?php
}
?>
<td>E: P</td>
<td>E: T</td>
<td>E: AT</td>
<td>E: AA</td>
<td>E: AU</td>
<td>S: P</td>
<td>S: A</td>
<td>S: AA</td>
<td>S: ST</td>
<td>S: AU</td>

</tr>
<?php
// echo "COUNT: " . $_REQUEST["empleados"];
if ($_REQUEST["empleados"] != "TODOS") {
	$EMPLEADOS = " AND empleado.id_empleado IN (" . $_REQUEST["empleados"] . ") ";
} else {
	$EMPLEADOS = "";
}
$qEmp = $mysqli->query("
SELECT DISTINCT empleado.*
FROM empleado
INNER JOIN empleado_turno USING(id_empleado)
WHERE id_lugar_trabajo IN (" . $_REQUEST["id_lugar_trabajo"] . ")
AND empleado_turno.id_turno = '" . $_REQUEST["id_turno"] . "'
 " . $EMPLEADOS . " 
ORDER BY name
");

while ($rEmp = $qEmp->fetch_object()) {
	
	$qER = $mysqli->query("
	SELECT GROUP_CONCAT(id_empleado_reloj SEPARATOR ',') as id_empleado_reloj
	FROM empleado_reloj
	WHERE id_empleado = '" . $rEmp->id_empleado . "'
	");
	$rER = $qER->fetch_object();
	
	$qET = $mysqli->query("
	SELECT GROUP_CONCAT(id_empleado_turno SEPARATOR ',') as id_empleado_turno
	FROM empleado_turno
	WHERE id_empleado = '" . $rEmp->id_empleado . "'
	AND desde <= '" . $DESDE . "'
	AND IFNULL(hasta,'3000-12-31') >= '" . $HASTA . "'
	");
	$rET = $qET->fetch_object();
	
// 	echo $rEmp->name . " - EmpleadoReloj: " . $rER->id_empleado_reloj . " - EmpleadoTurno: " . $rET->id_empleado_turno . "<br />";
	?>
	<tr>
		<td style="font-size:10;"><?php echo $rEmp->name; ?>&nbsp;</td>
	<?php
	
	$cant_entradas = 0;
	$cant_salidas = 0;
	
	$EP = 0;
	$ET = 0;
	$EAT = 0;
	$EAA = 0;
	$EAU = 0;
	$SP = 0;
	$ST = 0;
	$SAT = 0;
	$SAA = 0;
	$SAU = 0;
	for ($i=1; $i<=31; $i++) {
		?>
		<td><table border="1" cellpadding="0" cellspacing="0"><tr>
		<?php
		$entrada_ok = false;
		$salida_ok = false;
		
		if ($i < 10) {
			$dia = "0" . $i;
		} else {
			$dia = $i;
		}
		
		if ((date("N", strtotime($_REQUEST["ANO"] . "-" . $_REQUEST["MES"] . "-" . $dia)) == "6") || (date("N", strtotime($_REQUEST["ANO"] . "-" . $_REQUEST["MES"] . "-" . $dia)) == "7")) {
			?>
			<td>&nbsp;</td><td>&nbsp;</td></tr></table></td>
			<?php
		} else {
		
		$qFiE = $mysqli->query("
		SELECT *, CONCAT(HOUR(fichaje.fecha_hora), ':', if(MINUTE(fichaje.fecha_hora)<10, CONCAT('0', MINUTE(fichaje.fecha_hora)), MINUTE(fichaje.fecha_hora))) as asistencia 
		FROM fichaje
		WHERE id_empleado_reloj IN (" . $rER->id_empleado_reloj . ")
		AND DATE(fecha_hora) = '" . $_REQUEST["ANO"] . "-". $_REQUEST["MES"] . "-" . $dia . "'
		AND inout_mode = '" . $ENTRADA . "'
		ORDER BY id_fichaje ASC
		LIMIT 1
		");
		if ($mysqli->error) die($mysqli->error);

		$qFiS = $mysqli->query("
		SELECT *, CONCAT(HOUR(fichaje.fecha_hora), ':', if(MINUTE(fichaje.fecha_hora)<10, CONCAT('0', MINUTE(fichaje.fecha_hora)), MINUTE(fichaje.fecha_hora))) as asistencia
		FROM fichaje
		WHERE id_empleado_reloj IN (" . $rER->id_empleado_reloj . ")
		AND DATE(fecha_hora) = '" . $_REQUEST["ANO"] . "-". $_REQUEST["MES"] . "-" . $dia . "'
		AND inout_mode = '" . $SALIDA . "'
		ORDER BY id_fichaje DESC
		LIMIT 1
		");
		if ($mysqli->error) die($mysqli->error);

		$rFiE = $qFiE->fetch_object();
		if ($rFiE) {
			$cant_entradas++;
// 			echo "E: " . $rFiE->asistencia . "<br />";
			$entrada_ok = true;
			
// 			$horaInicial= $rFiE->asistencia;
// 			$minutoAnadir= $rTO->e_fichada;
// 			$segundos_horaInicial=strtotime($horaInicial);
// 			$segundos_minutoAnadir=$minutoAnadir*60;
// 			$nuevaHora=date("H:i",$segundos_horaInicial+$segundos_minutoAnadir);
// 			echo "Hora Nueva: ".$nuevaHora . "<br />";
			$tol_entrada = date("H:i", strtotime($rTURNO->entrada) - ($rTO->e_fichada*60));
			$tol_tardanza = date("H:i", strtotime($rTURNO->entrada) + ($rTO->e_tolerable*60));
			$tardanza = date("H:i", strtotime($tol_tardanza) + ($rTO->e_tardanza*60));
			
			
// 			echo "TE: " . $tol_entrada . "<br />";
// 			echo "TT: " . $tol_tardanza . "<br />";
// 			echo "T: " . $tardanza . "<br />";
			
			$entrada = strtotime($rFiE->asistencia);
			if ($entrada >= strtotime($tol_entrada) ) {
				if ($entrada <= strtotime($tol_tardanza)) {
// 					echo "Presente" . "<br />";
					$EP += 1;
					?><td bgcolor="green" title="<?php echo $rFiE->asistencia; ?>">&nbsp;</td><?php
				} else {
					if ($entrada <= strtotime($tardanza)) {
// 						echo "Tardanza" . "<br />";
					$ET += 1;
					?><td bgcolor="yellow" title="<?php echo $rFiE->asistencia; ?>">&nbsp;</td><?php
					} else {
					$EAA += 1;
// 						echo "Ausente (Tarde)" . "<br />";
					?><td bgcolor="orange" title="<?php echo $rFiE->asistencia; ?>">&nbsp;</td><?php
					}
				}
			} else {
// 				echo "Ausente (Antes)" . "<br />";
					$EAT += 1;
					?><td bgcolor="purple" title="<?php echo $rFiE->asistencia; ?>">&nbsp;</td><?php
			}
			
		} else {
			$permiso = false;
			$entrada_ok = false;
			if ($rET->id_empleado_turno) {
				$qEPT = $mysqli->query("
				SELECT permiso.descrip as permiso
				FROM empleado_permiso
				INNER JOIN permiso USING(id_permiso)
				WHERE id_empleado_turno IN (" . $rET->id_empleado_turno . ")
				AND fecha = '" . $_REQUEST["ANO"] . "-". $_REQUEST["MES"] . "-" . $dia . "'
				");
				if ($mysqli->error) die($mysqli->error);
				while ($rEPT = $qEPT->fetch_object()) {
					echo '<td bgcolor="#89FFED" title="' . $rEPT->permiso . '">&nbsp;</td>';
					$permiso = true;
				}
			}
			if (!$permiso) {
			$EAU += 1;
			?>
				<td bgcolor="red">&nbsp;</td>
			<?php
			}
		}
		
		$rFiS = $qFiS->fetch_object();
		if ($rFiS) {
			$cant_salidas++;
// 			echo "S: " . $rFiS->asistencia . "<br />";
			$salida_ok = true;
			
			$tol_salida = date("H:i", strtotime($rTURNO->salida) + ($rTO->s_fichada*60));
			$tol_abandono = date("H:i", strtotime($rTURNO->salida) - ($rTO->s_tolerable*60));
			$abandono = date("H:i", strtotime($tol_abandono) - ($rTO->s_abandono*60));

			$salida = strtotime($rFiS->asistencia);
			if ($salida <= strtotime($tol_salida) ) {
				if ($salida >= strtotime($tol_abandono)) {
// 					echo "Presente" . "<br />";
					$SP += 1;
						?><td bgcolor="green" title="<?php echo $rFiS->asistencia; ?>">&nbsp;</td><?php
				} else {
					if ($salida >= strtotime($abandono)) {
// 						echo "Salida Pre Abandono" . "<br />";
					$ST += 1;
						?><td bgcolor="yellow" title="<?php echo $rFiS->asistencia; ?>">&nbsp;</td><?php
					} else {
// 						echo "Abandono (Antes)" . "<br />";
					$SAA += 1;
						?><td bgcolor="orange" title="<?php echo $rFiS->asistencia; ?>">&nbsp;</td><?php
					}
				}
			} else {
					$SAT += 1;
// 				echo "Salida Tarde (Despues)" . "<br />";
					?><td bgcolor="purple" title="<?php echo $rFiS->asistencia; ?>">&nbsp;</td><?php
			}
				
// 			echo "TS: " . $tol_salida . "<br />";
// 			echo "TA: " . $tol_abandono . "<br />";
// 			echo "A: " . $abandono . "<br />";
		} else {
			$salida_ok = false;
			$permiso = false;
			if ($rET->id_empleado_turno) {
				$qEPT = $mysqli->query("
						SELECT permiso.descrip as permiso
						FROM empleado_permiso
						INNER JOIN permiso USING(id_permiso)
						WHERE id_empleado_turno IN (" . $rET->id_empleado_turno . ")
						AND fecha = '" . $_REQUEST["ANO"] . "-". $_REQUEST["MES"] . "-" . $dia . "'
						");
				if ($mysqli->error) die($mysqli->error);
				while ($rEPT = $qEPT->fetch_object()) {
					echo '<td bgcolor="#89FFED" title="' . $rEPT->permiso . '">&nbsp;</td>';
					$permiso = true;
				}
			}
			if (!$permiso) {
			$SAU += 1;
			?>
				<td bgcolor="red">&nbsp;</td>
			<?php
			}
		}
		
		if (($entrada_ok) && ($salida_ok)) {
			//echo "EVALUO <br />";
			
		}
		?>
		</tr></table></td>
		<?php
		}
	}
	?>
	<td align="center" bgcolor="green"><?php echo $EP; ?></td>
	<td align="center" bgcolor="yellow"><?php echo $ET; ?></td>
	<td align="center" bgcolor="purple"><?php echo $EAT; ?></td>
	<td align="center" bgcolor="orange"><?php echo $EAA; ?></td>
	<td align="center" bgcolor="red"><?php echo $EAU; ?></td>
	<td align="center" bgcolor="green"><?php echo $SP; ?></td>
	<td align="center" bgcolor="yellow"><?php echo $ST; ?></td>
	<td align="center" bgcolor="purple"><?php echo $SAT; ?></td>
	<td align="center" bgcolor="orange"><?php echo $SAA; ?></td>
	<td align="center" bgcolor="red"><?php echo $SAU; ?></td>
	</tr>
	<?php
// 	echo "Entradas: " . $cant_entradas . " - Salidas: " . $cant_salidas . "<br />";
}

?>
</table>