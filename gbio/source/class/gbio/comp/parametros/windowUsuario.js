qx.Class.define("gbio.comp.parametros.windowUsuario",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (appMain, model)
	{
		this.base(arguments);

	this.set({
		width: 370,
		height: 430,
		allowMaximize: false,
		showMinimize: false,
		showMaximize: false
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		txtUsuario.focus();
	});
		

	var modelForm = null;
		
		
	var form = new qx.ui.form.Form();
	
	var txtUsuario = new qx.ui.form.TextField("");
	txtUsuario.setRequired(true);
	txtUsuario.addListener("blur", function(e){
		txtUsuario.setValue(txtUsuario.getValue().trim());
	})
	form.add(txtUsuario, "Usuario", null, "usuario");
	
	var txtPassword = new qx.ui.form.PasswordField();
	txtPassword.setRequired(true);
	txtPassword.addListener("blur", function(e){
		txtPassword.setValue(txtPassword.getValue().trim());
	})
	form.add(txtPassword, "Contraseña", null, "password");
	
	var slbTipo = new qx.ui.form.SelectBox();
	slbTipo.add(new qx.ui.form.ListItem("Usuario", null, "U"));
	slbTipo.add(new qx.ui.form.ListItem("Administrador", null, "A"));
	form.add(slbTipo, "Tipo", null, "tipo");
	
	var formView = new qx.ui.form.renderer.Single(form);
	
	this.add(formView, {left: 0, top: 0})
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	
	
	var groupbox = new qx.ui.groupbox.GroupBox("Lugar de trabajo");
	groupbox.setLayout(new qx.ui.layout.Canvas())
	groupbox.setWidth(330);
	groupbox.setHeight(240);
	
	
	
	var cboLocalidadSel = new qx.ui.form.SelectBox();
	var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("leer_lugar_trabajo");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	for (var x in resultado) {
		cboLocalidadSel.add(new qx.ui.form.ListItem(resultado[x].descrip, null, resultado[x].id_lugar_trabajo))
	}
	
	var btnAgregarLocalidad = new qx.ui.form.Button("Agregar");
	btnAgregarLocalidad.addListener("execute", function(e){
		var selection = cboLocalidadSel.getSelection()[0];

		var bandera = true;
		var children = lstLocalidad.getChildren();
		for (var x in children) {
			if (children[x].getModel() == selection.getModel()) {
				lstLocalidad.setSelection([children[x]]);
				bandera = false
			}
		}
		if (bandera) {
			var listItem = new qx.ui.form.ListItem(selection.getLabel(), null, selection.getModel());
			lstLocalidad.add(listItem);
			lstLocalidad.setSelection([listItem]);
		}
		cboLocalidadSel.focus();
	});
	
	var btnBorrar = new qx.ui.form.Button("Borrar");
	btnBorrar.setEnabled(false);
	btnBorrar.addListener("execute", function(e){
		lstLocalidad.remove(lstLocalidad.getSelection()[0]);
		cboLocalidadSel.focus();
	});
	
	
	var lstLocalidad = new qx.ui.form.List();
	lstLocalidad.setInvalidMessage("Debe agregar algún lugar de trabajo a la lista");
	lstLocalidad.addListener("changeSelection", function(e){
		btnBorrar.setEnabled(! lstLocalidad.isSelectionEmpty());
	});
	
	groupbox.add(cboLocalidadSel, {left: 0, top: 0, right: 0});
	groupbox.add(btnAgregarLocalidad, {left: 0, top: 30});
	groupbox.add(btnBorrar, {right: 0, top: 30});
	groupbox.add(lstLocalidad, {left: 0, top: 60, right: 0, bottom: 0});
	this.add(groupbox, {left: 0, top: 100});
	
	
	
	if (model==null) {
		this.setCaption("Alta de usuario");
		
		modelForm = controllerForm.createModel(true);
	} else {
		this.setCaption("Modificación de usuario");
		
		txtPassword.setEnabled(false);
		model.password = "                   ";
		
		modelForm = qx.data.marshal.Json.createModel(model);
		controllerForm.setModel(modelForm);
		
		for (var x in model.lugar_trabajo) {
			lstLocalidad.add(new qx.ui.form.ListItem(model.lugar_trabajo[x].descrip, null, model.lugar_trabajo[x].id_lugar_trabajo));
		}
	}
		

	var commandEsc = new qx.ui.command.Command("Esc");
	this.registrarCommand(commandEsc);
	commandEsc.addListener("execute", function(e){
		btnCancelar.fireEvent("execute");
	});
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e) {
		lstLocalidad.setValid(true);
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(modelForm);
			p.model.id_usuario = (model==null) ? null : model.id_usuario;
			p.lugar_trabajo = [];
			var children = lstLocalidad.getChildren();
			if (children.length > 0) {
				for (var x in children) {
					p.lugar_trabajo.push(children[x].getModel());
				}
				
				var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
				try {
					var resultado = rpc.callSync("escribir_usuarios", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
				
				this.fireDataEvent("aceptado", resultado);
				this.destroy();
			} else {
				lstLocalidad.setValid(false);
				lstLocalidad.focus();
			}
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
	this.add(btnCancelar, {left: 220, bottom: 0});

		
		
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});