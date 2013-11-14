ClientSpace.SingleShowView = Backbone.View.extend({

  className: 'singleShow',
  
  events: {},

  initialize: function(params) {
    this.template = params.clientModel.get('templates')['singleShow'];
  },

  render: function() {
    return this.$el.html(this.template(this.model.attributes));
  }

});