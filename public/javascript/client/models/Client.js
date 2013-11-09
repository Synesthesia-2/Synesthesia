ClientSpace.Client = Backbone.Model.extend({

  // TODO : set up remote url on kine-tech.org
  // to receive get requests, and returns show info,
  // cast info for current show, upcoming shows,
  // etc

  initialize: function() {
    this.set('currentShow', 'Synethesia');
    this.set('upcoming', {
      'one': {
        'link': 'http://www.kunst-stoff.org/projects/Tomi-Paasonen-and-Yannis-Adoniou-create-new-works-for-KUNST-STOFFs-15-Anniversary-Retrospective-Season#prettyPhoto',
        'mainImg': 'images/fpo_show_img.gif',
        'what': "KUNST-STOFF's 15 Anniversary Retrospective Season",
        'where': 'ODC Theater, San Fransisco',
        'when': 'November 8th, 9th and 10th, 2013'
      },
      'two': {
        'link': '',
        'mainImg': 'images/fpo_show_img.gif',
        'what': "Details coming soon!",
        'where': 'The Garage',
        'when': 'November 17th, 2013'
      }
    });

    this.set('cast', {
      'one': {
        'portrait': 'images/cast/weidong.jpg',
        'name': 'Weidong Yang',
        'role': 'Tech, Director',
        'bio': 'Weidong has indulged in the fields of science (Ph.D in Physics and MCS Computer Science), dance, photography, and Taiji. Having grown up in China and received high education in US, he has experienced two drastically different cultures. Kinetech demands him to tap into all these past experiences. Weidong envisions Kinetech to be a place for synergy of art and technology, as well as for people with vast different background and training, working together creatively, making beauty that is beyond what’s possible by a single person.'
      },
      'two': {
        'portrait': 'images/cast/marissa.jpg',
        'name': 'Marissa Katarina Bergmann',
        'role': 'Performer',
        'bio': 'is a visual artist, performer, and musician, newly relocated to the Bay Area from Southern California. A graduate from Duke University, she is currently working toward her MFA in Interdisciplinary Fine Arts at California College of the Arts. She is passionate about collaboration and the fusion of visual art, dance, technology, music, and live performance. She has directed two of her own performative installations in the past and is currently working with Brenda Wong Aoki, Mark Izu, and Kimi Okada on the upcoming world premiere of MU. 4SEE is her first performance in San Francisco.'
      }

    });
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