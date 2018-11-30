qx.Class.define("gbio.comp.empleados.pageAsignaciones",
{
	extend : qx.ui.tabview.Page,
	construct : function ()
	{
	this.base(arguments);
	
	this.setLabel('Asignaciones');
	this.setLayout(new qx.ui.layout.Canvas());
	this.toggleShowCloseButton();
	
	this.addListenerOnce("appear", function(){
		slbLugarTrabajo.focus();
	});

	var application = qx.core.Init.getApplication();
	
	var formatDate = new qx.util.format.DateFormat("d/M/y");
	
	
	var functionActualizar = function(id_lugar_trabajo) {
		var root = application.getRoot();
		root.block();
		
		var bounds = root.getBounds();
		var imageLoading = new qx.ui.basic.Image("gbio/loading66.gif");
		imageLoading.setBackgroundColor("#FFFFFF");
		imageLoading.setDecorator("main");
		root.add(imageLoading, {left: parseInt(bounds.width / 2 - 33), top: parseInt(bounds.height / 2 - 33)});
		
		var p = {};
		p.id_lugar_trabajo = id_lugar_trabajo;
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Empleados");
		rpc.callAsync(function(resultado, error, id) {
			//alert(qx.lang.Json.stringify(resultado, null, 2));
			
			tableModelEmpleados.setDataAsMapArray(resultado, true);
			selectionModelEmpleados.fireEvent("changeSelection");
			
			imageLoading.destroy();
			root.unblock();
		}, "leer_asignaciones", p);
	}
	
	var functionReviver = function(key, value) {
	    if (value && typeof value === "string") {
			if (value.substr(4, 1) == "-" && value.substr(7, 1) == "-" && (value.length == 10 || value.length == 19)) {
				var m = [];
				m[1] = parseInt(value.substr(0, 4));
				m[2] = parseInt(value.substr(5, 2)) - 1;
				m[3] = parseInt(value.substr(8, 2));
				if (value.length == 19) {
					m[4] = parseInt(value.substr(11, 2));
					m[5] = parseInt(value.substr(14, 2));
					m[6] = parseInt(value.substr(17, 2));
				} else {
					m[4] = 0;
					m[5] = 0;
					m[6] = 0;
				}
				
				return new Date(m[1],m[2],m[3],m[4],m[5],m[6]);
			}
	    }
	    return value;
	}
	
	var functionReplacer = function(key, value) {
	  value = this[key];
	
	  if (qx.lang.Type.isDate(value)) {
	    var dateParams =
	      value.getFullYear() + "-" +
	      qx.lang.String.pad((value.getMonth() + 1).toString(), 2, "0") + "-" +
	      qx.lang.String.pad(value.getDate().toString(), 2, "0") + " " +
	      qx.lang.String.pad(value.getHours().toString(), 2, "0") + ":" +
	      qx.lang.String.pad(value.getMinutes().toString(), 2, "0") + ":" +
	      qx.lang.String.pad(value.getSeconds().toString(), 2, "0");
	    return dateParams;
	  }
	  return value;
	}

	
	

	var stack1 = new qx.ui.container.Stack();
	var composite1 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	var composite2 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	var composite3 = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
	stack1.add(composite3);
	stack1.add(composite1);
	stack1.add(composite2);
	
	
	var toolbar1 = new qx.ui.toolbar.ToolBar();
	var rb1 = new qx.ui.toolbar.RadioButton(" Turnos ");
	var rb2 = new qx.ui.toolbar.RadioButton(" Permisos ");
	var rb3 = new qx.ui.toolbar.RadioButton(" Relojes ");
	rb1.addListener("execute", function(){stack1.setSelection([composite1]);});
	rb2.addListener("execute", function(){stack1.setSelection([composite2]);});
	rb3.addListener("execute", function(){stack1.setSelection([composite3]);});
	toolbar1.add(rb3);
	toolbar1.add(rb1);
	toolbar1.add(rb2);
	
	var radioGroup1 = new qx.ui.form.RadioGroup(rb3, rb1, rb2);
	this.add(stack1, {left: "41%", top: 31, right: 0, bottom: 0});
	this.add(toolbar1, {left: "41%", top: 0});
	
	
	
	
	
	
	var commandSelTodo = new qx.ui.command.Command("Ctrl+E");
	commandSelTodo.addListener("execute", function(){
		selectionModelEmpleados.setSelectionInterval(0, tableModelEmpleados.getRowCount() - 1);
	});
	
	var menutblEmpleados = new componente.comp.ui.ramon.menu.Menu();
	var btnSelTodo = new qx.ui.menu.Button("Seleccionar todo", null, commandSelTodo);
	
	menutblEmpleados.add(btnSelTodo);
	menutblEmpleados.memorizar();
	commandSelTodo.setEnabled(false);
	
	
	//Tabla

	var tableModelEmpleados = new qx.ui.table.model.Simple();
	tableModelEmpleados.setColumns(["Apellido, Nombre", "Nombre corto", "Legajo"], ["apenom", "name", "enroll_number"]);
	//tableModelPedido.setColumns(["Fecha", "Fábrica"], ["fecha", "id_fabrica"]);
	//tableModelPedido.setEditable(true);

	var custom = {tableColumnModel : function(obj) {
		return new qx.ui.table.columnmodel.Resize(obj);
	}};
	
	var tblEmpleados = new componente.comp.ui.ramon.table.Table(tableModelEmpleados, custom);
	tblEmpleados.setWidth(250);
	tblEmpleados.modo = "normal";
	tblEmpleados.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);
	tblEmpleados.setShowCellFocusIndicator(false);
	tblEmpleados.toggleColumnVisibilityButtonVisible();
	tblEmpleados.setAdditionalStatusBarText("0 de 0 seleccionados");
	//tblPedido.toggleStatusBarVisible();
	
	
	var tableColumnModelEmpleados = tblEmpleados.getTableColumnModel();
	var resizeBehavior = tableColumnModelEmpleados.getBehavior();
	resizeBehavior.set(0, {width:"55%", minWidth:100});
	resizeBehavior.set(1, {width:"30%", minWidth:100});
	resizeBehavior.set(2, {width:"15%", minWidth:100});
	//tableColumnModelPedido.setColumnWidth(0, 65);
	//tableColumnModelPedido.setColumnWidth(1, 65);


	var selectionModelEmpleados = tblEmpleados.getSelectionModel();
	selectionModelEmpleados.addListener("changeSelection", function(e){
		var rowCount = tableModelEmpleados.getRowCount();
		tblEmpleados.setAdditionalStatusBarText(selectionModelEmpleados.getSelectedCount() + " de " + rowCount + " seleccionados");
		if (rowCount == 0 || selectionModelEmpleados.isSelectionEmpty()) {
			tableModelTurnos.setDataAsMapArray([], true);
			tableModelPermisos.setDataAsMapArray([], true);
			tableModelRelojes.setDataAsMapArray([], true);
			
			slbTurno2.removeAll();
			
			btnAgregar1.setEnabled(false);
			btnAgregar2.setEnabled(false);
			btnAgregar3.setEnabled(false);
		} else {
			var bandera;
			var aux;
			var data1 = [];
			var data2 = [];
			var data3 = [];
			
			btnAgregar1.setEnabled(true);
			btnAgregar2.setEnabled(true);
			btnAgregar3.setEnabled(true);
			tblTurnos.setFocusedCell();
			tblPermisos.setFocusedCell();
			tblRelojes.setFocusedCell();
	
			selectionModelEmpleados.iterateSelection(function(index) {
				var rowData = tableModelEmpleados.getRowData(index);
				for (var x in rowData.turnos) {
					bandera = true;
					for (var y in data1) {
						if (data1[y].id_turno == rowData.turnos[x].id_turno && data1[y].desde == rowData.turnos[x].desde && data1[y].hasta == rowData.turnos[x].hasta) {
							bandera = false;
							data1[y].id_empleado_turno.push(rowData.turnos[x].id_empleado_turno);
						}
					}
					if (bandera) {
						aux = qx.lang.Json.parse(qx.lang.Json.stringify(rowData.turnos[x], functionReplacer), functionReviver);
						aux.id_empleado_turno = [aux.id_empleado_turno];
						data1.push(aux);
					}
				}
				
				
				for (var x in rowData.permisos) {
					bandera = true;
					for (var y in data2) {
						if (data2[y].id_permiso == rowData.permisos[x].id_permiso && data2[y].id_turno == rowData.permisos[x].id_turno && data2[y].desde == rowData.permisos[x].desde && data2[y].hasta == rowData.permisos[x].hasta && data2[y].fecha == rowData.permisos[x].fecha) {
							bandera = false;
							data2[y].id_empleado_permiso.push(rowData.permisos[x].id_empleado_permiso);
						}
					}
					if (bandera) {
						aux = qx.lang.Json.parse(qx.lang.Json.stringify(rowData.permisos[x], functionReplacer), functionReviver);
						aux.id_empleado_permiso = [aux.id_empleado_permiso];
						data2.push(aux);
					}
				}
				
				
				for (var x in rowData.relojes) {
					bandera = true;
					for (var y in data3) {
						if (data3[y].id_reloj == rowData.relojes[x].id_reloj) {
							bandera = false;
							data3[y].id_empleado_reloj.push(rowData.relojes[x].id_empleado_reloj);
						}
					}
					if (bandera) {
						aux = qx.lang.Json.parse(qx.lang.Json.stringify(rowData.relojes[x], functionReplacer), functionReviver);
						aux.id_empleado_reloj = [aux.id_empleado_reloj];
						data3.push(aux);
					}
				}
			});
			
			//alert(qx.lang.Json.stringify(data1, null, 2));
			
			tableModelTurnos.setDataAsMapArray(data1, true);
			tableModelPermisos.setDataAsMapArray(data2, true);
			tableModelRelojes.setDataAsMapArray(data3, true);
			
			slbTurno2.removeAll();
			//alert(qx.lang.Json.stringify(data1, null, 2));
			for (var y in data1) {
				aux = new qx.ui.form.ListItem(data1[y].turno + " (" + formatDate.format(data1[y].desde) + ((data1[y].hasta == null) ? "" : " - " + formatDate.format(data1[y].hasta)) + ")" , null, data1[y].id_empleado_turno);
				slbTurno2.add(aux);
			}
		}
	});

	tblEmpleados.setContextMenu(menutblEmpleados);
	

	this.add(tblEmpleados, {left:0, right: "60%", top: 31, bottom: 0});
	this.add(new qx.ui.basic.Label("Empleados:"), {left: 0, top: 10});
	
	

	

	
	var mnutblTurnos = new componente.comp.ui.ramon.menu.Menu();
	var btnEliminarTurno = new qx.ui.menu.Button("Eliminar asignación");
	btnEliminarTurno.setEnabled(false);
	btnEliminarTurno.addListener("execute", function(e){
		/*
		dialog.Dialog.confirm("Desea eliminar este item? Se eliminarán también los permisos relacionados.", function(e){
			if (e) {
				var p = {id_empleado_turno: tableModelTurnos.getRowData(tblTurnos.getFocusedRow()).id_empleado_turno};
			
				var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Empleados");
				try {
					var resultado = rpc.callSync("eliminar_turno", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				functionActualizar([slbLugarTrabajo.getModelSelection().getItem(0)]);
			}
		});
		*/
		
		(new dialog.Confirm({
		        "message"   : "Desea eliminar el item seleccionado? Se eliminarán también los permisos relacionados.",
		        "callback"  : function(e){
									if (e) {
										var p = {id_empleado_turno: tableModelTurnos.getRowData(tblTurnos.getFocusedRow()).id_empleado_turno};
									
										var rpc = new qx.io.remote.Rpc("services/", "comp.Empleados");
										try {
											var resultado = rpc.callSync("eliminar_turno", p);
										} catch (ex) {
											alert("Sync exception: " + ex);
										}
										functionActualizar([slbLugarTrabajo.getModelSelection().getItem(0)]);
									}
		        				},
		        "context"   : this,
		        "image"     : "icon/48/status/dialog-warning.png"
		})).show();
	});
	mnutblTurnos.add(btnEliminarTurno);
	mnutblTurnos.memorizar();
	
	
		//Tabla

		var tableModelTurnos = new qx.ui.table.model.Simple();
		tableModelTurnos.setColumns(["Turno", "Desde", "Hasta"], ["turno", "desde", "hasta"]);
		//tableModel.setEditable(true);
		//tableModel.setColumnEditable(0, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tblTurnos = new componente.comp.ui.ramon.table.Table(tableModelTurnos, custom);
		tblTurnos.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		tblTurnos.setShowCellFocusIndicator(false);
		tblTurnos.toggleColumnVisibilityButtonVisible();
		tblTurnos.toggleStatusBarVisible();
		
		var tableColumnModelTurnos = tblTurnos.getTableColumnModel();
		var resizeBehavior = tableColumnModelTurnos.getBehavior();
		resizeBehavior.set(0, {width:"58%", minWidth:100});
		resizeBehavior.set(1, {width:"21%", minWidth:100});
		resizeBehavior.set(2, {width:"21%", minWidth:100});
		
		var cellrendererDate = new qx.ui.table.cellrenderer.Date();
		cellrendererDate.setDateFormat(formatDate);
		tableColumnModelTurnos.setDataCellRenderer(1, cellrendererDate);
		tableColumnModelTurnos.setDataCellRenderer(2, cellrendererDate);
		
		var selectionModelTurnos = tblTurnos.getSelectionModel();
		selectionModelTurnos.addListener("changeSelection", function(e){
			var bool = (selectionModelTurnos.getSelectedCount() > 0);
			btnEliminarTurno.setEnabled(bool);
			mnutblTurnos.memorizar([btnEliminarTurno]);
		});
		
		tblTurnos.setContextMenu(mnutblTurnos);
		
		composite1.add(tblTurnos, {left: 0, top: 0, right: "41%", bottom: 0});
		
	

	var form1 = new qx.ui.form.Form();
		
	var gbxTurnos = new qx.ui.groupbox.GroupBox("Asignar turno");
	gbxTurnos.setLayout(new qx.ui.layout.Basic());

	var slbTurno1 = new qx.ui.form.SelectBox();
	slbTurno1.setRequired(true);
	slbTurno1.setWidth(200);
	form1.add(slbTurno1, "Turno", null, "id_turno");
	
	
	var txtDesde = new qx.ui.form.DateField();
	txtDesde.setRequired(true);
	txtDesde.setMaxWidth(100);
	form1.add(txtDesde, "Desde", null, "desde");
	
	var txtHasta = new qx.ui.form.DateField();
	txtHasta.setMaxWidth(100);
	form1.add(txtHasta, "Hasta", null, "hasta");
	
	var btnAgregar1 = new qx.ui.form.Button("Asignar");
	btnAgregar1.addListener("execute", function(e){
		if (form1.validate()) {
			var p = qx.util.Serializer.toNativeObject(controllerFormTurnos.getModel());
			p.id_empleado = [];
			selectionModelEmpleados.iterateSelection(function(index) {
				var rowData = tableModelEmpleados.getRowData(index);
				p.id_empleado.push(rowData.id_empleado);
			});
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Empleados");
			try {
				var resultado = rpc.callSync("asignar_turno", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			functionActualizar([slbLugarTrabajo.getModelSelection().getItem(0)]);
			form1.reset();
		} else {
			var items = form1.getItems();
			for (var item in items) {
				if (!items[item].isValid()) {
					items[item].focus();
					break;
				}
			}
		}
	});
	form1.addButton(btnAgregar1);
	
	gbxTurnos.add(new qx.ui.form.renderer.Single(form1));
	
	composite1.add(gbxTurnos, {left: "60%", right: 0, top: 0});
	
	var controllerFormTurnos = new qx.data.controller.Form(null, form1);
	controllerFormTurnos.createModel(true);
		

	
	
	
	
	
	
	
	var mnutblPermisos = new componente.comp.ui.ramon.menu.Menu();
	var btnEliminarPermiso = new qx.ui.menu.Button("Eliminar asignación");
	btnEliminarPermiso.setEnabled(false);
	btnEliminarPermiso.addListener("execute", function(e){
		/*
		dialog.Dialog.confirm("Dese eliminar este item?", function(e){
			if (e) {
				var p = {id_empleado_permiso: tableModelPermisos.getRowData(tblPermisos.getFocusedRow()).id_empleado_permiso};
				
				//alert(qx.lang.Json.stringify(p));
				
				var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Empleados");
				try {
					var resultado = rpc.callSync("eliminar_permiso", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				functionActualizar([slbLugarTrabajo.getModelSelection().getItem(0)]);
			}
		});
		*/
		
		(new dialog.Confirm({
		        "message"   : "Desea eliminar el item seleccionado?",
		        "callback"  : function(e){
									if (e) {
										var p = {id_empleado_permiso: tableModelPermisos.getRowData(tblPermisos.getFocusedRow()).id_empleado_permiso};
										
										var rpc = new qx.io.remote.Rpc("services/", "comp.Empleados");
										try {
											var resultado = rpc.callSync("eliminar_permiso", p);
										} catch (ex) {
											alert("Sync exception: " + ex);
										}
										functionActualizar([slbLugarTrabajo.getModelSelection().getItem(0)]);
									}
		        				},
		        "context"   : this,
		        "image"     : "icon/48/status/dialog-warning.png"
		})).show();
	});
	mnutblPermisos.add(btnEliminarPermiso);
	mnutblPermisos.memorizar();
	
	
		//Tabla

		var tableModelPermisos = new qx.ui.table.model.Simple();
		tableModelPermisos.setColumns(["Permiso", "Turno", "Fecha"], ["permiso", "turno", "fecha"]);
		//tableModel.setEditable(true);
		//tableModel.setColumnEditable(0, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tblPermisos = new componente.comp.ui.ramon.table.Table(tableModelPermisos, custom);
		tblPermisos.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		tblPermisos.setShowCellFocusIndicator(false);
		tblPermisos.toggleColumnVisibilityButtonVisible();
		tblPermisos.toggleStatusBarVisible();
		
		var tableColumnModelPermisos = tblPermisos.getTableColumnModel();
		var resizeBehavior = tableColumnModelPermisos.getBehavior();
		resizeBehavior.set(0, {width:"39%", minWidth:100});
		resizeBehavior.set(1, {width:"39%", minWidth:100});
		resizeBehavior.set(2, {width:"22%", minWidth:100});
		
		var cellrendererDate = new qx.ui.table.cellrenderer.Date();
		cellrendererDate.setDateFormat(formatDate);
		tableColumnModelPermisos.setDataCellRenderer(2, cellrendererDate);
		
		var selectionModelPermisos = tblPermisos.getSelectionModel();
		selectionModelPermisos.addListener("changeSelection", function(e){
			var bool = (selectionModelPermisos.getSelectedCount() > 0);
			btnEliminarPermiso.setEnabled(bool);
			mnutblPermisos.memorizar([btnEliminarPermiso]);
		});
		
		tblPermisos.setContextMenu(mnutblPermisos);
		
		composite2.add(tblPermisos, {left: 0, top: 0, right: "41%", bottom: 0});
		
		
		
	var form2 = new qx.ui.form.Form();
		
		
	var gbxPermisos = new qx.ui.groupbox.GroupBox("Asignar permiso");
	gbxPermisos.setLayout(new qx.ui.layout.Basic());

	
	var slbPermiso = new qx.ui.form.SelectBox();
	slbPermiso.setRequired(true);
	form2.add(slbPermiso, "Permiso", null, "id_permiso");
	
	var slbTurno2 = new qx.ui.form.SelectBox();
	slbTurno2.setRequired(true);
	slbTurno2.setWidth(250);
	form2.add(slbTurno2, "Turno", null, "id_empleado_turno");
	
	
	var txtFecha = new qx.ui.form.DateField();
	txtFecha.setRequired(true);
	txtFecha.setMaxWidth(100);
	form2.add(txtFecha, "Fecha", null, "fecha");
	
	
	var btnAgregar2 = new qx.ui.form.Button("Asignar");
	btnAgregar2.addListener("execute", function(e){
		if (form2.validate()) {
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
			try {
				var resultado = rpc.callSync("leer_hora_servidor");
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			var row = slbPermiso.getSelection()[0].getUserData("row");
			//alert(qx.lang.Json.stringify(row, null, 2));
			
			//alert(qx.lang.Json.stringify(resultado.hora, null, 2));
			//alert(qx.lang.Json.stringify(row.hora_asignacion_limite, null, 2));
			
			if (application.usuario.tipo == "A" || resultado.hora < row.hora_asignacion_limite){
				var p = qx.util.Serializer.toNativeObject(controllerFormPermisos.getModel());
				
				//alert(qx.lang.Json.stringify(p, null, 2));
				
				var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Empleados");
				try {
					var resultado = rpc.callSync("asignar_permiso", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				
				//alert(qx.lang.Json.stringify(resultado, null, 2));
				
				if (resultado) {
					var m = "";
					
					if (resultado.primer_aviso.length > 0) {
						//m+= "Primer aviso";
						//m+= "<br/>";
						m+= resultado.permiso.primer_mensaje;
						m+= "<br/><br/>";
						m+= '<table border="0" rules="none" cellpadding="2" cellspacing="2" width="99%" align="center">';
						m+= '<tr><th>Empleado</th></tr>';
						for (var x in resultado.primer_aviso) {
							m+= '<tr><td>' + resultado.primer_aviso[x].apenom + '</td></tr>';
						}
						m+= '</table>';
						m+= "<br/><br/>";
					}
					
					if (resultado.segundo_aviso.length > 0) {
						//m+= "Segundo aviso";
						//m+= "<br/>";
						m+= resultado.permiso.segundo_mensaje;
						m+= "<br/><br/>";
						m+= '<table border="0" rules="none" cellpadding="1" cellspacing="1" width="99%" align="center">';
						m+= '<tr><th>Empleado</th></tr>';
						for (var x in resultado.segundo_aviso) {
							m+= '<tr><td>' + resultado.segundo_aviso[x].apenom + '</td></tr>';
						}
						m+= '</table>';
						m+= "<br/><br/>";
					}
					
					dialog.Dialog.warning(m, function(e){
	
					});
				}
				
				functionActualizar([slbLugarTrabajo.getModelSelection().getItem(0)]);
				form2.reset();
			} else {
				dialog.Dialog.warning("Ya venció la hora límite permitida para asignar el permiso.", function(e){

				});
			}
		} else {
			form2.getValidationManager().getInvalidFormItems()[0].focus();
			
			/*
			var items = form2.getItems();
			for (var item in items) {
				if (!items[item].isValid()) {
					items[item].focus();
					break;
				}
			}
			*/
		}
	});
	form2.addButton(btnAgregar2);
	
	gbxPermisos.add(new qx.ui.form.renderer.Single(form2));
	
	composite2.add(gbxPermisos, {left: "60%", right: 0, top: 0});
	
	var controllerFormPermisos = new qx.data.controller.Form(null, form2);
	controllerFormPermisos.createModel(true);
	
	
	
	
	
	
	
	
	
	
	
	

	
	var mnutblRelojes = new componente.comp.ui.ramon.menu.Menu();
	var btnEliminarReloj = new qx.ui.menu.Button("Eliminar asignación");
	btnEliminarReloj.setEnabled(false);
	btnEliminarReloj.addListener("execute", function(e){
		/*
		dialog.Dialog.confirm("Dese eliminar este item?", function(e){
			if (e) {
				var p = {id_empleado_reloj: tableModelRelojes.getRowData(tblRelojes.getFocusedRow()).id_empleado_reloj};
				
				var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Empleados");
				try {
					var resultado = rpc.callSync("eliminar_reloj", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				functionActualizar([slbLugarTrabajo.getModelSelection().getItem(0)]);
			}
		});
		*/
		
		(new dialog.Confirm({
		        "message"   : "Desea eliminar el item seleccionado?",
		        "callback"  : function(e){
									if (e) {
										var p = {id_empleado_reloj: tableModelRelojes.getRowData(tblRelojes.getFocusedRow()).id_empleado_reloj};
										
										var rpc = new qx.io.remote.Rpc("services/", "comp.Empleados");
										try {
											var resultado = rpc.callSync("eliminar_reloj", p);
										} catch (ex) {
											alert("Sync exception: " + ex);
										}
										functionActualizar([slbLugarTrabajo.getModelSelection().getItem(0)]);
									}
		        				},
		        "context"   : this,
		        "image"     : "icon/48/status/dialog-warning.png"
		})).show();
	});
	mnutblRelojes.add(btnEliminarReloj);
	mnutblRelojes.memorizar();
	
	
		//Tabla

		var tableModelRelojes = new qx.ui.table.model.Simple();
		tableModelRelojes.setColumns(["Reloj"], ["reloj"]);
		//tableModel.setEditable(true);
		//tableModel.setColumnEditable(0, false);

		var custom = {tableColumnModel : function(obj) {
			return new qx.ui.table.columnmodel.Resize(obj);
		}};
		
		var tblRelojes = new componente.comp.ui.ramon.table.Table(tableModelRelojes, custom);
		tblRelojes.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
		//tblRelojes.setWidth(250);
		tblRelojes.setShowCellFocusIndicator(false);
		tblRelojes.toggleColumnVisibilityButtonVisible();
		tblRelojes.toggleStatusBarVisible();
		
		var tableColumnModelRelojes = tblRelojes.getTableColumnModel();
		var resizeBehavior = tableColumnModelRelojes.getBehavior();
		//resizeBehavior.set(0, {width:"60%", minWidth:100});
		//resizeBehavior.set(1, {width:"40%", minWidth:100});
		
		var selectionModelRelojes = tblRelojes.getSelectionModel();
		selectionModelRelojes.addListener("changeSelection", function(e){
			var bool = (selectionModelRelojes.getSelectedCount() > 0);
			//btnEliminarReloj.setEnabled(bool);
			//mnutblRelojes.memorizar([btnEliminarReloj]);
		});
		
		tblRelojes.setContextMenu(mnutblRelojes);
		
		composite3.add(tblRelojes, {left: 0, top: 0, right: "51%", bottom: 0});
		
		
		
	var form3 = new qx.ui.form.Form();
		
		
	var gbxRelojes = new qx.ui.groupbox.GroupBox("Asignar relojes");
	gbxRelojes.setLayout(new qx.ui.layout.Basic());

	
	var lstRelojes = new qx.ui.form.List();
	lstRelojes.setRequired(true);
	lstRelojes.setWidth(200);
	lstRelojes.setSelectionMode("multi");
	var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("leer_relojes");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	for (var x in resultado){
		lstRelojes.add(new qx.ui.form.ListItem(resultado[x].descrip, null, resultado[x].id_reloj));
	}
	form3.add(lstRelojes, "Relojes", null, "id_reloj");
	
	
	var btnAgregar3 = new qx.ui.form.Button("Asignar");
	btnAgregar3.addListener("execute", function(e){
		if (form3.validate()) {
			var p = {id_reloj: qx.util.Serializer.toNativeObject(lstRelojes.getModelSelection())};
			p.id_empleado = [];
			selectionModelEmpleados.iterateSelection(function(index) {
				var rowData = tableModelEmpleados.getRowData(index);
				p.id_empleado.push(rowData.id_empleado);
			});
			
			//alert(qx.lang.Json.stringify(p));
			//alert(qx.util.Serializer.toNativeObject(lstRelojes.getModelSelection()));
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Empleados");
			try {
				var resultado = rpc.callSync("asignar_reloj", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			functionActualizar([slbLugarTrabajo.getModelSelection().getItem(0)]);
			form3.reset();
		} else {
			var items = form3.getItems();
			for (var item in items) {
				if (!items[item].isValid()) {
					items[item].focus();
					break;
				}
			}
		}
	});
	form3.addButton(btnAgregar3);
	
	gbxRelojes.add(new qx.ui.form.renderer.Single(form3));
	
	composite3.add(gbxRelojes, {left: "50%", right: 0, top: 0});
	
	var controllerFormRelojes = new qx.data.controller.Form(null, form3);
	controllerFormRelojes.createModel(true);
	
	
	var slbLugarTrabajo = new qx.ui.form.SelectBox();
	slbLugarTrabajo.addListener("changeSelection", function(e){
		var data = e.getData();
		var item;
		
		var p = {};
		p.todos = false;
		p.id_lugar_trabajo = [data[0].getModel()];
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
		try {
			var resultado = rpc.callSync("leer_turnos", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		slbTurno1.removeAll();
		for (var x in resultado){
			slbTurno1.add(new qx.ui.form.ListItem(resultado[x].descrip, null, resultado[x].id_turno));
		}
		
		
		var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
		try {
			var resultado = rpc.callSync("leer_permisos", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}
		slbPermiso.removeAll();
		for (var x in resultado){
			item = new qx.ui.form.ListItem(resultado[x].descrip, null, resultado[x].id_permiso);
			item.setUserData("row", resultado[x]);
			slbPermiso.add(item);
		}
		
		tblEmpleados.resetSelection();
		tblEmpleados.setFocusedCell();
		
		functionActualizar([data[0].getModel()]);
	});
	for (var x in application.usuario.lugar_trabajo) {
		slbLugarTrabajo.add(new qx.ui.form.ListItem(application.usuario.lugar_trabajo[x].descrip, null, application.usuario.lugar_trabajo[x].id_lugar_trabajo));
	}
	this.add(slbLugarTrabajo, {left: 70, top: 5});
	
	
	
	slbLugarTrabajo.setTabIndex(1);
	tblEmpleados.setTabIndex(2);

	tblRelojes.setTabIndex(3);
	tblTurnos.setTabIndex(4);
	tblPermisos.setTabIndex(5);
	
	lstRelojes.setTabIndex(6);
	btnAgregar3.setTabIndex(7);

	slbTurno1.setTabIndex(8);
	txtDesde.setTabIndex(9);
	txtHasta.setTabIndex(10);
	btnAgregar1.setTabIndex(11);
	
	slbPermiso.setTabIndex(12);
	slbTurno2.setTabIndex(13);
	txtFecha.setTabIndex(14);
	btnAgregar2.setTabIndex(15);
	
	
	
	

	},
	members : 
	{

	}
});