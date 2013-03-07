source "http://rubygems.org"

gem "sinatra"

group :development do
  gem "guard"
  gem "guard-livereload"
  gem "guard-concat"

  gem "uglifier" # todo: remove dependency from https://github.com/smgt/guard-minify
  gem "guard-minify", git: "git@github.com:smgt/guard-minify"

  gem "foreman"
  gem "rb-fsevent", '~> 0.9.1' # osx
end
