qx.Class.define("gbio.comp.parametros.windowPermisos",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
		this.base(arguments);

	this.set({
		caption: "Permisos",
		width: 600,
		height: 400,
		showMinimize: false,
		showMaximize: false
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		tbl.focus();
	});
	
	
	
	
	var application = qx.core.Init.getApplication();
		
		

	var commandAgregar = new qx.ui.command.Command("Insert");
	commandAgregar.addListener("execute", function(e){
		btnAceptar.setEnabled(true);
		var id_lugar_trabajo = (application.usuario.lugar_trabajo.length > 0) ? application.usuario.lugar_trabajo[0].id_lugar_trabajo : null;
		tableModel.addRowsAsMapArray([{id_permiso: "0", descrip: "Nuevo permiso", id_lugar_trabajo: id_lugar_trabajo, entrada: false, salida: false, pagas: false, activo: true, alta: true}], null, true);
		tbl.setFocusedCell(0, tableModel.getRowCount() - 1, true);
		tbl.startEditing();
	});
	var commandEditar = new qx.ui.command.Command("F2");
	commandEditar.setEnabled(false);
	commandEditar.addListener("execute", function(e){
		tbl.startEditing();
	});
	
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnAgregar = new qx.ui.menu.Button("Agregar permiso", null, commandAgregar);
	var btnCambiar = new qx.ui.menu.Button("Editar", null, commandEditar);
	menu.add(btnAgregar);
	menu.addSeparator();
	menu.add(btnCambiar);
	menu.memorizar();

		
		
		
		//Tabla

		var tableModel = new qx.ui.table.model.Filtered();
		tableModel.setColumns(["Descripción", "Lugar de trabajo", "Entrada", "Salida", "Pagas", "Activo"], ["descrip", "id_lugar_trabajo", "entrada", "salida", "pagas", "activo"]);
		tableModel.setEditable(true);
		//tableModel.setColumnEditable(0, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tbl = new componente.comp.ui.ramon.table.Table(tableModel, custom);
		tbl.setShowCellFocusIndicator(true);
		tbl.toggleColumnVisibilityButtonVisible();
		tbl.toggleStatusBarVisible();
		tbl.setContextMenu(menu);
		
		tbl.addListener("dataEdited", function(e){
			var focusedRow = tbl.getFocusedRow();
			var original = tableModel.getRowData(focusedRow);
			var actual = tableModel.getRowDataAsMap(focusedRow);
			for (var x in actual) {
				original[x] = actual[x];
			}
			//original.descrip = actual.descrip;
			//original.host = actual.host;
			original.modificado = true;
			tableModel.setRowsAsMapArray([original], focusedRow, true);
			btnAceptar.setEnabled(true);
		});
		
		var tableColumnModel = tbl.getTableColumnModel();
		var resizeBehavior = tableColumnModel.getBehavior();
		resizeBehavior.set(0, {width:"30%", minWidth:100});
		resizeBehavior.set(1, {width:"30%", minWidth:100});
		

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
		

		var celleditorText = new qx.ui.table.celleditor.TextField();
		celleditorText.setValidationFunction(function(newValue, oldValue){
			newValue = newValue.trim();
			if (newValue=="") return oldValue; else return newValue;
		});
		tableColumnModel.setCellEditorFactory(0, celleditorText);
		
		
		var aux = [];
		for (var x in application.usuario.lugar_trabajo) aux.push([application.usuario.lugar_trabajo[x].descrip, null, application.usuario.lugar_trabajo[x].id_lugar_trabajo]);
		var celleditorSelectBox = new qx.ui.table.celleditor.SelectBox();
		celleditorSelectBox.setListData(aux);
		tableColumnModel.setCellEditorFactory(1, celleditorSelectBox);
		
		
		var celleditorChk = new qx.ui.table.celleditor.CheckBox();
		tableColumnModel.setCellEditorFactory(2, celleditorChk);
		tableColumnModel.setCellEditorFactory(3, celleditorChk);
		tableColumnModel.setCellEditorFactory(4, celleditorChk);
		tableColumnModel.setCellEditorFactory(5, celleditorChk);
		

		
		var selectionModel = tbl.getSelectionModel();
		selectionModel.setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		selectionModel.addListener("changeSelection", function(){
			var bool = (selectionModel.getSelectedCount() > 0);
			commandEditar.setEnabled(bool);
			menu.memorizar([commandEditar]);
		});
		
		
		
		this.add(tbl, {left: 0, top: 0, right: 0, bottom: 35});
		

		
		
		
		
		

		var commandEsc = new qx.ui.command.Command("Esc");
		this.registrarCommand(commandEsc);
		commandEsc.addListener("execute", function(e){
			if (tbl.isEditing()) {
				tbl.cancelEditing();
				tbl.focus();
			} else btnCancelar.execute();
		});
		
		var btnAceptar = new qx.ui.form.Button("Aceptar");
		btnAceptar.setEnabled(false);
		btnAceptar.addListener("execute", function(e){
			var enviar = false;
			var cambios = {altas: [], modificados: []};
			for (var i=0; i < tableModel.getRowCount(); i++) {
				var row = tableModel.getRowData(i);
				if (row.alta) {
					cambios.altas.push(row);
					enviar = true;
				} else if (row.modificado) {
					cambios.modificados.push(row);
					enviar = true;
				}
			}
			if (enviar) {
				var p = {};
				p.cambios = cambios;

				var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
				try {
					var resultado = rpc.callSync("escribir_permisos", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
			}
			
			btnCancelar.execute();
		}, this);

		var btnCancelar = new qx.ui.form.Button("Cancelar");
		btnCancelar.addListener("execute", function(e){
			this.destroy();
		}, this);
		
		this.add(btnAceptar, {left: "35%", bottom: 0});
		this.add(btnCancelar, {right: "35%", bottom: 0});
		
		var p = {};
		p.todos = true;
		p.id_lugar_trabajo = application.usuario.id_lugar_trabajo;
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		try {
			var resultado = rpc.callSync("leer_permisos", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}

		tableModel.setDataAsMapArray(resultado, true);

		if (tableModel.getRowCount() > 0) tbl.setFocusedCell(0, 0, true);
		

	
		
		
	},
	members : 
	{

	}
});