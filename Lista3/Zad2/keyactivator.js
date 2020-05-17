const readline = require('readline');

// Activates step choosing mode
module.exports = function configureKeyPresing(web, interval) {
   readline.emitKeypressEvents(process.stdin);
   process.stdin.setRawMode(true);
   process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
         // On ctrl + c exit
         process.exit();
      } else if (web.repeater === null && key.name === 'return') {
         // Make single step
         web.networkStep();
         console.log('\nPAUSED');
      } else if (key.name === 'space') {
         // Switch between continous mode
         if (web.repeater !== null) {
            clearInterval(web.repeater);
            web.repeater = null;
            console.log('\nPAUSED');
         } else {
            web.run(interval);
         }
      }
   });
}
