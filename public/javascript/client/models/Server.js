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
    this.trigger('changeBG', data);
  },

  randomBackgroundColor: function(data) {
    console.log(data.colors.color);
    var i = Math.floor(Math.random() * data.colors.color.length);
    console.log(i);
    var color = data.colors.color[i];
    console.log(color);
    this.setBackgroundColor({ color: color, fadeTime: data.fadeTime });
  },

  emit: function(event, data) {
    this.connection.emit(event, data);
  }

});
