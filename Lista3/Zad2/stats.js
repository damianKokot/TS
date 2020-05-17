module.exports = class Stats {
   static web;

   constructor(web) {
      this.web = web;

      this.defaultStats = [
         {
            name: 'Name',
            width: 15,
            data: station => station.name,
            end: true,
         },
         {
            name: 'State',
            width: 15,
            data: station => {
               if (station.sendingSignal == null) {
                  return 'none';
               } else if (station.sendingSignal === station.normalSignal) {
                  return 'packet';
               } else {
                  return 'jamming';
               }
            },
         },
         {
            name: 'Queued',
            width: 15,
            data: station => station.wantToSendMessage.toString(),
         },
         {
            name: 'Left',
            width: 15,
            data: station => station.leftSignals,
         },
         {
            name: 'Colisions in row',
            width: 20,
            data: station => station.waitTime,
         },
         {
            name: 'Waiting',
            width: 15,
            data: station => station.colisionsInRow,
            end: true,
         },
         {
            name: 'Success',
            width: 15,
            data: station =>
               `${station.succesfullySent}/${station.messagesTotal}`,
            end: true,
         },
      ]
   }

   get wireState() {
      const stationsView = new Array(this.web.wire.wireLength).fill(' ');
      const stationsPointers = new Array(this.web.wire.wireLength).fill(' ');

      for (const station of this.web.stations) {
         stationsView[station.position] = station.name;
         if (station.waitTime > 0) {
            stationsPointers[station.position] = 'w';
         } else {
            stationsPointers[station.position] = '|';
         }
      }

      let out = '';
      out += this.web.wire.toString() + '\n';
      for (const array of [stationsPointers, stationsView]) {
         out += `[${array.join(' ')}]\n`;
      }

      return out;
   }

   get statistics() {
      return this.generateTable(this.defaultStats);
   }

   get endStatistics() {
      return this.generateTable(this.defaultStats.filter(field => field.end));
   }

   generateTable(fields) {
      let table = '';
      for (const stats of fields) {
         table += centered(stats.name + ':', stats.width);
      }
      table += '\n';

      for (const station of this.web.stations) {
         for (const stat of fields) {
            table += centered(stat.data(station), stat.width);
         }
         table += '\n';
      }

      return table;
   }
}

function centered(key, width) {
   const marginLeft = ' '.repeat((width - key.toString().length) / 2);
   const marginRight = ' '.repeat((width - key.toString().length + 1) / 2);

   return marginLeft + key + marginRight;
}