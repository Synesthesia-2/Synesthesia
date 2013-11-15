UpdateSpace.CastMemberView = Backbone.View.extend({

  tagName: 'p',

  className: 'castMember',

  template: _.template('<%= name %>'),
  
  events: {
    'click': 'addMemberToForm'
  },

  initialize: function(params) {
    this.parentView = params.parentView;
  },

  render: function() {
    return this.$el.html(this.template(this.model.attributes));
  },

  addMemberToForm: function(event) {
    this.parentView.addMemberToForm(this.model);
  }

});