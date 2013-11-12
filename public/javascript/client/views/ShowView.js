ClientSpace.ShowView = Backbone.View.extend({
  
  className: "showWrapper",

  events: {
    'touchend #exitShow': 'exitShow',
  },

  initialize: function(params) {
    this.cr = 0;
    this.cg = 0;
    this.cb = 0;
    this.fadeOutTimer = 0;
    this.fadeInterval = null;
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
    if (this.model.get('strobe')) {
      this.strobe(false);
      this.strobe(true);
    }
    this.currentColor = data.color;
    this.fadeTime = parseFloat(data.fadeTime);
    this.$el.animate({
      backgroundColor: this.currentColor
    }, this.fadeTime);
  },

  audioColor: function(data) {
    //console.log('hz: ' + data.hz + ' volume: ' + data.volume);
//    var oldCR = this.cr, oldCB = this.cb, oldCG = this.cg;
    var self = this;
    if (data.hz && !this.fadeInterval) {
      this.fadeInterval = setInterval(function() {
        self.fadeOutTimer++;
    //     // if (self.fadeOutTimer > 100 && self.fadeOutTIme < 300 && self.fadeOutTimer % 60 === 0) {
          
    //     //   console.log(self.fadeOutTimer, " drifting."); 
    //     //   self.driftColor();
    //     // }
        if (self.fadeOutTimer === 260) {
          self.fadeOut();
        }
        if (self.fadeOutTimer > 1000) {
          clearInterval(self.fadeInterval);
          self.fadeInterval = null;
        }
      }, 1);
    }
    if (data.hz && data.volume>-60) {
      this.fadeOutTimer = 0;
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
    } else {
      this.cr = 0;
      this.cb = 0;
      this.cg = 0;
    }
    this.$el.animate({
      'backgroundColor': 'rgb(' + this.cr + ',' + this.cg + ',' + this.cb + ')'
    }, 90);
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
      console.log('strobe off');
      clearInterval(this.strobeInt);
      this.strobeInt = null;
    }
  },

  fadeOut: function() {
    this.$el.animate({
      backgroundColor: '#000000'
    }, 500);
  },

  driftColor: function() {
    this.cr = this.cr * 0.94;
    this.cg = this.cg * 0.94;
    this.cb = this.cb * 0.94;
    this.$el.animate({
      'backgroundColor': 'rgb(' + this.cr + ',' + this.cg + ',' + this.cb + ')'
    }, 20);
  },

  exitShow: function(event) {
    this.model.loadIndex();
  }

});
