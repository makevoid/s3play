require 'bundler/setup'
Bundler.require :default

class Static < Sinatra::Base
  @@path = File.expand_path("../", __FILE__)

  get '/' do
    send_file "#{@@path}/index.html"
  end
end

run Static