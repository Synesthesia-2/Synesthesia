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
    this.model.on('changeColor', this.sendColor.bind(this));
    this.model.on('randomColor', this.randomColor.bind(this));
    this.model.on('newFadeTime', this.newFadeTime.bind(this));

    this.server.on('resetSelf', this.resetSelf.bind(this));
  },

  render: function(){
    this.$el.html( this.template() );
    return this;
  },

  resetSelf: function() {
    this.model.reset();
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
    this.server.emit('changeColor', data);
  },

  randomColor: function(data) {
    this.server.emit('randomColor', data);
  },

  newFadeTime: function(data) {
    this.server.emit('newFadeTime', data);
  }

});