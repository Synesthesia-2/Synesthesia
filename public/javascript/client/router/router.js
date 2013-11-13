ClientSpace.Router = Backbone.Router.extend({
  
  initialize: function(options) {
    this.$el = options.el;
    this.model = options.model;
  },

  routes: {
    "": "index",
    "showCastList": "showCastList",
    "showUpcomingShows": "showUpcomingShows",
    "show": "startShow",
    "about": "showAbout"
  },
  
  swapView: function(view) {
    if ( this.$el.css('display') == 'none') {
      this.$el.show();
    }
    this.$el.html( view.render().el);
  },

  index: function(){
    console.log('index route');
    var indexView = new ClientSpace.IndexView({ model: this.model  });
    this.swapView(indexView);
  },

  showCastList: function() {
    console.log('cast route');
    var cast = new Cast();
    var castView = new ClientSpace.CastView({ model: this.model, collection: cast });
    this.swapView(castView);
  },

  showAbout: function() {
    console.log('about route');
    var aboutView = new ClientSpace.AboutView({ model: this.model });
    this.swapView(aboutView);
  },

  showUpcomingShows: function() {
    console.log('upcoming shows route');
    var showsView = new ClientSpace.UpcomingShowsView({ model: this.model });
    this.swapView(showsView);
  },

  startShow: function() {
    console.log('start show');
    var that = this;
    this.$el.fadeOut(1000, function() {
      var server = new ClientSpace.Server();
      var showView = new ClientSpace.ShowView({ model: that.model, server: server });
      that.swapView(showView);
    });
  }

});