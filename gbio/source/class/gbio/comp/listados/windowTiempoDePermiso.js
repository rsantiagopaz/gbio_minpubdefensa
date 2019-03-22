qx.Class.define("gbio.comp.listados.windowTiempoDePermiso",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function ()
	{
	this.base(arguments);
	
	this.set({
		caption: "Listado",
		width: 500,
		height: 350,
		showMinimize: false,
		showMaximize: false,
		allowMaximize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Canvas());
	//this.setResizable(false, false, false, false);

	this.addListenerOnce("appear", function(e){
		rbtA1.setValue(true);
		rbtA1.focus();
	});
	
	
	var application = qx.core.Init.getApplication();
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	var dateFormat = new qx.util.format.DateFormat("yyyy-MM-dd");
	

	var composite = new qx.ui.container.Composite(new qx.ui.layout.Grid(10, 10));
	this.add(composite, {left: 0, top: 0});
	
	var rgpA = new qx.ui.form.RadioGroup();
	
	var rbtA1 = new qx.ui.form.RadioButton("Permisos").set({value: true});
	rbtA1.addListener("changeValue", function(e){
		var data = e.getData();
		
		chkEmpleado.setEnabled(data);
		cboEmpleado.setEnabled(data && chkEmpleado.getValue());
		
		if (data) {
			dtfDesde.setEnabled(true);
			dtfHasta.setEnabled(true);
		}
	});
	
	
	//composite.add(rbtA1, {row: 0, column: 0});
	rgpA.add(rbtA1);
	
	var chkEmpleado = new qx.ui.form.CheckBox("Empleado:");
	composite.add(chkEmpleado, {row: 0, column: 1});
	
	var cboEmpleado = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Parametros", methodName: "autocompletarEmpleado"});
	cboEmpleado.setWidth(300);
	var lstEmpleado = cboEmpleado.getChildControl("list");
	composite.add(cboEmpleado, {row: 0, column: 2});
	
	chkEmpleado.bind("value", cboEmpleado, "enabled");
	
	
	
	
	var rbtA3 = new qx.ui.form.RadioButton("Choferes");
	rbtA3.addListener("changeValue", function(e){
		var data = e.getData();
		
		chkDependencia.setEnabled(data);
		cboDependencia2.setEnabled(data && chkDependencia.getValue());
		
		if (data) {
			dtfDesde.setEnabled(false);
			dtfHasta.setEnabled(false);
		}
	});
	
	//composite.add(rbtA3, {row: 1, column: 0});
	rgpA.add(rbtA3);
	
	
	var chkDependencia = new qx.ui.form.CheckBox("Por dependencia:");
	chkDependencia.setEnabled(false);
	//composite.add(chkDependencia, {row: 1, column: 1});
	
	var cboDependencia2 = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Vehiculo", methodName: "autocompletarDependencia"});
	var lstDependencia2 = cboDependencia2.getChildControl("list");
	//composite.add(cboDependencia2, {row: 1, column: 2});
	
	chkDependencia.bind("value", cboDependencia2, "enabled");
	
	
	
	
	
	var rbtA2 = new qx.ui.form.RadioButton("Incidentes").set({value: true});
	rbtA2.addListener("changeValue", function(e){
		var data = e.getData();
		
		rbtB1.setEnabled(data);
		cboChofer.setEnabled(data && rbtB1.getValue());
		
		rbtB2.setEnabled(data);
		slbTipo.setEnabled(data && rbtB2.getValue());
		
		rbtB3.setEnabled(data);
		cboDependencia1.setEnabled(data && rbtB3.getValue());
		
		if (data) {
			dtfDesde.setEnabled(false);
			dtfHasta.setEnabled(false);
		}
	});
	
	//composite.add(rbtA2, {row: 2, column: 0});
	rgpA.add(rbtA2);
	
	
	
	
	
	
	var rgpB = new qx.ui.form.RadioGroup();
	
	var rbtB1 = new qx.ui.form.RadioButton("Por chofer").set({value: true});
	//composite.add(rbtB1, {row: 2, column: 1});
	rgpB.add(rbtB1);
	
	var cboChofer = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Chofer", methodName: "autocompletarChofer"});
	cboChofer.setWidth(300);
	var lstChofer = cboChofer.getChildControl("list");
	//composite.add(cboChofer, {row: 2, column: 2});
	
	rbtB1.bind("value", cboChofer, "enabled");
	
	
	
	
	var rbtB2 = new qx.ui.form.RadioButton("Por tipo incidente");
	//composite.add(rbtB2, {row: 3, column: 1});
	rgpB.add(rbtB2);
	
	var slbTipo = new qx.ui.form.SelectBox();
	/*
	var rpc = new qx.io.remote.Rpc("services/", "comp.Chofer");
	try {
		var resultado = rpc.callSync("leer_tipo_incidente");
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	for (var x in resultado) {
		slbTipo.add(new qx.ui.form.ListItem(resultado[x].descrip, null, resultado[x].id_tipo_incidente));
	}
	*/
	//composite.add(slbTipo, {row: 3, column: 2});
	
	rbtB2.bind("value", slbTipo, "enabled");
	
	
	
	
	var rbtB3 = new qx.ui.form.RadioButton("Por dependencia");
	//composite.add(rbtB3, {row: 4, column: 1});
	rgpB.add(rbtB3);
	
	var cboDependencia1 = new componente.comp.ui.ramon.combobox.ComboBoxAuto({url: "services/", serviceName: "comp.Vehiculo", methodName: "autocompletarDependencia"});
	var lstDependencia1 = cboDependencia1.getChildControl("list");
	//composite.add(cboDependencia1, {row: 4, column: 2});
	
	rbtB3.bind("value", cboDependencia1, "enabled");
	
	
	
	
	

	
	
	
	
	
	
	
	
	
	
	var compositeFecha = new qx.ui.container.Composite(new qx.ui.layout.HBox(6).set({alignY: "middle"}));
	var dtfDesde = new qx.ui.form.DateField();
	dtfDesde.setMaxWidth(100);
	var dtfHasta = new qx.ui.form.DateField();
	dtfHasta.setMaxWidth(100);
	
	var aux = new Date;
	aux.setDate(1);
	dtfDesde.setValue(aux);
	aux.setMonth(aux.getMonth() + 1);
	aux.setDate(aux.getDate() - 1);
	dtfHasta.setValue(aux);
	
	
	
	compositeFecha.add(new qx.ui.basic.Label("Desde:"));
	compositeFecha.add(dtfDesde);
	compositeFecha.add(new qx.ui.basic.Label("Hasta:"));
	compositeFecha.add(dtfHasta);
	
	this.add(compositeFecha, {left: 0, top: 200});
	
	
	var btnAceptar = new qx.ui.form.Button("Ver");
	btnAceptar.addListener("execute", function(e){
		var aux, txt;
		
		cboEmpleado.setValid(true);
		cboChofer.setValid(true);
		cboDependencia1.setValid(true);
		cboDependencia2.setValid(true);
		dtfDesde.setValid(true);
		dtfHasta.setValid(true);
		
		if (rbtA1.getValue() && chkEmpleado.getValue() && lstEmpleado.isSelectionEmpty()) {
			cboEmpleado.setValid(false);
			cboEmpleado.focus();
			sharedErrorTooltip.setLabel("Debe seleccionar empleado");
			sharedErrorTooltip.placeToWidget(cboEmpleado);
			sharedErrorTooltip.show();
		} else if (rbtA2.getValue() && rbtB1.getValue() && lstChofer.isSelectionEmpty()) {
			cboChofer.setValid(false);
			cboChofer.focus();
			sharedErrorTooltip.setLabel("Debe seleccionar chofer");
			sharedErrorTooltip.placeToWidget(cboChofer);
			sharedErrorTooltip.show();
		} else if (rbtA2.getValue() && rbtB3.getValue() && lstDependencia1.isSelectionEmpty()) {
			cboDependencia1.setValid(false);
			cboDependencia1.focus();
			sharedErrorTooltip.setLabel("Debe seleccionar dependencia");
			sharedErrorTooltip.placeToWidget(cboDependencia1);
			sharedErrorTooltip.show();
		} else if (rbtA3.getValue() && chkDependencia.getValue() && lstDependencia2.isSelectionEmpty()) {
			cboDependencia2.setValid(false);
			cboDependencia2.focus();
			sharedErrorTooltip.setLabel("Debe seleccionar dependencia");
			sharedErrorTooltip.placeToWidget(cboDependencia2);
			sharedErrorTooltip.show();
		} else if (dtfDesde.getValue() == null) {
			dtfDesde.setValid(false);
			dtfDesde.focus();
			sharedErrorTooltip.setLabel("Debe seleccionar fecha");
			sharedErrorTooltip.placeToWidget(dtfDesde);
			sharedErrorTooltip.show();
		} else if (dtfHasta.getValue() == null) {
			dtfHasta.setValid(false);
			dtfHasta.focus();
			sharedErrorTooltip.setLabel("Debe seleccionar fecha");
			sharedErrorTooltip.placeToWidget(dtfHasta);
			sharedErrorTooltip.show();
		} else if (dtfDesde.getValue() > dtfHasta.getValue()) {
			dtfHasta.setValid(false);
			dtfHasta.focus();
			sharedErrorTooltip.setLabel("Debe seleccionar fecha hasta posterior a fecha desde");
			sharedErrorTooltip.placeToWidget(dtfHasta);
			sharedErrorTooltip.show();
		} else {
			if (rbtA1.getValue()) {
				txt = "?rutina=permisos";
				
				if (chkEmpleado.getValue()) txt+= "&id_empleado=" + lstEmpleado.getSelection()[0].getModel();
			} else if (rbtA2.getValue()) {
				txt = "?rutina=incidentes";
				
				if (rbtB1.getValue()) {
					txt+= "&id_chofer=" + lstChofer.getSelection()[0].getModel();
				} else if (rbtB2.getValue()) {
					txt+= "&id_tipo_incidente=" + slbTipo.getSelection()[0].getModel();
				} else if (rbtB3.getValue()) {
					txt+= "&organismo_area_id=" + lstDependencia1.getSelection()[0].getModel();
				}
			} else if (rbtA3.getValue()) {
				txt = "?rutina=choferes";
				
				if (chkDependencia.getValue()) txt+= "&organismo_area_id=" + lstDependencia2.getSelection()[0].getModel();
			}
			
			if (rbtA1.getValue()) {
				txt+= (aux = dtfDesde.getValue()) ? "&desde=" + dateFormat.format(aux) : "";
				txt+= (aux = dtfHasta.getValue()) ? "&hasta=" + dateFormat.format(aux) : "";
			}
			
			window.open("services/class/comp/Impresion.php" + txt);
		}
		
		
		

	}, this);
	
	var btnCancelar = new qx.ui.form.Button("Cerrar");
	btnCancelar.addListener("execute", function(e){
		this.close();
		
		this.destroy();
	}, this);
	
	this.add(btnAceptar, {left: "20%", bottom: 0});
	this.add(btnCancelar, {right: "20%", bottom: 0});
	
	},
	members : 
	{

	},
	events : 
	{

	}
});