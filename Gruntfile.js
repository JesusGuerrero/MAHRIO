'use strict';

module.exports = function (grunt) {
  
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '*.js',
        'client/**/*.js',
        'server/**/*.js',
        'test/**/*.js',
        '!server/public/**/*.js'
      ]
    },

    less: {
      development: {
        options: {
          //compress: true  //minifying the result
        },
        files: {
          'server/public/css/application.css' : 'client/styles/application.less'
        }
      }
    },

    jade: {
      compile: {
        options: {
          client: false,
          pretty: true
        },
        files: [{
          cwd: 'client/angular/',
          src: ['**/*.jade', '!**/_*.jade'],
          dest: 'server/public/html',
          expand: true,
          ext: '.html'
        }]
      }
    },

    concat: {
      options: {
        separator: '\n'
      },
      angular: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/bootstrap3-wysihtml5-bower/dist/bootstrap3-wysihtml5.all.js',
          'bower_components/jquery-ui/jquery-ui.js',
          'bower_components/underscore/underscore.js',
          'bower_components/socket.io-client/socket.io.js',
          'bower_components/moment/moment.js',
          'bower_components/fullcalendar/dist/fullcalendar.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/jquery.slimscroll/jquery.slimscroll.min.js',
          'bower_components/fastclick/lib/fastclick.js',
          'bower_components/icheck/icheck.min.js',
          'bower_components/Chart.js/Chart.js',
          'bower_components/angular/angular.js',
          'bower_components/angular-ui-router/release/angular-ui-router.js',
          'bower_components/angular-ui-sortable/sortable.min.js',
          'bower_components/angular-ui-bootstrap/src/modal/modal.js',
          'bower_components/angular-ui-bootstrap/src/typeahead/typeahead.js',
          'bower_components/angular-ui-bootstrap/src/position/position.js',
          'bower_components/angular-ui-bootstrap/src/bindHtml/bindHtml.js',
          'bower_components/angular-ui-bootstrap/src/tabs/tabs.js',
          'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
          'bower_components/angular-resource/angular-resource.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-cookies/angular-cookies.js',
          'bower_components/angular-sanitize/angular-sanitize.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/angular-touch/angular-touch.js',
          'bower_components/angular-loading-bar/build/loading-bar.js',
          'bower_components/angular-underscore/angular-underscore.min.js',
          'bower_components/angular-socket-io/socket.js',
          'bower_components/angular-chart.js/dist/angular-chart.js',
          'bower_components/matchHeight/jquery.matchHeight-min.js'
        ],
        dest: 'server/public/js/angular.js'
      },
      utils: {
          src: [

              'bower_components/jquery/dist/jquery.js',
              'bower_components/jquery.videoBG/jquery.videoBG.js',
              'bower_components/bootstrap/dist/js/bootstrap.js',
              'bower_components/requirejs/require.js',
              'client/requirejs/setup.js'
          ],
          dest: 'server/public/js/utils.js'
      },
      application: {
        src: [
          'server/public/js/angular.js',
          'client/AdminLTE/AdminLTE.js',
          'client/angular/application.js',
          'client/angular/**/*.js'
        ],
        dest: 'server/public/js/application.js'
      }
    },

    karma: {
      once: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      },
      watch: {
        configFile: 'test/karma.conf.js'
      }
    },

    exec: {
      npmTest: 'npm test'
    },

    copy: {
      build: {
        cwd: 'bower_components',
        src: [ 'fontawesome/fonts/*.{otf,eot,svg,ttf,woff,woff2}', 'bootstrap/fonts/*.{otf,eot,svg,ttf,woff,woff2}'],
        dest: 'server/public/fonts',
        expand: true,
        flatten: true
      },
      jade: {
        cwd: 'client/views',
        src: ['**/_*.jade'],
        dest: 'server/views',
        expand: true
      },
      html: {
        cwd: 'client/angular',
        src: ['**/*.html'],
        dest: 'server/public/html',
        expand: true
      },
      requireJs: {
        cwd: 'client/requirejs',
        src: ['**/*.js', '!setup.js'],
        dest: 'server/public/require',
        expand: true
      }
    },

    watch: {
      less: {
        files: ['client/styles/**/*.less'],
        tasks: ['less']
      },
      angular: {
        files: ['client/angular/**/*.jade', '!**/_*.jade'],
        tasks: ['jade']
      },
      requireJs: {
        files: ['client/requirejs/**/_*.js'],
        tasks: ['copy:requireJs']
      },
      jade: {
        files: ['client/views/**/_*.jade'],
        tasks: ['copy:jade']
      },
      scripts: {
        files: [
          '*.js',
          'server/**/*.js',
          '!server/public/**/*.js',
          'client/**/*.js',
          'test/**/*.js'
        ],
        tasks: ['jshint:all', 'concat']
      }
    }
  });

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['less', 'jade', 'concat', 'copy']);
};
