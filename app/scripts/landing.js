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

