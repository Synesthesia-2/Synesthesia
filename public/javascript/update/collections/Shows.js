UpdateSpace.Shows = Backbone.Collection.extend({

  model: UpdateSpace.Show,
  url: '/upcomingShows',

  initialize: function() {
    this.fetch();
  }

});