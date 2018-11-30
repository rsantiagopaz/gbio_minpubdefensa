qx.Class.define("gbio.comp.parametros.windowUsuarios",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (appMain)
	{
		this.base(arguments);

	this.set({
		caption: "Usuarios",
		width: 400,
		height: 400,
		showMinimize: false,
		showMaximize: false
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		tbl.focus();
	});
		
	
	var functionActualizar = function(e) {
		var p = {todos: true};
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		try {
			var resultado = rpc.callSync("leer_usuarios", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}

		tableModel.setDataAsMapArray(resultado, true);
	}


	
	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowUsuario(appMain, null);
		win.addListener("aceptado", function(e){
			functionActualizar();
		});
		win.setModal(true);
		appMain.getRoot().add(win);
		win.center();
		win.open();
	});
	var commandEditar = new qx.ui.command.Command("Enter");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		var rowData = tableModel.getRowData(tbl.getFocusedRow());
		
		var win = new gbio.comp.parametros.windowUsuario(appMain, rowData);
		win.addListener("aceptado", function(e){
			functionActualizar();
		});
		win.setModal(true);
		appMain.getRoot().add(win);
		win.center();
		win.open();
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Agregar usuario", null, commandAgregar);
	var btnCambiar = new qx.ui.menu.Button("Modificar...", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnCambiar);
	menu.memorizar();

		
		
		
		//Tabla

		var tableModel = new qx.ui.table.model.Simple();
		tableModel.setColumns(["Descripción"], ["usuario"]);
		//tableModel.setEditable(true);
		//tableModel.setColumnEditable(0, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
		tbl.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		tbl.setShowCellFocusIndicator(false);
		tbl.toggleColumnVisibilityButtonVisible();
		tbl.toggleStatusBarVisible();
		
		tbl.addListener("cellDbltap", function(e){
			commandEditar.fireDataEvent("execute");
		});
		
		var tableColumnModel = tbl.getTableColumnModel();
		var resizeBehavior = tableColumnModel.getBehavior();
		//resizeBehavior.set(0, {width:"60%", minWidth:100});
		//resizeBehavior.set(1, {width:"40%", minWidth:100});
		

		
		var selectionModel = tbl.getSelectionModel();
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
		

		functionActualizar();

		if (tableModel.getRowCount() > 0) tbl.setFocusedCell(0, 0, true);
		

	
		
		
	},
	members : 
	{

	}
});