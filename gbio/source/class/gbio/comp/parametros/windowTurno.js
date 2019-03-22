qx.Class.define("gbio.comp.parametros.windowTurno",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (model)
	{
		this.base(arguments);

	this.set({
		width: 380,
		height: 400,
		allowMaximize: false,
		showMinimize: false,
		showMaximize: false
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		txtDescrip.focus();
	});
		

	var application = qx.core.Init.getApplication();
	var modelForm = null;
	var regexpHora = new RegExp(/^((0[0-9]|1\d|2[0-3]|[0-9])(:|.)([0-5]\d)){1}$/);
		
		
	var form = new qx.ui.form.Form();
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	txtDescrip.addListener("blur", function(e){
		txtDescrip.setValue(txtDescrip.getValue().trim());
	})
	form.add(txtDescrip, "Descripción", null, "descrip", null, {grupo: 1, item: {row: 0, column: 1, colSpan: 5}});
	
	var slbLugarTrabajo = new qx.ui.form.SelectBox();
	slbLugarTrabajo.setRequired(true);
	for (var x in application.usuario.lugar_trabajo) {
		slbLugarTrabajo.add(new qx.ui.form.ListItem(application.usuario.lugar_trabajo[x].descrip, null, application.usuario.lugar_trabajo[x].id_lugar_trabajo));
	}
	form.add(slbLugarTrabajo, "Lugar de trabajo", null, "id_lugar_trabajo", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 5}});
	
	var chkActivo = new qx.ui.form.CheckBox();
	form.add(chkActivo, "Activo", null, "activo", null, {grupo: 1, item: {row: 1, column: 8, colSpan: 1}});
	
	var slbTipo = new qx.ui.form.SelectBox();
	slbTipo.add(new qx.ui.form.ListItem("Fijo", null, "F"))
	slbTipo.add(new qx.ui.form.ListItem("Flexible", null, "X"))
	slbTipo.add(new qx.ui.form.ListItem("Variable", null, "V"))
	
	slbTipo.addListener("changeSelection", function(e){
		var data = e.getData()[0];
		var model = data.getModel();
		if (model=="F") {
			txtCant_horas.setValue(0);
			
			txtEntrada.setEnabled(true);
			txtSalida.setEnabled(true);
			txtCant_horas.setEnabled(false);
				
			chkLu.setEnabled(true);
			chkMa.setEnabled(true);
			chkMi.setEnabled(true);
			chkJu.setEnabled(true);
			chkVi.setEnabled(true);
			chkSa.setEnabled(true);
			chkDo.setEnabled(true);
		} else if (model=="X") {
			txtEntrada.setValue("");
			txtSalida.setValue("");
			
			txtEntrada.setEnabled(false);
			txtSalida.setEnabled(false);
			txtCant_horas.setEnabled(true);
	
			chkLu.setEnabled(true);
			chkMa.setEnabled(true);
			chkMi.setEnabled(true);
			chkJu.setEnabled(true);
			chkVi.setEnabled(true);
			chkSa.setEnabled(true);
			chkDo.setEnabled(true);
		} else {
			txtCant_horas.setValue(0);
			chkLu.setValue(false);
			chkMa.setValue(false);
			chkMi.setValue(false);
			chkJu.setValue(false);
			chkVi.setValue(false);
			chkSa.setValue(false);
			chkDo.setValue(false);
			
			txtEntrada.setEnabled(true);
			txtSalida.setEnabled(true);
			txtCant_horas.setEnabled(false);
	
			chkLu.setEnabled(false);
			chkMa.setEnabled(false);
			chkMi.setEnabled(false);
			chkJu.setEnabled(false);
			chkVi.setEnabled(false);
			chkSa.setEnabled(false);
			chkDo.setEnabled(false);
		}
	});
	form.add(slbTipo, "Tipo", null, "tipo", null, {grupo: 1, item: {row: 2, column: 1, colSpan: 3}});
	
	var txtCant_horas = new qx.ui.form.Spinner(0, 0, 2000);
	txtCant_horas.setEnabled(false);
	txtCant_horas.setNumberFormat(application.numberformatEntero);
	txtCant_horas.getChildControl("upbutton").setVisibility("excluded");
	txtCant_horas.getChildControl("downbutton").setVisibility("excluded");
	txtCant_horas.setSingleStep(0);
	txtCant_horas.setPageStep(0);
	form.add(txtCant_horas, "Cant.horas", null, "cant_horas", null, {grupo: 1, item: {row: 2, column: 8, colSpan: 2}});
	
	var txtEntrada = new qx.ui.form.TextField("");
	txtEntrada.setPlaceholder("00:00");
	txtEntrada.addListener("blur", function(e){
		var value = txtEntrada.getValue();
		if (regexpHora.test(value)) {
			value = qx.lang.String.pad(value, 5, "0");
			value = value.replace(".", ":");
			value = value.replace(" ", ":");
		} else {
			value = "";
		}
		txtEntrada.setValue(value);
	});
	form.add(txtEntrada, "Entrada", function(value) {
		if (txtEntrada.getEnabled() && txtEntrada.getValue()=="") throw new qx.core.ValidationError("Validation Error", "Debe ingresar hora de entrada");
	}, "entrada", null, {grupo: 1, item: {row: 3, column: 1, colSpan: 2}});
	
	
	var txtSalida = new qx.ui.form.TextField("");
	txtSalida.setPlaceholder("00:00");
	txtSalida.addListener("blur", function(e){
		var value = txtSalida.getValue();
		if (regexpHora.test(value)) {
			value = qx.lang.String.pad(value, 5, "0");
			value = value.replace(".", ":");
			value = value.replace(" ", ":");
		} else {
			value = "";
		}
		txtSalida.setValue(value);
	});
	form.add(txtSalida, "Salida", function(value) {
		if (txtSalida.getEnabled() && txtSalida.getValue()=="") throw new qx.core.ValidationError("Validation Error", "Debe ingresar hora de salida");
	}, "salida", null, {grupo: 1, item: {row: 3, column: 8, colSpan: 2}});
	
	
	var chkLu = new qx.ui.form.CheckBox();
	form.add(chkLu, "Lunes", null, "lu", null, {grupo: 1, item: {row: 10, column: 1, colSpan: 1}});
	
	var chkMa = new qx.ui.form.CheckBox();
	form.add(chkMa, "Martes", null, "ma", null, {grupo: 1, item: {row: 11, column: 1, colSpan: 1}});
	
	var chkMi = new qx.ui.form.CheckBox();
	form.add(chkMi, "Miércoles", null, "mi", null, {grupo: 1, item: {row: 12, column: 1, colSpan: 1}});
	
	var chkJu = new qx.ui.form.CheckBox();
	form.add(chkJu, "Jueves", null, "ju", null, {grupo: 1, item: {row: 13, column: 1, colSpan: 1}});
	
	var chkVi = new qx.ui.form.CheckBox();
	form.add(chkVi, "Viernes", null, "vi", null, {grupo: 1, item: {row: 14, column: 1, colSpan: 1}});
	
	var chkSa = new qx.ui.form.CheckBox();
	form.add(chkSa, "Sábado", null, "sa", null, {grupo: 1, item: {row: 10, column: 8, colSpan: 1}});
	
	var chkDo = new qx.ui.form.CheckBox();
	form.add(chkDo, "Domingo", null, "do", null, {grupo: 1, item: {row: 11, column: 8, colSpan: 1}});
	
	
	

	
	


	//var formView = new qx.ui.form.renderer.Double(form);
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 13, 13, 1);
	
	this.add(formView, {left: 0, top: 0})
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	
	

	
	
	
	if (model == null) {
		this.setCaption("Alta de turno");
		
		modelForm = controllerForm.createModel(true);
	} else {
		this.setCaption("Modificación de turno");
		
		modelForm = qx.data.marshal.Json.createModel(model);
		controllerForm.setModel(modelForm);
	}
		

	var commandEsc = new qx.ui.command.Command("Esc");
	this.registrarCommand(commandEsc);
	commandEsc.addListener("execute", function(e){
		btnCancelar.execute();
	});
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e) {
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(modelForm);
			p.model.id_turno = (model==null) ? null : model.id_turno;
			
			var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
			try {
				var resultado = rpc.callSync("escribir_turno", p);
			} catch (ex) {
				alert("Sync exception: " + ex);
			}
			
			this.fireDataEvent("aceptado", resultado);
			btnCancelar.execute();
		} else {
			var items = form.getItems();
			for (var item in items) {
				if (!items[item].isValid()) {
					items[item].focus();
					break;
				}
			}
		}
	}, this);

	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: 80, bottom: 0});
	this.add(btnCancelar, {left: 240, bottom: 0});

		
		
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});