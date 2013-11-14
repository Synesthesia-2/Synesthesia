ClientSpace.CastView = Backbone.View.extend({

  className: 'cast scrollable',
  
  events: {
    'click .back': 'backToIndex'
  },

  initialize: function() {
    this.template = this.model.get('templates')['castList'];
  },

  render: function() {
    var self = this;
    this.$el.html( this.template(this.model.attributes) );
    this.$el.find('#castList').append(
      this.collection.map(function(item) {
        return new ClientSpace.CastMemberView({ clientModel: self.model, model: item }).render();
      })
    );
    return this;
  },

  backToIndex: function() {
    this.model.loadIndex();
  }

});