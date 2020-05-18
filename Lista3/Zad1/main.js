const fs = require('fs')
const Coder = require('./src/Coder')
const commenter = require('./src/CommentBuilder')

function main(action, silent) {
   const message = readFile(action);
   let codedMessage;

   clearFile(action);
   if (action == 'encode') {
      const encoder = new Coder.Encoder();
      encoder.encode(message, (message, encodedMessage) => {
         if (!silent) {
            commenter.comment(action, message, encodedMessage);
            console.log('');
         }
         writeToFile(action, message);
      });
      console.log('Encoded:', encoder.encoded);
   } else {
      const decoder = new Coder.Decoder();
      decoder.decode(message, (message, decodedMessage, err) => {
         if (!silent) {
            commenter.comment(action, message, decodedMessage, err);
         }
         if (!err) {
            writeToFile(action, decodedMessage);
         }
      });
      console.log('Successfully decoded:', decoder.decoded);
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

function run() {
   const encodeFinder = item => /--encode|-e/.test(item)
   const decodeFinder = item => /--decode|-d/.test(item)
   const silentModeFinder = item => /--silent|-s/.test(item);

   let action, silentModeOn = false;;

   if (process.argv.find(encodeFinder)) {
      action = 'encode';
   } else if (process.argv.find(decodeFinder)) {
      action = 'decode';
   } else {
      console.error('No action selected')
      process.exit();
   }

   if (process.argv.find(silentModeFinder)) {
      silentModeOn = true;
   }

   main(action, silentModeOn)
}
run();
