# Guardfile is ran by guard commands (see guard on github)
#
# in this project it will be used to concatenate files js and for the browser plugin livereload (autorefreshes the browser)

# This will concatenate the javascript files specified in :files to public/all.js
guard :concat, type: "js", files: %w(vendor/jquery vendor/handlebars vendor/ember vendor/underscore vendor/jquery-ajax-localstorage-cache s3play), input_dir: "public", output: "public/all"


# TODO: fork guard-minify, fix it, email Simon and then ask him to merge and publish the rubygem

# guard 'minify', input: 'public', output: "public", extension: ".min.js"

# guard 'minify', input: 'public', output: 'public', extension: ".min.css"

guard 'livereload' do
  watch "index.html"
  watch "main.css"
  watch "s3play.js"
  # watch %r{.+\.(html|js|css)} # watches all htmls, js, css
end