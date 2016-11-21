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
