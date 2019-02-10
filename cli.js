#!/usr/bin/env node

const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const babel = require("@babel/core");
const expect = require('expect');
const iwork = require('./src/iwork');
const chalk = require('chalk');
const argv = require('yargs')
  .usage('Usage: iwork --pattern=./**/*.spec.js --watch')
  .describe('pattern', 'A glob pattern')
  .describe('watch', 'Running iwork in a watch mode')
  .demandOption(['pattern'])
  .argv;

const babelOptions = {
  presets: [
    '@babel/react',
    '@babel/preset-env'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-regenerator',
    'transform-es2015-modules-commonjs'
  ]
};
const noop = () => {};
let reports = [];
let inProgress = false;

function ind(level) {
  let str = '';
  for(let i=0; i<level; i++) {
    str += '  ';
  }
  return str;
}
function printError(error, indLevel) {
  return error.toString().split('\n').map(line => (ind(indLevel) + '| ' + line)).join('\n');
}
function printReports() {
  reports.forEach(report => {
    console.log(chalk.grey('-> ' + report.file.path));
    report.report.forEach(testReport => {
      const emoji = !testReport.test.tests ? (testReport.test.error ? '❌': '👍') : (testReport.test.error ? '❌': '');
      const text = chalk[testReport.test.error ? 'red' : 'green'](emoji + ' ' + testReport.test.text);
      console.log([
        ind(testReport.level),
        text,
        testReport.test.error ? '\n' + printError(testReport.test.error, testReport.level + 1) : ''
      ].join(''));
    });
  });
}
function runSingleTest(file) {
  return new Promise(done => {
    try {
      const iworkAPI = iwork();
      const f = new Function(
        'require',
        'describe',
        'it',
        file.content
      );
      const interval = setTimeout(() => {
        reports.push({
          file: file,
          report: [
            {
              test: {
                text: 'The processing of "' + file.path + '" took 5s. Timeout.',
                error: error
              }
            }
          ]
      });
      done();
      }, 5000);
      const res = f(
        require,
        iworkAPI.describe,
        iworkAPI.it
      );
      iworkAPI.run()
        .then(report => {
          clearTimeout(interval);
          reports.push({
            file: file,
            report: report
          });
          done();
        }).catch(error => {
          console.log(error);
          clearTimeout(interval);
        });
    } catch(error) {
      reports.push({
          file: file,
          report: [
            {
              test: {
                text: 'The processing of "' + file.path + '" failed.',
                error: error
              }
            }
          ]
      });
      done();
    }
  });
}
function runTests(files, index = 0, done) {
  if (index >= files.length) {
    printReports();
    if (done) {
      done();
    }
    inProgress = false;
  } else {
    runSingleTest(files[index]).then(() => {
      runTests(files, index + 1, done);
    });
  }
}
function run(files, done = noop) {
  console.log('+-------------------+');
  reports = [];
  inProgress = true;
  runTests(files, 0, done);
}
function getFile(p) {
  const code = fs.readFileSync(p).toString('utf8');
  const transpiled = babel.transformSync(code, babelOptions);
  // console.log(transpiled.code);
  return transpiled.code;
}

if (argv.pattern) {
  glob(argv.pattern, function (er, filesPaths) {
    const files = filesPaths.map(p => {
      const fullPath = path.normalize(__dirname + '/' + p);
      return {
        path: p,
        fullPath: fullPath,
        content: getFile(p)
      }
    });

    console.log([
      '+-------------------+',
      '| iwork: ' + files.length + (files.length === 1 ? ' file' : 'files'),
    ].join('\n'));

    if (files.length === 0) {
      console.log(chalk.red('There are no files matching ' + argv.pattern));
    } else {
      run(files, () => {
        if (argv.watch) {
          const watcher = chokidar.watch(argv.pattern, {
            ignored: /(^|[\/\\])\../,
            persistent: true
          });

          watcher.on('change', (path) => {
            if (inProgress) return;

            const file = files.find(f => (f.path.indexOf(path) >= 0));
            file.content = getFile(file.path);

            run(files);
          });
        }
      });
    }
  });
}