UpdateSpace.UpdateEventsView = Backbone.View.extend({
  
  className: 'events',
  
  events: {
    'click #eventSubmit': 'postEventUpdate',
    'click #eventDelete': 'deleteEvent'
  },

  initialize: function() {
    this.template = this.model.get('templates')['updateEvents'];
    this.collection.on('add remove', this.render.bind(this));
    this.currentModel = null;
  },

  render: function() {
    var self = this;
    this.$el.html( this.template(this.model.attributes) );
    this.$el.find('.currentEventsList').append(
      this.collection.map(function(item) {
        return new UpdateSpace.SingleShowView({ model: item, parentView: self }).render();
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

  addEventToForm: function(model) {
    this.currentModel = model;
    var form = $('#event-form').get(0);
    form[0].value = model.get('title');
    form[1].value = model.get('link');
    form[2].value = model.get('location');
    form[4].value = model.get('description');
  },

  deleteEvent: function(event) {
    event.preventDefault();
    this.collection.remove(this.currentModel);
    this.currentModel.destroy();
    this.currentModel = null;
  },

  formatDate: function(date) {
    var months = ["", "January","February","March","April","May","June","July","August","September","October","November","December"];
    date = date.split('-');
    var month = months[date[1]];
    return month + " " + date[2] + ", " + date[0];
  }

});