ClientSpace.AboutView = Backbone.View.extend({
  
  className: 'about scrollable',
  
  events: {
    'touchend .back': 'backToIndex',
    'mousedown .back': 'backToIndex'
  },

  initialize: function() {
    this.template = this.model.get('templates')['about'];
  },

  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    return this;
  },

  backToIndex: function() {
    this.model.loadIndex();
  }

});