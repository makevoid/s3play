# Ember.js Presentation
-                                             note: display 20 lines



### Setup

    Em = Ember

    yourApp = Em.Application.create({})



build a basic application









### Views and Templates (handlebars)

handlebars


    <script type="text/x-handlebars" data-template-name="player">

    </script>


define ui

    yourApp = Em.Application.create({
      yourView: Em.View.create({
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






player
  song (current)

songs
  song (multiple)








### Actions

    <a class="play_pause" {{action "play_pause"}} href="javascript:void(0)">











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






### Remote persistence (S3)

set all publics (you may use a hard-to-guess namespace to hide them: ex. "/antani42/")



configs:

  - bucket_url







### Links

- http://emberjs.com/documentation/
- http://docs.emberjs.com/









### Note that

- doesn't work in firefox (mp3 vs ogg)
- layout can be done better than this ^^







### Thanks


@makevoid

this project: github.com/makevoid/s3play