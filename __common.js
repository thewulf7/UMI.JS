;(function($, doc, win) {
  "use strict";
  
  
  function setConf(){
	  return {
	  	 version : "0.1",
	  	jsprefix : ".json",
		   prots : {
			  	  upage : "/upage/",
			  	  udata : "/udata/",
			  	uobject : "/uobject/"
		   }
	  };
  }
  
  /* mainfunction */
  
  
  function UMI(){
  	this.conf = setConf();
  	/* start */
  	this.init();
  }
  /*

  
  
  FUNCTIONS
  
  
  
  */
  
  
  /* INIT */
  
  UMI.prototype.init = function(){
	//getcurrentpage
  	this.page = this.jsonDecode(this.conf.prots.upage+window.location.pathname+this.conf.jsprefix).page;
  	console.log("init load");
  }
  
  /* confs */
  
  UMI.prototype.confs = function() {
	  return this;
  }
  
  /* HTTPRequest */
  
  UMI.prototype.http = function(url,type){
  	if(!type) type = "GET";
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( type, url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
  }
  
  /* JSON decode */
  
  UMI.prototype.jsonDecode = function(url,type){
	 var content = this.http(url,type);
	 return JSON.parse(content);
  }
  
  /* CurrentVersion of script */
  UMI.prototype.getVersion = function() {
	  console.log(this.conf.version);
	  return true;
  }
  /*

  
  !CORE MODULE
  
  
  */
  
  UMI.prototype.core = function (method,argums){
  
  	
  	if (argums && argums.length) {
	    var response = UMI.prototype.jsonDecode(this.conf.prots.udata + "core/"+ method + "/" + argums.join("/") + this.conf.jsprefix);
  	} else {
		var response = UMI.prototype.jsonDecode(this.conf.prots.udata + "core/"+ method + this.conf.jsprefix);  	
  	}
	return response;
	
  }
  /*

  
  !DATA MODULE
  
  
  */
  
  UMI.prototype.data = {
  	conf : setConf(),
  	/*
  	*
  	* data getProperty(element_id, prop_name)
  	*
  	* element_id - pageid in umi
  	* prop_name - property name
  	*
  	*/
  	getProperty : function(element_id,prop_name) {
	  var response = UMI.prototype.jsonDecode(this.conf.prots.upage + element_id + "." + prop_name + this.conf.jsprefix);
	  return response;
	}
	
  }
  
  /*

  
  !MENU MODULE
  
  
  */

  UMI.prototype.menuDraw = function(method,menu_id){
	  var response = UMI.prototype.jsonDecode(this.conf.prots.udata + "menu/"+ method + "/" + menu_id + this.conf.jsprefix);
	  return response;
  }

  
  /* onload */
  $(window).load(function(){
	  window.umi = new UMI();
	  window.umi.getVersion();
  });
})(jQuery, document, window);