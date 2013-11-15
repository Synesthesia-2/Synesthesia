UpdateSpace.UpdateEventsView = Backbone.View.extend({
  
  className: 'events',
  
  events: {
    'click #eventSubmit': 'postEventUpdate'
  },

  initialize: function() {
    this.template = this.model.get('templates')['updateEvents'];
    this.collection.on('add', this.render.bind(this));
  },

  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    this.$el.find('.currentEventsList').append(
      this.collection.map(function(item) {
        return '<p>' + item.get('title') + '</p>';
      })
    );
    return this;
  },

  postEventUpdate: function(event) {
    event.preventDefault();
    var data = {};
    var self = this;
    _(event.target.form).each(function(field) {
      if (field.name) {
        if (field.name === 'showdate') {
          data[field.name] = self.formatDate(field.value);
        } else {
          data[field.name] = field.value;
        }
      }
    });
    var newEvent = new UpdateSpace.Show(data);
    newEvent.save();
    this.collection.add(newEvent);
  },

  formatDate: function(date) {
    var months = ["", "January","February","March","April","May","June","July","August","September","October","November","December"];
    date = date.split('-');
    var month = months[date[1]];
    return month + " " + date[2] + ", " + date[0];
  }

});