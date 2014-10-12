;(function($, doc, win) {
  "use strict";

  var name = 'js-widget';
  
  var verison = "0.1";
  
  
  //main function
  function Widget(el, opts) {
    this.$el      = $(el);
    this.$el.data(name, this);

    this.defaults = {};

    var meta      = this.$el.data(name + '-opts');
    this.opts     = $.extend(this.defaults, opts, meta);

    this.init();
  }
  //init method
  Widget.prototype.init = function() {
  	console.info("init");
  };
  //destroy method
  Widget.prototype.destroy = function() {
    console.info("destroy");
    /*
this.$el.off('.' + name);
    this.$el.find('*').off('.' + name);
    this.$el.removeData(name);
    this.$el = null;
*/
  };
  //function fo selfinit
  $.fn.widget = function(opts) {
    return this.each(function() {
      new Widget(this, opts);
    });
  };
  //selfinit
  $(doc).on('dom_loaded ajax_loaded', function(e) {
     widget();
  });
})(jQuery, document, window);