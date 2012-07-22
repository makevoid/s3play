# Ember.js Presentation

### Setup

    Em = Ember

    yourApp = Em.Application.create({})










-                                             note: 20 lines

### Views and Templates (handlebars)

define ui

    yourApp = Em.Application.create({
      yourView: Em.View.create({
        attribute: "value"
      }),



      init: function(){
        this.yourView.appendTo(".element")
      }


...






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









### Models and Bindings

play button










### Remote persistence (S3)

set all publics (you may use a hard-to-guess namespace to hide them: ex. "/antani42/")



configs:

  - bucket_url







### Links

http://emberjs.com/documentation/









### Note that

- doesn't work in firefox (mp3 vs ogg)
- layout can be done better than this ^^



### Thanks


@makevoid

github.com/makevoid/s3