const Wire = require('./wire');
const Signal = require('./signal');

module.exports = class Ethernet {
   constructor(wireLength, rounds) {
      this.wireLength = wireLength;
      this.totalRounds = rounds;
      this.allowedToContinue = true;
      this.wire = new Wire(wireLength);
      this.stations = [];
   }

   run(interval) {
      let round = 0;
      setInterval(() => {
         if (this.allowedToContinue) {
            if ((++round) > this.totalRounds) {
               process.exit();
            }

            this.nextStep();
            this.printState(round);
         }
      }, interval);
   }


   // Performs microsecond jump in 
   nextStep() {
      this.wire.updateSignal();
      this.stations.forEach(station => station.nextStep());
   }

   attachStation(station) {
      this.stations.push(station);
      station.setEthernet(this);
   }

   sendSignal(signal) {
      this.wire.broadcastSignal(signal);
   }
   

   // Functions, that station uses to check state of signal in ethernet calble
   isJammed (station) {
      return this.wire.states[station.position] === Signal.jam;
   }

   isSilenced (station) {
      return this.wire.states[station.position] === Signal.none;
   }
   
   isConflicted (station) {
      return this.wire.states[station.position] === Signal.conflict;
   }

   printState(round) {
      this.wire.updateStates();
      const stationsView = new Array(this.wire.wireLength)
         .fill(' ');
      const stationsPointers = new Array(this.wire.wireLength)
         .fill(' ');

      for (const station of this.stations) {
         stationsView[station.position] = station.name;
         if (station.waitTime > 0) {
            stationsPointers[station.position] = 'w';
         } else {
            stationsPointers[station.position] = '|';
         }
      }
      
      console.clear();
      this.wire.printState();
      for (const array of [stationsPointers, stationsView]) {
         console.log('[' + array.join(' ') + ']');
      }
      console.log()

      console.log('\tState\t\tLeft:\t\tColisions in row:\tWaiting:')
      for (const station of this.stations) {
         let status;
         if (station.sendingSignal == null) {
            status = 'none';
         } else if (station.sendingSignal === station.normalSignal) {
            status = 'packet';
         } else {
            status = 'jamming';
         }

         const name = station.name;
         const leftSignals = station.leftSignals;
         const colisionsInRow = station.colisionsInRow;
         const waitTime = station.waitTime;

         console.log(`${name}:\t${status}\t\t${leftSignals}\t\t${colisionsInRow}\t\t\t${waitTime}`)
      }

      console.log('Iteration: %s/%s', round, this.totalRounds)
   }
}
