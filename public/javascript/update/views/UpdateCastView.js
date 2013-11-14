UpdateSpace.UpdateCastView = Backbone.View.extend({
  
  className: 'castView',
  
  events: {
    'click .submit-button': 'postUpdate'
  },

  initialize: function() {
    this.template = this.model.get('templates')['updateCast'];
    this.collection.on('add', this.render.bind(this));
  },

  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    this.$el.find('.currentCastList').append(
      this.collection.map(function(item) {
        return '<p>' + item.get('name') + '</p>';
      })
    );
    return this;
  },

  postUpdate: function(event) {
    event.preventDefault();
    var data = {};
    _(event.target.form).each(function(field) {
      if (field.name) {
        if(field.name === 'portrait') {
          var val = field.value.split('\\');
          val = val[val.length-1];
          data[field.name] = 'images/cast/' + val;
        } else {
          data[field.name] = field.value;
        }
      }
    });
    var newCastMember = new UpdateSpace.CastMember(data);
    newCastMember.save();
    this.collection.fetch();

  }

});