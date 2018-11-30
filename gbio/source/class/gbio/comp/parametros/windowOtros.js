qx.Class.define("gbio.comp.parametros.windowOtros",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (model)
	{
		this.base(arguments);

	this.set({
		caption: "Otros parametros",
		width: 400,
		height: 350,
		allowMaximize: false,
		showMinimize: false,
		showMaximize: false
	});
	this.setLayout(new qx.ui.layout.Canvas());
		
	this.addListenerOnce("appear", function(){
		
	});
		

	
	var application = qx.core.Init.getApplication();

	var regexpHora = new RegExp(/^((0[0-9]|1\d|2[0-3]|[0-9])(:|.)([0-5]\d)){1}$/);
	var sharedErrorTooltip = qx.ui.tooltip.Manager.getInstance().getSharedErrorTooltip();
	
	
	var functionEscribirParamet = function() {
		var p = {};
		p.json = {};
		p.json.notificacion_permisos = {hora: txtHora.getValue(), emails: []};
		
		var children = lstEmails.getChildren();
		for (var x in children) {
			p.json.notificacion_permisos.emails.push(children[x].getLabel());
		}
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.callAsync(function(resultado, error, id){

		}, "escribir_paramet", p);
	};
	
	
	var gpbNotificacionPermisos = new qx.ui.groupbox.GroupBox("Notificación de permisos");
	gpbNotificacionPermisos.setLayout(new qx.ui.layout.Grow());
	this.add(gpbNotificacionPermisos);
	
	var layout = new qx.ui.layout.Grid(6, 6);
	layout.setColumnWidth(2, 120);
    for (var i = 0; i < 5; i++) {
    	//layout.setColumnWidth(i, 20);
    	layout.setColumnAlign(i, "left", "middle");
    }
    
	var composite = new qx.ui.container.Composite(layout);
	gpbNotificacionPermisos.add(composite);
	
	
	
	
	
	
	var commandEliminar = new qx.ui.command.Command("Del");
	commandEliminar.setEnabled(false);
	commandEliminar.addListener("execute", function(e){
		var item = lstEmails.getSelection()[0];
		var index = lstEmails.indexOf(item);
		lstEmails.removeAt(index);
		
		var children = lstEmails.getChildren();
		if (children.length > 0) lstEmails.setSelection([children[((index == children.length) ? index -1 : index)]]);
		
		functionEscribirParamet();
	});
	
	var menu = new componente.comp.ui.ramon.menu.Menu();
	var btnEliminar = new qx.ui.menu.Button("Eliminar", null, commandEliminar);
	menu.add(btnEliminar);
	menu.memorizar();
	
	
	
	
	
	
	
	var txtHora = new qx.ui.form.TextField("00:00");
	txtHora.setMaxLength(5);
	txtHora.setMaxWidth(50);
	txtHora.setPlaceholder("00:00");
	txtHora.addListener("blur", function(e){
		var value = txtHora.getValue();
		if (regexpHora.test(value)) {
			value = qx.lang.String.pad(value, 5, "0");
			value = value.replace(".", ":");
			value = value.replace(" ", ":");
		} else {
			value = "00:00";
		}
		txtHora.setValue(value);
		
		functionEscribirParamet();
	});
	
	composite.add(txtHora, {row: 0, column: 1});
	composite.add(new qx.ui.basic.Label("Hora: "), {row: 0, column: 0});
	

	
	var txtMail = new qx.ui.form.TextField("");
	
	
	composite.add(txtMail, {row: 1, column: 1, colSpan: 3})
	composite.add(new qx.ui.basic.Label("E-mail: "), {row: 1, column: 0});
	
	var btnAgregar = new qx.ui.form.Button("Agregar", "qx/decoration/Simple/arrows/down.gif");
	btnAgregar.addListener("execute", function(e){
		var value = txtMail.getValue().trim().toLowerCase();
		
		txtMail.setValid(true);
		sharedErrorTooltip.hide();
		
		if (value) {
			try {
				qx.util.Validate.checkEmail(value);
				
				var item = lstEmails.findItem(value);
				if (item) {
					
				} else {
					item = new qx.ui.form.ListItem(value);
					lstEmails.add(item);
					
					functionEscribirParamet();
				}
	
				lstEmails.setSelection([item]);
				
				txtMail.setValue("");
			} catch(err) {
				txtMail.setValid(false);
				sharedErrorTooltip.setLabel("No es un correo electrónico");
				sharedErrorTooltip.placeToWidget(txtMail);
				sharedErrorTooltip.show();
			}
		}
		
		txtMail.focus();
	})
	composite.add(btnAgregar, {row: 2, column: 3})

	
	var lstEmails = new componente.comp.ui.ramon.list.List();
	lstEmails.setContextMenu(menu);
	lstEmails.addListener("changeSelection", function(e){
		var isSelectionEmpty = lstEmails.isSelectionEmpty();
		
		menu.memorizarEnabled([commandEliminar], ! isSelectionEmpty);
		if (qx.ui.core.FocusHandler.getInstance().getFocusedWidget() === lstEmails) commandEliminar.setEnabled(! isSelectionEmpty);
	});
	composite.add(lstEmails, {row: 3, column: 1, colSpan: 3});
	
	
	
	
	var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
	rpc.callAsync(function(resultado, error, id){
		var item;
		
		txtHora.setValue(resultado.json.notificacion_permisos.hora);
		for (var x in resultado.json.notificacion_permisos.emails) {
			item = new qx.ui.form.ListItem(resultado.json.notificacion_permisos.emails[x]);
			lstEmails.add(item);
			lstEmails.setSelection([item]);
		}
	}, "leer_paramet");
	
	
		
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});