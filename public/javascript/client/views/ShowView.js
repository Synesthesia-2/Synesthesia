ClientSpace.ShowView = Backbone.View.extend({
  
  className: "showWrapper",

  events: {
    'touchend #exitShow': 'exitShow',
    'touchstart #brushSize' : 'setBrushSize',
    'touchstart .colorBlock': 'setColor'
  },

  initialize: function(params) {
    this.strobeInt = null;
    this.currentColor = '#000000';
    this.fadeTime = 1500;
    this.template = this.model.get('templates')['show'];
    this.server = params.server;
    this.ip = this.server.get('ip');
    this.server.on('changeBG', this.updateBackgroundColor.bind(this));
    this.server.on('initMotionListener', this.initMotionListener.bind(this));
    this.server.on('removeMotionListener', this.removeMotionListener.bind(this));
    this.server.on('setClientDetails', this.setClientDetails.bind(this));
    this.server.on('toggleStrobe', this.toggleStrobe.bind(this));
    this.server.on('newFadeTime', this.newFadeTime.bind(this));
    this.emitGyro = this.emitGyro.bind(this); // bind for context
    this.onDeviceMotion = this.onDeviceMotion.bind(this);
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
    this.model.set('brushId', data.id);
    this.model.set('mode', data.mode);
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
    // if (this.strobeInt !== null) {

    //   clearInterval(this.strobeInt);
    //   this.strobeInt = null;
    // }
    this.currentColor = data.color;
    this.fadeTime = parseFloat(data.fadeTime);
    this.removeMotionListener(false);
    this.$el.animate({
      backgroundColor: this.currentColor
    }, this.fadeTime);
    // if (this.model.get('strobe')) {
    // }
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

  initMotionListener: function() {
    console.log('motion on');
    this.$el.animate({
      backgroundColor: '#000000'
    }, 500);
    this.$el.find('#wrapper').fadeIn(500);
    window.addEventListener('deviceorientation', this.emitGyro);
    window.addEventListener('devicemotion', this.onDeviceMotion);
  },

  removeMotionListener: function(colorChange) {
    var that = this;
    console.log('motion off');
    this.$el.find('#wrapper').fadeOut(500);
    if (colorChange === true) {
      this.$el.animate({
        backgroundColor: that.currentColor
      }, 500);
    }
    window.removeEventListener('deviceorientation', this.emitGyro);
    window.removeEventListener('devicemotion', this.emitGyro);
  },

  emitGyro: function(event){
    var alpha = Math.round(event.alpha);
    var beta = Math.round(event.beta);
    var gamma = Math.round(event.gamma);
    var data = {
      alpha: alpha,
      beta: beta,
      gamma: gamma,
      color: this.model.get('color'),
      brushSize: this.model.get('brushSize'),
      brushId: this.model.get('brushId')
    };
    this.server.emit('gyro', data);
  },

  onDeviceMotion: function(event) {
    var aX = event.acceleration.x;
    var aY = event.acceleration.y;
    var aZ = event.acceleration.z;
    var data = {
      aX: aX,
      aY: aY,
      aZ: aZ,
      color: client.get('color'),
      brushSize: client.get('brushSize'),
      brushId: client.get('brushId')
    };
    this.server.emit('paint', data);
  },

  setBrushSize: function(event) {
   this.model.set('brushSize', event.target.value);
  },

  setColor: function(event) {
    this.model.set('color', event.target.dataset.color);
  },

  exitShow: function(event) {
    this.removeMotionListener(false);
    this.model.loadIndex();
  }

});
