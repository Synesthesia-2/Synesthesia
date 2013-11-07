ClientSpace.Server = Backbone.Model.extend({

  initialize:function() {
    this.set('ip', window.location.host);

    this.connection = io.connect('http://' + window.location.host + "/client");
    this.connection.on('welcome', this.setID.bind(this));
    this.connection.on('changeColor', this.setBackgroundColor.bind(this));
    this.connection.on('randomColor', this.randomBackgroundColor.bind(this));
    this.connection.on('switchPainting', this.routePaintSwitch.bind(this));
    this.connection.on('toggleStrobe', this.toggleStrobe.bind(this));
    this.connection.on('newFadeTime', this.newFadeTime.bind(this));

  },

  setID: function(data) {
    this.trigger('setClientDetails', data);
  },

  routePaintSwitch: function(data) {
    if (data.paint) {
      this.trigger('initMotionListener');
    } else {
      this.trigger('removeMotionListener');
    }
  },

  toggleStrobe: function(data) {
    this.trigger('toggleStrobe');
  },

  setBackgroundColor: function(data) {
    this.trigger('changeBG', data);
  },

  randomBackgroundColor: function(data) {
    var i = Math.floor(Math.random() * data.colors.color.length);
    var color = data.colors.color[i];
    this.setBackgroundColor({ color: color, fadeTime: data.fadeTime });
  },

  newFadeTime: function(data) {
    this.trigger('newFadeTime', data);
  },

  emit: function(event, data) {
    this.connection.emit(event, data);
  }

});
