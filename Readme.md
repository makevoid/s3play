# S3Play - http://s3play.it

### Target:

- integrate digital currencies
- make this into IPFSPlay


### TODO list (near future)

- localstorage clear
- loop
- ui


### Deployed version:


usage: create an s3bucket with a special/non guessable name, upload songs in s3 bucket, add cors policy, 
go to address  BUCKETNAME.s3play.it and you're done!

[BUCKETNAME.s3play.it](http://s3play.it)

but you can fork the project and deploy your own!

This version is simplistic and it doesn't have a public blockchain bitcoin integration like github.com/makevoid/s3play_v2! the road is very long to have a v2 version fully worked, but (still on the v2 version) there is this code (s3play version 1, this repo) modularized.

author note: we'll see, as this is a side project and I'm pretty busy right now I can't really finish it even if I use this app everyday and I would like to integrate something like ipfs after s3 + blockchain (save s3play links / hashes of the song into the blockchain) + optional hash of the user reference (needs A/B testing)


### Support:

- Right now only webkit based browsers are supported (Chrome/Safari/iPhone/Android) because they can play mp3/flac with HTML5 audio.

---

### How to:

### play songs directly from your bucket:
[s3play.makevoid.com?bucket=BUCKET_NAME](http://s3play.makevoid.com?bucket=BUCKET_NAME)

Note: You need to have **Read** and **List** permissions set.


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

also I found it useful to upload all my music (and some friends music) on a/some s3 bucket(s) we only know the name(s) so I'm improving the player, I recently updated ember version

stream: http://livestream.4ktech.net/channel/florence-on-ruby

music in the default bucket (s3play) by:
- http://soundcloud.com/aritmiamusic
- http://soundcloud.com/motionless-opaque
- https://soundcloud.com/draft_
- https://soundcloud.com/adventureclubdubstep

---


### Development

to start the app in the development environment, there are many ways

A) complete, using ruby (1.9+):

complete means the 'guard tools' are run, see Guardfile for more info

install bundler gem and dependencies

    gem install bundler
    bundle

start the server and guard (to automatically concatenate assets):

    foreman start

B) use python simple http server:

    python -m SimpleHTTPServer 3000

---

in both cases go to <http://localhost:3000> and you should see S3Play on the default bucket!

C) otherwise you can use apache/nginx (or similar) and point it to the root folder



### TODO:

- support: flash fallback for firefox etc

- UI need work, especially on mobile version

- feature: playlist localstorage reload button

- feature: keybard events (space = pause/play)

- feature: duplicate tracks removal

- feature: player link and sync
  - history .push and .replace state continuously to link the current song at the current timestamp + login to sync the players ;) [ember routes?]

- feature: remote control

- feature: search

- appcache?

- iphone app with offline music cache

- use svgs?

    <svg width="30px" height="30px" viewBox="0 0 100 100">
       <polygon
      points="0,0 100,50 0,100"
      style="fill: green;"/>
    </svg>

## notes:

list routes:

    S3Play.Router.router.recognizer.names

## to try:

{{#view 'songs'}}

on click, render delle view, tip by @nebulab


## Credits:

Icon: Tiziano Berti <tiz.berti@gmail.com>
