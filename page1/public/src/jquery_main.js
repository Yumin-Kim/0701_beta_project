$.fn.extend({
  
    // Define the threeBarToggle function by extending the jQuery object
    threeBarToggle: function(options){
      
      // Set the default options
      var defaults = {
        color: 'black',
        width: 30,
        height: 25,
        speed: 400,
        animate: true
      }
      var options = $.extend(defaults, options); 
      return this.each(function(){
        
        $(this).empty().css({'width': options.width, 'height': options.height, 'background': 'transparent'});
        $(this).addClass('tb-menu-toggle');
        $(this).prepend('<i></i><i></i><i></i>').on('click', function(event) {
          event.preventDefault();
          $(this).toggleClass('tb-active-toggle');
          if (options.animate) { $(this).toggleClass('tb-animate-toggle'); }
          $('.tb-mobile-menu').slideToggle(options.speed);
        });
        $(this).children().css('background', options.color);
      });
    },
    
    // Define the accordionMenu() function that adds the sliding functionality
    accordionMenu: function(options){
      
      // Set the default options
      var defaults = {
        speed: 400
      }
      var options =  $.extend(defaults, options);
  
      return this.each(function(){
        
        $(this).addClass('tb-mobile-menu');
        var menuItems = $(this).children('li');
        menuItems.find('.sub-menu').parent().addClass('tb-parent');
        $('.tb-parent ul').hide();
        $('.tb-parent > a').on('click', function(event) {
          event.stopPropagation();
          event.preventDefault();
          $(this).siblings().slideToggle(options.speed);
        });
        
      });
    }
  });
  
  // Convert any element into a three bar toggle
  // Optional arguments are 'speed' (number in ms, 'slow' or 'fast') and 'animation' (true or false) to disable the animation on the toggle
  $('#menu-toggle').threeBarToggle({color: 'white', width: 30, height: 25});
  
  // Make any nested ul-based menu mobile
  // Optional arguments are 'speed' and 'accordion' (true or false) to disable the behavior of closing other sub
  $('#menu').accordionMenu();
  let count = 0;
  $('#menu-toggle').click(() => { 
    count++;
    if(count % 2 === 0){
      console.log("Hello")
      $(document.body).removeClass("black")
      $('#map').removeClass('z-indexMap')
      $('#contents').removeClass('z-indexMap')
    }else{
      $(document.body).addClass("black")
      $('#map').addClass('z-indexMap')
      $('#contents').addClass('z-indexMap')
    }
   })