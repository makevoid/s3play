if (!console)
  var console = {}

var Songs = [
  // Em.Object.create({ name: "A song", file: "songs/a-song.mp3" }),
] // load local files here

var bucket_name = "s3play"
var cors = true

var max_song_limit = 100000

if (navigator.userAgent.match(/(iphone|android)/i))
  max_song_limit = 500

var split = location.search.replace(/\?/, '').split(/bucket=/)

if (split && split[1]) {
  bucket_name = split[1]
}

var S3PlayEmberApp = Em.Application.create({})

// TODO: max-keys, add to single urls and use marker to rotate trough pages
// "/?max-keys="+max_song_limit
// es: http://xxx.s3.amazonaws.com/?max-keys=5&marker=Quantic


$.get_cached = function(url, callback){
  return $.get(url, callback)
  return $.ajax({
      url          : url,
      localCache   : false,
      cacheTTL     : 1,
      isCacheValid : function(){
        return true;
      },
      dataType: "xml",
      success: callback
  })
}

var S3Play = Em.Object.create({
  s3_bucket_url: "http://"+bucket_name+".s3.amazonaws.com",
  songs: [],
  dirs: [],
  current: Em.Object.create({ name: "not loaded", file: "#" }),
  audio: null,
  playing: false,
  download: "javascript: id(0)",


  // helpers

  s3_bucket_list: function(last_marker){
    marker = ""
    if (last_marker)
      marker = "?marker="+last_marker
    return this.s3_bucket_url+marker
  },


  // views

  playerView: Em.View.create({
    templateName: 'player',
    song_nameBinding: "S3Play.current.name",
    fileBinding: "S3Play.current.file",
    playingBinding: "S3Play.playing",
    downloadBinding: "S3Play.download",
    play_pause: function(evt){
      S3Play.play_pause()
    },
    prev: function(evt){
      S3Play.prev()
    },
    next: function(evt){
      S3Play.next()
    },
    set_current_time: function(evt){
      S3Play.set_current_time(evt)
    },
    set_volume: function(evt){
      S3Play.set_volume(evt)
    }
  }),

  artistsView: Em.View.create({
    templateName: 'artists',
    dirsBinding: 'S3Play.dirs',
    change_artist: function(evt){
      S3Play.change_artist(evt.context)
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
      self.artistsView.replaceIn(".s3play_songs")
    })

    this.s3_load(function(){
      setTimeout(
        function(){
          self.bind_ui()
          self.restore_state()
        }, 0
      )
    })
  },

  
  
  // ui

  bind_ui: function(){
    var self = this
    $(function(){
      this.audio = $(".s3play_audio").get(0)
 
      $(".s3play_audio").off()
      $(".s3play_audio").on("ended", function(){
        self.next()
      })
      this.audio.addEventListener('timeupdate', function(){
        self.update_slider_position()
        self.store_state()
      })
    })
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
    var index = this.index()
    index += 1
    if (index >= this.songs.length)
      index = 0
    this.change_song(this.songs[index])
  },

  prev: function(){
    var index = this.index()
    index -= 1
    if (index <= -1)
      index = this.songs.length-1
    this.change_song(this.songs[index])
  },


  // sliders control | volume/seek

  set_current_time: function(evt){
    var time = $(evt.target).val()
    this.audio.currentTime = time
  },

  set_volume: function(evt){
    var volume = $(evt.target).val()
    this.volume(volume)
  },

  volume_input: function(){ return $("input.volume").get(0) },
  current_time_input: function(){ return $("input.current_time").get(0) },

  volume: function(vol) {
    this.audio.volume = vol
    this.volume_input().value = vol
    localStorage.state_volume = vol
  },

  update_slider_position: function(evt){
    var seekbar = this.current_time_input()
    if (!this.audio.buffered.length)
      return
    seekbar.max = this.audio.duration;
    seekbar.value = this.audio.currentTime;
  },

  store_state: function(evt){
    localStorage.state_time = this.audio.currentTime
    localStorage.state_volume = this.audio.volume
    localStorage.state_file = this.current.file
    localStorage.state_playing = this.get("playing")
  },

  restore_state: function(evt){
    var self = this
    $(function(){
      self.audio = $(".s3play_audio").get(0)
    })
    if (localStorage && localStorage.state_time) {
      var song = this.find_song(localStorage.state_file)
      if (song) {
        this.change_song(song)

        if (!localStorage.state_playing)
          this.pause()
          
        this.volume(localStorage.state_volume)
        var self = this
        var time = localStorage.state_time
        setTimeout(function(){
          if (time != 0) {
            // setTimeout(function(){
              // console.log(self.audio.currentTime)
              if (self.audio && self.audio.currentTime)
                self.audio.currentTime = time
            // }, 1000) // FIXME: remove this, it's awful
          }
        }, 100)
      }
    }
  },

  find_song: function(file){
    return _(this.songs).find(function(song){
      return song.get("file") == file
    })
  },

  // change artist, TODO: refactor

  change_artist: function(artist){
    var songs = _(this.songs).select(function(song){
      return song.dir == artist
    })

    var div = $("<div>")
    var songsView = Em.View.create({
      templateName: 'songs',
      songs: songs,
      change: function(evt){
        S3Play.change_song(evt.context)
      }
    })

    var full = $(".song").length && artist == $(".song").data("artist")
    S3Play.artistsView.rerender()
    setTimeout(function(){
      var extra_height = $(".player").outerHeight()
      var extra_height2 = extra_height + $(".dir").outerHeight()
      if (!full) {
          $("a[data-name='"+artist+"']").after(div)
          songsView.appendTo(div)
          $('html, body').animate({
            scrollTop: div.offset().top - extra_height2
          }, 10)
      } else {
        var elem = $("a[data-name='"+artist+"']").after(div)
        $('html, body').animate({
            scrollTop: elem.offset().top - extra_height
          }, 10)
      }
    }, 0)
  },

  // change song

  change_song: function(song){
    this.pause()
    this.set_current(song)
    this.set("download", song.file)
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

    if (songs[0])
      this.set_current(songs[0])
  },

  // utils

  set_current: function(song){
    this.current.set("name",  song.name)
    this.current.set("file",  song.file)
  },

  index: function(){
    var list = _(this.songs).map(function(s){ return s.name })
    return _(list).indexOf(this.current.name)
  },

  // S3

  s3_load: function(callback){
    var self = this
    var url
    if (cors) {
      url = this.s3_bucket_url
    } else {
      url = "http://jscrape.it:9393/q/"+encodeURIComponent(this.s3_bucket_url)
    }

    this.get_all(callback)
  },

  // Ajax

  get_all: function(callback) {

    // TODO: scan markers (this is very manual)
    var a = this.get_one(null)
    var b = this.get_one("Cat Power")
    var c = this.get_one("Lele")
    var d = this.get_one("Tool")
    $.when(a, b, c, d).done(function(){
      callback()
    })
  },

  get_one: function(marker, callback){
    var self = this
    return $.get_cached(this.s3_bucket_list(marker), function(data){

      bla = data

      self.got_one(data)

      self.artistsView.rerender()
      if (callback)
        callback()
    })
  },

  got_one: function(data, callback) {
    var files = data
    var self = this

    files.every(function(file, idx){
      // FIXME: where are edIT and hol baumann?

      if (file.match(/(\/|mp3|ogg|flac|m4a|wav|m3u|au|snd|mid|rmi|aif|aifc|aiff|ra|ram)$/i)){
        self.push_song(file)
      }else{
        // console.log("not audio: "+file)
      }

      return idx < max_song_limit // prevent browser crash
    })

    self.dirs = self.dirs.sort()
  },

  push_song: function(file){
    var name = file.replace(/\.\w+$/, '')
    name = file.replace(/\/$/g, '').replace(/\//g, ' - ')
    var dir = name.match(/(.+?) - /)
    if (dir)
      dir = dir[1]

    var ext_regex = /\.(\w{3})$/
    var match = file.match(ext_regex)
    var self = this
    if (match) {
      name = name.replace(ext_regex, '')
      name_short = name.replace(/(.+?) - /, '')
      var song = Em.Object.create({ name: name, name_short: name_short, ext: match[1], file: self.s3_bucket_url+"/"+file, dir: dir })
      self.songs.push(song)
      if ( !_(self.dirs).include(dir) )
        self.dirs.push(dir)
    }
  }

})