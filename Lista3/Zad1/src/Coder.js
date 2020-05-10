const crc32 = require('buffer-crc32')
const DecodingError = require('./DecodingError')

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
   encode(message) {
      const crc = this.getCRC(message);
      let frame = message.concat(crc);

      // Strech message adding zero to the end of each string of five ones
      frame = frame.replace(/11111/g, '111110');      
      
      // Add sign code at the beggining and at the end of string
      return this.signCode + frame + this.signCode;
   }
};

// Decoder class
module.exports.Decoder = class extends Coder {
   decode(message) {
      // Remove sign code
      message = message.replace(this.signCodeRegex, '');
      
      // Strech message removing zero after end of each string of five ones
      message = message.replace(/111110/g, '11111');      
      
      // Divide message into CRC code and message
      const crcCode = message.substr(message.length - 32);
      message = message.substr(0, message.length - 32);

      // Check checksum of message
      if (this.getCRC(message) != crcCode) {
         throw new DecodingError();
      }

      return message;
   }
}
