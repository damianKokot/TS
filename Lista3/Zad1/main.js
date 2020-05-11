const fs = require('fs')
const Coder = require('./src/Coder')
const printComment = require('./src/CommentWriter')

function main(action) {
   const message = readFile(action);
   let codedMessage;

   if (action == 'encode') {
      clearFile('encode');
      const encoder = new Coder.Encoder();
      encoder.encode(message, writeToFile);
   } else {
      const decoder = new Coder.Decoder();
      codedMessage = decoder.decode(message);
      writeToFile('decode', codedMessage);
   }

   return codedMessage;
}

// =================================
//       Operating with files
// =================================

function clearFile(action) {
   // Read from file
   const filename = (action == 'encode') ? 'files/w.txt' : 'files/zc.txt';
   fs.writeFileSync(filename, '');
}

function readFile(action) {
   // Read from file
   const filename = (action == 'encode') ? 'files/z.txt' : 'files/w.txt';
   return fs.readFileSync(filename).toString()
}

function writeToFile(action, message) {
   // Read from file
   const filename = (action == 'encode') ? 'files/w.txt' : 'files/zc.txt';
   fs.appendFileSync(filename, message);
}

// =================================
//        Starting program
// =================================

const encodeFinder = item => /--encode|-e/.test(item)
const decodeFinder = item => /--decode|-d/.test(item)

if (process.argv.find(encodeFinder)) {
   main('encode')
} else if (process.argv.find(decodeFinder)) {
   try {
      main('decode')
   } catch (err) {
      console.error(err.message);
   }
} else {
   console.error('No action selected')
}
