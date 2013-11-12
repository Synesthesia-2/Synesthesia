ClientSpace.CastView = Backbone.View.extend({
  // TODO: ADD VIEW FOR SINGLE PERFORMER FOR EACH PERFORMER IN COLLECTION
  className: 'cast scrollable',
  
  events: {
    'click .back': 'backToIndex'
  },

  initialize: function() {
    this.template = this.model.get('templates')['castList'];
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