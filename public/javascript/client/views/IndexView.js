ClientSpace.IndexView = Backbone.View.extend({
  
  className: "scrollable",
  
  events: {
    "touchend .startShow":  "startShow",
    "touchend .cast":  "showCastList",
    "touchend .upcomingShows":  "showUpcomingShows",
    "touchend .about":  "showAbout"
  },

  initialize: function() {
    this.template = this.model.get('templates')['index'];
  },

  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    return this;
  },

  startShow: function() {
    this.model.startShow();
  },

  showCastList: function(e) {
    this.model.getCastList();
  },

  showUpcomingShows: function() {
    this.model.getUpcomingShows();
  },

  showAbout: function() {
    this.model.getAbout();
  }

});