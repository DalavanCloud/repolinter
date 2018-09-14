// Copyright 2017 TODO Group. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

const path = require('path')
const chai = require('chai')
const expect = chai.expect

describe('lib', () => {
  describe('file_system', () => {
    const FileSystem = require('../../lib/file_system')

    describe('findAllFiles', () => {
      it('should ignore symlinks for ** globs', () => {
        const symlink = './tests/lib/symlink_for_test'
        const stats = require('fs').lstatSync(symlink)
        expect(stats.isSymbolicLink()).to.equal(true)
        const fs = new FileSystem(path.resolve('./tests'))
        const files = fs.findAllFiles('**/lib/symlink_for_test')
        expect(files).to.have.lengthOf(0)
      })
    })

    describe('findAll', () => {
      it('should honor filtered directories', () => {
        const includedDirectories = ['lib/', 'rules/']
        const includedRegex = /(lib|rules)\/\S+.js/
        const excludedRegex = /(formatters|package)\/\S+.js/
        const fs = new FileSystem(path.resolve('./tests'), includedDirectories)

        const files = fs.findAll('**/*.js')

        var foundIncluded = files.every(file => {
          return file.search(includedRegex) !== -1
        })

        var ignoredExcluded = files.every(file => {
          return file.search(excludedRegex) === -1
        })
        expect(foundIncluded).to.equal(true)
        expect(ignoredExcluded).to.equal(true)
      })

      it('should honor filtered files', () => {
        const includedFiles = ['index.js', 'bin/repolinter.bat']
        const fs = new FileSystem(path.resolve('.'), includedFiles)

        const files = fs.findAll('**/*').map(file => {
          return path.relative(path.resolve('.'), file)
        })
        expect(files).to.deep.equal(includedFiles)
      })

      it('should honor nocase true', () => {
        const includedFiles = ['index.js']
        const fs = new FileSystem(path.resolve('.'), includedFiles)

        const files = fs.findAll('**/iNdEx.Js', true).map(file => {
          return path.relative(path.resolve('.'), file)
        })
        expect(files).to.deep.equal(includedFiles)
      })

      it('should honor nocase false', () => {
        const includedFiles = ['index.js']
        const fs = new FileSystem(path.resolve('.'), includedFiles)

        const files = fs.findAll('**/iNdEx.Js', false).map(file => {
          return path.relative(path.resolve('.'), file)
        })
        expect(files).to.deep.equal([])
      })

      it('should not honor nocase by default', () => {
        const includedFiles = ['index.js']
        const fs = new FileSystem(path.resolve('.'), includedFiles)

        const files = fs.findAll('**/iNdEx.Js').map(file => {
          return path.relative(path.resolve('.'), file)
        })
        expect(files).to.deep.equal([])
      })
    })
  })
})
