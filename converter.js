const { readFile, writeFile } = require('fs');
const { promisify } = require('util');
const readfile = promisify(readFile);
const writefile = promisify(writeFile);

const length = 100;
let output = '';
let origFile;
const main = async () => {
  try {
    origFile = await readfile('./Collections.md', 'utf8');
  } catch (err) {
    console.error(err);
  }

  const regexL = new RegExp('^- (.*)');
  const regexH = new RegExp('^### (.*)');
  const tableRow = '| $1 | Required |';
  const tableHeader = `| $1 | Required |\r\n|-${'-'.repeat(length)}-|-${'-'.repeat(8)}-|`;
  origFile = origFile.split('\r\n');
  for (const line of origFile) {
    const matchList = line.match(regexL);
    const matchHeader = line.match(regexH);
    if (matchList) output += `${tableRow.replace('$1', matchList[1].padEnd(length))}\r\n`;
    else if (matchHeader) {
      output += `${line}\r\n\r\n`;
      output += `${tableHeader.replace('$1', matchHeader[1].padStart(length / 2 + matchHeader[1].length / 2).padEnd(length))}`;
    } else output += `${line}\r\n`;
  }

  try {
    await writefile('./Collections.md', output, 'utf8');
  } catch (err) {
    console.error(err);
  }
};

main();