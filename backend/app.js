require('dotenv').config({ silent: true });

const server = require('./server');
const port = process.env.PORT || 9000;

/**
 * Start up the Express server and listen on port for events
 */

server.then(app => {
  app.listen(port, () => {
    console.log('Watson Discovery Server running on port: %d', port);
  });
});
