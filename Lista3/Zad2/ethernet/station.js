const Signal = require('./signal')

module.exports = class Station {
   constructor(name, position, propabilityOfSending) {
      this.propability = propabilityOfSending;
      this.position = position;
      this.name = name;
      
      this.leftSignals = 0;
      this.colisionsInRow = 0;
      this.waitTime = 0;
      this.succesfullySent = 0;
      this.messagesTotal = 0;

      this.normalSignal = {
         value: this.name,
         initPosition: this.position
      };
      this.jammingSignal = {
         value: Signal.jam,
         initPosition: this.position
      };
   }

   setEthernet(ethernet) {
      this.ethernet = ethernet;
      this.packetSize = 2 * ethernet.wireLength;
   }

   sendMessage() {
      this.sendingSignal = this.normalSignal;
      this.leftSignals = this.packetSize;
   }

   broadcastSignal() {
      this.ethernet.sendSignal(this.sendingSignal);
      this.leftSignals--;
   }
   
   nextStep() {
      if (this.ethernet.isConflicted(this)) {
         if (this.sendingSignal !== null) {
            this.colisionsInRow++;
         }
         this.sendingSignal = this.jammingSignal;
         this.leftSignals = this.packetSize;
         this.waitTime = computeWaitingTime(this.colisionsInRow) * this.packetSize;
      }

      if(this.sendingSignal !== null) {
         if (this.leftSignals > 0) {
            this.broadcastSignal();
         } else {
            if (this.sendingSignal !== this.jammingSignal) {
               this.colisionsInRow = 0;
               this.succesfullySent++;
            }
            this.sendingSignal = null;
         }
      } else {
         if (this.waitTime > 0) {
            this.waitTime--;
         } else if (this.ethernet.isSilenced(this) && Math.random() < this.propability) {
            this.messagesTotal++;
            this.sendMessage();
         }
      }
   }
}

function computeWaitingTime(colisionsInRow) {
   let rangeOfRandom;

   if (colisionsInRow < 10) {
      rangeOfRandom = 2 ** colisionsInRow;
   } else if (colisionsInRow < 16) {
      rangeOfRandom = 2 ** 10;
   } else {
      throw new Error('To many colisions in a row!');
   }

   return Math.floor(Math.random() * rangeOfRandom);
}
