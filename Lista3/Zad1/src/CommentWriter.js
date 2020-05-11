const silentModeFinder = item => /--silent|-s/.test(item)

module.exports = (message) => {
   if (!process.argv.find(silentModeFinder)) {
      printComment(message)
   }
}

function printComment(message) {
   const startSign = message.substr(0, 8);
   const content = message.substr(8, message.length - 48);
   const crc = message.substr(message.length - 48, 32);
   const endSign = message.substr(message.length - 8, 8);

   console.log('', startSign, ' ', content, ' ', crc, '  ', endSign);
   const msgFiller = ' '.repeat(Math.max(0, content.length / 2 - 'Message'.length + 5));
   const crcFiller = ' '.repeat(16);
   comment = '|' + '  Sign   '
      + '|' + msgFiller + 'Message' + msgFiller
      + '|' + crcFiller + 'CRC' + crcFiller
      + '|' + '  Sign   ' + '|';
   console.log(comment)
}
