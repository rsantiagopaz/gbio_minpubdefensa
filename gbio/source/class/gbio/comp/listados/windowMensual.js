qx.Class.define("gbio.comp.listados.windowMensual", {
extend : componente.comp.ui.ramon.window.Window,
construct : function (appMain) {
this.base(arguments);

this.set({
	caption: "Listado Mensual",
	width: 850,
	height: 610,
	showMinimize: false,
	showMaximize: false
});

this.setLayout(new qx.ui.layout.Basic());

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
ifrListado.setWidth(825);
ifrListado.setHeight(530);

this.add(lblMes, {left:0, top:0});
this.add(cmbMes, {left:70, top:0});
this.add(lblAno, {left:200, top:0});
this.add(txtAno, {left:270, top:0});
this.add(btnVer, {left:470, top:0});
this.add(ifrListado, {left:0, top:30});

var application = qx.core.Init.getApplication();
this.debug(application.usuario.id_lugar_trabajo);

btnVer.addListener("execute", function (e) {
	ifrListado.setSource("reportes/mensual.php?MES=" + cmbMes.getModelSelection().getItem(0) + "&ANO=" + txtAno.getValue() + "&id_lugar_trabajo=" + application.usuario.id_lugar_trabajo + "&rand=" + Math.random());	
}, this);


},
members : {

}
});