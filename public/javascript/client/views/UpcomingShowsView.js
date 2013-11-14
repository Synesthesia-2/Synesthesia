ClientSpace.UpcomingShowsView = Backbone.View.extend({
  
  // TODO: ADD VIEW FOR SINGLE SHOW FOR EACH SHOW IN COLLECTION
  className: 'shows scrollable',
  
  events: {
    'click .back': 'backToIndex'
  },

  initialize: function() {
    this.template = this.model.get('templates')['showsList'];
  },

  render: function() {
    var self = this;
    this.$el.html( this.template(this.model.attributes) );
    this.$el.find('#showList').append(
      this.collection.map(function(item) {
        return new ClientSpace.SingleShowView({ clientModel: self.model, model: item }).render();
      })
    );
    return this;
  },

  backToIndex: function() {
    this.model.loadIndex();
  }

});