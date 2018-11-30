qx.Class.define("gbio.comp.parametros.windowTolerancia",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (model)
	{
		this.base(arguments);

	this.set({
		width: 400,
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
		
		
	var form = new qx.ui.form.Form();
	
	var txtDescrip = new qx.ui.form.TextField("");
	txtDescrip.setRequired(true);
	txtDescrip.addListener("blur", function(e){
		txtDescrip.setValue(txtDescrip.getValue().trim());
	})
	form.add(txtDescrip, "Descripción", null, "descrip", null, {grupo: 1, tabIndex: 1, item: {row: 0, column: 1, colSpan: 5}});
	
	var slbLugarTrabajo = new qx.ui.form.SelectBox();
	slbLugarTrabajo.setRequired(true);
	for (var x in application.usuario.lugar_trabajo) {
		slbLugarTrabajo.add(new qx.ui.form.ListItem(application.usuario.lugar_trabajo[x].descrip, null, application.usuario.lugar_trabajo[x].id_lugar_trabajo));
	}
	form.add(slbLugarTrabajo, "Lugar trabajo", null, "id_lugar_trabajo", null, {grupo: 1, item: {row: 0, column: 8, colSpan: 5}});
	
	var dtfDesde = new qx.ui.form.DateField();
	form.add(dtfDesde, "Desde", null, "desde", null, {grupo: 1, item: {row: 1, column: 1, colSpan: 5}});
	
	var dtfHasta = new qx.ui.form.DateField();
	form.add(dtfHasta, "Hasta", null, "hasta", null, {grupo: 1, item: {row: 1, column: 8, colSpan: 5}});

	
	
	
	var chkEntrada_extras = new qx.ui.form.CheckBox();
	//form.add(chkEntrada_extras, "entrada_extras", null, "entrada_extras");
	form.add(chkEntrada_extras, "Hs.extras ent.", null, "entrada_extras", null, {grupo: 2, tabIndex: 6, item: {row: 2, column: 1, colSpan: 5}});
	
	var txtE_fichada = new qx.ui.form.Spinner(0, 0, 100);
	//form.add(txtE_fichada, "e_fichada", null, "e_fichada");
	form.add(txtE_fichada, "Ent.normal", null, "e_fichada", null, {grupo: 2, item: {row: 3, column: 1, colSpan: 5}});
	
	var txtE_tolerable = new qx.ui.form.Spinner(0, 0, 100);
	//form.add(txtE_tolerable, "e_tolerable", null, "e_tolerable");
	form.add(txtE_tolerable, "Ent.tolerable", null, "e_tolerable", null, {grupo: 2, item: {row: 4, column: 1, colSpan: 5}});
	
	var txtE_tardanza = new qx.ui.form.Spinner(0, 0, 100);
	form.add(txtE_tardanza, "Ent.tardanza", null, "e_tardanza", null, {grupo: 2, item: {row: 5, column: 1, colSpan: 5}});
	
	var txt30minutos = new qx.ui.form.Spinner(0, 0, 100);
	form.add(txt30minutos, "30 minutos", null, "e_30minutos", null, {grupo: 2, item: {row: 6, column: 1, colSpan: 5}});
	
	var txt60minutos = new qx.ui.form.Spinner(0, 0, 100);
	form.add(txt60minutos, "60 minutos", null, "e_60minutos", null, {grupo: 2, item: {row: 7, column: 1, colSpan: 5}});
	
	var chkSalida_extras = new qx.ui.form.CheckBox();
	//form.add(chkSalida_extras, "salida_extras", null, "salida_extras");
	form.add(chkSalida_extras, "Hs.extras sal.", null, "salida_extras", null, {grupo: 2, item: {row: 2, column: 8, colSpan: 5}});
	
	var txtS_fichada = new qx.ui.form.Spinner(0, 0, 100);
	//form.add(txtS_fichada, "s_fichada", null, "s_fichada");
	form.add(txtS_fichada, "Sal.normal", null, "s_fichada", null, {grupo: 2, item: {row: 3, column: 8, colSpan: 5}});
	
	var txtS_tolerable = new qx.ui.form.Spinner(0, 0, 100);
	//form.add(txtS_tolerable, "s_tolerable", null, "s_tolerable");
	form.add(txtS_tolerable, "Sal.tolerable", null, "s_tolerable", null, {grupo: 2, item: {row: 4, column: 8, colSpan: 5}});
	
	var txtS_abandono = new qx.ui.form.Spinner(0, 0, 100);
	//form.add(txtS_abandono, "s_abandono", null, "s_abandono");
	form.add(txtS_abandono, "Abandono", null, "s_abandono", null, {grupo: 2, item: {row: 5, column: 8, colSpan: 5}});



	
	
	
	
	
	
	var chkEntrada = new qx.ui.form.CheckBox();
	form.add(chkEntrada, "Control entrada", null, "control_entrada", null, {grupo: 3, tabIndex: 15, item: {row: 1, column: 1, colSpan: 5}});
	
	var chkSalida = new qx.ui.form.CheckBox();
	form.add(chkSalida, "Control salida", null, "control_salida", null, {grupo: 3, item: {row: 1, column: 8, colSpan: 1}});
	
	var txtTotalMinutos = new qx.ui.form.Spinner(0, 0, 1000);
	txtTotalMinutos.setNumberFormat(application.numberformatEntero);
	txtTotalMinutos.getChildControl("upbutton").setVisibility("excluded");
	txtTotalMinutos.getChildControl("downbutton").setVisibility("excluded");
	txtTotalMinutos.setSingleStep(0);
	txtTotalMinutos.setPageStep(0);
	form.add(txtTotalMinutos, "Total minutos", null, "total_minutos", null, {grupo: 3, item: {row: 2, column: 1, colSpan: 2}});
	
	var txtTardanzas = new qx.ui.form.Spinner(0, 0, 100);
	txtTardanzas.setNumberFormat(application.numberformatEntero);
	txtTardanzas.getChildControl("upbutton").setVisibility("excluded");
	txtTardanzas.getChildControl("downbutton").setVisibility("excluded");
	txtTardanzas.setSingleStep(0);
	txtTardanzas.setPageStep(0);
	form.add(txtTardanzas, "Límite de tardanzas", null, "limite_tardanzas", null, {grupo: 3, item: {row: 2, column: 8, colSpan: 2}});
	
	
	
	


	//var formView = new qx.ui.form.renderer.Double(form);
	var formView = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 13, 13, 1);
	
	this.add(formView, {left: 0, top: 0})
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	
	
	var formView2 = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 13, 13, 2);
	
	this.add(formView2, {left: 0, top: 80});
	
	
	

	var gpb = new qx.ui.groupbox.GroupBox("Tiempo mensual de permisos");
	gpb.setLayout(new qx.ui.layout.Basic());
	this.add(gpb, {left: 0, top: 280});
	
	
	
	var formView3 = new componente.comp.ui.ramon.abstractrenderer.Grid(form, 13, 13, 3);
	
	gpb.add(formView3, {left: 0, top: 0});

	
	
	
	
	
	if (model==null) {
		this.setCaption("Alta de tolerancia");
		
		modelForm = controllerForm.createModel(true);
	} else {
		this.setCaption("Modificación de tolerancia");
		
		var ano, mes, dia;

		//ano = parseInt(model.desde.substr(0, 4));
		//mes = parseInt(model.desde.substr(5, 2)) - 1;
		//dia = parseInt(model.desde.substr(8, 2));
		//model.desde = new Date(ano, mes, dia);
		
		//ano = parseInt(model.hasta.substr(0, 4));
		//mes = parseInt(model.hasta.substr(5, 2)) - 1;
		//dia = parseInt(model.hasta.substr(8, 2));
		//model.hasta = new Date(ano, mes, dia);

		
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
			p.model.id_tolerancia = (model==null) ? null : model.id_tolerancia;
			
			//alert(qx.lang.Json.stringify(p, null, 2));
			
			var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Parametros");
			try {
				var resultado = rpc.callSync("escribir_tolerancia", p);
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
	
	this.add(btnAceptar, {left: 100, bottom: 0});
	this.add(btnCancelar, {left: 250, bottom: 0});

		
		
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});