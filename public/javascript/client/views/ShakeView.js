ClientSpace.ShakeView = Backbone.View.extend({
  
  className: "showWrapper",

  events: {
    'click #exitShow': 'exitShow'
  },

  initialize: function(params) {
    // this.cr = 0;
    // this.cg = 0;
    // this.cb = 0;
    // this.fadeOutTimer = 0;
    // this.fadeInterval = null;
    // this.strobeInt = null;
    // this.fadeTime = 1500;
    this.template = this.model.get('templates')['shake'];
    this.server = params.server;
    this.ip = this.server.get('ip');
    // this.server.on('changeBG', this.updateBackgroundColor.bind(this));
    // this.server.on('setClientDetails', this.setClientDetails.bind(this));
    // this.server.on('toggleStrobe', this.toggleStrobe.bind(this));
    // this.server.on('newFadeTime', this.newFadeTime.bind(this));
    // this.server.on('audioColor', this.audioColor.bind(this));
    // this.server.on('reset', this.reset.bind(this));
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  },

  fadeOut: function() {
    this.$el.animate({
      backgroundColor: '#000000'
    }, 500);
  },

  startGyroData: function() {
    
  },

  exitShow: function(event) {
    this.model.loadIndex();
  }

});
