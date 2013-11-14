UpdateSpace.UpdateCastView = Backbone.View.extend({
  
  className: 'castView',
  
  events: {},

  initialize: function() {
    this.template = this.model.get('templates')['updateCast'];
  },

  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    return this;
  }

});