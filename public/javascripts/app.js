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
require.register("scripts/album", function(exports, require, module) {
// Example Album
 var albumPicasso = {
   name: 'The Colors',
   artist: 'Pablo Picasso',
   label: 'Cubism',
   year: '1881',
   albumArtUrl: '/images/album-placeholder.png',
   songs: [
       { name: 'Blue', length: '4:26' },
       { name: 'Green', length: '3:14' },
       { name: 'Red', length: '5:01' },
       { name: 'Pink', length: '3:21'},
       { name: 'Magenta', length: '2:15'}
     ]
 };
 
 // Another Example Album
 var albumMarconi = {
   name: 'The Telephone',
   artist: 'Guglielmo Marconi',
   label: 'EM',
   year: '1909',
   albumArtUrl: '/images/album-placeholder.png',
   songs: [
       { name: 'Hello, Operator?', length: '1:01' },
       { name: 'Ring, ring, ring', length: '5:01' },
       { name: 'Fits in your pocket', length: '3:21'},
       { name: 'Can you hear me now?', length: '3:14' },
       { name: 'Wrong phone number', length: '2:15'}
     ]
 };

var createSongRow = function(songNumber, songName, songLength) {
 var template =
     '<tr>'
   + '  <td class="col-md-1">' + songNumber + '</td>'
   + '  <td class="col-md-9">' + songName + '</td>'
   + '  <td class="col-md-2">' + songLength + '</td>'
   + '</tr>'
   ;

 return $(template);
};

var changeAlbumView = function(album) {
  // Update the album title
  var $albumTitle = $('.album-title');
  $albumTitle.text(album.name);

  // Update the album artist
  var $albumArtist = $('.album-artist');
  $albumArtist.text(album.artist);

  // Update the meta information
  var $albumMeta = $('.album-meta-info');
  $albumMeta.text(album.year + " on " + album.label);

  // Update the album image
  var $albumImage = $('.album-image img');
  $albumImage.attr('src', album.albumArtUrl);

  // Update the Song List
  var $songList = $(".album-song-listing");
  $songList.empty();
  var songs = album.songs;
  for (var i = 0; i < songs.length; i++) {
   var songData = songs[i];
   var $newRow = createSongRow(i + 1, songData.name, songData.length);
   $songList.append($newRow);
  }
};

if (document.URL.match(/\/album.html/)) {
  $(document).ready(function() {
   changeAlbumView(albumPicasso);
  });
};
});

;require.register("scripts/app", function(exports, require, module) {
require("./landing");
require('./collection');
require('./album');

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

// Attempt at randomizing output. To ask Phil //  

//   var randomizedAlbumOutput = function() {
//     return Math.floor(Math.random() * (100 - 25)) + 25;
//   };

//   console.log(randomizedAlbumOutput());
  
//   for (i = 0; i < randomizedAlbumOutput(); i++) {
//     var $newThumbnail = buildAlbumThumbnail();
//     $collection.append($newThumbnail);
//   };
// };

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