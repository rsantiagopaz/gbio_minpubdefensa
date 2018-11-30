qx.Class.define("gbio.comp.empleados.windowEmpleado",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (empleado)
	{
		this.base(arguments);
		
		this.set({
			width: 520,
			height: 400,
			showMinimize: false,
			showMaximize: false
		});
		
		this.setLayout(new qx.ui.layout.Canvas());
		this.setResizable(false, false, false, false);
		
	
	this.addListenerOnce("appear", function(e){
		/*
		if (empleado!=null) {
			var encontrado = functionBuscarNodo(nodes, empleado.id_ubicacion);
			vtUbicacion.openNodeAndParents(encontrado);
			vtUbicacion.getSelection().removeAll();
			vtUbicacion.getSelection().push(encontrado);
			vtUbicacion.closeNode(encontrado);
		}
		*/
		txtApellido.focus();
	});
	
	
	
qx.Mixin.define("my.Mixin",
{
  properties: {
    parentNode: {init: null, nullable: true, event: "parentNode"}
  }
});
	
	var application = qx.core.Init.getApplication();
	var nodes;
	var modelForm = null;
	var id_lugar_trabajo = null;
	
	var functionBuscarNodo = function(nodo, id_ubicacion) {
		var encontrado = null;
		if (nodo.get("id_ubicacion")==id_ubicacion) {
			encontrado = nodo;
		} else {
			var hijos = nodo.get("hijos");
			for (var x = 0; x < hijos.getLength(); x++) {
				encontrado = functionBuscarNodo(hijos.getItem(x), id_ubicacion);
				if (encontrado!=null) break;
			}
		}
		
		return encontrado;
	}
		

	
	
	var form = new qx.ui.form.Form();
	
	var txtApellido = new qx.ui.form.TextField("");
	txtApellido.setRequired(true);
	form.add(txtApellido, "Apellido", null, "apellido");
	
	var txtNombre = new qx.ui.form.TextField("");
	txtNombre.setRequired(true);
	form.add(txtNombre, "Nombre", null, "nombre");
	
	var txtName = new qx.ui.form.TextField("");
	form.add(txtName, "N.corto", null, "name");
	
	var txtDireccion = new qx.ui.form.TextField("");
	txtDireccion.setRequired(true);
	form.add(txtDireccion, "Domicilio", null, "domicilio");
	
	var txtDni = new qx.ui.form.TextField("");
	txtDni.setRequired(true);
	form.add(txtDni, "DNI", null, "nro_doc");
	
	var txtNacimiento = new qx.ui.form.DateField();
	form.add(txtNacimiento, "F.nac.", null, "nacimiento");
	
	var rbgSexo = new qx.ui.form.RadioButtonGroup();
	rbgSexo.setLayout(new qx.ui.layout.HBox(5));
	var rbtFemenino = new qx.ui.form.RadioButton("Femenino");
	rbtFemenino.setModel("F");
	var rbtMasculino = new qx.ui.form.RadioButton("Masculino");
	rbtMasculino.setModel("M");
	rbgSexo.add(rbtFemenino);
	rbgSexo.add(rbtMasculino);
	form.add(rbgSexo, "Sexo", null, "sexo");

	var slbEstado_civil = new qx.ui.form.SelectBox();
	slbEstado_civil.add(new qx.ui.form.ListItem("Soltero/a", null, "S"))
	slbEstado_civil.add(new qx.ui.form.ListItem("Casado/a", null, "C"))
	slbEstado_civil.add(new qx.ui.form.ListItem("Divorciado/a", null, "D"))
	slbEstado_civil.add(new qx.ui.form.ListItem("Viudo/a", null, "V"))
	form.add(slbEstado_civil, "Estado civil", null, "estado_civil");
	
	var txtEmail = new qx.ui.form.TextField("");
	form.add(txtEmail, "E-mail", null, "email");
	
	var txtTelefono = new qx.ui.form.TextField("");
	form.add(txtTelefono, "Teléfono", null, "telefono");
	
	var txtCelular = new qx.ui.form.TextField("");
	form.add(txtCelular, "Celular", null, "celular");
	
	
	
	var txtIngreso = new qx.ui.form.DateField();
	txtIngreso.setValue(new Date());
	form.add(txtIngreso, "F.ingreso.", null, "ingreso");
	
	var txtEnroll_number = new qx.ui.form.TextField("");
	txtEnroll_number.setRequired(true);
	form.add(txtEnroll_number, "Nro.legajo", null, "enroll_number");
	
	var txtPassword = new qx.ui.form.PasswordField();
	form.add(txtPassword, "Contraseña", null, "password");
	
	var slbPrivilege = new qx.ui.form.SelectBox();
	slbPrivilege.add(new qx.ui.form.ListItem("Usuario", null, 0))
	slbPrivilege.add(new qx.ui.form.ListItem("Enroller", null, 1))
	slbPrivilege.add(new qx.ui.form.ListItem("Administrador", null, 2))
	slbPrivilege.add(new qx.ui.form.ListItem("S.Administrador", null, 3))
	form.add(slbPrivilege, "Privilegio", null, "privilege");
	
	var chkEnabled = new qx.ui.form.CheckBox();
	form.add(chkEnabled, "Habilitado", null, "enabled");
	
	
	var dtfDuracion_contrato_desde = new qx.ui.form.DateField();
	dtfDuracion_contrato_desde.setValue(new Date());
	form.add(dtfDuracion_contrato_desde, "Contrato desde", null, "contrato_desde");
	
	var dtfDuracion_contrato_hasta = new qx.ui.form.DateField();
	dtfDuracion_contrato_hasta.setValue(new Date());
	form.add(dtfDuracion_contrato_hasta, "Contrato hasta", null, "contrato_hasta");
	
	var slbId_tolerancia = new qx.ui.form.SelectBox();
	
	var slbLugarTrabajo = new qx.ui.form.SelectBox();
	slbLugarTrabajo.setRequired(true);
	slbLugarTrabajo.addListener("changeSelection", function(e){
		var data = e.getData();
		var p = {id_lugar_trabajo: [data[0].getModel()]};

		var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
		try {
			var resultado = rpc.callSync("leer_tolerancias", p);
		} catch (ex) {
			alert("Sync exception: " + ex);
		}

		slbId_tolerancia.removeAll();
		for (var x in resultado) {
			slbId_tolerancia.add(new qx.ui.form.ListItem(resultado[x].descrip, null, resultado[x].id_tolerancia));
		}	
	});
	for (var x in application.usuario.lugar_trabajo) {
		slbLugarTrabajo.add(new qx.ui.form.ListItem(application.usuario.lugar_trabajo[x].descrip, null, application.usuario.lugar_trabajo[x].id_lugar_trabajo));
	}
	form.add(slbLugarTrabajo, "Lugar de trabajo", null, "id_lugar_trabajo");
	
	slbId_tolerancia.setRequired(true);
	form.add(slbId_tolerancia, "Tolerancia", null, "id_tolerancia");
	
	
	
	
	var formView = new qx.ui.form.renderer.Double(form);
	
	this.add(formView, {left: 0, top: 0})
	
	var controllerForm = new qx.data.controller.Form(null, form);
	
	
	
	var btnAceptar = new qx.ui.form.Button("Aceptar");
	btnAceptar.addListener("execute", function(e){
		if (form.validate()) {
			//if (vtUbicacion.getSelection().getLength()==1) {
			if (true) {
				var p = qx.util.Serializer.toNativeObject(modelForm);
				//p.id_ubicacion = vtUbicacion.getSelection().getItem(0).get("id_ubicacion");
				p.id_ubicacion = "2";
				p.id_empleado = ((empleado==null) ? "0" : empleado.id_empleado);
				p.cambio_lugar_trabajo = (p.id_lugar_trabajo != id_lugar_trabajo);
				
				//var rpc = new qx.io.remote.Rpc("services/", "comp.Empleados");
				var rpc = new componente.comp.io.ramon.rpc.Rpc("services/", "comp.Empleados");
				try {
					var resultado = rpc.callSync("alta_modifica_empleado", p);
				} catch (ex) {
					alert("Sync exception: " + ex);
				}
		
				this.fireDataEvent("aceptado", resultado);
				this.destroy();
			} else {
				dialog.Dialog.alert("Debe seleccionar una ubicación", function(e){
					vtUbicacion.focus();
				});
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
	this.add(btnAceptar, {left: "30%", bottom: 0});
	
	var btnCancelar = new qx.ui.form.Button("Cancelar");
	btnCancelar.addListener("execute", function(e){
		this.destroy();
	}, this);
	this.add(btnCancelar, {right: "30%", bottom: 0});
	
	
	
	if (empleado==null) {
		this.setCaption("Alta de empleado");
		modelForm = controllerForm.createModel(true);
	} else {
		this.setCaption("Modificación de empleado");
		
		id_lugar_trabajo = empleado.id_lugar_trabajo;
		
		modelForm = qx.data.marshal.Json.createModel(empleado);
		controllerForm.setModel(modelForm);
	}
	
	

	
	
	
var delegateMarshal = {
	getModelMixins: function(properties) {
		return my.Mixin;
	}
}

var marshal = new qx.data.marshal.Json(delegateMarshal);
	

	
	var p = {id_ubicacion: "1"};
	var rpc = new qx.io.remote.Rpc("services/", "comp.Parametros");
	try {
		var resultado = rpc.callSync("leer_ubicaciones", p);
	} catch (ex) {
		alert("Sync exception: " + ex);
	}
	
		
	nodes = resultado;
	
	
//var nodes = [{label: "primero"}, {label: "segundo"}, {label: "tercero"}];
/*
var nodes = [];
for (var i = 0; i < 50; i++)
{
  nodes[i] = {label : "Item " + i};
  // if its not the root node
  if (i !== 0)
  {
    // add the children in some random order
    var node = nodes[parseInt(Math.random() * i)];

    if(node.children == null) {
      node.children = [];
    }
    node.children.push(nodes[i]);
  }
}
*/

	
	
/*
var functionPrepararModel = function(nodo, parent) {
	if (parent == null) {
		nodo.labelLargo = nodo.descrip;
	} else {
		nodo.labelLargo = nodo.descrip + " / " + parent.labelLargo;
	}
	for (var x in nodo.hijos) {
		functionPrepararModel(nodo.hijos[x], nodo);
	}
}

functionPrepararModel(nodes);
*/

//alert(qx.lang.Json.stringify(nodes, null, 2));


// converts the raw nodes to qooxdoo objects


//nodes = qx.data.marshal.Json.createModel(nodes, true);
marshal.toClass(nodes, true);
nodes = marshal.toModel(nodes);

var functionPrepararModel = function(nodo, parent) {
	nodo.set("parentNode", parent);
	
	if (parent == null) {
		nodo.set("labelLargo", nodo.get("descrip"));
	} else {
		nodo.set("labelLargo", nodo.get("descrip") + " / " + parent.get("labelLargo"));
	}
	var hijos = nodo.get("hijos");
	var length = hijos.getLength();
	for (var x=0; x < length; x++) {
		functionPrepararModel(hijos.getItem(x), nodo);
	}
}






		
		var lblUbicacion = new qx.ui.basic.Label("Ubicación: ");
		//this.add(lblUbicacion, {left: 500, top: 0});
		
		var vtUbicacion = new qx.ui.tree.VirtualTree(nodes, "descrip", "hijos");
		vtUbicacion.setHideRoot(true);
		vtUbicacion.setShowTopLevelOpenCloseIcons(true);
		vtUbicacion.setWidth(300);
		vtUbicacion.getSelection().addListener("change", function(e) {
			//lblUbicacion.setValue("Ubicación: " + vtUbicacion.getSelection().getItem(0).get("labelLargo"))
		});
		//slbUbicacion.setWidth(300);
//var p = new controles.selectbox.VirtualSelectBox(nodes).set({
//        labelPath: "label",
//        childProperty: "children"
//      });
		
		//this.add(vtUbicacion, {left: 500, top: 20});
		
		
functionPrepararModel(nodes, null);
	
	
	
	
	
		
	},
	members : 
	{

	},
	events : 
	{
		"aceptado": "qx.event.type.Event"
	}
});