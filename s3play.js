var Songs = [
  // Em.Object.create({ name: "Adebisi Shank - Logdrum", file: "songs/adebisi_shank-logdrum.mp3" }),
  //  Em.Object.create({ name: "Aphex Twin - Avril 14th", file: "songs/aphex_twin-avril_14th.mp3" }),
  //  Em.Object.create({ name: "Ronald Jenkees - Disorganized Fun", file: "songs/ronald_jenkees-disorganized_fun.mp3" }),
  Em.Object.create({ name: "Ratatat - One", file: "songs/ratatat-one.mp3" }),
  Em.Object.create({ name: "Brontide - Sans Souci", file: "songs/brontide-sans-souci.mp3" }),
  Em.Object.create({ name: "edIT - Screening Phone Calls", file: "songs/edit-screening-phone-calls.mp3" }),
  Em.Object.create({ name: "Younger Brother - Pound A Rythm", file: "https://s3-eu-west-1.amazonaws.com/mkvmusic/Younger+Brother/Vaccine/03+Pound+A+Rhythm.mp3" })

]

S3PlayEmberApp = Em.Application.create({})

S3Play = Em.Object.create({
  songs: [],
  current: Em.Object.create({ name: "not loaded", file: "test" }),
  audio: null,
  state: null,
  states: [null, "loading", "playing", "paused"],

  // views

  playerView: Em.View.create({
    templateName: 'player',
    song_nameBinding: "S3Play.current.name",
    fileBinding: "S3Play.current.file",
    play_pause: function(evt){
      self.play_pause()
    },
    prev: function(evt){
      self.prev()
    },
    next: function(evt){
      self.next()
    }
  }),

  songsView: Em.View.create({
    templateName: 'songs',
    songsBinding: 'S3Play.songs',
    change: function(evt){
      self.change_song(evt.context)
    }
  }),

  // constructor

  init: function(){
    this.load(Songs)
    self = this
    $(function(){
      self.playerView.appendTo("#s3play")
      self.songsView.replaceIn(".s3play_songs")
      setTimeout(
        function(){
          self.bind_ui()
          // self.play()
        }, 0
      )
    })
  },

  // ui

  bind_ui: function(){
    this.audio = $(".s3play_audio").get(0)
    window.audio = this.audio
  },

  // controls

  play_pause: function(){
    if (this.state == "playing")
      this.pause()
    else
      this.play()
  },

  play: function(){
    this.audio.play()
    this.state = "playing"
  },

 //  this.change_song = function(song){
 //    this.pause()
 //    idx = _(this.songs).indexOf(song)
 //    this.current = idx
 //    this.play()
 //  }

  pause: function(){
    this.audio.pause()
    this.state = "paused"
  },

 //  this.next = function(){
 //    this.pause()
 //    this.current += 1
 //    if (this.current >= this.songs.length)
 //      this.current = 0
 //    this.play()
 //  }

 //  this.prev = function(){
 //    this.pause()
 //    this.current -= 1
 //    if (this.current <= -1)
 //      this.current = this.songs.length-1
 //    this.play()
 //  }

  // loading

  load: function(songs){
    var self = this
    songs.forEach(function(song) {
      self.songs.push(song)
    })
    // this.current.set(this.songs[0])
    this.current.set("name",  this.songs[0].name)
    this.current.set("file",  this.songs[0].file)
  }

})

// S3Play.init() // called automatically