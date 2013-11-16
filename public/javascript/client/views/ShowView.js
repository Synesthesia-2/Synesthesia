ClientSpace.ShowView = Backbone.View.extend({
  
  className: "showWrapper",

  events: {
    'click #exitShow': 'exitShow'
  },

  initialize: function(params) {
    this.cr = 0;
    this.cg = 0;
    this.cb = 0;
    this.fadeOutTimer = 0;
    this.fadeInterval = null;
    this.strobeInt = null;
    this.fadeTime = 1500;
    this.template = this.model.get('templates')['show'];
    this.server = params.server;
    this.ip = this.server.get('ip');
    this.server.on('changeBG', this.updateBackgroundColor.bind(this));
    this.server.on('setClientDetails', this.setClientDetails.bind(this));
    this.server.on('toggleStrobe', this.toggleStrobe.bind(this));
    this.server.on('newFadeTime', this.newFadeTime.bind(this));
    this.server.on('audioColor', this.audioColor.bind(this));
    this.server.on('reset', this.reset.bind(this));
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  },

  reset: function() {
    this.strobe(false);
    this.model.set('strobe', false);
    this.fadeTime = 1500;
    if (this.strobeInt !== null) clearInterval(this.strobeInt);
    this.model.set('currentColor', '#000000');
    this.$el.css({'backgroundColor': '#000000'});
  },

  newFadeTime: function(data) {
    this.fadeTime = data.fadeTime;
    if (this.strobeInt !== null) {
      clearInterval(this.strobeInt);
      this.strobeInt = null;
      this.strobe(true);
    }
  },

  setClientDetails: function(data) {
    console.log(data.mode);
    this.model.set('audioColor', data.audioColor);
    this.model.set('strobe', data.strobe);
    this.model.set('currentColor', data.mode.color);
    if (!this.model.get('brushId')){
      this.model.set('brushId', data.id);
    }
    if (data.audioLights) {
      console.log('audio lights');
      this.audioColor();
    } else if (data.mode.color !== '#000000') {
      this.updateBackgroundColor({ color: data.mode.color, fadeTime: this.fadeTime });
    }
  },

  toggleStrobe: function() {
    var strobe = this.model.get('strobe');
    strobe = !strobe;
    this.model.set('strobe', strobe);
    if (strobe && (this.model.get('currentColor') !== "#000000")) {
      this.strobe(true);
    } else if (!strobe) {
      this.strobe(false);
    }
  },

  updateBackgroundColor: function(data) {
    if (this.model.get('strobe')) {
      this.strobe(false);
      this.strobe(true);
    }
    console.log(data);
    this.model.set('currentColor', data.color);
    this.fadeTime = parseFloat(data.fadeTime);
    this.$el.animate({
      backgroundColor: data.color
    }, this.fadeTime);
  },

  audioColor: function(data) {
    var self = this;
    if (!this.fadeInterval) {
      this.fadeInterval = setInterval(function() {
        self.fadeOutTimer++;
        if (self.fadeOutTimer === 170) {
          self.fadeOut();
        }
        if (self.fadeOutTimer > 800) {
          clearInterval(self.fadeInterval);
          self.fadeInterval = null;
          self.fadeOutTimer = 0;
        }
      }, 1);
    }
    if (data.hz && data.volume>-40) {
      this.fadeOutTimer = 0;
      var modifier = (Math.log(data.hz/110)/Math.log(2) % 1) * (-360);
      var colorHz = pusher.color('yellow').hue(modifier.toString());

      this.cr=colorHz.rgb()[0];
      this.cg=colorHz.rgb()[1];
      this.cb=colorHz.rgb()[2];
      this.$el.animate({
        'backgroundColor': 'rgb(' + this.cr + ',' + this.cg + ',' + this.cb + ')'
      }, 10);
    }
  },

  strobe: function(on) {
    if (on) {
      if (this.fadeTime < 150) {
        this.fadeTime = 150;
      }
      var self = this;
      this.strobeInt = setInterval(function() {
        self.$el.animate({
          backgroundColor: '#000000'
        }, self.fadeTime / 2-2, function() {
          self.$el.animate({
            backgroundColor: self.model.get('currentColor')
          }, self.fadeTime / 2-2);
        });
      }, this.fadeTime);
    } else {
      clearInterval(this.strobeInt);
      this.strobeInt = null;
    }
  },

  fadeOut: function() {
    this.$el.animate({
      backgroundColor: '#000000'
    }, 500);
  },

  exitShow: function(event) {
    this.model.loadIndex();
  }

});
