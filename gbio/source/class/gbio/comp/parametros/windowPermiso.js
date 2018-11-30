qx.Class.define("gbio.comp.parametros.windowPermiso",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (model)
	{
		this.base(arguments);

	this.set({
		width: 300,
		height: 500,
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
	form.add(txtDescrip, "Descripción", null, "descrip");
	
	var slbLugarTrabajo = new qx.ui.form.SelectBox();
	slbLugarTrabajo.setRequired(true);
	for (var x in application.usuario.lugar_trabajo) {
		slbLugarTrabajo.add(new qx.ui.form.ListItem(application.usuario.lugar_trabajo[x].descrip, null, application.usuario.lugar_trabajo[x].id_lugar_trabajo));
	}
	form.add(slbLugarTrabajo, "Lugar de trabajo", null, "id_lugar_trabajo");

	var chkEntrada = new qx.ui.form.CheckBox();
	form.add(chkEntrada, "Entrada", null, "entrada");
	
	var chkSalida = new qx.ui.form.CheckBox();
	form.add(chkSalida, "Salida", null, "salida");
	
	var chkPagas = new qx.ui.form.CheckBox();
	form.add(chkPagas, "Pagas", null, "pagas");
	
	var chkActivo = new qx.ui.form.CheckBox();
	form.add(chkActivo, "Activo", null, "activo");
	
	var txtHora_limite = new qx.ui.form.TextField("00:00");
	txtHora_limite.setMaxLength(5);
	txtHora_limite.setMaxWidth(50);
	txtHora_limite.setPlaceholder("00:00");
	txtHora_limite.addListener("blur", function(e){
		var value = txtHora_limite.getValue();
		if (regexpHora.test(value)) {
			value = qx.lang.String.pad(value, 5, "0");
			value = value.replace(".", ":");
			value = value.replace(" ", ":");
		} else {
			value = "00:00";
		}
		txtHora_limite.setValue(value);
	});

	form.add(txtHora_limite, "H.asigna.límite", null, "hora_asignacion_limite");
	
	var txtPrimer_aviso = new qx.ui.form.Spinner(0, 0, 100);
	txtPrimer_aviso.setMaxWidth(50);
	txtPrimer_aviso.getChildControl("upbutton").setVisibility("excluded");
	txtPrimer_aviso.getChildControl("downbutton").setVisibility("excluded");
	txtPrimer_aviso.setSingleStep(0);
	txtPrimer_aviso.setPageStep(0);
	form.add(txtPrimer_aviso, "1er.aviso anual", null, "primer_aviso");
	
	var txtPrimer_mensaje = new qx.ui.form.TextArea("");
	txtPrimer_mensaje.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtPrimer_mensaje, "Mensaje", null, "primer_mensaje");
	
	var txtSegundo_aviso = new qx.ui.form.Spinner(0, 0, 100);
	txtSegundo_aviso.setMaxWidth(50);
	txtSegundo_aviso.getChildControl("upbutton").setVisibility("excluded");
	txtSegundo_aviso.getChildControl("downbutton").setVisibility("excluded");
	txtSegundo_aviso.setSingleStep(0);
	txtSegundo_aviso.setPageStep(0);
	form.add(txtSegundo_aviso, "2do.aviso anual", null, "segundo_aviso");
	
	var txtSegundo_mensaje = new qx.ui.form.TextArea("");
	txtSegundo_mensaje.addListener("blur", function(e){
		this.setValue(this.getValue().trim());
	})
	form.add(txtSegundo_mensaje, "Mensaje", null, "segundo_mensaje");
	
	
	
	
	


	var formView = new qx.ui.form.renderer.Single(form);
	
	this.add(formView, {left: 0, top: 0})
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	
	
	if (model==null) {
		this.setCaption("Alta de permiso");
		
		modelForm = controllerForm.createModel(true);
	} else {
		this.setCaption("Modificación de permiso");
		
		modelForm = qx.data.marshal.Json.createModel(model);
		controllerForm.setModel(modelForm);
	}
		

	var commandEsc = new qx.ui.command.Command("Esc");
	this.registrarCommand(commandEsc);
	commandEsc.addListener("execute", function(e){
		btnCancelar.fireEvent("execute");
	});
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e) {
		if (form.validate()) {
			var p = {};
			p.model = qx.util.Serializer.toNativeObject(modelForm);
			p.model.id_permiso = (model==null) ? null : model.id_permiso;
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
			try {
				var resultado = rpc.callSync("escribir_permiso", p);
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
	
	//this.add(btnAceptar, {left: 100, bottom: 0});
	//this.add(btnCancelar, {left: 250, bottom: 0});
	this.add(btnAceptar, {left: "20%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});

		
		
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});