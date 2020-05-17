const Wire = require('./wire');
const Signal = require('./signal');
const Stats = require('../stats');

const silentModeFinder = item => /--silent|-s/.test(item)

module.exports = class Ethernet {
   constructor(wireLength, rounds) {
      this.wireLength = wireLength;
      this.totalRounds = rounds;
      this.wire = new Wire(wireLength);
      this.stations = [];
      this.round = 0;
      this.repeater = null;

      this.stats = new Stats(this);
   }

   networkStep() {
      if ((++this.round) > this.totalRounds) {
         console.log(this.stats.endStatistics);

         process.exit();
      }

      this.nextStep();
      this.wire.updateStates();

      this.printState(this.round);
   }

   run(interval) {
      if (process.argv.find(silentModeFinder)) {
         for (let probe = 0; probe < this.totalRounds; probe++) {
            this.networkStep();
         }
         console.log(this.stats.endStatistics);
         process.exit();
      } else {
         this.printState(this.round);
         this.repeater = setInterval(() => this.networkStep(), interval);
      }
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
   isJammed(station) {
      return this.wire.states[station.position] === Signal.jam;
   }

   isSilenced(station) {
      return this.wire.states[station.position] === Signal.none;
   }

   isConflicted(station) {
      return this.wire.states[station.position] === Signal.conflict;
   }

   printState(round) {
      if (process.argv.find(silentModeFinder)) {
         return;
      }

      console.clear();
      console.log(this.stats.wireState);
      console.log(this.stats.statistics);

      console.log('Iteration: %s/%s', round, this.totalRounds)
   }
}
