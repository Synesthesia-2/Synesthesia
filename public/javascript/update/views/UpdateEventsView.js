UpdateSpace.UpdateEventsView = Backbone.View.extend({
  
  className: 'events',
  
  events: {
    'click .back': 'backToIndex'
  },

  initialize: function() {
    this.template = this.model.get('templates')['updateEvents'];
  },

  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    return this;
  },

  backToIndex: function() {
    this.model.loadIndex();
  }

});