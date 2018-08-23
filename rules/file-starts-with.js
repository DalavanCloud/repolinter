// Copyright 2017 TODO Group. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

const Result = require('../lib/result')

module.exports = function (fileSystem, rule) {
  const options = rule.options
  const fs = options.fs || fileSystem
  const files = fs.findAllFiles(options.files, options.nocase === true)

  let results = []
  files.forEach(file => {
    const lines = fs.readLines(file, options.lineCount)
    const misses = options.patterns.filter((pattern) => {
      const regexp = new RegExp(pattern, options.flags)
      return !lines.match(regexp)
    })

    let message = `The first ${options.lineCount} lines of '${file}'`
    const passed = misses.length === 0
    if (passed) {
      message += ` contain all of the requested patterns.`
    } else {
      message += ` do not contain the patterns:\n\t${misses.join('\n\t')}`
    }

    results.push(new Result(rule, message, file, passed))
  })

  return results
}
