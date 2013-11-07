ClientSpace.UpcomingShowsView = Backbone.View.extend({
  
  // TODO: ADD VIEW FOR SINGLE SHOW FOR EACH SHOW IN COLLECTION
  className: 'shows',
  
  events: {
    'click .back': 'backToIndex'
  },

  initialize: function() {
    this.template = this.model.get('templates')['showsList'];
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