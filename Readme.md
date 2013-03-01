# S3Play
### Ember app to play audio files directly from s3

Demo:
<http://s3play.makevoid.com>

To play songs directly from your bucket:
<http://s3play.makevoid.com?bucket=BUCKET_NAME>

Note: You have to have Read and List permissions set.


Try it in a webkit browser (chrome/safari), especially if you have only mp3s ;)

---

### Amazon S3 Configuration

your s3 bucket files must be public, to do so

go to https://console.aws.amazon.com/s3/home

then properties, bucket permissions

and add the following pemissions: Everyone -> List, View

then enter in your bucket, select all your files/folders, then click on Actions > Make public

go to <http://s3play.makevoid.com?bucket=BUCKET_NAME> and enjoy your music!

---

This was made specifically for this ember FLOR talk: [florenceonruby.it/talks/7](http://florenceonruby.it/talks/7)

stream: http://livestream.4ktech.net/channel/florence-on-ruby

music by:
- http://soundcloud.com/aritmiamusic
- http://soundcloud.com/motionless-opaque

---

### TODO:

- feature: save playlist in localstorage + reload button

- feature: keybard events (space = pause/play)

- feature: duplicate tracks removal

- feature: player link and sync
  - history .push and .replace state continuously to link the current song at the current timestamp + login to sync the players ;)



- feature: remote control

- use svgs?

    <svg width="30px" height="30px" viewBox="0 0 100 100">
       <polygon
      points="0,0 100,50 0,100"
      style="fill: green;"/>
    </svg>

## Credits:

Icon: Tiziano Berti <tiz.berti@gmail.com>
