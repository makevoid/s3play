require 'bundler/setup'
Bundler.require :default

class Static < Sinatra::Base
  PATH = File.expand_path("../", __FILE__)

  set :public_folder, PATH

  get '/' do
    send_file "#{PATH}/index.html"
  end
end

run Static