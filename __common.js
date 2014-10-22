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
  /*

  MODULE
  
  name - Module name
  config - configs object
  makeCall(method,argums) - function to call api methods in this module;
  			method - method of the module
  			argums - Array of params
  
  */
  
  function Module(moduleName,version){
	  	 this.name = moduleName;
	   this.config = regedit.config;
	  this.version = version;
	 this.makeCall = function(method,argums,success,error){
		  var response = (argums && argums.length) ? UMI.prototype.jsonDecode(this.config.protocol.udata + this.name + "/"+ method + "/" + argums.join("/") + this.config.jsprefix) : UMI.prototype.jsonDecode(this.config.protocol.udata + this.name + "/"+ method + this.config.jsprefix);
		  try {
			  success(response,argums);
			  return response;
		  } catch(e) {
			  error(e);
		  }
	  }
  }
  /*

  
  
  !SYSTEM FUNCTIONS
  
  
  
  */
  
  
  
  /* INIT */
  
  UMI.prototype.init = function(){
	//getcurrentpage
  	try{
  		this.page = this.jsonDecode(regedit.config.protocol.upage+window.location.pathname+regedit.config.jsprefix).page;
  	}
  	catch(e) {
	  	throw "THIS IS NOT UMI";
  	}
  	console.timeEnd('umi.js init');
  };
  
  /* HTTPRequest */
  
  UMI.prototype.http = function(url,type){
  	type = type || "GET";
    var xmlHttp = null;
    try {
	    xmlHttp = new XMLHttpRequest();
	    xmlHttp.open( type, url, false );
	    xmlHttp.send( null );
	    
    }
    catch(e) {
	    throw e;
    }
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
  !MODULES
  */
  	   UMI.prototype.banners = new Module("banners","0.1");
  	   UMI.prototype.blogs20 = new Module("blogs20","0.1");
	   UMI.prototype.catalog = new Module("catalog","0.1");
	  UMI.prototype.comments = new Module("comments","0.1");
	   UMI.prototype.content = new Module("content","0.1");
	   	  UMI.prototype.core = new Module("core","0.1");
	  	  UMI.prototype.data = new Module("data","0.1");	   	  
	   UMI.prototype.emarket = new Module("emarket","0.1");
	       UMI.prototype.faq = new Module("faq","0.1");
         UMI.prototype.forum = new Module("forum","0.1"); 
		  UMI.prototype.menu = new Module("menu","0.1");
		  UMI.prototype.news = new Module("news","0.1");
	UMI.prototype.photoalbum = new Module("photoalbum","0.1");
		UMI.prototype.search = new Module("search","0.1");
		UMI.prototype.system = new Module("system","0.1");
		 UMI.prototype.users = new Module("users","0.1");
	  UMI.prototype.webforms = new Module("webforms","0.1");
  /*
  !EXPAND MODULES
  */
  
  UMI.prototype.data.getProperty = function (element_id,prop_name) {
	  var response = UMI.prototype.jsonDecode(regedit.configig.protocol.upage + element_id + "." + prop_name + regedit.configig.jsprefix);
	  return response;
  };
  
  UMI.prototype.data.getPage = function (page_id) {
	  var response = UMI.prototype.jsonDecode(regedit.config.protocol.upage+page_id+regedit.config.jsprefix).page;
	  return response;
  };
  
  /* onload */
  $(window).load(function(){
	  window.umi = new UMI({version:"0.2"});
  });
})(jQuery,document, window);