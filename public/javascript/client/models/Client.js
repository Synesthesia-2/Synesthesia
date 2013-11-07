ClientSpace.Client = Backbone.Model.extend({

   // TODO : set up remote url on kine-tech.org
   // to receive get requests, and returns show info,
   // cast info for current show, upcoming shows,
   // etc

   initialize: function() {
     this.set('currentShow', '[Name of Performance]');
     this.set('upcomingShows', { 'one': 'Dance Of The Ladies', 'two': 'Gray Swan', 'three': 'Tha Rumpshaker'});
   },

   getCastList: function() {
     this.trigger('castList', this);
   },

   getUpcomingShows: function() {
     this.trigger('shows', this);
   },

   getAbout: function() {
     this.trigger('about', this);
   },

   startShow: function() {
     this.trigger('startShow', this);
   },

   loadIndex: function() {
    this.trigger('loadIndex', this);
   }

});