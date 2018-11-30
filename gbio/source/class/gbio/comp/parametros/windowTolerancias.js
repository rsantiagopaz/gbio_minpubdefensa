qx.Class.define("gbio.comp.parametros.windowTolerancias",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Tolerancias",
		width: 900,
		height: 500,
		showMinimize: false,
		showMaximize: false
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		tbl.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var formatDate = new qx.util.format.DateFormat("dd/MM/y");
	
	
	var functionActualizar = function(id_tolerancia) {
		var p = {id_lugar_trabajo: application.usuario.id_lugar_trabajo};
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
		try {
			var resultado = rpc.callSync("leer_tolerancias", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		

		tbl.setFocusedCell();
		tableModel.setDataAsMapArray(resultado, true);
		if (id_tolerancia) {
			tbl.buscar("id_tolerancia", id_tolerancia);
		} else if (tableModel.getRowCount() > 0) tbl.setFocusedCell(0, 0, true);
	}.bind(this);
		
		

	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowTolerancia(null);
		win.addListener("aceptado", function(e){
			functionActualizar(e.getData());
		});
		win.addListener("disappear", function(e){
			tbl.focus();
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	var commandEditar = new qx.ui.command.Command("Enter");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		var rowData = tableModel.getRowData(tbl.getFocusedRow());
		
		var win = new gbio.comp.parametros.windowTolerancia(rowData);
		win.addListener("aceptado", function(e){
			functionActualizar(e.getData());
		});
		win.addListener("disappear", function(e){
			tbl.focus();
		});
		win.setModal(true);
		application.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Agregar tolerancia", null, commandAgregar);
	var btnCambiar = new qx.ui.menu.Button("Modificar...", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnCambiar);
	menu.memorizar();

		
		
		
		//Tabla

		var tableModel = new qx.ui.table.model.Simple();
		//tableModel.setColumns(["Descripción", "Lugar trab.", "entrada_extras", "e_fichada", "e_tolerable", "e_tardanza", "salida_extras", "s_fichada", "s_tolerable", "s_abandono", "desde", "hasta"], ["descrip", "lugar_trabajo_descrip", "entrada_extras", "e_fichada", "e_tolerable", "e_tardanza", "salida_extras", "s_fichada", "s_tolerable", "s_abandono", "desde", "hasta"]);
		tableModel.setColumns(["Descripción", "Lugar trab.", "H.ext.ent.", "Ent.normal", "Ent.tolerable", "Ent.tardanza", "H.ext.sal.", "Sal.normal", "Sal.tolerable", "Abandono", "desde", "hasta"], ["descrip", "lugar_trabajo_descrip", "entrada_extras", "e_fichada", "e_tolerable", "e_tardanza", "salida_extras", "s_fichada", "s_tolerable", "s_abandono", "desde", "hasta"]);
		//tableModel.setEditable(true);
		//tableModel.setColumnEditable(0, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
		tbl.setShowCellFocusIndicator(false);
		tbl.toggleColumnVisibilityButtonVisible();
		tbl.toggleStatusBarVisible();
		
		tbl.addListener("cellDbltap", function(e){
			commandEditar.fireDataEvent("execute");
		});
		
		var tableColumnModel = tbl.getTableColumnModel();
		var resizeBehavior = tableColumnModel.getBehavior();
		resizeBehavior.set(0, {width:"12%", minWidth:100});
		resizeBehavior.set(1, {width:"12%", minWidth:100});
		resizeBehavior.set(10, {width:"8%", minWidth:100});
		resizeBehavior.set(11, {width:"8%", minWidth:100});
		

		var cellrendererBool = new qx.ui.table.cellrenderer.Boolean();
		tableColumnModel.setDataCellRenderer(2, cellrendererBool);
		tableColumnModel.setDataCellRenderer(6, cellrendererBool);
		
		var cellrendererDate = new qx.ui.table.cellrenderer.Date();
		cellrendererDate.setDateFormat(formatDate);
		tableColumnModel.setDataCellRenderer(10, cellrendererDate);
		tableColumnModel.setDataCellRenderer(11, cellrendererDate);

		
		var selectionModel = tbl.getSelectionModel();
		selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		selectionModel.addListener("changeSelection", function(){
			var bool = (selectionModel.getSelectedCount() > 0);
			commandEditar.setEnabled(bool);
			menu.memorizar([commandEditar]);
		});
		
		
		
		
		

		tbl.setContextMenu(menu);

		
		
		this.add(tbl, {left: 0, top: 0, right: 0, bottom: 0});
		
		tbl.addListener("dataEdited", function(e){
			var focusedRow = tbl.getFocusedRow();
			var original = tableModel.getRowData(focusedRow);
			var actual = tableModel.getRowDataAsMap(focusedRow);
			original.descrip = actual.descrip;
			original.host = actual.host;
			original.modificado = true;
			tableModel.setRowsAsMapArray([original], focusedRow, true);
		});
		
		
		
		
		

		var commandEsc = new qx.ui.command.Command("Esc");
		this.registrarCommand(commandEsc);
		commandEsc.addListener("execute", function(e){
			if (!tbl.isEditing()) btnCancelar.fireEvent("execute");
		});
		

		var btnCancelar = new qx.ui.form.Button("Cerrar");
		btnCancelar.addListener("execute", function(e){
			this.destroy();
		}, this);
		
		//this.add(btnCancelar, {left: 150, bottom: 10});
		

		functionActualizar(null);
	
		
	},
	members : 
	{

	}
});