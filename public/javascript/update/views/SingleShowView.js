UpdateSpace.SingleShowView = Backbone.View.extend({

  tagName: 'p',

  className: 'singleShow',
  
  template: _.template('<%= title %>'),

  events: {
    'click': 'addShowToForm'
  },

  initialize: function(params) {
    this.parentView = params.parentView;
  },

  render: function() {
    return this.$el.html(this.template(this.model.attributes));
  },

  addShowToForm: function(event) {
    this.parentView.addEventToForm(this.model);
  }

});