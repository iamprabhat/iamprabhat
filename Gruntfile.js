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
