var Program = require('commander');
var Commands = require('./commands');

// Define the program commands.
Program.version(require('../package.json').version);

Program
  .command('join [name]')
  .alias('j')
  .description('Join a room with the specified name.')
  .action(Commands.joinRoom);

Program
  .command('authorize')
  .alias('set-auth')
  .description('Set the access-key token for client authentication.')
  .action(Commands.authorize);

Program
  .command('whoami')
  .alias('me')
  .description('Display your user information based on the existing token.')
  .action(Commands.whoAmI);

Program
  .command('rooms')
  .alias('status')
  .description('Display a list of rooms that you are part of.')
  .action(Commands.rooms);

Program
  .option('--token [token]', 'Set the access-key token for client authentication. This won\'t be persisted.');

// Parse the application arguments.
Program.parse(process.argv);

// Check if there are no arguments.
if (!process.argv.slice(2).length) {
  // Display the application help.
  Program.outputHelp();
}

// Check if there is a token on the arguments.
if (Program.token) {
  Commands.setToken(Program.token);
}
