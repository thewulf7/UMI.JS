var umi = (function () {
    "use strict";

    console.time('umi.js init');
    /* CONFIG */

    function Configuration() {
        this.config = {
            version: "0.1",
            jsprefix: ".json",
            transform: "/layouts/ajax.xsl",
            protocol: {
                upage: "/upage/",
                udata: "/udata/",
                uobject: "/uobject/"
            }
        };
    }

    Configuration.prototype.setValue = function (name, val) {
        try {
            this.config[name] = val;
        } catch (err) {
            throw err;
        }
    };

    var regedit = new Configuration();

    /* construct */
    function UMI(params) {

        for (var obj in params) {
            regedit.setValue(obj, params[obj]);
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

    function Module(moduleName, customconfig) {
        this.name = moduleName;
        this.config = regedit.config;

        if(customconfig) {
            for (var obj in customconfig) {
                try {
                    this.config[obj] = customconfig[obj];
                } catch (e) {
                    throw e;
                }
            }
        }

        this.makeCall = function (method, argums, options, success, error) {
            var response = (argums && argums.length) ? UMI.prototype.jsonDecode(this.config.protocol.udata + this.name + "/" + method + "/" + argums.join("/") + this.config.jsprefix,"GET",options) : UMI.prototype.jsonDecode(this.config.protocol.udata + this.name + "/" + method + this.config.jsprefix,"GET",options);
            try {
                var func = eval(success);
                func && func(response, argums);
            } catch (e) {
                var funce = eval(error);
                funce && funce(e);
            }
            return response;
        }
        this.transform = function (method, argums, options, success, error) {
            var response = (argums && argums.length) ? UMI.prototype.jsonDecode(this.config.protocol.udata + this.name + "/" + method + "/" + argums.join("/") + "?" + this.config.transform,"GET",options) : UMI.prototype.jsonDecode(this.config.protocol.udata + this.name + "/" + method + "?" + this.config.transform,"GET",options);
            try {
                var func = eval(success);
                func && func(response, argums);
            } catch (e) {
                var funce = eval(error);
                funce && funce(e);
            }
            return response;
        }
        this.addMethod = function (method, success) {
            if(!this[method]) {
                this[method] = eval(success);
                return true;
            }
            else {
                throw "This method already exists."
            }
        }
    }
    function Compare() {
        this.config = regedit.config;
	    this.__transformOptions = function (options) {
		    var o = {};
		    for (var i in options) {
			    var k;
			    if (i.toLowerCase() != "amount") k = "options[" + i + "]";
			    else k = i;
			    o[k] = options[i];
		    }
		    return o;
	    };
        this.add = function(id, options, callback){
	        var self = this;
            var opts = this.__transformOptions(options);

	        var response = UMI.prototype.jsonDecode("/emarket/addToCompare/" + id +"/"+ this.config.jsprefix, "GET", opts);

            try {
                var func = eval(callback);
	            var list = self.list();
	            var event = new CustomEvent('add2compare', { detail: {"element":id,"list":list} });
	            document.dispatchEvent(event);
                func && func(response);
            }
            catch (e) {
                throw "error adding to compare";
            }
            return response;
        };
        this.remove = function(id, options, callback){
	        var self = this;
            var opts = this.__transformOptions(options);
            var response = UMI.prototype.jsonDecode("/emarket/removeFromCompare/" + id +"/" + this.config.jsprefix, "GET", opts);
            try {
                var func = eval(callback);
	            var list = self.list();
	            var event = new CustomEvent('remove2compare', { detail: {"element":id,"list":list} });
	            document.dispatchEvent(event);
                func && func(response);
            }
            catch (e) {
                throw "error removing from compare";
            }
            return response;
        };
        this.list = function(options, callback){
            var opts = this.__transformOptions(options);
            var response = UMI.prototype.jsonDecode(this.config.protocol.udata + "emarket/getCompareList" + this.config.jsprefix, "GET", opts);
            try {
                var func = eval(callback);
                func && func(response);
            }
            catch (e) {
                throw e;
            }
            return response;
        };
    }
    function Basket() {
        this.config = regedit.config;
        this.__transformOptions = function (options) {
            var o = {};
            for (var i in options) {
                var k;
                if (i.toLowerCase() != "amount") k = "options[" + i + "]";
                else k = i;
                o[k] = options[i];
            }
            return o;
        };
        this.get = function (callback) {
            var response = UMI.prototype.jsonDecode(this.config.protocol.udata + "emarket/basket" + this.config.jsprefix);
            try {
                var func = eval(callback);
                func && func(response);
            }
            catch (e) {
                throw e;
            }
            return response;
        };
        this.put = function (id, options, callback) {
	        var self = this;
            var opts = this.__transformOptions(options);
            var response = UMI.prototype.jsonDecode(this.config.protocol.udata + "emarket/basket/put/element/" + id + this.config.jsprefix, "POST", opts);
            try {
                var func = eval(callback);
	            var basket = self.get();
	            var event = new CustomEvent('add2basket', { detail: {"element":id,"basket":basket} });
	            document.dispatchEvent(event);
                func && func(response);
            }
            catch (e) {
                throw e;
            }
            return response;
        };
        this.modify = function (id, options, callback) {
            var opts = this.__transformOptions(options);

            if (opts.amount == 0) {
                this.removeItem(id, callback);
                return;
            }
            var response = UMI.prototype.jsonDecode(this.config.protocol.udata + "emarket/basket/put/item/" + id + this.config.jsprefix, "POST", opts);
            try {
                var func = eval(callback);
                func && func(response);
            }
            catch (e) {
                throw e;
            }
            return response;
        };
        this.removeItem = function (id, options, callback) {
            var opts = this.__transformOptions(options);
            var response = UMI.prototype.jsonDecode(this.config.protocol.udata + "emarket/basket/remove/item/" + id + this.config.jsprefix, "POST", opts);
            try {
                var func = eval(callback);
                func && func(response);
            }
            catch (e) {
                throw e;
            }
            return response;
        };
        this.removeElement = function (id, options, callback) {
            var opts = this.__transformOptions(options);
            var response = UMI.prototype.jsonDecode(this.config.protocol.udata + "emarket/basket/remove/element/" + id + this.config.jsprefix, "POST", opts);
            try {
                var func = eval(callback);
                func && func(response);
            }
            catch (e) {
                throw e;
            }
            return response;
        };
        this.clear = function (callback) {
            var response = UMI.prototype.jsonDecode(this.config.protocol.udata + "emarket/basket/remove_all" + this.config.jsprefix);
            try {
                var func = eval(callback);
                func && func(response);
            }
            catch (e) {
                throw e;
            }
            return response;
        };
    }

    /*



     !SYSTEM FUNCTIONS



     */


    /* INIT */

    UMI.prototype.init = function () {
        //getcurrentpage
        try {
            this.page = this.jsonDecode(regedit.config.protocol.upage + window.location.pathname + regedit.config.jsprefix).page;
        }
        catch (e) {
            throw "THIS IS NOT UMI";
        }
        console.timeEnd('umi.js init');
    };

    /* HTTPRequest */

    UMI.prototype.http = function (url, type, body) {
        type = type || "GET";
        body = body || "";
        var xmlHttp = null;

        if (body != null) {
            var str = [];
            for (var p in body)
                if (body.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(body[p]));
                }
            body = str.join("&");
        }
        if(url.indexOf("?")==-1) {
            url = url + "?" + body;
        } else {
            url = url + body;
        }
        try {
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open(type, url, false);
            if (type == "POST") {
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttp.send(body);
            } else {
                xmlHttp.send(null);
            }
            if (xmlHttp.status == 200 && xmlHttp.responseURL==window.location.origin+url) {
                return xmlHttp.responseText;
            } else {
	            return "{}";
            }
        }
        catch (e) {
            throw e;
        }
    };

    /* JSON decode */

    UMI.prototype.jsonDecode = function (url, type, options) {
        var content = this.http(url, type, options);
        return JSON.parse(content);
    };
    //METHOD TO ADD NEW MODULE
    UMI.prototype.addNewModule = function (name,params) {
        if(name) UMI.prototype[name] = new Module(name,params);
        return UMI.prototype[name];
    };

    /*
     !MODULES
     */

    var modules = ["banners","blogs20","catalog","comments","content","core","custom","data","emarket","faq","forum","menu","news","photoalbum","search","system","users","webforms"];
    for(var module in modules) {
        UMI.prototype[modules[module]] = new Module(modules[module]);
    }

    /*
     !EXPAND MODULES
     */

    UMI.prototype.data.getProperty = function (element_id, prop_name) {
        var response = UMI.prototype.jsonDecode(regedit.config.protocol.upage + element_id + "." + prop_name + regedit.config.jsprefix);
        return response;
    };

    UMI.prototype.data.getPage = function (page_id) {
        var response = UMI.prototype.jsonDecode(regedit.config.protocol.upage + page_id + regedit.config.jsprefix).page;
        return response;
    };

    UMI.prototype.basket = new Basket();

    UMI.prototype.compare = new Compare();

    //UMI.prototype.form = new Form();

    return new UMI();
})();