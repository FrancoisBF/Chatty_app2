const express = require('express');
const WebSocket = require('ws');
const uuidv1 = require('uuid/v1');
const SocketServer = require('ws').Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
      //client.send(JSON.stringify(data));
    }
  });
};

let count = 0;

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  count += 1;

  let userCount = {
    type: 'userCount',
    count: count
  }
  wss.broadcast(JSON.stringify(userCount));
//     wss.broadcast(UserCount);


  ws.on('message', function(text) {
    const msgBroadCast = JSON.parse(text);
//Check if no proper type => error out
//Check for message type.
    if(msgBroadCast.type === "postNotification"){
//Send a notification back to client
      msgBroadCast.type = "incomingNotification";
    }
    if(msgBroadCast.type === "postMessage"){
  // Broadcast the message to everyone(all connected browser)
  //convert it back to object
      msgBroadCast.type = "incomingMessage";

    }
      msgBroadCast.id = uuidv1();
      wss.broadcast(JSON.stringify(msgBroadCast));
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    count -= 1;
    let userCount = {
      type: 'userCount',
      count: count
    }
    wss.broadcast(JSON.stringify(userCount));
  });
});
//   ws.on('close', () => console.log('Client disconnected'));
// });


// because for some reason, 'ws' doesn't ship with a working broadcast




// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
// wss.on('connection', function connection(ws, req) {

//   console.log('Client connected');

//   ws.on('message', function incoming(message) {
//     console.log("just got stuff");

//     const parsedData = JSON.parse(message);
//     let type;
//     if (parsedData.type === 'postNotification'){
//       type = 'incomingNotification'
//     } else {
//       type = 'incomingMessage'
//     }

// broadcast the message to everyone
  //   const newMessage = {
  //     type: type,
  //     id: Math.random(),
  //     content: parsedData.content,
  //     username: parsedData.username
  //   };
  //   console.log(newMessage, 'newMessage')

  //   wss.broadcast(newMessage);
  // });



//broccast for everyoe
