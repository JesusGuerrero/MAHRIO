// Smooth Scrolling: Smooth scrolls to an ID on the current page.
$(function() {
    $('a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Activates floating label headings for the contact form.
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// Owl Carousel Settings
$(".about-carousel").owlCarousel({
    items: 3,
    navigation: true,
    pagination: false,
    navigationText: [
        "<i class='fa fa-angle-left'></i>",
        "<i class='fa fa-angle-right'></i>"
    ],
});

$(".portfolio-carousel").owlCarousel({
    singleItem: true,
    navigation: true,
    pagination: false,
    navigationText: [
        "<i class='fa fa-angle-left'></i>",
        "<i class='fa fa-angle-right'></i>"
    ],
    autoHeight: true,
    mouseDrag: false,
    touchDrag: false,
    transitionStyle: "fadeUp"
});

$(".testimonials-carousel").owlCarousel({
    singleItem: true,
    navigation: true,
    pagination: true,
    autoHeight: true,
    navigationText: [
        "<i class='fa fa-angle-left'></i>",
        "<i class='fa fa-angle-right'></i>"
    ],
    transitionStyle: "backSlide"
});

$(".portfolio-gallery").owlCarousel({
    items: 3,
});

// Magnific Popup jQuery Lightbox Gallery Settings
$('.gallery-link').magnificPopup({
    type: 'image',
    gallery: {
        enabled: true
    },
    image: {
        titleSrc: 'title'
    }
});

// Formstone Wallpaper - Video Background Settings
$("header.video").wallpaper({
    source: {
        poster: "/assets/static/assets/img/bg-mobile-fallback.jpg",
        mp4: "/assets/static/assets/mp4/camera.mp4"
    }
});

// Scrollspy: Highlights the navigation menu items while scrolling.
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Portfolio Filtering Scripts & Hover Effect
$(function() {
    var filterList = {
        init: function() {

            // MixItUp plugin
            // http://mixitup.io
            $('#portfoliolist').mixitup({
                targetSelector: '.portfolio',
                filterSelector: '.filter',
                effects: ['fade'],
                easing: 'snap',
                // call the hover effect
                onMixEnd: filterList.hoverEffect()
            });

        },

        hoverEffect: function() {

            // Simple parallax effect
            $('#portfoliolist .portfolio').hover(
                function() {
                    $(this).find('.caption').stop().animate({
                        bottom: 0
                    }, 200, 'easeOutQuad');
                    $(this).find('img').stop().animate({
                        top: -20
                    }, 300, 'easeOutQuad');
                },
                function() {
                    $(this).find('.caption').stop().animate({
                        bottom: -75
                    }, 200, 'easeInQuad');
                    $(this).find('img').stop().animate({
                        top: 0
                    }, 300, 'easeOutQuad');
                }
            );

        }

    };

    filterList.init();
});

// Load WOW.js on non-touch devices
var isPhoneDevice = "ontouchstart" in document.documentElement;
$(document).ready(function() {
    if (isPhoneDevice) {
        //mobile
    } else {
        //desktop               
        // Initialize WOW.js
        wow = new WOW({
            offset: 50
        })
        wow.init();
    }
});

angular.module('mahrio', [])
  .controller('AccountController', ['$scope', function( $scope ) {
      $scope.accountLink = function(){
          if( typeof window.localStorage.Authorization !== 'undefined' ){
              window.location.href = '/app';
          } else {
              $('#authModal').modal('show');
          }
      }
  }])
  .controller('AuthenticationController', ['$scope', '$http',
      function($scope, $http){
          $scope.view = 'login';
          $scope.user = {};
          $scope.login = function(){
              $http.post( '/api/session/login', $scope.user)
                .then( function(res){
                    $http.defaults.headers.common.Authorization = res.headers('Authorization');
                    window.localStorage.Authorization = res.headers('Authorization');
                    //window.localStorage.Access = res.data.user.access;
                    window.location.href = window.location.protocol + '//' + window.location.host + '/app';
                }, function(){
                    $scope.failed = true;
                    $scope.user = {};
                });
          };
        }]);

