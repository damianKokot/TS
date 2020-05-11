const crc32 = require('buffer-crc32')
const DecodingError = require('./DecodingError')
const printComment = require('./CommentWriter');


class Coder {
   constructor() {
      this.signCode = '01111110';
      this.signCodeRegex = new RegExp(this.signCode, 'g');
   }

   getCRC(message) {
      return crc32.unsigned(message).toString(2)
   }
}

// Encoder class
module.exports.Encoder = class extends Coder {
   framing(message) {
      const crc = this.getCRC(message).toString();
      while(crc.length < 32) {
         crc += '0';
      }

      let frame = message.concat(crc);

      // Strech message adding zero to the end of each string of five ones
      frame = frame.replace(/11111/, '111110');

      // Add sign code at the beggining and at the end of string
      return this.signCode + frame + this.signCode;
   }
   
   encode(message, send) {
      while(message) {
         const framedMessage = this.framing(message.slice(0, 32));
         printComment(framedMessage);
         send('encode', framedMessage);

         message = message.slice(32);
      }
   }
};

// Decoder class
module.exports.Decoder = class extends Coder {
   unframing(message) {
      // Remove sign code
      message = message.replace(this.signCodeRegex, '');
      
      // Strech message removing zero after end of each string of five ones
      message = message.replace(/111110/, '11111');

      // Divide message into CRC code and message
      const crcCode = message.substr(message.length - 32);
      message = message.substr(0, message.length - 32);

      console.log('mess', message)
      console.log('crc1', this.getCRC(message))
      console.log('crc2', crcCode)
      // Check checksum of message
      if (this.getCRC(message) != crcCode) {
         throw new DecodingError();
      }

      return message;
   }

   decode(message) {
      while (message) {
         const start = message.indexOf(this.signCode);
         const end = message.indexOf(this.signCode, start + 1);

         console.log(message.slice(start, end + this.signCode.length));
         console.log(this.unframing(message.slice(start, end + this.signCode.length)));
         console.log(start, end);

         if (end !== -1) {
            message = message.slice(end + this.signCode.length);
         } else {
            message = '';
         }
         ///const framedMessage = this.framing(message.slice(0, 100));
         ///printComment(framedMessage);
         ///send('encode', framedMessage);
///
         ///message = message.slice(100);
      }
   }
}
