qx.Class.define("gbio.comp.empleados.pageEmpleados",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);
	
	this.setLabel('Empleados');
	this.setLayout(new qx.ui.layout.Grow());
	this.toggleShowCloseButton();
	
	this.addListenerOnce("appear", function(e){
		tblPedido.focus();
	});
	
	var application = qx.core.Init.getApplication();
	

	
	var functionActualizar = function(id) {
		var p = {};
		p.id_lugar_trabajo = application.usuario.id_lugar_trabajo;
		
		//alert(qx.lang.Json.stringify(p, null, 2));
		
		//var rpc = new qx.io.remote.Rpc("services/", "comp.Empleados");
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Empleados");
		try {
			var resultado = rpc.callSync("leer_empleados", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		
		//alert(qx.lang.Json.stringify(resultado, null, 2));
		
		/*
		var ano, mes, dia;
		for (var x in resultado) {
			if (resultado[x].nacimiento != null) {
				ano = parseInt(resultado[x].nacimiento.substr(0, 4));
				mes = parseInt(resultado[x].nacimiento.substr(5, 2)) - 1;
				dia = parseInt(resultado[x].nacimiento.substr(8, 2));
				resultado[x].nacimiento = new Date(ano, mes, dia);
			}
			
			if (resultado[x].ingreso != null) {
				ano = parseInt(resultado[x].ingreso.substr(0, 4));
				mes = parseInt(resultado[x].ingreso.substr(5, 2)) - 1;
				dia = parseInt(resultado[x].ingreso.substr(8, 2));
				resultado[x].ingreso = new Date(ano, mes, dia);
			}
			
			if (resultado[x].contrato_desde != null) {
				ano = parseInt(resultado[x].contrato_desde.substr(0, 4));
				mes = parseInt(resultado[x].contrato_desde.substr(5, 2)) - 1;
				dia = parseInt(resultado[x].contrato_desde.substr(8, 2));
				resultado[x].contrato_desde = new Date(ano, mes, dia);
			}
			
			if (resultado[x].contrato_hasta != null) {
				ano = parseInt(resultado[x].contrato_hasta.substr(0, 4));
				mes = parseInt(resultado[x].contrato_hasta.substr(5, 2)) - 1;
				dia = parseInt(resultado[x].contrato_hasta.substr(8, 2));
				resultado[x].contrato_hasta = new Date(ano, mes, dia);
			}
		}
		*/
	
		tableModelPedido.setDataAsMapArray(resultado, true, true)
		tblPedido.buscar("id_empleado", id);
	}
	

	var commandNuevoPedido = new qx.ui.command.Command("Insert");
	commandNuevoPedido.addListener("execute", function(){
		var win = new gbio.comp.empleados.windowEmpleado(null);
		win.addListener("aceptado", function(e){
			functionActualizar(e.getData());
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var commandModificar = new qx.ui.command.Command("Enter");
	commandModificar.addListener("execute", function(){
		var rowData = tableModelPedido.getRowData(tblPedido.getFocusedRow());
		var win = new gbio.comp.empleados.windowDatos(rowData);
		win.addListener("aceptado", function(e){
			var data = e.getData();
			
			functionActualizar(data);
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	var menutblPedido = new componente.comp.ui.ramon.menu.Menu();
	var btnNuevoPedido = new qx.ui.menu.Button("Nuevo empleado...", null, commandNuevoPedido);
	var btnModificar = new qx.ui.menu.Button("Modificar datos...", null, commandModificar);
	
	
	//menutblPedido.add(btnNuevoPedido);
	//menutblPedido.addSeparator();
	menutblPedido.add(btnModificar);
	menutblPedido.memorizar();
	commandNuevoPedido.setEnabled(false);

		
	
	//Tabla

	var tableModelPedido = new qx.ui.table.model.Simple();
	tableModelPedido.setColumns(["Apellido, Nombre", "DNI", "Nombre corto", "Legajo", "Lugar de trabajo", "Tolerancia"], ["apenom", "nro_doc", "name", "enroll_number", "lugar_trabajo_descrip", "tolerancia_descrip"]);
	//tableModelPedido.setColumns(["Fecha", "Fábrica"], ["fecha", "id_fabrica"]);
	//tableModelPedido.setEditable(true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblPedido = new componente.comp.ui.ramon.table.Table(tableModelPedido, custom);
	tblPedido.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
	tblPedido.setShowCellFocusIndicator(false);
	tblPedido.toggleColumnVisibilityButtonVisible();
	tblPedido.toggleStatusBarVisible();
	
	tblPedido.addListener("cellDbltap", function(e){
		commandModificar.fireDataEvent("execute");
	});
	
	
	var tableColumnModelPedido = tblPedido.getTableColumnModel();
	//tableColumnModelPedido.setColumnWidth(0, 65);
	//tableColumnModelPedido.setColumnWidth(1, 65);


	var selectionModelPedido = tblPedido.getSelectionModel();

	selectionModelPedido.addListener("changeSelection", function(e){
		if (! selectionModelPedido.isSelectionEmpty()) {

		}
	});

	tblPedido.setContextMenu(menutblPedido);
	

	//this.add(tblPedido, {left:0 , top: 20, right: "77%", bottom: "30%"});
	this.add(tblPedido);
	
	


	
	
	functionActualizar();
	if (tableModelPedido.getRowCount() > 0) tblPedido.setFocusedCell(1, 0, true);


	
	},
	members : 
	{

	}
});