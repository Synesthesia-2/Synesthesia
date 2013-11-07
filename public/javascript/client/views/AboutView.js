ClientSpace.AboutView = Backbone.View.extend({
  
  className: 'about',
  
  events: {
    'click .back': 'backToIndex'
  },

  initialize: function() {
    this.template = this.model.get('templates')['about'];
    // get cast from remote server
    // set this cast to a cast collection
  },

  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    return this;
  },

  backToIndex: function() {
    this.model.loadIndex();
  }

});