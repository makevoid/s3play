var Songs = [
  Ember.Object.create({ name: "Adebisi Shank - Logdrum", file: "adebisi_shank-logdrum.mp3" }),
  Ember.Object.create({ name: "Aphex Twin - Avril 14th", file: "aphex_twin-avril_14th.mp3" }),
  Ember.Object.create({ name: "Ronald Jenkees - Disorganized Fun", file: "ronald_jenkees-disorganized_fun.mp3" })
]


function S3Play(){
  this.songs = []
  this.current = null
  this.audio = null
  this.state = null
  this.states = [null, "loading", "playing", "paused"]

  this.init = function(){
    this.load(Songs)
    self = this
    $(function(){
      self.bind_ui()
      self.play()
      console.log("S3Play loaded songs")
    })
  }

  this.bind_ui = function(){
    this.audio = $("#s3play audio").get(0)
  }

  this.play_pause = function(){
    if (state == "playing")
      this.pause()
    else
      this.play()
  }

  this.play = function(){
    if (!this.current)
      this.current = 0

    this.load_song()
    console.log(this.audio)
    this.audio.play()
  }

  this.current_song = function() {
    return this.songs[this.current]
  }

  this.load_song = function(){
    file = this.current_song().get("file")
    $(this.audio).attr("src", "songs/"+file)
  }

  this.pause = function(){
    this.audio.pause()
  }

  this.next = function(){

  }

  this.prev = function(){

  }

  this.load = function(songs){
    var self = this
    _(songs).each(function(song) {
      self.songs.push(song)
    })
  }
}