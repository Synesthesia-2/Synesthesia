ClientSpace.ShowView = Backbone.View.extend({
  
  className: "showWrapper",

  events: {
    'touchend #exitShow': 'exitShow',
  },

  initialize: function(params) {
    this.cr = 0;
    this.cg = 0;
    this.cb = 0;
    this.strobeInt = null;
    this.currentColor = '#000000';
    this.fadeTime = 1500;
    this.template = this.model.get('templates')['show'];
    this.server = params.server;
    this.ip = this.server.get('ip');
    this.server.on('changeBG', this.updateBackgroundColor.bind(this));
    this.server.on('setClientDetails', this.setClientDetails.bind(this));
    this.server.on('toggleStrobe', this.toggleStrobe.bind(this));
    this.server.on('newFadeTime', this.newFadeTime.bind(this));
    this.server.on('audioColor', this.audioColor.bind(this));
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
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
    this.model.set('strobe', data.strobe);
    this.model.set('mode', data.mode);
    if (!this.model.get('brushId')){
      this.model.set('brushId', data.id);
    }
  },

  toggleStrobe: function() {
    var strobe = this.model.get('strobe');
    strobe = !strobe;
    this.model.set('strobe', strobe);
    if (strobe && this.currentColor !== "#000000") {
      this.strobe(true);
    } else if (!strobe) {
      this.strobe(false);
    }
  },

  updateBackgroundColor: function(data) {
    this.currentColor = data.color;
    this.fadeTime = parseFloat(data.fadeTime);
    this.$el.animate({
      backgroundColor: this.currentColor
    }, this.fadeTime);
  },

  audioColor: function(data) {
    this.cr = 0;
    this.cg = 0;
    this.cb = 0;
    if (data.hz && data.volume>-40) {
      if (data.hz%38.9<2) {
        this.cr=255;
        this.cg=51;
        this.cb=51;
      } else if (data.hz%41.2<2) {
        this.cr=255;
        this.cg=153;
        this.cb=51;
      } else if (data.hz%43.6<2) {
        this.cr=255;
        this.cg=255;
        this.cb=51;
      } else if (data.hz%46.2<2) {
        this.cr=153;
        this.cg=255;
        this.cb=51;
      } else if (data.hz%49.0<2) {
        this.cr=51;
        this.cg=255;
        this.cb=51;
      } else if (data.hz%51.9<2) {
        this.cr=51;
        this.cg=255;
        this.cb=153;
      } else if (data.hz%55.0<2) {
        this.cr=51;
        this.cg=255;
        this.cb=255;
      } else if (data.hz%58.3<2) {
        this.cr=51;
        this.cg=153;
        this.cb=255;
      } else if (data.hz%61.7<2) {
        this.cr=51;
        this.cg=51;
        this.cb=255;
      } else if (data.hz%65.4<2) {
        this.cr=153;
        this.cg=51;
        this.cb=255;
      } else if (data.hz%69.3<2) {
        this.cr=255;
        this.cg=51;
        this.cb=255;
      } else if (data.hz%73.4<2) {
        this.cr=255;
        this.cg=51;
        this.cb=153;
      }
    }
    this.$el.animate({
      'backgroundColor': 'rgb(' + this.cr + ',' + this.cg + ',' + this.cb + ')'
    }, 20);
  },

  strobe: function(on) {
    if (on) {
      if (this.fadeTime < 150) {
        this.fadeTime = 150;
      }
      var self = this;
      console.log('strobe on');
      this.strobeInt = setInterval(function() {
        self.$el.animate({
          backgroundColor: '#000000'
        }, self.fadeTime / 2-2, function() {
          self.$el.animate({
            backgroundColor: self.currentColor
          }, self.fadeTime / 2-2);
        });
      }, this.fadeTime);
    } else {
      console.log('off');
      clearInterval(this.strobeInt);
      this.strobeInt = null;
    }
  },

  exitShow: function(event) {
    this.removeMotionListener();
    this.model.loadIndex();
  }

});
