# S3Play
### Ember app to play audio files directly from s3

Demo:
<http://s3play.makevoid.com>

To play songs directly from your bucket:
<http://s3play.makevoid.com?bucket=BUCKET_NAME>

Note: You have to have Read and List permissions set.


Try it in a webkit browser (chrome/safari), especially if you have only mp3s ;)

---

This was made specifically for this ember FLOR talk: [florenceonruby.it/talks/7](http://florenceonruby.it/talks/7)

stream: http://livestream.4ktech.net/channel/florence-on-ruby

music by:
- http://soundcloud.com/aritmiamusic
- http://soundcloud.com/motionless-opaque

---

### TODO:

- feature: player link and sync
  - history .push and .replace state continuously to link the current song at the current timestamp + login to sync the players ;)