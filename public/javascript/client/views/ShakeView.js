ClientSpace.ShakeView = Backbone.View.extend({
  
  className: "showWrapper",

  events: {
    'click #exitShow': 'exitShow',
    'click #toggleTracking': 'toggleTracking'
  },

  initialize: function(params) {
    this.template = this.model.get('templates')['shake'];
    this.server = params.server;
    this.ip = this.server.get('ip');
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

  toggleTracking: function() {
    console.log(1);
    this.model.toggleTracking();
  },

  exitShow: function(event) {
    this.model.loadIndex();
  }

});
