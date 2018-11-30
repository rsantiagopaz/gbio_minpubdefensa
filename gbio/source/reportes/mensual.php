<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
</head>

<?php
/*
$SERVIDOR = "10.0.0.3";
$USUARIO = "gbio";
$PASSWORD = "3sp3r4nz4iea!";
$BASE = "gbio-defensoria";
*/
require("../services/class/comp/Conexion.php");
$mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
$mysqli->query("SET NAMES 'utf8'");

if ($mysqli->error) die($mysqli->error);

?>
<input type="button" value="Imprimir" onclick="window.print()" /><br /><br />
<?php


IF ((@$_REQUEST["MES"] != "") && (@$_REQUEST["ANO"] != "")) {

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
		$qTurnos = $mysqli->query("
		SELECT * FROM turno
		WHERE activo = 1
		");
		$TURNOS = array();
		while ($rTurnos = $qTurnos->fetch_object()) {
			$TURNOS []=$rTurnos->id_turno;
			?>
			<td align="center"><?php echo $rTurnos->descrip; ?>&nbsp;</td>
			<?php
		}
		?>
	</tr>
	<?php
	$qEmp = $mysqli->query("
	SELECT *
	FROM empleado
	WHERE id_lugar_trabajo IN (" . $_REQUEST["id_lugar_trabajo"] . ")
	ORDER BY name
	"); 
	if ($mysqli->error) die($mysqli->error);
	while ($rEmp = $qEmp->fetch_object()) {
	?>
	<tr>
		<td style="font-size:10;"><?php echo $rEmp->name; ?>&nbsp;</td>
		<?php
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
		");
		$rET = $qET->fetch_object();
		
		for ($i=1; $i<=31; $i++) {
		?>
			<td align="center" style="font-size:7;">
				<?php
				
					if ($i < 10) {
						$dia = "0" . $i;
					} else {
						$dia = $i;
					}
					$qFi = $mysqli->query("
					SELECT *, CONCAT(HOUR(fichaje.fecha_hora), ':', if(MINUTE(fichaje.fecha_hora)<10, CONCAT('0', MINUTE(fichaje.fecha_hora)), MINUTE(fichaje.fecha_hora))) as asistencia 
					FROM fichaje
					
					WHERE id_empleado_reloj IN (" . $rER->id_empleado_reloj . ") 
					AND DATE(fecha_hora) = '" . $_REQUEST["ANO"] . "-". $_REQUEST["MES"] . "-" . $dia . "'
					ORDER BY fichaje.fecha_hora
					");
					while ($rFi = $qFi->fetch_object()) {
// 						echo $rFi->asistencia . " - " . $rFi->id_fichaje . "<br />";
						echo $rFi->asistencia . "<br />";
					}
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
							echo "<label title='" . $rEPT->permiso . "'><b>P</b></label><br />";
						}
					}
				
// 				echo $rER->id_empleado_reloj;
				?>&nbsp;
			</td>
		<?php
		}
		?>
	</tr>
	<?php
	} 
	?>
</table>
<?php
} 
?>