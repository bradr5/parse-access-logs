#!/usr/bin/env node

const fsPromises = require('fs').promises;
const fs = require('fs');
const geoip = require('geoip-lite');
const Logparser = require('@sematext/logagent');
const LineByLineReader = require('line-by-line');
const UAParser = require('ua-parser-js');
const { Parser } = require('json2csv');
const cliProgress = require('cli-progress');
const countLinesInFile = require('count-lines-in-file');
const path = require('path');

const myArgs = process.argv.slice(2);
if (!myArgs[0]) throw new Error('missing argument');

const targetFilePath = path.resolve(__dirname, myArgs[0]);
fs.access(targetFilePath, fs.F_OK, (err) => {
  if (err) throw err;
});
const outputFilePath = myArgs[1] ? myArgs[1] : './access-log-data.csv';
console.log('testing5');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
process.stdout.isTTY && countLinesInFile(targetFilePath, (error, number) => {
  if (error) {
    process.stdout.write(`\nerror while attempting to count number of lines in file...\n${error}\n`);
  } else if (number >= 50000) {
    bar1.start(number, 0);
  }
});

const lr = new LineByLineReader(targetFilePath);
const lp = new Logparser('./patterns.yml');
const parser = new UAParser();
const results = [];
let currLineNum = 0;
process.stdout.write('\nParsing access logs...\n');

lr.on('error', (err) => {
  process.stdout.write('\nerror while attempting to read the file...\n');
  throw err;
});

lr.on('line', (line) => {
  lp.parseLine(line, 'access_log', (err, data) => {
    if (err) {
      process.stdout.write('\nerror while attempting to parse the line: ${line}\n');
      throw err;
    }
    currLineNum++;
    if(bar1.isActive && currLineNum % 100 === 0) bar1.update(currLineNum);
    const geoInfo = geoip.lookup(data.client_ip);
    const ua_info = parser.setUA(data.user_agent);
    results.push({
      Country: geoInfo ? geoInfo.country : '',
      Region: geoInfo ? geoInfo.region : '',
      Type: ua_info.getDevice().type,
      Browser: ua_info.getBrowser().name,
      IP: data.client_ip,
      DateTime: data['@timestamp'],
      Request: data.message + ' ' + data.protocol,
      'Status Code': data.status_code,
      Size: data.size,
      Referer: data.referer,
      'User Agent': data.user_agent,
    });
  });
});

lr.on('end', async () => {
  bar1.update(currLineNum);
  bar1.stop();
  try {
    await fsPromises.writeFile(outputFilePath, new Parser().parse(results));    
    process.stdout.write(`\nSaved!\nFile location: ${outputFilePath}\n`);
  } catch (err) {
    process.stdout.write('\nerror while attempting to export csv file...\n');
    throw err;
  } finally {
    process.exit();
  }
});