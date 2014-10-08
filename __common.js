;(function($, doc, win) {
  "use strict";
  /* mainfunction */
  
  function UMI(){
  	this.defaults = {
	  	 version : "0.1",
	  	jsprefix : "/.json",
		   prots : {
			  	  upage : "/upage/",
			  	  udata : "/udata/",
			  	uobject : "/uobject/"
		   }
  	};
  	//getcurrentpage
  	this.page = this.jsonDecode(this.defaults.prots.upage+window.location.pathname+this.defaults.jsprefix).page;
  }
  /*

  
  
  FUNCTIONS
  
  
  
  */
  
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
  
  /* CurrentVersion of module */
  UMI.prototype.getVersion = function(){
	  console.log(this.defaults.version);
	  return true;
  }
  /* onload */
  $(window).load(function(){
	  window.umi = new UMI();
	  window.umi.getVersion();
  });
})(jQuery, document, window);