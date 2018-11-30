<?php
require("../services/class/comp/Conexion.php");
$mysqli = new mysqli("$servidor", "$usuario", "$password", "$base");
$mysqli->query("SET NAMES 'utf8'");


?>
<input type="button" value="Imprimir" onclick="window.print()" /><br /><br />
<?php

IF (($_REQUEST["DESDE"] != "") && ($_REQUEST["HASTA"] != "")) {
	if ($_REQUEST["USUARIO"] != "") {
		$USUARIO = " AND empleado.id_empleado = '" . $_REQUEST["USUARIO"] . "' ";
	} ELSE {
		$USUARIO = "";
	}
	
	
// 	$DESDE = explode("/", $_REQUEST["DESDE"]);
// 	$DESDE = $DESDE[2] . "-" . $DESDE[1] . "-" . $DESDE[0];
// 	echo $DESDE;
// 	$HASTA = explode("/", $_REQUEST["HASTA"]);
// 	$HASTA = $HASTA[2] . "-" . $HASTA[1] . "-" . $HASTA[0];
// 	echo $HASTA;
	$DESDE = $_REQUEST["DESDE"];
	$HASTA = $_REQUEST["HASTA"];

	$q = $mysqli->query("
	SELECT empleado.*, GROUP_CONCAT(DISTINCT empleado_reloj.id_empleado_reloj SEPARATOR ', ') as id_empleado_reloj
	FROM empleado
	INNER JOIN empleado_reloj USING(id_empleado)
	WHERE 1=1
	 " . $USUARIO . " 
	AND id_lugar_trabajo IN (" . $_REQUEST["id_lugar_trabajo"] . ")
	AND empleado.enabled = 1
	GROUP BY id_empleado
	ORDER BY empleado.name
	");
	if ($mysqli->error) { die($mysqli->error); }
	echo "<b>LISTADO DESDE: " . $_REQUEST["DESDE"] . " - HASTA: " . $_REQUEST["HASTA"] . "</b><br /><br />";
	while ($r = $q->fetch_object()) {
		?>
		<table border="0" style="font-size:10;">
			<tr>
				<td><b>Empleado: <?php echo $r->name; ?></b></td>
			</tr>
		<?php
		$qF = $mysqli->query("
		SELECT fichaje.*
		FROM fichaje
		WHERE id_empleado_reloj IN (" . $r->id_empleado_reloj . ")
		AND fecha_hora BETWEEN '" . $DESDE . "' AND '" . $HASTA . "'
		ORDER BY fecha_hora
		");
		if ($mysqli->error) { die($mysqli->error); }
		?>
		<tr><td align="center">
			<table border="1" cellpadding="2" cellspacing="0" style="font-size:10;">
		<?php
		while ($rF = $qF->fetch_object()) {
			if ($rF->inout_mode == "0") {
				$rF->mov_e = "Entrada";
				$rF->mov_s = "";
			} else {
				$rF->mov_e = "";
				$rF->mov_s = "Salida";
			}
			?>
				<tr>
					<td><?php echo $rF->mov_e; ?></td>
					<td><?php echo $rF->fecha_hora; ?></td>
					<td><?php echo $rF->mov_s; ?></td>
				</tr>
			<?php
		}
		?>
		</table>
		</tr></td>
		</table>
		<?php
	}
} ELSE {
?>
<form>
	<table border="1" cellspacing="0" cellpadding="2" width="100%" >
		<tr>
			<td>Desde: <input type="text" name="DESDE" /></td>
			<td>Hasta: <input type="text" name="HASTA" /></td>
			<td>Usuario:
				<select name="USUARIO">
				<option value="">TODOS</option>
				<?php
				$q = $mysqli->query("
				SELECT * FROM empleado WHERE empleado.enabled = 1 ORDER BY name
				");				
				while ($r = $q->fetch_object()) {
					?>
						<option value="<?php echo $r->id_empleado; ?>"><?php echo $r->name; ?></option>
					<?php
				}
				?>
				</select>
			</td>
			<td><input type="submit" value="Ver" /></td>
		</tr>
	</table>
</form>
<?php
}
?>