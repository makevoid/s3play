var Songs = [
  // Em.Object.create({ name: "A song", file: "songs/a-song.mp3" }),
] // load local files here

var bucket_name = "s3play"
var cors = true

var max_song_limit = 100000

if (navigator.userAgent.match(/(iphone|android)/i))
  max_song_limit = 200

var split = location.search.replace(/\?/, '').split(/bucket=/)

if (split && split[1]) {
  bucket_name = split[1]
}

var S3PlayEmberApp = Em.Application.create({})


var S3Play = Em.Object.create({
  s3_bucket_url: "http://"+bucket_name+".s3.amazonaws.com",
  songs: [],
  dirs: [],
  current: Em.Object.create({ name: "not loaded", file: "test" }),
  audio: null,
  playing: false,
  download: "javascript: id(0)",


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
    var self = this
    $(".s3play_audio").on("ended", function(){
      self.next()
    })
    this.audio.addEventListener('timeupdate', function(){
      self.update_slider_position()
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

  // slider control

  set_current_time: function(evt){
    var time = $(evt.target).val()
    this.audio.currentTime = time

    localStorage
  },

  set_volume: function(evt){
    var volume = $(evt.target).val()
    this.audio.volume = volume
  },

  update_slider_position: function(evt){
    // var seekbar = $("input.current_time").get(0)
    // var lastBuffered = this.audio.buffered.end(this.audio.buffered.length-1);
    // seekbar.max = lastBuffered;
    // seekbar.value = this.audio.currentTime;
  },

  // change artist
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
        console.log(elem.offset().top)
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

  s3_load: function(){
    var self = this
    var url
    if (cors)
      url = this.s3_bucket_url
    else
      url = "http://jscrape.it:9393/q/"+encodeURIComponent(this.s3_bucket_url)

    $.get(url, function(data){
      var contents = _(data.childNodes[0].childNodes).select(function(node){ return node.nodeName == "Contents" })
      var files = _(contents).map(function(elem){
        var key = _(elem.childNodes).find(function(node){ return node.nodeName == "Key" })
        return key.childNodes[0].wholeText
      })

      files.every(function(file, idx){
        // FIXME: console.log(file) - where are edIT and hol baumann?

        var name = file.replace(/\.\w+$/, '')
        name = file.replace(/\/$/g, '').replace(/\//g, ' - ')
        var dir = name.match(/(.+?) - /)
        if (dir)
          dir = dir[1]

        var ext_regex = /\.(\w{3})$/
        var match = file.match(ext_regex)
        if (match) {
          name = name.replace(ext_regex, '')
          name_short = name.replace(/(.+?) - /, '')
          var song = Em.Object.create({ name: name, name_short: name_short, ext: match[1], file: self.s3_bucket_url+"/"+file, dir: dir })
          S3Play.songs.push(song)
          if ( !_(S3Play.dirs).include(dir) )
            S3Play.dirs.push(dir)
        }
        return idx < max_song_limit // prevent browser crash
      })
      S3Play.artistsView.rerender()
    })
  }

})