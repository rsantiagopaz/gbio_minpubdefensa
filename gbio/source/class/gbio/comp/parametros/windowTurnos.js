qx.Class.define("gbio.comp.parametros.windowTurnos",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Turnos",
		width: 850,
		height: 500,
		showMinimize: false,
		showMaximize: false
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		tbl.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
		
	
	var functionActualizar = function(e) {
		var p = {};
		p.todos = true;
		p.id_lugar_trabajo = application.usuario.id_lugar_trabajo;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		try {
			var resultado = rpc.callSync("leer_turnos", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}

		tableModel.setDataAsMapArray(resultado, true);
	}


	
	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		var window = new gbio.comp.parametros.windowTurno(null);
		window.addListener("aceptado", function(e){
			functionActualizar();
		});
		window.setModal(true);
		application.getRoot().add(window);
		window.center();
		window.open();
	});
	var commandEditar = new qx.ui.command.Command("Enter");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		var rowData = tableModel.getRowData(tbl.getFocusedRow());
		
		var window = new gbio.comp.parametros.windowTurno(rowData);
		window.addListener("aceptado", function(e){
			functionActualizar();
		});
		window.setModal(true);
		application.getRoot().add(window);
		window.center();
		window.open();
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Agregar turno", null, commandAgregar);
	var btnCambiar = new qx.ui.menu.Button("Modificar...", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnCambiar);
	menu.memorizar();

		
		
		
		//Tabla

		var tableModel = new qx.ui.table.model.Simple();
		tableModel.setColumns(["Descripción", "Lugar de trabajo", "Activo", "Tipo", "Entrada", "Salida", "Horas", "Lunes", "Martes", "Mierc.", "Jueves", "Viernes", "Sabad.", "Domin."], ["descrip", "lugar_trabajo_descrip", "activo", "tipo", "entrada", "salida", "cant_horas", "lu", "ma", "mi", "ju", "vi", "sa", "do"]);
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
		resizeBehavior.set(0, {width:"15%", minWidth:100});
		resizeBehavior.set(1, {width:"15%", minWidth:100});
		

		var cellrendererBool = new qx.ui.table.cellrenderer.Boolean();
		tableColumnModel.setDataCellRenderer(2, cellrendererBool);
		tableColumnModel.setDataCellRenderer(7, cellrendererBool);
		tableColumnModel.setDataCellRenderer(8, cellrendererBool);
		tableColumnModel.setDataCellRenderer(9, cellrendererBool);
		tableColumnModel.setDataCellRenderer(10, cellrendererBool);
		tableColumnModel.setDataCellRenderer(11, cellrendererBool);
		tableColumnModel.setDataCellRenderer(12, cellrendererBool);
		tableColumnModel.setDataCellRenderer(13, cellrendererBool);

		
		var cellrendererTipo = new qx.ui.table.cellrenderer.Replace();
		cellrendererTipo.setReplaceFunction(function(newValue){
			if (newValue=="F") return "Fijo";
			if (newValue=="X") return "Flexible";
			if (newValue=="V") return "Variable";
		});
		tableColumnModel.setDataCellRenderer(3, cellrendererTipo);

		
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
			btnCancelar.execute();
		});
		

		var btnCancelar = new qx.ui.form.Button("Cerrar");
		btnCancelar.addListener("execute", function(e){
			this.destroy();
		}, this);
		
		//this.add(btnCancelar, {left: 150, bottom: 10});
		

		functionActualizar();

		if (tableModel.getRowCount() > 0) tbl.setFocusedCell(0, 0, true);
		

	
		
		
	},
	members : 
	{

	}
});