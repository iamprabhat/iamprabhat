#!/usr/bin/env node


/*!
 * iamprabhat®
 * From the Desk of Prabhat Kumar — CEO, Founder & Scientist.
 * ___________________________________________________________________________
 *
 * Grunt, http://gruntjs.com/ — The JavaScript Task Runner.
 * ___________________________________________________________________________
 *
 * Architecture and Code Handcrafted by Prabhat Kumar.
 * Architectuur en Code handgemaakt door Prabhat Kumar.
 * @author    : Prabhat Kumar [http://prabhatkumar.org/].
 * @copyright : Prabhat Kumar [http://prabhatkumar.org/].
 * ___________________________________________________________________________
 *
 * @date      : 18-Nov-2016
 * @license   : Apache, version 2.0
 * @require   : Node.js®
 * @require   : NPM
 * @require   : grunt-cli
 * @build     : SEED™ — Umeå
 *              └────── A Sequømics Product — http://sequomics.com/.
 * ___________________________________________________________________________
 *
 * --/The Heart of Build System/-- of "iamprabhat®".
 * ___________________________________________________________________________
 */


// Invoking strict mode.
///@purpose: Strict mode applies to entire scripts or to individual functions.
"use strict";

// To load required Node module.
///-----------------------------
var os          = require('os');
var fs          = require('fs');
var path        = require('path');

// To load required NPM modules.
///-----------------------------
var chalk       = require('chalk');
var inquirer    = require('inquirer');
var semver      = require('semver');

// Default color defined.
///----------------------
var noop        = chalk.red;
var yeep        = chalk.green;
var okay        = chalk.blue;
var boop        = chalk.gray;

///-------------------
// An object literals.
///-------------------
var build = {
  // Nonidentifier property names are quoted.
  "system"    : "SEED™",
  "name"      : "Umeå",
  "year"      : "2015",
  "audience"  : "for all scientist."
};

///-------------------------
// A smart license function.
///------- Apache ----------
var license = [
'/*!                                                                                                  ',
' * iamprabhat® — %(version)s                                                                         ',
' * From the Desk of Prabhat Kumar — CEO, Founder & Scientist.                                        ',
' * ---------------------------------------------------------------------------                       ',
' * Copyright © 2008 - ' + new Date().getFullYear() + ', Prabhat Kumar, All rights reserved.          ',
' * ---------------------------------------------------------------------------                       ',
' * Copyright © 2014 - ' + new Date().getFullYear() + ', Sequømics Research, All rights reserved.     ',
' * Copyright © 2014 - ' + new Date().getFullYear() + ', Sequømics Corporation, All rights reserved.  ',
' * ---------------------------------------------------------------------------                       ',
' * HomePage: http://prabhatkumar.org/ or https://iamprabhatkumar.wordpress.com                       ',
' * ---------------------------------------------------------------------------                       ',
' * Available via the Apache, version 2.0. [http://www.apache.org/licenses/]                          ',
' * See: https://github.com/iamprabhat/iamprabhat — for details.                                      ',
' * ---------------------------------------------------------------------------                       ',
' */                                                                                                  ',
'\n',
'/*!                                                                                                  ',
' * Build System — ' + build.system + ':' + build.name + ' — ' + '%(version)s' + ' — '+ build.audience ,
' * ---------------------------------------------------------------------------                       ',
' * Copyright © 2015 - ' + new Date().getFullYear() + ', Sequømics Corporation, All rights reserved.  ',
' * Available via the Apache, version 2.0. [http://www.apache.org/licenses/]                          ',
' * ---------------------------------------------------------------------------                       ',
' * See: http://seed.sequomics.com/ — for details.                                                    ',
' * ---------------------------------------------------------------------------                       ',
' */                                                                                                  ',
'\n',
].map(function(s) {
  return s.replace(/\s+$/, '');
}).join("\n");

///--------------------------
// A citation of iamprabhat®.
///--------------------------
var cite = JSON.parse(fs.readFileSync('./citation.json', {
  encoding: "utf8"
}));

// To get asset(s) information.
///----------------------------
var bkg  = JSON.parse(fs.readFileSync('./bower.json', {
  encoding: "utf8"
}));

var pkg  = JSON.parse(fs.readFileSync('./package.json', {
  encoding: "utf8"
}));

// To get credential(s) information.
///---------------------------------
var ftp  = JSON.parse(fs.readFileSync('./secret.json', {
  encoding: "utf8"
}));

// Global variables.
//=~~~~~~~~~~~~~~~~~
var rootPath    = './';
var appsPath    = './app/';
var docsPath    = './docs/';
var libsPath    = './libs/';
// A destination directory.
var buildPath   = './build/';

var message     = "SEED™ — Supported under Mac OS X and Linux only!";

// To get 'version', i.e. required to work on SEED™: Grunt based build system.
var version     = pkg.version;

// ----------------------------------------------------------------------------------------------------------
var banner      =
    '/*!\n' +
    ' * ————————————\n' +
    ' * iamprabhat®: v' + version + '\n' +
    ' * ————————————\n' +
    ' * From the Desk of Prabhat Kumar — CEO, Founder & Scientist.\n' +
    ' * Copyright © 2008 - ' + new Date().getFullYear() + ', Prabhat Kumar, All rights reserved.\n' +
    ' * Copyright © 2014 - ' + new Date().getFullYear() + ', Sequømics Corporation, All rights reserved.\n' +
    ' * Released under the Apache License (http://www.apache.org/licenses/).\n' +
    ' */';

// An object with no properties.
var replaceHandlers = {};

// A function to register `ReplaceHandler`.
///----------------------------------------
function registerReplaceHandler(keyword, handler) {
  replaceHandlers[keyword] = handler;
}

/*!
 * Replace %(id)s in strings with values in objects(s).
 * ----------------------------------------------------
 * Given a string like `"Hello %(name)s from %(user.country)s"`
 * and an object like `{name:"Prabhat", user:{country:"India"}}` would,
 * return `"Hello Prabhat from India"`.
 * ----------------------------------------------------
 * @param {string} str string to do replacements in,
 * @param {Object|Object[]} params one or more objects.
 * @returns {string} string with replaced parts.
 */
var replaceParams = (function() {
  
  var replaceParamsRE = /%\(([^\)]+)\)s/g;
  
  return function(str, params) {
    if (!params.length) {
      params = [params];
    }
    return str.replace(replaceParamsRE, function(match, key) {
      var colonNdx = key.indexOf(":");
      if (colonNdx >= 0) {
        try {
          var hanson = null;
          var args = hanson.parse("{" + key + "}");
          var handlerName = Object.keys(args)[0];
          var handler = replaceHandlers[handlerName];
          if (handler) {
            return handler(args[handlerName]);
          }
          console.error(noop("SEED™: Unknown substition handler: " + handlerName));
        } catch(e) {
          console.error(noop(e));
          console.error(noop("SEED™: Bad substitution: %(" + key + ")s"));
        }
      } else {
        // handle normal substitutions.
        var keys = key.split('.');
        for (var ii = 0; ii < params.length; ++ii) {
          var obj = params[ii];
          for (var jj = 0; jj < keys.length; ++jj) {
            key = keys[jj];
            obj = obj[key];
            if (obj === undefined) {
              break;
            }
          }
          if (obj !== undefined) {
            return obj;
          }
        }
      }
      console.error(noop("SEED™: Unknown key: " + key));
      return "%(" + key + ")s";
    });
  };
}());

// A function to register `hackForCommonJSAndBrowserify`.
///------------------------------------------------------
function hackForCommonJSAndBrowserify(text, sourceMapText) {
  var dirname = path.dirname(this.outPath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
  text = text.replace(/require/g, 'notrequirebecasebrowserifymessesup');
  fs.writeFileSync(this.outPath, text, {
    encoding: "utf-8"
  });
}

// A function to register `dateFormat`.
///------------------------------------
function dateFormat(date, format) {
  if (format === undefined) {
    format = date;
    date = new Date();
  }
  var map = {
    "M": date.getMonth() + 1,
    "d": date.getDate(),
    "h": date.getHours(),
    "m": date.getMinutes(),
    "s": date.getSeconds(),
    "q": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  format = format.replace(/([yMdhmsqS])(\1)*/g, function(all, t){
    var v = map[t];
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v;
        v = v.substr(v.length-2);
      }
      return v;
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length);
    }
    return all;
  });
  return format;
}

// ----------------------------------------------------------------------------------------------------------
// All Grunt Operations Defined... |--------------------------------------------| 21/Nov/2016 | SEED™ — Umeå.
// ----------------------------------------------------------------------------------------------------------

module.exports = function(grunt) {
  
  // Force use of Unix newlines.
  grunt.util.linefeed = '\n';
  
  // A regular expression.
  RegExp.quote = function(string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };
  
  // Date objects.
  var today    = new Date();
  var timems   = Date.now();
  
  // Advanced Grunt API.
  /// -->> A mode defaults to `0777`.
  var mode     = '0777';
  /// -->> A file globbing pattern.
  var pattern  = '**/*.js';
  // Exclude: remove from consideration.
  // grunt.file.expand([options, ] patterns)
  var excludes = grunt.file.expand([
    '!/libs/assembly/assembly.js',
    '!/libs/assembly/convert.js'
  ]);
  // Includes: make part of a whole or set.
  // grunt.file.expand([options, ] patterns)
  var includes = grunt.file.expand([
    __dirname + '/core/source/script/' + pattern,
    __dirname + '/core/source/engine/' + pattern
  ]);
  // To write process log(s).
  var contents = null;
  
  // To generate data of Project(s) and Publication(s).
  // ./core/source/data/raw/ ——> ./core/source/data/gold/
  var generateData = require('./core/source/data/datagenerator.js');
  
  // A configuration bridge.
  var configBridge = grunt.file.readJSON('./grunt/configBridge.json', {
    encoding: 'utf8'
  });
  
  // A configuration bridge function.
  Object.keys(configBridge.paths).forEach(function(key) {
    configBridge.paths[key].forEach(function(val, i, arr) {
      arr[i] = path.join('./docs/', val);
    });
  });
  
  // 1. time-grunt ——> $ npm install time-grunt --save-dev
  // -----------------------------------------------------
  // Display the elapsed execution time of grunt tasks.
  require('time-grunt')(grunt);
  
  // 2. load-grunt-tasks ——> $ npm install load-grunt-tasks --save-dev
  // -----------------------------------------------------------------
  // Load multiple grunt tasks using globbing patterns.
  require('load-grunt-tasks')(grunt, {
    scope: ['devDependencies', 'dependencies']
  });
  
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Project configuration for -//iamprabhat®//- |------------------------------| 22/Nov/2016 | SEED™ — Umeå.
  //                      Copyright © 2008 - 2016, Prabhat Kumar, All rights reserved.
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  
  // Grunt Project Configuration.
  // ----------------------------
  grunt.initConfig({
    
    /* reading 'package.json'
                ------------
       for sync package(s) updates, mainly. */
    pkg: pkg,
    
    /* reading 'secret.json'
                -----------
       for FTP updates, mainly. */
    /* Note: Do not store credentials in the git repo, store them separately and read from a secret file. */
    secret: ftp,
    
    /* To get banner information. */
    banner: banner,
    
    /* grunt-notify --> $ npm install grunt-notify --save-dev */
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5, // maximum number of notifications from [jshint] output.
        title: "I'm Prabhat", // defaults to the name in [package.json].
        success: false, // whether successful grunt executions should be notified automatically.
        duration: 4 // the duration of notification in seconds, for `notify-send only.
      }
    },
    // ———————————————————————————————————————————————————————————————————————————|
    // Primary Task(s) for SEED™ — Umeå — Building System ||                      |
    // -----------------------------------------------------                      |
    // 01. Asset(s) Preparation                                                   |
    // 02. Build Asset(s) Verification                                            |
    // -‡-----------------------------------------------------------------------‡-|
    // 03. Assembly of Application                                                |
    // 04. Build of Sass using Compass and Lint                                   |
    // 05. Linting of (CSS + JavaScript)                                          |
    // 06. Concatenation of (CSS + JavaScript)                                    |
    // 07. Minification of (CSS + JavaScript)                                     |
    // 08. Data Build + Lint                                                      |
    // 09. Cleaning of temporary files or directories                             |
    // 10. Localhost Server + Watch                                               |
    // -‡-----------------------------------------------------------------------‡-|
    // ->     https://github.com/iamprabhat/iamprabhat/blob/master/BUILDING.md    |
    // ———————————————————————————————————————————————————————————————————————————|
    // Task configuration.
    // -----------------------
    // 1. Asset(s) Preparation
    // -----------------------
    // Bower Components Installation
    'bower-install-simple': {
      options: {
        color: true,
        command: 'update',
        interactive: true,
        forceLatest: false,
        directory: __dirname + '/core/source/libs/' // library i.e, downloaded by Bower.
      },
      'prod': {
        options: {
          production: true // Install project Dependencies.
        }
      },
      'dev': {
        options: {
          production: false // Install project devDependencies.
        }
      }
    },
    // ------------------------------
    // 2. Build Asset(s) Verification
    // ------------------------------
    // Bower Components Syncing
    bowersync: {
      taskName: {
        files: {
          // Target directory  : Source directory
          './core/source/libs/': './bower_components'
        },
        options: {
          // The path to the file. Default: 'bower.json'.
          bowerFile: bkg, // alias --> './bower.json',
          // Use when copying `dependencies` section. Default: true.
          dependencies: true,
          // Use when copying `devDpendencies` section. Default: false.
          devDependencies: true,
          // Use when copying `peerDependencies` section. Default: false.
          peerDependencies: false,
          // Remove all files from dest that are not found in src. Default: true.
          updateAndDelete: true,
          // Create symlinks to dependencies, instead of copying them. Default: false.
          symlink: true
        }
      }
    },
    // -------------------------------------------
    /// 3. Assembly of Application + Documentation
    // -------------------------------------------
    /// 3. Assembly --> 3.1 HTML Hint
    /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    htmlhint: {
      options: {
        htmlhintrc: './grunt/config/rules/.htmlhintrc'
      },
      html1: {
        options: {
          'attr-lowercase': false
        },
        /// Application
        src: ['./app/*.html', './app/en/**/*.html']
      },
      html2: {
        options: {
          'attr-lowercase': true
        },
        /// Documentation + Repositories
        src: ['./docs/source/*.html', './docs/source/repo/**/*.html']
      }
    },
    /// 3. Assembly --> 3.2 HTML Minify
    /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    htmlmin: {
      dist: {
        options: {
          html5: true,
          collapseWhitespace: true,
          conservativeCollapse: false,
          minifyCSS: true,
          minifyJS: true,
          removeAttributeQuotes: true,
          removeComments: true
        },
        expand: true,
        cwd: '.',
        dest: buildPath,
        src: [
          /// for all files in `app` and `docs` directory.
          './app/**/*.html',
          './docs/**/*.html'
        ]
      }
    },
    // -------------------------------
    /// 4. Build of Sass using Compass
    // -------------------------------
    /// 4. Sass Build --> 4.1 Compass
    /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    compass: {
      /// T:1 [cacheDir: .sass-cache]
      dist: {
        options: {
          config: './config.rb',
          environment: 'production',
          raw: 'preferred_syntax = :sass\n' // Use `raw` since it's not directly available.
        }
      },
      /// T:2
      dev: {
        options: {
          assetCacheBuster: true,
          fontsPath: './core/source/font',
          sassDir: './core/source/scss',
          cssDir: './app/en/assets/style',
          sourcemap: true
        }
      }
    },
    /// 4. Sass Build --> 4.2 Scss Lint
    /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    scsslint: {
      options: {
        bundleExec: true,
        config: './core/source/scss/.scss-lint.yml',
        reporterOutput: null
      },
      core: {
        src: ['./core/source/scss/**/*.scss', '!./core/source/scss/**/_normalize.scss']
      }
    },
    // ---------------------------------
    /// 5. Linting of (CSS + JavaScript)
    // ---------------------------------
    /// 5. CSS --> 5.1 Lint
    /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    csslint: {
      options: {
        csslintrc: './grunt/config/rules/.csslintrc'
      },
      strict: {
        options: {
          import: 2
        },
        src: ['./core/source/style/**/*.css']
      },
      lax: {
        options: {
          import: false
        },
        src: ['./app/en/assets/style/**/*.css']
      }
    },
    // To update '.csslintrc' list, run this:
    // node -e "require('csslint').CSSLint.getRules().forEach(function(x) { console.log(x.id) })"
    /// 5. JavaScript --> 5.2 Lint
    /// ~~~~~~~~~~~~~~~~~~~~~~~~~~
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          d3: true,
          Modernizr: true,
          jQuery: true
        },
        strict: true,
        undef: true
      },
      ignore_warning: {
        options: {
          '-W069': true, // for dot notation.
          '-W015': true // [L24:C9] W015: Expected '}' to have an indentation at 11 instead at 9.
        }
      },
      all: [
        './Gruntfile.js',
        './grunt/**/*.js',
        './libs/**/*.js',
        './core/source/data/*.js',
        './core/source/engine/**/*.js',
        './core/source/script/root.js',
        './core/source/script/**/*.js',
        '!node_modules/**/*.js', // ignores node_modules.
        '!bower_components/**/*.js' // ignores bower_components.
      ]
    },
    /// 6. JavaScript --> Concatenation
    /// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    concat: {
      dist: {
        options: {
          separator: ';\n',
          // Replace all 'use strict' statements in the code with a single one at the top.
          banner: "'use strict';\n",
          process: function(src, filepath) {
            return '// Source: ' + filepath + '\n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          }
        },
        files: {
          // compiled JavaScript for — intermediate work.
          // output ——> [./app/en/assets/script/]
          './app/en/assets/script/<%= pkg.name %>-<%= pkg.version %>.js': ['./core/source/script/**/*.js']
        }
      }
    },
