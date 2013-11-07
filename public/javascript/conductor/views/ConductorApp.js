ConductorSpace.ConductorApp = Backbone.View.extend({

  className: "mainPage",

  initialize: function(params) {
    this.template = this.model.get('templates')['conductorApp'];
    this.server = params.server;
    $('body').prepend(this.render().el);
    this.router = new ConductorSpace.Router({ el: this.$el.find('#container'), model: this.model });
    Backbone.history.start({pushstate:true});
    this.model.on('toggleSound', this.toggleSound.bind(this));
    this.model.on('togglePaint', this.togglePaint.bind(this));
    this.model.on('toggleStrobe', this.toggleStrobe.bind(this));
    this.model.on('sendColor', this.sendColor.bind(this));
  },

  render: function(){
    this.$el.html( this.template() );
    return this;
  },

  toggleStrobe: function(data) {
    this.server.emit('toggleStrobe', { strobe: data.strobe });
  },

  togglePaint: function(data) {
    this.server.emit('switchPainting', { paint: data.paint });
  },

  toggleSound: function(data) {
    this.server.emit('toggleSound', { sound: data.sound });
  },

  sendColor: function(data) {
    this.server.emit('sendColor', data);
  }

});