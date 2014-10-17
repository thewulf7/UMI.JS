;(function($, doc, win) {
  "use strict";
  
  console.time('umi.js init');
  /* CONFIG */
  
  function Configuration(){
	 this.config = {
	  	 version : "0.1",
	  	jsprefix : ".json",
	    protocol : {
		  	  upage : "/upage/",
		  	  udata : "/udata/",
		  	uobject : "/uobject/"
	    }
	  };
  }
  
  Configuration.prototype.setValue = function(name,val) {
  	try {
	  this.config[name] = val;
  	} catch(err) {
	  	throw err;
  	}
 };
  
  var regedit = new Configuration();
  
  /* construct */
  function UMI(params){
    
  	for (var obj in params) {
  		regedit.setValue(obj,params[obj]);
  	}
  	/* start */
  	this.init();
  }
  /* MODULE */
  
  function Module(moduleName,version){
	  	this.name = moduleName;
	 this.version = version;
  }
  /*

  
  
  FUNCTIONS
  
  
  
  */
  
  
  
  /* INIT */
  
  UMI.prototype.init = function(){
	//getcurrentpage
  	this.page = this.jsonDecode(regedit.config.protocol.upage+window.location.pathname+regedit.config.jsprefix).page;
  	console.timeEnd('umi.js init');
  };
  
  /* HTTPRequest */
  
  UMI.prototype.http = function(url,type){
  	type = type || "GET";
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( type, url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
  };
  
  /* JSON decode */
  
  UMI.prototype.jsonDecode = function(url,type){
	 var content = this.http(url,type);
	 return JSON.parse(content);
  };
  
  /* CurrentVersion of script */
  UMI.prototype.getVersion = function() {
	  console.log(regedit.config.version);
	  return true;
  };
  /*

  
  !CORE MODULE
  
  
  */
  UMI.prototype.core = new Module("core","0.1");
  
  UMI.prototype.core.makeCall = function (method,argums){
  	var response = (argums && argums.length) ? UMI.prototype.jsonDecode(regedit.config.protocol.udata + "core/"+ method + "/" + argums.join("/") + regedit.config.jsprefix) : UMI.prototype.jsonDecode(regedit.config.protocol.udata + "core/"+ method + regedit.config.jsprefix);
	return response;
	
  };
  /*

  
  !DATA MODULE
  
  
  */
  
  UMI.prototype.data = new Module("data","0.1");
  
  UMI.prototype.data.getProperty = function (element_id,prop_name) {
	  var response = UMI.prototype.jsonDecode(regedit.configig.protocol.upage + element_id + "." + prop_name + regedit.configig.jsprefix);
	  return response;
  };
  
  UMI.prototype.data.getPage = function (page_id) {
	  var response = UMI.prototype.jsonDecode(regedit.config.protocol.upage+page_id+regedit.config.jsprefix).page;
	  return response;
  };
  
  /*

  
  !MENU MODULE
  
  
  */

  UMI.prototype.menu = new Module("menu","0.1");

  UMI.prototype.menu.makeCall = function(method,menu_id){
	  var response = UMI.prototype.jsonDecode(regedit.config.protocol.udata + "menu/"+ method + "/" + menu_id + regedit.config.jsprefix);
	  return response;
  };

  
  /* onload */
  $(window).load(function(){
	  window.umi = new UMI({version:"0.2"});
	  window.umi.getVersion();
  });
})(jQuery,document, window);