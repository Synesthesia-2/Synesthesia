ClientSpace.ShowView = Backbone.View.extend({
  
  className: "showWrapper",

  events: {
    'touchend #exitShow': 'exitShow',
    'touchstart #brushSize' : 'setBrushSize',
    'touchstart .colorBlock': 'setColor'
  },

  initialize: function(params) {
    this.currentColor = '#000000';
    this.template = this.model.get('templates')['show'];
    this.server = params.server;
    this.ip = this.server.get('ip');
    this.server.on('changeBG', this.updateBackgroundColor.bind(this));
    this.server.on('initMotionListener', this.initMotionListener.bind(this));
    this.server.on('removeMotionListener', this.removeMotionListener.bind(this));
    this.server.on('setID', this.setClientID.bind(this));
    this.emitGyro = this.emitGyro.bind(this); // bind for context
    this.onDeviceMotion = this.onDeviceMotion.bind(this);
  },

  render: function() {
    this.$el.html( this.template() );
    return this;
  },

  setClientID: function(id) {
    this.model.set('brushId', id);
  },

  updateBackgroundColor: function(data) {
    var color = data.color;
    var fadeTime = parseFloat(data.fadeTime);
    this.removeMotionListener(false);
    this.currentColor = color;
    this.$el.animate({
      backgroundColor: color
    }, fadeTime);
  },

  initMotionListener: function() {
    this.$el.animate({
      backgroundColor: '#000000'
    }, 1000);
    this.$el.find('.controls').fadeIn(500);
    window.addEventListener('deviceorientation', this.emitGyro);
    window.addEventListener('devicemotion', this.onDeviceMotion);
  },

  removeMotionListener: function(colorChange) {
    var that = this;
    this.$el.find('.controls').fadeOut(500);
    if (colorChange === false) {
      this.$el.animate({
        backgroundColor: that.currentColor
      }, 1000);
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
