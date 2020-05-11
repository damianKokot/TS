module.exports = class Signal {
   static none = ' ';
   static conflict = '!';
   static jam = 'J';

   constructor(signal, wireLength) {
      this.value = signal.value;
      this.leftPos = signal.initPosition;
      this.rightPos = signal.initPosition;
      this.wireLength = wireLength;
   }

   updateSignal() {
      if (this.leftPos !== null) {
         this.leftPos--;
         if (this.leftPos < 0) {
            this.leftPos = null;
         }
      }

      if (this.rightPos !== null) {
         this.rightPos++;
         if (this.rightPos === this.wireLength) {
            this.rightPos = null;
         }
      }
   }
}