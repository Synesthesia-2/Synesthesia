UpdateSpace.UpdateApp = Backbone.View.extend({

  events: {
    "click .castLink":  "castUpdates",
    "click .eventsLink":  "eventUpdates"
  },

  initialize: function() {
    this.template = this.model.get('templates')['updateApp'];
    $('body').prepend(this.render().el);
    this.router = new UpdateSpace.Router({ el: this.$el.find('#wrapper'), model: this.model });
    Backbone.history.start({pushstate:true});
    this.router.navigate("/cast", {trigger: true} );
  },

  render: function(){
    this.$el.html( this.template() );
    return this;
  },

  castUpdates: function() {
    this.router.navigate("/cast", {trigger: true} );
  },

  eventUpdates: function() {
    this.router.navigate("/events", {trigger: true} );
  }

});