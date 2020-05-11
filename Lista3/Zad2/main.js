const Ethernet = require('./ethernet/ethernet');
const Station = require('./ethernet/station');
const configureKeyPresing = require('./keyactivator');

function main() {
   const web = new Ethernet(70, 2000)
   const interval = 100;

   configureKeyPresing(web, interval);
   web.attachStation(new Station('A', 5, 0.5));
   web.attachStation(new Station('B', 35, 0.1));
   web.attachStation(new Station('C', 65, 0.01));

   web.run(interval);
}

main();
