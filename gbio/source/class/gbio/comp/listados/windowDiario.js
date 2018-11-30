qx.Class.define("gbio.comp.listados.windowDiario", {
extend : componente.comp.ui.ramon.window.Window,
construct : function (appMain) {
this.base(arguments);

this.set({
	caption: "Listado Diario",
	width: 850,
	height: 610,
	showMinimize: false,
	showMaximize: false
});

this.setLayout(new qx.ui.layout.Basic());

var lblDesde = new qx.ui.basic.Label("Desde:");
var txdDesde = new qx.ui.form.DateField();
txdDesde.setValue(new Date());
txdDesde.setDateFormat(new qx.util.format.DateFormat("dd/MM/yyyy"));
var lblHasta = new qx.ui.basic.Label("Hasta:");
var txdHasta = new qx.ui.form.DateField();
txdHasta.setValue(new Date());
txdHasta.setDateFormat(new qx.util.format.DateFormat("dd/MM/yyyy"));
var lblEmpleado = new qx.ui.basic.Label("Empleado:");
var cmbEmpleado = new qx.ui.form.SelectBox();
	cmbEmpleado.setWidth(170);
var btnVer = new qx.ui.form.Button("Ver");
var ifrListado = new qx.ui.embed.Iframe("");
ifrListado.setWidth(825);
ifrListado.setHeight(530);

this.add(lblDesde, {left:0, top:0});
this.add(txdDesde, {left:70, top:0});
this.add(lblHasta, {left:200, top:0});
this.add(txdHasta, {left:270, top:0});
this.add(lblEmpleado, {left:400, top:0});
this.add(cmbEmpleado, {left:470, top:0});

this.add(btnVer, {left:670, top:0});
this.add(ifrListado, {left:0, top:30});

var application = qx.core.Init.getApplication();

var p = {};
p.lugar_trabajo = application.usuario.id_lugar_trabajo;
var rpc = new qx.io.remote.Rpc("services/", "comp.Empleados");
rpc.setTimeout(10000);
var res = rpc.callSync("getEmpleadosLugarTrabajo", p);
cmbEmpleado.add(new qx.ui.form.ListItem("", "").set({model:""}));
var item;
for (var i=0; i<res.length; i++) {
	item = new qx.ui.form.ListItem(res[i].name, "").set({model:res[i].id_empleado});
	cmbEmpleado.add(item);
}

btnVer.addListener("execute", function (e) {
	
	
	var dateQx = txdDesde.getDateFormat().format(txdDesde.getValue()); 
	var desdeSQL = "";
	if (dateQx)
		var desdeSQL = dateQx.substr(6,4) + '-' + dateQx.substr(3,2) + '-' + dateQx.substr(0,2);
	
	var dateQx = txdHasta.getDateFormat().format(txdHasta.getValue()); 
	var hastaSQL = "";
	if (dateQx)
		var hastaSQL = dateQx.substr(6,4) + '-' + dateQx.substr(3,2) + '-' + dateQx.substr(0,2);
		
	//alert(desdeSQL + " - " + hastaSQL);
	ifrListado.setSource("reportes/diario.php?DESDE=" + desdeSQL + "&HASTA=" + hastaSQL + "&USUARIO=" + cmbEmpleado.getModelSelection().getItem(0) + "&id_lugar_trabajo=" + application.usuario.id_lugar_trabajo + "&rand=" + Math.random());
}, this);


},
members : {

}
});