const Signal = require('./signal');

module.exports = class Wire {
   constructor(wireLength) {
      this.states = new Array(wireLength).fill(Signal.none);
      this.wireLength = wireLength;
      this.signals = []
   }

   broadcastSignal(signal) {
      this.signals.push(new Signal(signal, this.wireLength));
   }

   updateSignal() {
      this.signals.forEach(signal => signal.updateSignal());
      this.signals = this.signals.filter(signal => {
         // Remove if there is null on left and right position
         return signal.leftPos !== null || signal.rightPos !== null;
      });
   }

   updateStates() {
      this.states.fill(Signal.none);

      for (let signal of this.signals) {
         for (let position of [signal.leftPos, signal.rightPos]) {
            if (position !== null) {
               this.states[position] = getSignalValue(
                  this.states[position],
                  signal.value,
               )
            }
         }
      }
   }

   toString() {
      return `[${this.states.join(' ')}]`;
   }
}

function getSignalValue(prevState, newState) {
   if (prevState === Signal.jam || newState === Signal.jam) {
      return Signal.jam;
   } else if (prevState !== Signal.none && prevState !== newState) {
      return Signal.conflict;
   } else {
      return newState;
   }
}
