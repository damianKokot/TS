module.exports = class DecodingError extends Error {
   constructor() {
      super("Data CRC doesn't match");
   }
}