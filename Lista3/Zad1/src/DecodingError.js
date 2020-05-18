const message = "  Error: Data CRC doesn't match:\n\t Calculated:\t%s\n\t Given:\t\t%s";

module.exports = class DecodingError extends Error {
   constructor(crcCalculated, crcGiven) {
      let errMsg = message.replace(/%s/, crcCalculated);
      errMsg = errMsg.replace(/%s/, crcGiven);
      super(errMsg);
   }
}