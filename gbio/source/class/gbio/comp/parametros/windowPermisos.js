qx.Class.define("gbio.comp.parametros.windowPermisos",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Permisos",
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
	
	var functionActualizar = function(id_permiso) {
		var p = {};
		p.todos = true;
		p.id_lugar_trabajo = application.usuario.id_lugar_trabajo;
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
		try {
			var resultado = rpc.callSync("leer_permisos", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}

		tbl.setFocusedCell();
		tableModel.setDataAsMapArray(resultado, true);
		if (id_permiso) {
			tbl.buscar("id_permiso", id_permiso);
		} else if (tableModel.getRowCount() > 0) tbl.setFocusedCell(0, 0, true);
	}.bind(this);
		
		

	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowPermiso(null);
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
		
		var win = new gbio.comp.parametros.windowPermiso(rowData);
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
	var btnAgregar = new qx.ui.menu.Button("Agregar permiso", null, commandAgregar);
	var btnCambiar = new qx.ui.menu.Button("Modificar...", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnCambiar);
	menu.memorizar();

		
		
		
		//Tabla

		var tableModel = new qx.ui.table.model.Simple();
		//tableModel.setColumns(["Descripción", "Lugar trab.", "entrada_extras", "e_fichada", "e_tolerable", "e_tardanza", "salida_extras", "s_fichada", "s_tolerable", "s_abandono", "desde", "hasta"], ["descrip", "lugar_trabajo_descrip", "entrada_extras", "e_fichada", "e_tolerable", "e_tardanza", "salida_extras", "s_fichada", "s_tolerable", "s_abandono", "desde", "hasta"]);
		tableModel.setColumns(["Descripción", "Lugar de trabajo", "Entrada", "Salida", "Pagas", "Activo", "Hora límite", "1er.aviso", "2do.aviso"], ["descrip", "id_lugar_trabajo", "entrada", "salida", "pagas", "activo", "hora_asignacion_limite", "primer_aviso", "segundo_aviso"]);
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
		resizeBehavior.set(0, {width:"20%", minWidth:100});
		resizeBehavior.set(1, {width:"20%", minWidth:100});
		

		var cellrendererBool = new qx.ui.table.cellrenderer.Boolean();
		tableColumnModel.setDataCellRenderer(2, cellrendererBool);
		tableColumnModel.setDataCellRenderer(3, cellrendererBool);
		tableColumnModel.setDataCellRenderer(4, cellrendererBool);
		tableColumnModel.setDataCellRenderer(5, cellrendererBool);
		
		var cellrendererReplace = new qx.ui.table.cellrenderer.Replace();
		var aux = {};
		for (var x in application.usuario.lugar_trabajo) aux[application.usuario.lugar_trabajo[x].id_lugar_trabajo] = application.usuario.lugar_trabajo[x].descrip;
		cellrendererReplace.setReplaceMap(aux);
		tableColumnModel.setDataCellRenderer(1, cellrendererReplace);
		

		
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