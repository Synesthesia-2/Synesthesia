ConductorSpace.Server = Backbone.Model.extend({

  initialize: function() {
    this.set('ip', window.location.host);
    this.connection = io.connect('http://' + window.location.host + "/conductor");
    console.log('Server connected');
    this.connection.on('welcome', this.handleWelcome.bind(this));
  },

  emit: function(event, data) {
    console.log(event, data);
    this.connection.emit(event, data);
  },

  handleWelcome: function(data) {
    console.log(data);
  }

});