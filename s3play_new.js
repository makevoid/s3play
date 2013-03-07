var S3Play = Em.Application.create({})
window.S3Play = S3Play

// iphone5 lolfix
if (window.screen.height == 568) { // iPhone 4"
	document.querySelector("meta[name=viewport]").content = "width=320.1"
}

var Conf = {
  bucket_name: "s3play"
}

var set_bucket_from_url = function(){
  var split = location.search.replace(/\?/, '').split(/bucket=/)
  if (split && split[1]) {
    Conf.bucket_name = split[1]
  }
}

set_bucket_from_url()

S3Play.Router.map(function() {
  this.route('artists', { path: "/" })
})

S3Play.ArtistsRoute = Ember.Route.extend({
  setupController: function(controller, playlist) {
    S3.get_all(function(){
      $(".loading_msg").remove()
      controller.set('dirs', S3.dirs)
    })
  },
  
  events: {
    change_artist: function(artist){
      var songs = this.find_songs(artist)
      S3Play.set("current_songs", songs)
      this.render_tracks(artist)
      this.adjust_scroll(artist)
    }
  },
  
  // non ember methods
  
  find_songs: function(artist) {
    return _(S3.songs).select(function(song){
      return song.dir == artist
    })
  },
  
  render_tracks: function(artist) {
    tracks = "<div class='tracks'>"+$(".tracks").html()+"</div>"
    $(".tracks").remove()
    $("a[data-name='"+artist+"']").after(tracks)
  },
  
  adjust_scroll: function(artist){
    // setTimeout(function(){
      var extra_height = $(".player").outerHeight()
      var extra_height2 = extra_height + $(".dir").outerHeight()
      var div = $(".tracks")
      $('html, body').animate({
         scrollTop: div.offset().top - extra_height2
       }, 10)
    // }, 0)
  }
})

// S3Play.SongsRoute = Em.Route.extend({
// })

S3Play.PlayerController = Em.Controller.extend({
  songsBinding: "S3Play.current_songs",
  playing: false,
  current: null,
  song_nameBinding: 'current.name',
  
  init: function(){
    this._super()
    
    var audio = new Audio()
    // audio.addEventListener('ended', function() {
    //   this.get('target').send('next')
    // }.bind(this))
    audio.addEventListener('timeupdate', function(){
      this.update_slider_position()
      // this.store_state()
    }.bind(this))

    this.set('audio', audio)
  },
  
  play_pause: function(){
    if (this.get('playing')) {
      this.pause()
    } else {
      this.play()
    }
  },
  
  play: function(){
    if (!this.get('current'))
      return
      
    this.get('audio').play()
    this.set('playing', true)
  },
  
  pause: function(){
    this.get('audio').pause()
    this.set('playing', false)
  },

  currentTrackChanged: function() {
    var song = this.get('current')
    this.get('audio').src = song.file
    this.play()
  }.observes('current'),

  prev: function(){
    if (!this.get('current'))
      return
    var songs = this.get('songs')
    var index = songs.indexOf(this.get('current')) - 1
    if (index < 0)
      return
    this.set('current', songs.objectAt(index))
  },
  
  next: function(){
    if (!this.get('current'))
      return
    var songs = this.get('songs')
    var index = songs.indexOf(this.get('current')) + 1
    if (index >= songs.length)
      return
    this.set('current', songs.objectAt(index))
  },
  
  // sliders control | volume/seek
  
  set_current_time: function(){
    var time = $(".current_time").val()
    this.set('current_time', time)
  },

  set_volume: function(){
    var volume = $("input.volume").val()
    this.set('volume', volume)
  },

  volume_input: function(){ return $("input.volume").get(0) },
  
  current_time_input: function(){ 
    return $("input.current_time").get(0) 
  },

  update_slider_position: function(evt){
    var seekbar = this.current_time_input()
    var audio = this.get('audio')
    if (!audio.buffered.length)
      return
    seekbar.max = audio.duration
    seekbar.value = audio.currentTime
  },
  
  current_time_changed: function(){
    this.get('audio').currentTime = this.get('current_time')
  }.observes("current_time"),
  
  volume_changed: function() {
    var vol = this.get('volume')
    this.get('audio').volume = vol
    this.volume_input().value = vol
    localStorage.state_volume = vol
  }.observes("volume")
})


S3Play.SongsController = Ember.ArrayController.extend({
  needs: 'player',
  playerBinding: "controllers.player",
  songsBinding: "S3Play.current_songs",
  currentBinding: 'player.current',

  change: function(song){
    this.set('current', song)
  }
})

S3Play.current_songs = Em.A([])

$.get_cached = function(url, callback){
  // return $.get(url, callback)
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

var S3 = {
  
  songs: [],
  dirs: [],
  
  max_song_limit: 100000,
  
  s3_bucket_url: "http://"+Conf.bucket_name+".s3.amazonaws.com",
  
  // helpers
  
  s3_bucket_list: function(last_marker){
    marker = ""
    if (last_marker)
      marker = "?marker="+last_marker
    return this.s3_bucket_url+marker  
  },

  // Ajax

  get_all: function(callback) {
    // http://localhost:3000/?bucket=mkvmusic
    // localStorage.clear()

    if (navigator.userAgent.match(/(iphone|android)/i)) {
      // this.max_song_limit = 500
    }
    
    var cb = function(data) {
      var last_item = _(data).last()
      // console.log(last_item)
      
      if (last_item) {
        this.get_one(last_item, cb)
      } else {
        if (callback){
          callback()
        }
      }
    }.bind(this)

    this.get_one(null, cb)
  },

  get_one: function(marker, callback){
    return $.get_cached(this.s3_bucket_list(marker), function(data){
      
      this.got_one(data)

      if (callback) {
        callback(data)
      }
    }.bind(this))
  },

  got_one: function(data, callback) {
    var files = data

    files.every(function(file, idx){
      // FIXME: where is hol baumann?
      
      if (file.match(/(\/|mp3|ogg|flac|m4a|wav|m3u|au|snd|mid|rmi|aif|aifc|aiff|ra|ram)$/i)){
        this.push_song(file)
      }else{
        // console.log("not audio: "+file)
      }

      return idx < this.max_song_limit // prevent browser crash
    }.bind(this))

    this.dirs = this.dirs.sort()
  },

  push_song: function(file){
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
      var song = { name: name, name_short: name_short, ext: match[1], file: this.s3_bucket_url+"/"+file, dir: dir }
      
      this.songs.push(song)
      if ( !_(this.dirs).include(dir) )
        this.dirs.push(dir)
    }
  }
  
}