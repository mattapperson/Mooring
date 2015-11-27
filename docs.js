var acquit = require('acquit');

var content = require('fs').readFileSync('./test/examples.test.js').toString();
var blocks = acquit.parse(content);

var mdOutput = `
# Mooring\n\n
[![Build Status](https://travis-ci.org/appersonlabs/Mooring.svg?branch=master)](https://travis-ci.org/appersonlabs/Mooring.svg)
[![Coverage Status](https://coveralls.io/repos/appersonlabs/mooring/badge.svg?branch=master&service=github)](https://coveralls.io/github/appersonlabs/mooring?branch=master)
[![bitHound Overalll Score](https://www.bithound.io/github/appersonlabs/Mooring/badges/score.svg)](https://www.bithound.io/github/appersonlabs/Mooring)

Born from a desire to have an API / hooks system that:\n
- Has a small API surfice
- Is easy to understand
- Has a data flow that is immutable
- Lets pre hooks manipulate the data going into a hooked method
- Lets post hooks manipulate the data coming out from a hooked method
- Not have the hooks stored on the prototype but rather in a seperate object

Credit to the [kareem](https://github.com/vkarpov15/kareem) & [grappling-hook](https://github.com/keystonejs/grappling-hook)
projects for their insight and the inspiration they provided (also some code ;).)\n\n

# API Spec\n\n
`

for (var i = 0; i < blocks.length; ++i) {
  var describe = blocks[i];
  mdOutput += '## ' + describe.contents + '\n\n';
  mdOutput += describe.comments[0] ?
    acquit.trimEachLine(describe.comments[0]) + '\n\n' :
    '';

  for (var j = 0; j < describe.blocks.length; ++j) {
    var it = describe.blocks[j];
    mdOutput += '#### It ' + it.contents + '\n\n';
    mdOutput += it.comments[0] ?
      acquit.trimEachLine(it.comments[0]) + '\n\n' :
      '';
    mdOutput += '```javascript\n';
    mdOutput += '    ' + it.code + '\n';
    mdOutput += '```\n\n';
  }
}

require('fs').writeFileSync('README.md', mdOutput);
