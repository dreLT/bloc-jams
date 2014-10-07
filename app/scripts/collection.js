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
 + '      X:XX Total Length'
 + '    </p>'
 + '  </div>'
 + '</div>';

  return $(template);
};

var updateCollectionView = function() {
  var $collection = $('.collection-container .row')
  $collection.empty();
  
  var randomizedAlbumOutput = function() {
    return Math.floor(Math.random() * (100 - 25)) + 25;
  };

  console.log(randomizedAlbumOutput());
  
  for (i = 0; i < randomizedAlbumOutput(); i++) {
    var $newThumbnail = buildAlbumThumbnail();
    $collection.append($newThumbnail);
  };
};

if (document.URL.match(/\/collection.html/)) {
  $(document).ready(function() {
    updateCollectionView();
  });
};