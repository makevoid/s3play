var Songs = [
  Ember.Object.create({ name: "Adebisi Shank - Logdrum", file: "adebisi_shank-logdrum.mp3" }),
  Ember.Object.create({ name: "Aphex Twin - Avril 14th", file: "aphex_twin-avril_14th.mp3" }),
  Ember.Object.create({ name: "Ronald Jenkees - Disorganized Fun", file: "ronald_jenkees-disorganized_fun.mp3" })
]

function S3Play(){
  this.app = Em.Application.create();
  this.songs = []
  this.current = null
  this.audio = null
  this.state = null
  this.states = [null, "loading", "playing", "paused"]

  // views

  this.playerView = Ember.View.create({
    templateName: 'player',
    message: "ready",
    self: this,
    play_pause: function(evt){
      self.play_pause()
    },
    prev: function(evt){
      self.prev()
    },
    next: function(evt){
      self.next()
    }
  })

  this.songsView = Ember.View.create({
    templateName: 'songs',
    name: "not loaded",
    songs: this.songs,
    self: this,
    change: function(evt){
      self.change_song(evt.context)
    }
  });

  this.init = function(){
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
      console.log("S3Play loaded songs")
    })
  }

  this.bind_ui = function(){
    this.audio = $(".s3play_audio").get(0)
  }

  this.play_pause = function(){
    if (this.state == "playing")
      this.pause()
    else
      this.play()
  }

  this.play = function(){
    if (!this.current)
      this.current = 0

    this.load_song()
    this.audio.play()
    this.state = "playing"
  }

  this.current_song = function() {
    return this.songs[this.current]
  }

  this.load_song = function(){
    file = this.current_song().get("file")
    $(this.audio).attr("src", "songs/"+file)
  }

  this.change_song = function(song){
    this.pause()
    idx = _(this.songs).indexOf(song)
    this.current = idx
    console.log(this.current_song())
    this.play()
  }

  this.pause = function(){
    this.audio.pause()
    this.state = "paused"
  }

  this.next = function(){

  }

  this.prev = function(){

  }

  this.load = function(songs){
    var self = this
    songs.forEach(function(song) {
      self.songs.push(song)
    })
  }

  this.display_songs = function(){
    // self.songs.each
  }
}