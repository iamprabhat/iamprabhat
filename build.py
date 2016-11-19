#!/usr/bin/env python
# -*- coding: utf-8 -*-

# ————————————————————————————————————————————————————————————————————————————
# Copyright © 2006 - 2016, Prabhat Kumar. All rights reserved.
# ————————————————————————————————————————————————————————————————————————————
# Licensed under the Apache License (the "License, version 2.0");
# you may not use this file except in compliance with the License.
# ————————————————————————————————————————————————————————————————————————————
__author__        = ['"Prabhat Kumar" <prabhat.genome@gmail.com>']
__license__       = 'Apache License'
__date__          = '18-11-2016'
__copyright__     = "Copyright © 2006 - 2016, Prabhat Kumar. All rights reserved."
__webserver__     = "http://prabhatkumar.org/"
__license__       = "http://prabhatkumar.org/legal/license.txt"

# ————————————————————————————————————————————————————————————————————————————
module            = 'trianglify'
input_path        = 'core/source/engine'
output_path       = 'core/source/compiled/trianglify.js'
# ————————————————————————————————————————————————————————————————————————————

# Load required modules.
import os
import sys
import re
import time
import tempfile

from termcolor import colored

localtime = time.asctime(time.localtime(time.time()))

header ='''/*!
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * | trianglify® of iamprabhat®                                              |
 * ├─────────────────────────────────────────────────────────────────────────┤
 * | From the Desk of Prabhat Kumar — CEO, Founder & Scientist.              |
 * ├─────────────────────────────────────────────────────────────────────────┤
 * | Copyright © 2008 - 2016, Prabhat Kumar, All rights reserved.            |
 * └─────────────────────────────────────────────────────────────────────────┘
 * ---------------------------------------------------------------------------
 * Architecture and Code Handcrafted by Prabhat Kumar.
 * Architectuur en Code handgemaakt door Prabhat Kumar.
 * @author    : Prabhat Kumar [http://prabhatkumar.org/].
 * @copyright : Prabhat Kumar [http://prabhatkumar.org/].
 * ___________________________________________________________________________
 *
 * @date      : 18-Nov-2016
 * @license   : Apache, version 2.0
 * @require   : d3.js® & Raphaël.js®
 * @build     : SEED™ — Umeå
 *              |---- A Sequømics Product — http://sequomics.com/.
 * ___________________________________________________________________________
 */
'''

def sources():
    return [os.path.join(base, f) for base, folders, files in \
        os.walk(input_path) for f in files if f.endswith('.js')]
