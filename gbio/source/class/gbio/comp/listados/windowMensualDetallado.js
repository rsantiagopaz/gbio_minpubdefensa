qx.Class.define("gbio.comp.listados.windowMensualDetallado", {
extend : componente.comp.ui.ramon.window.Window,
construct : function (appMain) {
this.base(arguments);

this.set({
	caption: "Listado Mensual",
	width: 1100,
	height: 610,
	showMinimize: false,
	showMaximize: false
});

this.setLayout(new qx.ui.layout.Basic());

//this._lstEmpleados = new qx.ui.form.ow.List("Empleados:", "", true);
this._lstEmpleados = new componente.comp.ui.alejandro.ow.List("Empleados:", "", true);
this._lstEmpleados.getCombo().setSelectionMode("multi");
this._lstEmpleados.getCombo().setWidth(150);
var lblMes = new qx.ui.basic.Label("Mes:");
var cmbMes = new qx.ui.form.SelectBox();
cmbMes.add(new qx.ui.form.ListItem("Enero", "", "01"));
cmbMes.add(new qx.ui.form.ListItem("Febrero", "", "02"));
cmbMes.add(new qx.ui.form.ListItem("Marzo", "", "03"));
cmbMes.add(new qx.ui.form.ListItem("Abril", "", "04"));
cmbMes.add(new qx.ui.form.ListItem("Mayo", "", "05"));
cmbMes.add(new qx.ui.form.ListItem("Junio", "", "06"));
cmbMes.add(new qx.ui.form.ListItem("Julio", "", "07"));
cmbMes.add(new qx.ui.form.ListItem("Agosto", "", "08"));
cmbMes.add(new qx.ui.form.ListItem("Septiembre", "", "09"));
cmbMes.add(new qx.ui.form.ListItem("Octubre", "", "10"));
cmbMes.add(new qx.ui.form.ListItem("Noviembre", "", "11"));
cmbMes.add(new qx.ui.form.ListItem("Diciembre", "", "12"));

var lblAno = new qx.ui.basic.Label("Año:");
var txtAno = new qx.ui.form.TextField();

var btnVer = new qx.ui.form.Button("Ver");
var ifrListado = new qx.ui.embed.Iframe("");
ifrListado.setWidth(920);
ifrListado.setHeight(530);

this.add(this._lstEmpleados, {left:0, top:14});
this.add(lblMes, {left:160, top:0});
this.add(cmbMes, {left:230, top:0});
this.add(lblAno, {left:360, top:0});
this.add(txtAno, {left:430, top:0});
this.add(btnVer, {left:530, top:0});
this.add(ifrListado, {left:160, top:30});

var application = qx.core.Init.getApplication();
this.debug(application.usuario.id_lugar_trabajo);

btnVer.addListener("execute", function (e) {
	var empleados = new Array();
	for (var i=0; i<this._lstEmpleados.getCombo().getSelection().length; i++) {
		empleados.push(this._lstEmpleados.getCombo().getSelection()[i].getModel());
	}
	
	ifrListado.setSource("reportes/mensualdetallado.php?MES=" + cmbMes.getModelSelection().getItem(0) + "&ANO=" + txtAno.getValue() + "&id_lugar_trabajo=" + application.usuario.id_lugar_trabajo + "&empleados=" + empleados + "&rand=" + Math.random());	
}, this);

this.init();

},
members : {
	init : function () {
		var rpc = new qx.io.remote.Rpc("services/", "comp.Maestros");
		var resEmpleados = rpc.callSync("getEmpleados");
		this._lstEmpleados.setNewValues(resEmpleados);
	}
}
});