ClientSpace.Client = Backbone.Model.extend({

  initialize: function() {
    this.set('strobe', false);
    this.set('currentColor', '#000000');
    this.set('audioColor', false);
    this.set('currentShow', 'Synesthesia');
    this.setCast();
    this.setEvents();
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
  },

  setCast: function() {
    this.set('castMember', {
      'three': {
        'portrait': 'images/cast/amanda.jpg',
        'name': 'Amanda Barbieri',
        'role': '(Marketing)',
        'bio': 'is an expert in marketing strategy, social media promotion, and visual advertisement design. She is highly motivated, creative, dedicated, and committed towards progressive action. Amanda favors marketing due to her love for, interest in, and background in: design, research, persuasive writing, psychology, social media, and promotion. Please feel free to visit her website at www.amandabarbieri.com to learn more.'
      },
      'four': {
        'portrait': 'images/cast/daiane.jpg',
        'name': 'Daiane Lopes da Silva',
        'role': '(Choreographer)',
        'bio': 'has performed with KUNST-STOFF, Labayen Dance, Mudita arts, Lisbon Dance Company, among others. Her work has been presented in Brazil, France, Holland, U.S.A and Belgium. While living in Europe, she studied at Performing Arts Research and Training Studios (P.A.R.T.S), directed by Anne Teresa the Keershmaeker at Belgium. Daiane has a B.A in Psychology from SFSU and is a member of Phi Betta Kappa honors society.'
      },
      'five': {
        'portrait': 'images/cast/florian.jpg',
        'name': 'Florian Hoenig',
        'role': '(Tech)',
        'bio': ''
      },
      'six': {
        'portrait': 'images/cast/irene.jpg',
        'name': 'Irene Hsiao',
        'role': '(Dancer)',
        'bio': 'has appeared with Kinetech, Winifred Haun & Dancers, Labayen Dance/SF, Opera Cabal, and various projects on three continents. She doesn\'t understand San Francisco\'s obsession with baseball at all.'
      },
      'seven': {
        'portrait': 'images/cast/katherine.jpg',
        'name': 'Katherine Disenhof',
        'role': '(Dancer)',
        'bio': 'is a Bay Area-based dance artist and arts administrator. She graduated from Stanford University in 2012 with a B.A. in Human Biology and received the Louis Sudler Prize in the Performing and Creative Arts. She currently works at Alonzo King LINES Ballet, and is both a dancer and Co-Executive Director at Inside Out Contemporary Ballet.'
      },
      'two': {
        'portrait': 'images/cast/marissa.jpg',
        'name': 'Marissa Katarina Bergmann',
        'role': '(Performer)',
        'bio': 'is a visual artist, performer, and musician, newly relocated to the Bay Area from Southern California. A graduate from Duke University, she is currently working toward her MFA in Interdisciplinary Fine Arts at California College of the Arts. She is passionate about collaboration and the fusion of visual art, dance, technology, music, and live performance. She has directed two of her own performative installations in the past and is currently working with Brenda Wong Aoki, Mark Izu, and Kimi Okada on the upcoming world premiere of MU. 4SEE is her first performance in San Francisco.'
      },
      'eight': {
        'portrait': 'images/cast/mark.jpg',
        'name': 'Mark McBeth',
        'role': '(Photography and Film)',
        'bio': 'documents contemporary Bay Area alternative dance, theater and performance through photography and video. He interviews local makers about their processes and intentions and collaborates with them to produce promotional materials, work samples for grants and media content for performances. His background in the ethics and principles of Permaculture Design, Non-Violent Communication and Community Mediation informs his role as “performance ethnographer”. Some current work can be seen at markmcbethprojects.com.'      },
      'nine': {
        'portrait': 'images/cast/paco.jpg',
        'name': 'Paco Gomes',
        'role': '(Advisor)',
        'bio': 'Paco Gomes fuses western modern dance with his deeply entrenched Brazilian roots to create multi-cultural, multi-faceted dance. Life and art are inextricably tied, as Paco straddles two cultures, uniquely expressing his diverse experiences through dance.'      },
      'ten': {
        'portrait': 'images/cast/raymond.jpg',
        'name': 'Raymond Larrett',
        'role': '(Visual Artist)',
        'bio': 'is an illustrator, cartoonist, graphic artist, raconteur, and lately designer and publisher of digital books, magazines, and apps. Find out more at PuzzledSquirrel.com, and Thunkism.com.'      },
      'eleven': {
        'portrait': 'images/cast/jean.jpg',
        'name': 'Jean Tarantino',
        'role': '(Sound Artist)',
        'bio': 'is a multimedia artist. Her electro-acoustic performance experiments explore the ways that we collaborate to create reality through exchange of information and shared experience. Jean graduated in design from UC Berkeley and studied art at CCAC. She has performed at ArtPad and Shoshana Wayne Gallery and has been included in exhibitions at Intersection for the Arts and Southern Exposure Gallery. Jean has work in the collections of the Museum of Fine Arts, Boston and Intersection for the Arts. '
      },
      'twelve': {
        'portrait': 'images/cast/laura.jpg',
        'name': 'Laura Rae Bernasconi',
        'role': '(Dancer)',
        'bio': 'began her classical ballet training with Paul E. Curtis Jr. and Shawn Stuart in her hometown of Los Gatos, California. Greatly influenced by teachers Richard Gibson, Maria Veigh, Benjamin Harkarvy, Kristine Elliot, Milton Meyers, David Howard and Robert Joffrey, Laura was educated on scholarship at schools of the San Francisco Ballet, Cleveland Ballet and Jacob\'s Pillow Dance Festival. Laura danced the works of Hans Van Manen, Milton Meyers, George Balanchine and Martin Schlaepfer in New York City and in Europe and performed Classical Odissi Temple dance with the Jyoti Kala Mandir College of Indian Dance in India and the US. Ms. Bernasconi choreographed and performed the “Dance of Salome” for the Bruckner House Orchestra in Linz, Austria, "At Shiva\'s Feet" with Labayen Dance/SF at the Cowell Theater in San Francisco, "Suite Simone" and "Nina in India" for the RAW series at the Garage Artspace, "Sensory Transcendence" for the PILOT series at ODC Dance. She re-staged the opera “Aida” for the dancers of Ballet Deutche Oper am Rheim at the LTU Arena in Düsseldorf, Germany and co-choreographed and performed "Raga", an Acro Yoga Dance dance duet at Dance Mission Theater. Under the mentorship of Enrico Labayen, Laura is rehearsal director, founding member and performer of Labayen Dance/SF and an international guest teacher for Nederlans Dans Theater, Dutch National Ballet, Scapino Ballet, the Henny Jurriens Foundation, La La La Human Steps, Alonzo King\'s LINES Ballet, ODC Dance, Smuin Ballet/SF, the Austrialian Dance Theater, and for Carte Blanche, the National Contemporary Company of Norway. As a certified Sivananda Yoga and Acro Yoga Teacher, Shi\'atsu Massage Therapist, Wellnes Instructor and practitioner of the Alexander Technique, Gyrotonic©, Thai Chi and Thai Massage, Laura fuses the healing and performing arts to raise funds in Amsterdam and SF for such organizations as Mama Cash, the Africa Yoga Project and the Ama-Foundation through her Healing Arts Celebration- a gathering of artists of movement, music, nutritional foods, touch and aroma therapies. Laura has recently returned from Europe to the SF Bay Area to teach for LINES Ballet, ODC Dance, and the South Bay Dance Center. She will choreograph and perform with Carlos Venturo and Dance Through Time and continue to collaborate with Labayen Dance/SF.'
      },
      'one': {
        'portrait': 'images/cast/weidong.jpg',
        'name': 'Weidong Yang',
        'role': '(Tech, Director)',
        'bio': 'Weidong has indulged in the fields of science (Ph.D in Physics and MCS Computer Science), dance, photography, and Taiji. Having grown up in China and received high education in US, he has experienced two drastically different cultures. Kinetech demands him to tap into all these past experiences. Weidong envisions Kinetech to be a place for synergy of art and technology, as well as for people with vast different background and training, working together creatively, making beauty that is beyond what’s possible by a single person.'
      },
      'thirteen': {
        'portrait': 'images/cast/george.jpg',
        'name': 'George Bonner',
        'role': '(Server Tech, Audio Detection)',
        'bio': 'spent the last four years as a music professional.  He is currently developing his skills as a software engineer to make the web a more interesting place.  His favorite place in San Francisco is Chinatown, which conveniently is where he happens to live.  Come say hi, he\'d love to meet you.'
      },
      'fourteen': {
        'portrait': 'images/cast/kate.jpg',
        'name': 'Kate Jenkins',
        'role': '(Tech, Visualizations)',
        'bio': 'has been in the Bay Area for most of the past decade doing science (magnets!) and art (blacksmithing!).'
      },
      'fifteen': {
        'portrait': 'images/cast/joey.jpg',
        'name': 'Joey Yang',
        'role': '(Backend, Sockets, Internet, Dancing)',
        'bio': '"We don\'t make mistakes, we just have happy accidents." -Bob Ross'
      },
      'sixteen': {
        'portrait': 'images/cast/ryan.jpg',
        'name': 'David Ryan Hall',
        'role': '(Merge Conflict Creator)',
        'bio': 'does not like writing bios.'
      },
    });
  },

  setEvents: function() {
    this.set('upcoming', {
      'one': {
        'link': 'http://www.kine-tech.org',
        'what': "Open Lab",
        'where': 'KUNST STOFF Arts Space, San Francisco',
        'when': 'Every Tuesday Night at 7:00',
      },
      'two': {
        'link': 'http://www.kine-tech.org',
        'what': "Kine-Tech One Year Anniversary Show",
        'where': 'To Be Determined',
        'when': 'TDB - Check our website regularly for updates!',
      }
    });
  }

});
