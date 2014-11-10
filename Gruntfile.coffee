eco    = require 'eco'
stylus = require 'stylus'

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    build:
      src: 'src',
      dest: '.'
      tmp: 'tmp'
      release: 'public'

    stylus:
      compile:
        options:
          define:
            url: stylus.url({ paths: ['src'], limit : false })
          compress: false
        files:
          '<%=build.dest%>/css/main.css': ['<%=build.src%>/css/main.styl']
      build:
        options:
          define:
            url: stylus.url({ paths: ['src'], limit : false })
          compress: true
        files:
          '<%=build.release%>/css/main.css': ['<%=build.src%>/css/main.styl']

    watch:
      scripts:
        files: ['<%=build.src%>/js/*.coffee', "<%=build.src%>/css/*.styl", "<%=build.src%>/html/*.eco", "<%=build.src%>/images/*.png"]
        tasks: ['compile']
      options:
        nospawn: true

    coffee:
      compile:
        expand: true,
        flatten: true,
        cwd: '<%=build.src%>/js/',
        src: ['*.coffee'],
        dest: '<%=build.tmp%>',
        ext: '.js'

    browserify:
      main:
        src: ['<%=build.tmp%>/*.js']
        dest: '<%=build.dest%>/js/main.js'
        options:
          debug: true

    uglify:
      build:
        files:
          '<%=build.release%>/js/main.js': ['<%=build.dest%>/js/main.js']

    connect:
      server:
        options:
          base: '<%=build.dest%>'


  # load plugins
  grunt.loadNpmTasks 'grunt-browserify'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-coffee'

  # tasks
  grunt.task.registerTask 'clean', 'clears out temporary build files', ->
    grunt.file.delete grunt.config.get('build').tmp


  isPartial = (filename) ->
    filename[0] == '_' and filename.indexOf '.eco' > -1

  compilePartials = (rootPath) ->
    partials = {}
    grunt.file.recurse rootPath, (path, _, __, filename) ->
      return unless isPartial filename
      name = filename.replace('.eco', '').replace(/^_/, '')

      partials[name] = eco.compile grunt.file.read(path)

    partials

  grunt.task.registerTask 'eco', 'compiles eco templates into html', ->
    htmlDir   = grunt.config('build.src') + '/html'
    buildDest = grunt.config('build.dest')
    partials  = compilePartials htmlDir

    context = render: (partial, ctx = {}) ->
      partials[partial]?(ctx)

    grunt.file.recurse htmlDir, (path, _, __, filename) ->
      return if isPartial filename

      destPath = buildDest + '/' + filename.replace('.eco', '.html')
      grunt.log.writeln 'writing', destPath
      grunt.file.write destPath , eco.render(grunt.file.read(path), context)




  grunt.registerTask 'default', ['compile', 'connect', 'watch']
  grunt.registerTask 'compile', ['clean', 'coffee:compile', 'browserify:main', 'stylus:compile', 'eco']
  grunt.registerTask 'build', ['clean', 'coffee:compile', 'browserify:main', 'uglify', 'stylus:build']
