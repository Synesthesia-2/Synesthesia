ClientSpace.ClientApp = Backbone.View.extend({
  
  className: "mainPage",

  initialize: function() {
    this.template = this.model.get('templates')['clientApp'];
    this.initializeClientDevice();
    $('body').prepend(this.render().el);
    this.router = new ClientSpace.Router({ el: this.$el.find('#container'), model: this.model });
//    this.router.on('route', this.updateNav, this);
    Backbone.history.start({pushstate:true});
    this.model.on('shows', this.showUpcomingShows, this);
    this.model.on('castList', this.showCastList, this);
    this.model.on('about', this.showAbout, this);
    this.model.on('startShow', this.startShow, this);
    this.model.on('loadIndex', this.loadIndex, this);
    this.model.on('sendMessage', this.showAlert, this);
  },

  render: function(){
    this.$el.html( this.template() );
    return this;
  },

  initializeClientDevice: function() {
    this.model.set('brushSize', 5);
    this.model.set('color',  "#000000");
  },

  startShow: function() {
    this.router.navigate("/show", {trigger: true} );
  },

  loadIndex: function() {
    this.router.navigate("/", {trigger: true} );
  },

  showCastList: function() {
    this.router.navigate("/showCastList", { trigger: true } );
  },

  showAbout: function() {
    this.router.navigate("/about", { trigger: true } );
  },

  showUpcomingShows: function() {
    this.router.navigate("/showUpcomingShows", { trigger: true });
  }

});