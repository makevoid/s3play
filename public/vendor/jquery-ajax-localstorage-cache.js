// ajax-cache-simple
//
// for the original and clean library see: https://github.com/makevoid/jquery-ajax-localstorage-cache/blob/master/ajax-cache-simple.js

// localStorage.clear()

$.ajaxPrefilter(function(options, originalOptions, jqXHR) {

  var key = options.url
  var value = localStorage.getItem( key )
  if (value){
    try {
      value = $.parseJSON(value)
    }
    catch (err) {
    }
    options.success(value)
    jqXHR.abort()
  } else {
    if ( options.success ) {
      options.realsuccess = options.success
      options.success = function(data) {

        // application logic code
        if ($.isXMLDoc(data)){
          array = _( $(data).find("Key") ).map(function(elem){ return $(elem).text() })

          data = JSON.stringify(array)
          localStorage.setItem(key, data)
          options.realsuccess(array)
        } else {
          localStorage.setItem(key, data)
          options.realsuccess(data)
        }

      }
    }
  }

})