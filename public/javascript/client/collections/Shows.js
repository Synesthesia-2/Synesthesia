ClientSpace.Shows = Backbone.Collection.extend({

  model: ClientSpace.Show,
  url: '/upcomingShows',

  initialize: function() {
    this.fetch();
  }

});