UpdateSpace.UpdateEventsView = Backbone.View.extend({
  
  className: 'events',
  
  events: {
    'click .back': 'backToIndex'
  },

  initialize: function() {
    this.template = this.model.get('templates')['updateEvents'];
    this.collection.on('add', this.render.bind(this));
  },

  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    this.$el.find('.currentEventsList').append(
      this.collection.map(function(item) {
        return '<p>' + item.get('title') + '</p>';
      })
    );
    return this;
  },

  backToIndex: function() {
    this.model.loadIndex();
  }

});