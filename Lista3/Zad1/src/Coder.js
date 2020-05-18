const crc32 = require('buffer-crc32')
const DecodingError = require('./DecodingError')
const printComment = require('./CommentBuilder');


class Coder {
   constructor() {
      this.signCode = '01111110';
      this.signCodeRegex = new RegExp(this.signCode, 'g');
   }

   getCRC(message) {
      let crc = crc32.unsigned(message).toString(2);
      while (crc.length < 32) {
         crc += '0';
      }
      return crc;
   }
}

// Encoder class
module.exports.Encoder = class extends Coder {
   constructor() {
      super();
      this.encoded = 0;
   }

   framing(message) {
      const crc = this.getCRC(message);
      let frame = message.concat(crc);

      // Strech message adding zero to the end of each string of five ones
      frame = frame.replace(/11111/g, '111110');

      // Add sign code at the beggining and at the end of string
      return this.signCode + frame + this.signCode;
   }

   encode(message, callback) {
      while (message) {
         const framedMessage = this.framing(message.slice(0, 32));
         callback(framedMessage, message.slice(0, 32));

         this.encoded++;
         message = message.slice(32);
      }
   }
};

// Decoder class
module.exports.Decoder = class extends Coder {
   constructor() {
      super();
      this.decoded = 0;
   }

   unframing(message) {
      // Remove sign code
      message = message.replace(this.signCodeRegex, '');

      // Strech message removing zero after end of each string of five ones
      message = message.replace(/111110/g, '11111');

      // Divide message into CRC code and message
      const crcCode = message.substr(message.length - 32);
      message = message.substr(0, message.length - 32);

      // Check checksum of message
      if (this.getCRC(message) != crcCode) {
         throw new DecodingError(this.getCRC(message), crcCode);
      }

      return message;
   }

   test(message, start, end) {
      try {
         this.unframing(message.slice(start, end));
      } catch (error) {
         return false;
      }
      return true;
   }

   decode(message, callback) {
      while (message) {
         const start = message.indexOf(this.signCode);
         let end = message.indexOf(this.signCode, start + 1);

         if (end === -1) {
            message = '';
            break;
         }

         end += this.signCode.length;

         if (this.test(message, start, end)) {
            const encodedMessage = message.slice(start, end)
            try {
               const unframedMessage = this.unframing(encodedMessage);
               this.decoded++;
               callback(encodedMessage, unframedMessage);
            } catch (error) {
               if (error instanceof DecodingError) {
                  callback(encodedMessage, null, error.message);
               }
            }

            message = message.slice(end);
         } else {
            message = message.slice(1);
         }
      }
   }
}
