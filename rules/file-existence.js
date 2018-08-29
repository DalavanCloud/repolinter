// Copyright 2017 TODO Group. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

const Result = require('../lib/result')

module.exports = function (fileSystem, rule) {
  const options = rule.options
  const fs = options.fs || fileSystem
  const file = fs.findFirstFile(options.files, options.nocase)

  const passed = !!file
  const message = (() => {
    if (passed) {
      return `found (${file})`
    } else {
      return `not found: (${options.files.join(', ')})${options['fail-message'] !== undefined ? ' ' + options['fail-message'] : ''}`
    }
  })()

  return [new Result(rule, message, file || null, passed)]
}
