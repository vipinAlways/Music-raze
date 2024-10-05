// import { NextApiRequest, NextApiResponse } from 'next';
// import WebSocket from 'ws';

// const wss = new WebSocket.Server({ noServer: true });

// export default (req: NextApiRequest, res: NextApiResponse) => {
//   if (res.socket && res.socket. && !res.socket.server.wss) {
//     res.socket.server.wss = wss;

//     wss.on('connection', (ws) => {
//       ws.on('message', (message) => {
//         console.log('Received:', message);
//         // Broadcast to all clients
//         wss.clients.forEach((client) => {
//           if (client.readyState === WebSocket.OPEN) {
//             client.send(message.toString());
//           }
//         });
//       });

//       ws.send('Welcome to the WebSocket server!');
//     });
//   }
//   res.end();
// };
