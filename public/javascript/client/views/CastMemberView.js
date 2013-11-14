ClientSpace.CastMemberView = Backbone.View.extend({

  className: 'castMember',
  
  events: {},

  initialize: function(params) {
    this.template = params.clientModel.get('templates')['castMember'];
  },

  render: function() {
    return this.$el.html(this.template(this.model.attributes));
  }

});