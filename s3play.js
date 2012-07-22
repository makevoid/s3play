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
  s3_bucket_url: "http://s3play.s3.amazonaws.com",
  songs: [],
  current: Em.Object.create({ name: "not loaded", file: "test" }),
  audio: null,
  playing: false,


  // views

  playerView: Em.View.create({
    templateName: 'player',
    song_nameBinding: "S3Play.current.name",
    fileBinding: "S3Play.current.file",
    playingBinding: "S3Play.playing",
    play_pause: function(evt){
      S3Play.play_pause()
    },
    prev: function(evt){
      S3Play.prev()
    },
    next: function(evt){
      S3Play.next()
    }
  }),

  songsView: Em.View.create({
    templateName: 'songs',
    songsBinding: 'S3Play.songs',
    change: function(evt){
      S3Play.change_song(evt.context)
    }
  }),

  // constructor

  init: function(){
    this.load(Songs)
    var self = this
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
    this.s3_load()
  },

  // ui

  bind_ui: function(){
    this.audio = $(".s3play_audio").get(0)
    window.audio = this.audio
  },

  // controls

  play_pause: function(){
    (this.playing) ? this.pause() : this.play()
  },

  play: function(){
    this.audio.play()
    this.set("playing", true)
  },

  pause: function(){
    this.audio.pause()
    this.set("playing", false)
  },

  next: function(){
    index = this.index()
    index += 1
    if (index >= this.songs.length)
      index = 0
    this.change_song(this.songs[index])
  },

  prev: function(){
    index = this.index()
    index -= 1
    if (index <= -1)
      index = this.songs.length-1
    this.change_song(this.songs[index])
  },

  change_song: function(song){
    this.pause()
    this.set_current(song)
    var self = this
    setTimeout(function(){
      self.play()
    }, 0)
  },

  // loading

  load: function(songs){
    var self = this
    songs.forEach(function(song) {
      self.songs.push(song)
    })
    this.set_current(songs[0])
  },

  // utils

  set_current: function(song){
    this.current.set("name",  song.name)
    this.current.set("file",  song.file)
  },

  index: function(){
    list = _(this.songs).map(function(s){ return s.name })
    return _(list).indexOf(this.current.name)
  },

  // S3

  s3_load: function(){
    var self = this
    $.get("http://jscrape.it:9393/q/"+encodeURIComponent(this.s3_bucket_url), function(data){
      contents = _(data.childNodes[0].childNodes).select(function(node){ return node.nodeName == "Contents" })
      files = _(contents).map(function(elem){
        key = _(elem.childNodes).find(function(node){ return node.nodeName == "Key" })
        return key.childNodes[0].wholeText
      })

      _(files).each(function(file){
        name = file.replace(/\.\w+$/, '')
        S3Play.songs.push(Em.Object.create({ name: name, file: self.s3_bucket_url+"/"+file }))
        S3Play.songsView.rerender()
      })
    })
  }

})