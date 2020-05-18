module.exports.comment = (action, message, newMessage, err) => {
   const commPrefix = (action === 'encode') ? 'Encoded' : 'Decoded';

   if (newMessage) {
      console.log(`${commPrefix} message:\t`, newMessage);
   } else if (err) {
      console.error(err);
   }
   console.log(buildComment(message), '\n');
}

function buildComment(message) {
   const startSign = message.substr(0, 8);
   let content = message.substr(8, message.length - 48);
   const crc = content.length !== 0 ? message.substr(message.length - 48, 32) : ' '.repeat(32);
   const endSign = message.substr(message.length - 8, 8);

   if (content.length < 9) {
      content += ' '.repeat(9 - content.length);
   }

   const msgFill = ' '.repeat((content.length - 'Message'.length) / 2);
   const align = content.length % 2 ? '' : ' ';
   const crcFiller = ' '.repeat(14);


   let out = ` ${startSign} ${content} ${crc} ${endSign}\n`;
   out += `|  Sign  |${msgFill}Message${msgFill}${align}|${crcFiller}CRC${crcFiller} |  Sign  |`

   return out;
}
