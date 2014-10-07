(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("scripts/app", function(exports, require, module) {
require("./landing");
require('./collection');

});

;require.register("scripts/collection", function(exports, require, module) {
var buildAlbumThumbnail = function() {
  var template =
   '<div class="collection-album-container col-md-2">'
 + '  <img src="/images/album-placeholder.png"/>'
 + '  <div class="caption album-collection-info">'
 + '    <p>'
 + '      <a class="album-name" href="/album.html"> Album Name </a>'
 + '      <br/>'
 + '      <a href="/album.html"> Artist name </a>'
 + '      <br/>'
 + '      X songs'
 + '      <br/>'
 + '    </p>'
 + '  </div>'
 + '</div>';

  return $(template);
};

var updateCollectionView = function() {
  var $collection = $('.collection-container .row')
  $collection.empty();
    
  for (i = 0; i < 33; i++) {
    var $newThumbnail = buildAlbumThumbnail();
    $collection.append($newThumbnail);
  };
};

if (document.URL.match(/\/collection.html/)) {
  $(document).ready(function() {
    updateCollectionView();
  });
};
});

;require.register("scripts/landing", function(exports, require, module) {
$(document).ready(function() { 
   $('.hero-content h3').click(function(){
      subText = $(this).text();
      $(this).text(subText + '!');
   });

   var onHoverAction = function() {
    console.log('Hover action triggered');
    $(this).animate({'margin-top': '10px'});
   };

   var offHoverAction = function() {
    console.log('Off-hover action triggered');
    $(this).animate({'margin-top': '0px'});
   };

   $('.selling-points .point').hover(onHoverAction, offHoverAction);
});


});

;
//# sourceMappingURL=app.js.map