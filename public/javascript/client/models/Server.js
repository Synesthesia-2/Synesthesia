ClientSpace.Server = Backbone.Model.extend({

  initialize:function() {
    this.set('ip', window.location.host);

    this.connection = io.connect('http://' + window.location.host + "/client");
    this.connection.on('welcome', this.setID.bind(this));
    this.connection.on('changeColor', this.setBackgroundColor.bind(this));
    this.connection.on('randomColor', this.randomBackgroundColor.bind(this));
    this.connection.on('switchPainting', this.routePaintSwitch.bind(this));
  },

  setID: function(data) {
    this.trigger('setID', data.id);
  },

  routePaintSwitch: function(data) {
    if (data.paint) {
      this.trigger('initMotionListener');
    } else {
      this.trigger('removeMotionListener');
    }
  },

  setBackgroundColor: function(data) {
    this.trigger('changeBG', data.color);
  },

  randomBackgroundColor: function(data) {
    var i = Math.floor(Math.random() * 10);
    var color = data.color[i];
    this.setBackgroundColor({ color: color });
  },

  emit: function(event, data) {
    this.connection.emit(event, data);
  }

});
