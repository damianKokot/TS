const readline = require('readline');

// Activates step choosing mode
module.exports = function configureKeyPresing(web, interval) {
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
