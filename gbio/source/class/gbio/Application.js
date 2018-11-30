/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "gbio"
 *
 * @asset(gbio/*)
 * @asset(qx/decoration/Simple/arrows/down.gif)
 */
qx.Class.define("gbio.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */





      // Document is the application root
      var doc = this.getRoot();

     doc.set({blockerColor: '#bfbfbf', blockerOpacity: 0.4});
     
     var pageEmpleados = null;
     var pageAsignaciones = null;
     
     
     
	var numberformatMontoEs = this.numberformatMontoEs = new qx.util.format.NumberFormat("es");
	numberformatMontoEs.setGroupingUsed(true);
	numberformatMontoEs.setMaximumFractionDigits(2);
	numberformatMontoEs.setMinimumFractionDigits(2);
	
	var numberformatMontoEn = this.numberformatMontoEn = new qx.util.format.NumberFormat("en");
	numberformatMontoEn.setGroupingUsed(false);
	numberformatMontoEn.setMaximumFractionDigits(2);
	numberformatMontoEn.setMinimumFractionDigits(2);
	
	var numberformatEntero = this.numberformatEntero = new qx.util.format.NumberFormat("en");
	numberformatEntero.setGroupingUsed(false);
	numberformatEntero.setMaximumFractionDigits(0);
	numberformatEntero.setMinimumFractionDigits(0);
     
     
     
	//qx.locale.Manager.getInstance().addLocale("es", {"cldr_date_format_medium": "d/M/yyyy"});
     
     
     
     
     
	var functionLogin = this.functionLogin = function (functionSuccess) {
		var checkCredentials = function(username, password, callback) {
			loginWidget._username.setValid(true);
			loginWidget._password.setValid(true);
			
			var p = {};
			p.nick = username;
			p.password = password;

			var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
			rpc.setTimeout(1000 * 60);
			rpc.callAsync(function(resultado, error, id){
				if (error) {
					callback(error);
				} else {
					callback(null, resultado);
				}
			}, "leer_usuario", p);
		}
		
		var finalCallback = function(err, data) {
			if(err) {

			} else {
				//alert(data);
			}
		}
	
		var loginWidget = new dialog.Login({
			text        : "Ingrese datos de identificación",
			checkCredentials : checkCredentials,
			callback    : finalCallback
		});
		
		loginWidget._username.setValue("root");
		loginWidget._password.setValue("root");
		
		loginWidget._username.getLayoutParent().getLayout().getCellWidget(0, 0).setValue("Usuario:");
		loginWidget._username.getLayoutParent().getLayout().getCellWidget(1, 0).setValue("Contraseña:");
		
		loginWidget._password.setInvalidMessage("Contraseña incorrecta");
		
		loginWidget._loginButton.setLabel("Aceptar");
		loginWidget._loginButton.getLayoutParent().getChildren()[1].setVisibility("hidden");
		loginWidget._username.addListener("appear", function(e) {
			loginWidget.activate();
			loginWidget._username.focus();
		});
		
		loginWidget.addListener("loginSuccess", functionSuccess, qx.core.Init.getApplication());
		loginWidget.addListener("loginFailure", function(e){
			var data = e.getData();
			if (data.message=="nick") {
				loginWidget._username.setInvalidMessage("Usuario no encontrado");
				loginWidget._username.setValid(false);
				loginWidget._username.focus();
			} else {
				loginWidget._password.setValid(false);
				loginWidget._password.focus();
			}
		});
		
		loginWidget.show();
	}
     
     
     
     
     
     
     
     
     
     

	var mnuArchivo = new qx.ui.menu.Menu();
	var btnAcercaDe = new qx.ui.menu.Button("Acerca de...");
	btnAcercaDe.addListener("execute", function(){
		var win = new gbio.comp.windowAcercaDe();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuArchivo.add(btnAcercaDe);
	
	
	  
	var mnuVer = new qx.ui.menu.Menu();
	
	var btnParametros = new qx.ui.menu.Button("Parametros");
	
	var mnuParametros = new qx.ui.menu.Menu();
	btnParametros.setMenu(mnuParametros);
	mnuVer.add(btnParametros);
	
	var btnEmpleados = new qx.ui.menu.Button("Empleados");
	btnEmpleados.addListener("execute", function(e){
		if (pageEmpleados==null) {
			pageEmpleados = new gbio.comp.empleados.pageEmpleados();
			pageEmpleados.addListenerOnce("close", function(e){
				pageEmpleados = null;
			});
			tabviewMain.add(pageEmpleados);				
		} 
		tabviewMain.setSelection([pageEmpleados])
	}, this);
	mnuVer.add(btnEmpleados);
	
	var btnAsignaTurnos = new qx.ui.menu.Button("Asignaciones");
	btnAsignaTurnos.addListener("execute", function(e){
		if (pageAsignaciones==null) {
			pageAsignaciones = new gbio.comp.empleados.pageAsignaciones();
			pageAsignaciones.addListenerOnce("close", function(e){
				pageAsignaciones = null;
			});
			tabviewMain.add(pageAsignaciones);				
		} 
		tabviewMain.setSelection([pageAsignaciones])
	}, this);
	mnuVer.add(btnAsignaTurnos);
	
	
	var btnListados = new qx.ui.menu.Button("Listados");
    var mnuListados = new qx.ui.menu.Menu();
    btnListados.setMenu(mnuListados);
    mnuVer.add(btnListados);
    
    var btnLisDiario = new qx.ui.menu.Button("Diario");
    btnLisDiario.addListener("execute", function (e) {
        var win = new gbio.comp.listados.windowDiario();
        win.setModal(true);
        win.center();
        win.open();
    }, this);
    mnuListados.add(btnLisDiario);
    
    var btnLisMensual = new qx.ui.menu.Button("Mensual");
    btnLisMensual.addListener("execute", function (e) {
        var win = new gbio.comp.listados.windowMensual();
        win.setModal(true);
        win.center();
        win.open();
    }, this);
    mnuListados.add(btnLisMensual);
    
    var btnLisMensualDetallado = new qx.ui.menu.Button("Mensual Detallado");
    btnLisMensualDetallado.addListener("execute", function (e) {
        var win = new gbio.comp.listados.windowMensualDetallado();
        win.setModal(true);
        win.center();
        win.open();
    }, this);
    mnuListados.add(btnLisMensualDetallado);
    
    
    var btnLisPermisos = new qx.ui.menu.Button("Tiempo de Permiso");
    btnLisPermisos.addListener("execute", function (e) {
        var win = new gbio.comp.listados.windowListado();
        win.setModal(true);
        win.center();
        win.open();
    });
    mnuListados.add(btnLisPermisos);
	
	
	var btnParRelojes = new qx.ui.menu.Button("Relojes");
	btnParRelojes.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowRelojes(this);
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	}, this);
	mnuParametros.add(btnParRelojes);
	
	var btnTurnos = new qx.ui.menu.Button("Turnos");
	btnTurnos.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowTurnos();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuParametros.add(btnTurnos);
	
	var btnPermisos = new qx.ui.menu.Button("Permisos");
	btnPermisos.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowPermisos();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuParametros.add(btnPermisos);
	
	var btnTolerancias = new qx.ui.menu.Button("Tolerancias");
	btnTolerancias.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowTolerancias();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	});
	mnuParametros.add(btnTolerancias);
	
	var btnParLugarTrabajo = new qx.ui.menu.Button("Lugar de trabajo");
	btnParLugarTrabajo.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowLugarTrabajo(this);
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	}, this);
	mnuParametros.add(btnParLugarTrabajo);
	
	var btnUsuarios = new qx.ui.menu.Button("Usuarios");
	btnUsuarios.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowUsuarios(this);
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	}, this);
	mnuParametros.add(btnUsuarios);
	
	var btnOtros = new qx.ui.menu.Button("Otros");
	btnOtros.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowOtros();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	}, this);
	//mnuParametros.add(btnOtros);
	
	mnuVer.addSeparator();
	
	
	var mnuRelojes = new qx.ui.menu.Menu();
	var btnRelojes = new qx.ui.menu.Button("Relojes");
	btnRelojes.setMenu(mnuRelojes);
	
	var btnEnroll = new qx.ui.menu.Button("Leer empleados");
	btnEnroll.addListener("execute", function(e){
		doc.blockContent(10);
		
		var bounds = doc.getBounds();
		var imageLoading = new qx.ui.basic.Image("gbio/loading66.gif");
		imageLoading.setBackgroundColor("#FFFFFF");
		imageLoading.setDecorator("main");
		doc.add(imageLoading, {left: parseInt(bounds.width / 2 - 33), top: parseInt(bounds.height / 2 - 33)});
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Relojes");
		rpc.setTimeout(0);
		rpc.callAsync(function(resultado, error, id) {
			imageLoading.destroy();
			doc.unblock();
			
			dialog.Dialog.alert("Recuperación de empleados completada.");
		}, "recuperar_empleados", {id_reloj: ""});
	}, this);
	mnuRelojes.add(btnEnroll);
	
	var btnFichaje = new qx.ui.menu.Button("Leer fichaje");
	btnFichaje.addListener("execute", function(e){
		doc.blockContent(10);
		
		var bounds = doc.getBounds();
		var imageLoading = new qx.ui.basic.Image("gbio/loading66.gif");
		imageLoading.setBackgroundColor("#FFFFFF");
		imageLoading.setDecorator("main");
		doc.add(imageLoading, {left: parseInt(bounds.width / 2 - 33), top: parseInt(bounds.height / 2 - 33)});
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Relojes");
		rpc.setTimeout(0);
		rpc.callAsync(function(resultado, error, id) {
			imageLoading.destroy();
			doc.unblock();

			dialog.Dialog.alert("Recuperación de fichajes completada.");
		}, "recuperar_fichajes");
	}, this);
	mnuRelojes.add(btnFichaje);
	mnuRelojes.addSeparator();
	
	var btnEscribirEmpleados = new qx.ui.menu.Button("Escribir empleados");
	btnEscribirEmpleados.addListener("execute", function(e){
		doc.blockContent(10);
		
		var bounds = doc.getBounds();
		var imageLoading = new qx.ui.basic.Image("gbio/loading66.gif");
		imageLoading.setBackgroundColor("#FFFFFF");
		imageLoading.setDecorator("main");
		doc.add(imageLoading, {left: parseInt(bounds.width / 2 - 33), top: parseInt(bounds.height / 2 - 33)});
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Relojes");
		rpc.setTimeout(0);
		rpc.callAsync(function(resultado, error, id) {
			imageLoading.destroy();
			doc.unblock();
			
			//alert(resultado);

			dialog.Dialog.alert("Escritura de empleados completada.");
		}, "escribir_empleados");
	}, this);
	mnuRelojes.add(btnEscribirEmpleados);
	
	mnuVer.add(btnRelojes);
	
	
	var mnuUsuario = new qx.ui.menu.Menu();
	
	var btnContrasena = new qx.ui.menu.Button("Cambiar contraseña...");
	btnContrasena.addListener("execute", function(e){
		var win = new gbio.comp.parametros.windowContrasena();
		win.setModal(true);
		doc.add(win);
		win.center();
		win.open();
	}, this);
	mnuUsuario.add(btnContrasena);
	mnuUsuario.addSeparator();
	
	var btnSesion = new qx.ui.menu.Button("Cerrar sesión");
	btnSesion.addListener("execute", function(e){
		location.reload(true);
	}, this);
	mnuUsuario.add(btnSesion);
	
	
	var mnubtnArchivo = new qx.ui.toolbar.MenuButton('Archivo');
	var mnubtnEdicion = new qx.ui.toolbar.MenuButton('Edición');
	var mnubtnVer = new qx.ui.toolbar.MenuButton('Ver');
	var mnubtnUsuario = new qx.ui.toolbar.MenuButton('Usuario');
	
	mnubtnArchivo.setMenu(mnuArchivo);
	mnubtnVer.setMenu(mnuVer);
	mnubtnUsuario.setMenu(mnuUsuario);
	  
	
	var toolbarMain = new qx.ui.toolbar.ToolBar();
	toolbarMain.add(mnubtnArchivo);
	toolbarMain.add(mnubtnEdicion);
	toolbarMain.add(mnubtnVer);
	toolbarMain.add(mnubtnUsuario);
	
	doc.add(toolbarMain, {left: 5, top: 0, right: 5});
	
	var contenedorMain = new qx.ui.container.Composite(new qx.ui.layout.Grow());
	var tabviewMain = this._tabviewMain = new qx.ui.tabview.TabView();
	
	contenedorMain.add(tabviewMain);
	doc.add(contenedorMain, {left: 0, top: 33, right: 0, bottom: 0});
	
	
	
	
	functionLogin(function(e) {
		var data = e.getData();
		qx.core.Init.getApplication().usuario = data;
		btnUsuarios.setEnabled(data.tipo == "A");
		btnParLugarTrabajo.setEnabled(data.tipo == "A");
		btnPermisos.setEnabled(data.tipo == "A");
		btnOtros.setEnabled(data.tipo == "A");
		mnubtnUsuario.setLabel("Usuario: " + data.usuario);
		
		var p = data;
		
		//alert(qx.lang.Json.stringify(p, null, 2));
		
		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		rpc.callAsync(function(resultado, error, id){

		}, "guardar_sesion", p);
	});
	
    }
  }
});