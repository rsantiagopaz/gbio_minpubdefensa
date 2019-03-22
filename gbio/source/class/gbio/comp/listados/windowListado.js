qx.Class.define("gbio.comp.listados.windowListado",
{
	extend : componente.comp.ui.ramon.window.Window,
	construct : function (datos)
	{
	this.base(arguments);
	
	this.set({
		caption: datos.caption,
		width: datos.width,
		height: datos.height,
		showMinimize: false,
		resizable: false
	});
		
	this.setLayout(new qx.ui.layout.Grow());

	this.addListenerOnce("appear", function(e){

	});
	
	
	var application = qx.core.Init.getApplication();

	
	var i = new qx.ui.embed.ThemedIframe(datos.url);
	this.add(i);
	
	
	},

	events : 
	{

	}
});