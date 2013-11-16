UpdateSpace.Router = Backbone.Router.extend({
  
  initialize: function(options) {
    this.$el = options.el;
    this.model = options.model;
  },

  routes: {
    "cast": "updateCast",
    "events": "updateEvents"
  },
  
  swapView: function(view) {
    this.$el.html( view.render().el);
  },

  updateCast: function() {
    console.log('cast route');
    var updateCastView = new UpdateSpace.UpdateCastView({ model: this.model, collection: this.model.get('cast') });
    this.swapView(updateCastView);
  },

  updateEvents: function() {
    console.log('event route');
    var updateEventsView = new UpdateSpace.UpdateEventsView({ model: this.model, collection: this.model.get('shows') });
    this.swapView(updateEventsView);
  }

});
