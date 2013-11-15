UpdateSpace.Cast = Backbone.Collection.extend({

  model: UpdateSpace.CastMember,
  url: '/cast',

  initialize: function() {
    this.fetch();
  }

});
