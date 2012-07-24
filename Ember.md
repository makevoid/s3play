# Ember.js Presentation
-                                             note: display 20 lines



### Setup

    Em = Ember

    var yourApp = Em.Application.create({})



build a basic application







var S3PlayEmberApp = Em.Application.create({})

var S3Play = Em.Object.create({})






### Some songs

    var Songs = [
      Em.Object.create({ name: "Ratatat - One", file: "songs/ratatat-one.mp3" }),
      Em.Object.create({ name: "Brontide - Sans Souci", file: "songs/brontide-sans-souci.mp3" }),
      Em.Object.create({ name: "edIT - Screening Phone Calls", file: "songs/edit-screening-phone-calls.mp3" }),
      Em.Object.create({ name: "Younger Brother - Pound A Rythm", file: "https://s3-eu-west-1.amazonaws.com/mkvmusic/Younger+Brother/Vaccine/03+Pound+A+Rhythm.mp3" })
    ]



### Views and Templates (handlebars)

handlebars


    <script type="text/x-handlebars" data-template-name="player">

    </script>


define ui

    var yourApp = Em.Application.create({
      yourView: Em.View.create({
        templateName: 'player',
        attribute: "value"
      }),



      init: function(){
        this.yourView.appendTo(".element")
      }


init method is called automatically...









      init: function(){
        datas.bind(yourView)
        this.yourView.appendTo(".element")
        // how to?...










        // ...rtfm!
      }

  })


### app views


    <script type="text/x-handlebars" data-template-name="player">
      <a class="prev" {{action "prev"}} href="javascript:void(0)"> ≪ </a>
      <a class="play_pause" {{bindAttr class="playing"}}  {{action "play_pause"}} href="javascript:void(0)">
        {{#if playing}} ▍▍ {{else}} ▶ {{/if}}
      </a>
      <a class="next" {{action "next"}} href="javascript:void(0)"> ≫ </a>
      <audio  class='s3play_audio' {{bindAttr src="file"}}></audio>
      <div class="song_name">{{song_name}}</div>
      <input class="current_time" type="range" {{action "set_current_time" on="change"}} value=0></type>
    </script>
    <script type="text/x-handlebars" data-template-name="songs">
      <h1>Songs</h1>
      {{#each songs}}
        <a href="javascript:void(0)" {{action "change"}}>{{name}}</a>
      {{/each}}
    </script>













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




    S3Play = Em.Object.create({
      songs: [],
      current: Em.Object.create({ name: "not loaded", file: "test" }),
      audio: null,
      playing: false,

      //...

    })



songsView

playerView



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
      },
      set_current_time: function(evt){
        S3Play.set_current_time(evt)
      }
    }),

    songsView: Em.View.create({
      templateName: 'songs',
      songsBinding: 'S3Play.songs',
      change: function(evt){
        S3Play.change_song(evt.context)
      }
    }),




player
  song (current)

songs
  song (multiple)








### Some CSS please!







#### HTML


    <div class="content">
      <header>
        <h1>S3Play</h1>
      </header>
      <section class="player" id="s3play"></section>
      <section class="s3play_songs playlist songs">
        loading...
      </section>
      <footer>
        source: <a href='https//github.com/makevoid/s3play'>github/makevoid/s3play</a>
      </footer>
    </div>




### Actions

    <a class="play_pause" {{action "play_pause"}} href="javascript:void(0)">



    playerView: Em.View.create({
      templateName: 'player',
      play_pause: function(evt){
        S3Play.play_pause()
      }
      //...
    })

    play_pause: function(){
      // the method is delegate from the view to the controller
    }





### Models and Bindings

- play/pause button
- current track
  - name
  - file


object.set("key", value)

object.get("key") //=> "value"



Em.Object.create({
  attrBinding: "YourApp.method",

  //..


  fooBinding: "YourApp.antani.foo"
})





### Play/Pause


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




### Logic


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
      var list = _(this.songs).map(function(s){ return s.name })
      return _(list).indexOf(this.current.name)
    },






ArrayController:

(not used but cool)

http://docs.emberjs.com/symbols/Ember.ArrayController.html




### Note


Not covered:

Ember Data
Ember StateManager
Ember Router


Higher level components
I personally don't like them, hard to fit in a single presentation, and there is too much "hidden magic" involved in them, try them if you don't want to reimplement stuff.





### Remote persistence (S3)

aws console
create bucket
upload files
set all publics (you may use a hard-to-guess bucket name if you want to hide them)


easiest implementation

use a CORS header allower server/service (es: jscrape.it)
do a GET request to the bucket url (es: http://s3play.s3.amazonaws.com)
search for file names


    s3_bucket_url: "http://s3play.s3.amazonaws.com",

    s3_load: function(){
      var self = this
      $.get("http://jscrape.it:9393/q/"+encodeURIComponent(this.s3_bucket_url), function(data){
        var contents = _(data.childNodes[0].childNodes).select(function(node){ return node.nodeName == "Contents" })
        var files = _(contents).map(function(elem){
          var key = _(elem.childNodes).find(function(node){ return node.nodeName == "Key" })
          return key.childNodes[0].wholeText
        })

        _(files).each(function(file){
          var name = file.replace(/\.\w+$/, '')
          S3Play.songs.push(Em.Object.create({ name: name, file: self.s3_bucket_url+"/"+file }))
          S3Play.songsView.rerender()
        })
      })
    }


configs:

  - bucket_url








### Moar features:

- ended event (play first song and run: audio.currentTime = 150)
- implement a slider for volume / currentTime
- implement playlists
- nicer ui
- firefox support (ogg)
- more S3 api (upload/make public)
- authentication
- groups
- ...









### Links

- http://emberjs.com/documentation/
- http://docs.emberjs.com/









### Note that

- doesn't work in firefox (mp3 vs ogg)
- layout can be done better than this ^^






### Thanks


@makevoid

this project: github.com/makevoid/s3play