var albumPicasso = {
 name: 'The Colors',
 artist: 'Pablo Picasso',
 label: 'Cubism',
 year: '1881',
 albumArtUrl: '/images/album-placeholder.png',
 songs: [
     { name: 'Blue', length: '4:26', audioUrl: '/music/placeholders/blue' },
     { name: 'Green', length: '3:14', audioUrl: '/music/placeholders/green' },
     { name: 'Red', length: '5:01', audioUrl: '/music/placeholders/red' },
     { name: 'Pink', length: '3:21', audioUrl: '/music/placeholders/pink' },
     { name: 'Magenta', length: '2:15', audioUrl: '/music/placeholders/magenta' }
   ]
};

blocJams = angular.module('BlocJams', ['ui.router']);

blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
 $locationProvider.html5Mode(true);

 $stateProvider
   .state('landing', {
     url: '/',
     controller: 'Landing.controller',
     templateUrl: '/templates/landing.html'
   })
   
   .state('collection', {
     url: '/collection',
     views: {
      '': {
        templateUrl: '/templates/collection.html',
        controller: 'Collection.controller'
      },
      'playerBar@collection': {
        templateUrl: '/templates/player_bar.html',
        controller: 'PlayerBar.controller'
      }
    }
  })

   .state('album', {
      url: '/album',
      views: {
        '': {
          templateUrl: '/templates/album.html',
          controller: 'Album.controller'
        },
        'playerBar@collection': {
          templateUrl: '/templates/player_bar.html',
          controller: 'PlayerBar.controller'
        }
      }
    })

}]);

blocJams.controller('Landing.controller', ['$scope', function($scope) {
  $scope.subText = "Turn the music up!";

  $scope.subTextClicked = function() {
    $scope.subText += '!';
  };

  $scope.albumURLs = [
   '/images/album-placeholders/album-1.jpg',
   '/images/album-placeholders/album-2.jpg',
   '/images/album-placeholders/album-3.jpg',
   '/images/album-placeholders/album-4.jpg',
   '/images/album-placeholders/album-5.jpg',
   '/images/album-placeholders/album-6.jpg',
   '/images/album-placeholders/album-7.jpg',
   '/images/album-placeholders/album-8.jpg',
   '/images/album-placeholders/album-9.jpg',
  ];

}]);

blocJams.controller('Collection.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.albums = [];
  for (var i = 0; i < 33; i++) {
    $scope.albums.push(angular.copy(albumPicasso));
  }

  $scope.playAlbum = function(album) {
    SongPlayer.setSong(album, album.songs[0]);
  };

}]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.album = angular.copy(albumPicasso);

  var hoveredSong = null;
 
  $scope.onHoverSong = function(song) {
    hoveredSong = song;
  };

  $scope.offHoverSong = function(song) {
    hoveredSong = null;
  };

    $scope.getSongState = function(song) {
     if (song === SongPlayer.currentSong && SongPlayer.playing) {
       return 'playing';
     }
     else if (song === hoveredSong) {
       return 'hovered';
     }
     return 'default';
    };

    $scope.playSong = function(song) {
      SongPlayer.setSong($scope.album, song);
    };
 
    $scope.pauseSong = function(song) {
      SongPlayer.pause();
    };
  
  // $scope.oddSongs = function() {
  //   if ($odd === true) {
  //     return 'background-color: white;';
  //   }

}]);

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
   $scope.songPlayer = SongPlayer;
}]);

blocJams.service('SongPlayer', function() {
  
  var currentSoundFile = null;

  var trackIndex = function(album, song) {
   return album.songs.indexOf(song);
  };

  return {
   currentSong: null,
   currentAlbum: null,
   playing: false,

   play: function() {
     this.playing = true;
     currentSoundFile.play();
   },
   pause: function() {
     this.playing = false;
     currentSoundFile.pause();
   },
   next: function() {
     var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
     currentTrackIndex++;
     if (currentTrackIndex >= this.currentAlbum.songs.length) {
       currentTrackIndex = 0;
     }
     var song = this.currentAlbum.songs[currentTrackIndex];
     this.setSong(this.currentAlbum, song);
   },
   previous: function() {
     var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
     currentTrackIndex--;
     if (currentTrackIndex < 0) {
       currentTrackIndex = this.currentAlbum.songs.length - 1;
     }
     var song = this.currentAlbum.songs[currentTrackIndex];
     this.setSong(this.currentAlbum, song);
   },
   setSong: function(album, song) {
     if (currentSoundFile) {
      currentSoundFile.stop();
     }
     this.currentAlbum = album;
     this.currentSong = song;
     currentSoundFile = new buzz.sound(song.audioUrl, {
      formats: [ "mp3" ],
      preload: true
     });
 
     this.play();
   }
 };
});

blocJams.directive('slider', ['$document', function($document){

var calculateSliderPercentFromMouseEvent = function($slider, event) {
  var offsetX =  event.pageX - $slider.offset().left; // Distance from left
  var sliderWidth = $slider.width(); // Width of slider
  var offsetXPercent = (offsetX  / sliderWidth);
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(1, offsetXPercent);
  return offsetXPercent;
}

return {
  templateUrl: '/templates/directives/slider.html',
  replace: true,
  restrict: 'E',
  scope: {},
  link: function(scope, element, attributes) {
    
    var $seekBar = $(element);

    scope.onClickSlider = function(event) {
      var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
      scope.value = percent * scope.max;
    }

    scope.trackThumb = function() {
      $document.bind('mousemove.thumb', function(event){
        var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
        scope.$apply(function(){
          scope.value = percent * scope.max;
        });
      });
 
    $document.bind('mouseup.thumb', function(){
      $document.unbind('mousemove.thumb');
      $document.unbind('mouseup.thumb');
    });
  };

    scope.value = 0;
    scope.max = 200;
      
      var percentString = function () {
        percent = Number(scope.value) / Number(scope.max)  * 100;
        return percent + "%";
      }

      scope.fillStyle = function() {
        return {width: percentString()};
      }

      scope.thumbStyle = function() {
        return {left: percentString()};
      }    
    }
  };
}]);