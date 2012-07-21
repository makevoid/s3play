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
    this.bind_ui()

    this.load(Songs)
    this.next()
    console.log("S3Play loaded songs")
  }

  this.bind_ui = function(){
    this.audio = $("#s3play .player")
  }

  this.play_pause = function(){

  }

  this.play = function(){

  }

  this.pause = function(){

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