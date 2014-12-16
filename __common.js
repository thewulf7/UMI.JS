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

            var callback = function(e) {
                try {
                    var func = eval(success);
                    func && func(e, argums);
                    var event = new CustomEvent(module+'2'+method, { detail: {"method":method,"module":this.name,"response":response,"argums":argums} });
                    document.dispatchEvent(event);
                } catch (er) {
                    var funce = eval(error);
                    funce && funce(er);
                }
                return response;
            };

            var response = (argums && argums.length) ? http.jsonDecode(this.config.protocol.udata + this.name + "/" + method + "/" + argums.join("/") + this.config.jsprefix,"GET",options,callback) : http.jsonDecode(this.config.protocol.udata + this.name + "/" + method + this.config.jsprefix,"GET",options,callback);

        }
        this.transform = function (method, argums, options, success, error) {
            var callb = function(response){
                try {
                    var func = eval(success);
                    func && func(response, argums);
                    var event = new CustomEvent(module+'2'+method, { detail: {"method":method,"module":this.name,"response":response,"argums":argums} });
                    document.dispatchEvent(event);
                } catch (e) {
                    var funce = eval(error);
                    funce && funce(e);
                }
                return response;
            }
            var response = (argums && argums.length) ? http.jsonDecode(this.config.protocol.udata + this.name + "/" + method + "/" + argums.join("/") + "?" + this.config.transform,"GET",options,callb) : http.jsonDecode(this.config.protocol.udata + this.name + "/" + method + "?" + this.config.transform,"GET",options,callb);

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
        this.loading = false;
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

            var callb = function(e){
                try {
                    var func = eval(callback);
                    self.list([],function(lresp){
                        var list = lresp;
                        var event = new CustomEvent('add2compare', { detail: {"element":id,"list":list} });
                        document.dispatchEvent(event);
                        self.loading = false;
                    });
                    func && func(e);
                }
                catch (er) {
                    throw "error adding to compare";
                }
                return e;
            };
            if(!self.loading) {
                self.loading = true;
                http.jsonDecode("/emarket/addToCompare/" + id + "/" + this.config.jsprefix, "GET", opts, callb);
            }
        };
        this.remove = function(id, options, callback){
            var self = this;
            var opts = this.__transformOptions(options);
            var calb = function(response){
                try {
                    var func = eval(callback);
                    var list = self.list(function(list){
                        var event = new CustomEvent('remove2compare', { detail: {"element":id,"list":list} });
                        document.dispatchEvent(event);
                        self.loading = false;
                    });
                    func && func(response);
                }
                catch (e) {
                    throw "error removing from compare";
                }
                return response;
            }
            if(!self.loading) {
                self.loading = true;
                http.jsonDecode("/emarket/removeFromCompare/" + id +"/" + this.config.jsprefix, "GET", opts,calb);
            }

        };
        this.list = function(options, callback){
            var opts = this.__transformOptions(options);
            var calb = function(response){
                try {
                    var func = eval(callback);
                    func && func(response);
                }
                catch (e) {
                    throw e;
                }
                return response;
            };
            http.jsonDecode(this.config.protocol.udata + "emarket/getCompareList" + this.config.jsprefix, "GET", opts,calb);
        };
    }
    function Basket() {
        this.config = regedit.config;
        this.loading=false;
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
            var calb = function(response){
                try {
                    var func = eval(callback);
                    func && func(response);
                }
                catch (e) {
                    throw e;
                }
                return response;
            }
            http.jsonDecode(this.config.protocol.udata + "emarket/basket" + this.config.jsprefix, "GET", [], calb);

        };
        this.put = function (id, options, callback) {
            var self = this;
            var opts = this.__transformOptions(options);

            var calb = function(response){
                try {
                    var func = eval(callback);
                    var basket = self.get(function(basket){
                        var event = new CustomEvent('add2basket', { detail: {"element":id,"basket":basket} });
                        document.dispatchEvent(event);
                        self.loading = false;
                    });
                    func && func(response);
                }
                catch (e) {
                    throw e;
                }
                return response;
            }
            if(!self.loading) {
                self.loading = true;
                http.jsonDecode(this.config.protocol.udata + "emarket/basket/put/element/" + id + this.config.jsprefix, "POST", opts, calb);
            }
        };
        this.modify = function (id, options, callback) {
            var opts = this.__transformOptions(options);
            var self = this;
            if (opts.amount == 0) {
                this.removeItem(id, callback);
                return;
            }

            var calb =  function(response){
                try {
                    var func = eval(callback);
                    func && func(response);
                    self.loading = false;
                }
                catch (e) {
                    throw e;
                }
                return response;
            }
            if(!self.loading) {
                self.loading = true;
                http.jsonDecode(this.config.protocol.udata + "emarket/basket/put/item/" + id + this.config.jsprefix, "POST", opts,calb);
            }
        };
        this.removeItem = function (id, options, callback) {
            var self = this;
            var opts = this.__transformOptions(options);
            var calb = function(response){
                try {
                    var func = eval(callback);
                    func && func(response);
                    self.loading = false;
                }
                catch (e) {
                    throw e;
                }
                return response;
            }

            if(!self.loading) {
                self.loading = true;

                http.jsonDecode(this.config.protocol.udata + "emarket/basket/remove/item/" + id + this.config.jsprefix, "POST", opts, calb);
            }

        };
        this.removeElement = function (id, options, callback) {
            var opts = this.__transformOptions(options);
            var self = this;
            var calb = function(response){
                try {
                    var func = eval(callback);
                    func && func(response);
                    self.loading = false;
                }
                catch (e) {
                    throw e;
                }
                return response;
            };
            if(!self.loading) {
                self.loading = true;
                http.jsonDecode(this.config.protocol.udata + "emarket/basket/remove/element/" + id + this.config.jsprefix, "POST", opts, calb);
            }
        };
        this.clear = function (callback) {
            var self = this;
            var calb = function(response){
                try {
                    var func = eval(callback);
                    func && func(response);
                    self.loading = false;
                }
                catch (e) {
                    throw e;
                }
                return response;
            };
            if(!self.loading) {
                self.loading = true;
                http.jsonDecode(this.config.protocol.udata + "emarket/basket/remove_all" + this.config.jsprefix, "GET", [], calb);
            }

        };
    }

    /*



     !SYSTEM FUNCTIONS



     */


    /* INIT */

    UMI.prototype.init = function () {
        //getcurrentpage
        var self = this;
        var callback = function(e){
            try{
                self.page = e.page;
                console.timeEnd('umi.js init');
            }
            catch (e) {
                throw "THIS IS NOT UMI";
            }
        };
        http.jsonDecode(regedit.config.protocol.upage + window.location.pathname + regedit.config.jsprefix,"GET",[],callback);
    };

    /* HTTPRequest */

    function http() {
        this.response={};
        this.setResponse = function(value,callme){
            this.response = value;
            var callback = eval(callme);
            callback && callback(value);
        };

        this.make = function(){
            var self = this;
            var argumens = arguments[0];
            var encode = arguments[1] || "";
            var url = argumens[0] || "";

            var type = argumens[1] || "GET";
            var body = argumens[2] || "";
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
                xmlHttp.open(type, url, true);
                xmlHttp.onload = function (e) {
                    if (xmlHttp.readyState === 4) {
                        if (xmlHttp.status === 200 && xmlHttp.responseURL==window.location.origin+url) {
                            var content = (encode!='' && encode=="json") ? JSON.parse(xmlHttp.responseText) : xmlHttp.responseText;
                            self.setResponse(content,argumens[3]);
                        } else {
                            self.setResponse({},argumens[3]);
                        }
                    }
                };
                if (type == "POST") {
                    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xmlHttp.send(body);
                } else {
                    xmlHttp.send(null);
                }
            }
            catch (e) {
                throw e;
            }
        };

        this.jsonDecode = function(){
            this.make(arguments,"json");
        };

    }

    var http = new http();

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