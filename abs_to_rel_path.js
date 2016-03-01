'use strict'

const g = require('globby')
const fs = require('fs')
const path = require('path')

const DEBUG = true
const DIR = '72bf236'
let files = g.sync(DIR + '/**/*.html')

let re = /(href|src)="(\/[^"]+)"/g

let i = 0
files.map(file => {
  // /path/to/dir
  let dirname = path.dirname(file.replace(DIR, ''))

  let contents = fs.readFileSync(file, 'utf8')
  // href="/ or src="/ -> href="../..
  contents = contents.replace(re, relative.bind({ dirname, file }))
  process.stdout.write('.')
  fs.writeFileSync(file, contents)
})

console.log('')
console.log(`replaced ${i} urls in ${files.length} files`)

function relative(m, attr, url) {
  let r = attr + '="'
  r += path.relative(this.dirname, url)
  r += '"'
  // windows \ -> /
  r = r.replace(/\\/g, '/')
  if (DEBUG && path.basename(this.file) === 'index.html') {
    console.log('file: ' + this.file)
    console.log('dirname: ' + this.dirname)
    console.log('url: ' + url)
    console.log('match: ' + m)
    console.log('replace: ' + r)
  }
  i += 1
  return r
}
