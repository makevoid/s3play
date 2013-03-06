var S3Play = Em.Application.create({})
window.S3Play = S3Play

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

S3Play.Audio = new Audio()

S3Play.ArtistsRoute = Ember.Route.extend({
  setupController: function(controller, playlist) {
    S3.get_all(function(){
      controller.set('dirs', S3.dirs)
    })
  },
  
  events: {
    change_artist: function(artist){
      var songs = this.find_songs(artist)
      S3Play.set("current_songs", songs)

      tracks = "<div class='tracks'>"+$(".tracks").html()+"</div>"
      $(".tracks").remove()
      $("a[data-name='"+artist+"']").after(tracks)
    }
  },
  
  // non ember methods
  
  find_songs: function(artist) {
    return _(S3.songs).select(function(song){
      return song.dir == artist
    })
  }
})

// S3Play.SongsRoute = Em.Route.extend({
// })

S3Play.SongsController = Ember.ArrayController.extend({
  songsBinding: "S3Play.current_songs",
  change: function(song){
    console.log("play", song)
    var audio = S3Play.Audio
    audio.src = song.file
    audio.play()

    // this.audio.play()
  }
})

S3Play.current_songs = Em.A([])

// S3Play.SongsView = Em.View.create({
//   templateName: 'songs',
//   change: function(evt){
//     // S3Play.change_song(evt.context)
//     console.log("changing song")
//   }
// })

// rake routes: S3Play.Router.router.recognizer.names


// this.playerView.appendTo("#s3play")
// this.artistsView.replaceIn(".s3play_songs")


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
  
    var self = this
    
    var cb = function(data) {
      var last_item = _(data).last()
      // console.log(last_item)
      
      if (last_item) {
        self.get_one(last_item, cb)
      } else {
        if (callback){
          callback()
        }
      }
    }

    this.get_one(null, cb)
  },

  get_one: function(marker, callback){
    var self = this
    return $.get_cached(this.s3_bucket_list(marker), function(data){
      
      self.got_one(data)

      if (callback) {
        callback(data)
      }
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

      return idx < self.max_song_limit // prevent browser crash
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
      var song = { name: name, name_short: name_short, ext: match[1], file: self.s3_bucket_url+"/"+file, dir: dir }
      
      self.songs.push(song)
      if ( !_(self.dirs).include(dir) )
        self.dirs.push(dir)
    }
  }
  
}

// 
// S3Play.Router.map(function() {
//   this.route('library') // default route
// });
// 
// 
// 
// S3Play.LibraryRoute = Ember.Route.extend({
//   model: function() {
//     var content = []
// 
//     var songs = [{ "name_short": "test" }, { "name_short": "test2" }];
// 
//     content.pushObjects(songs)
// 
//     return content
//   }
// });
// 
// 
// S3Play.LibraryView = Em.View.extend({
//   tagName: 'section',
// 
//   classNames: ['library']
// });
// 
// S3Play.PlaylistTrackController = Em.ObjectController.extend({
//   // needs: ['playlist'],
// 
//   // currentTrack: Em.computed.alias('controllers.playlist.currentTrack'),
// 
//   // current: function() {
//   //   return this.get('content') === this.get('currentTrack');
//   // }.property('content', 'currentTrack')
// });
// 
// // playlistTrack