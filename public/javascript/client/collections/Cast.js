ClientSpace.Cast = Backbone.Collection.extend({

  model: ClientSpace.CastMember,
  url: '/cast',

  initialize: function() {
    //this.fetch();
  }

});
