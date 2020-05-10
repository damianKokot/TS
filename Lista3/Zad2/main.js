const Ethernet = require('./ethernet/ethernet');
const Station = require('./ethernet/station');
const readline = require('readline');

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

// Activates step choosing mode
function configureKeyPresing(web, interval) {
   readline.emitKeypressEvents(process.stdin);
   process.stdin.setRawMode(true);
   process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
         // On ctrl + c exit
         process.exit();
      } else if (web.allowedToContinue === false && key.name === 'return') {
         // If continous mode not running and enter pressed, 
         // make web.allowedToContinue true for one interval
         web.allowedToContinue = true;
         setTimeout(() => {
            web.allowedToContinue = false;
         }, interval);
      } else if (key.name === 'space') {
         // Switch between continous mode
         web.allowedToContinue = !web.allowedToContinue;
      }
   });
}
