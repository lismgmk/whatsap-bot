import { log } from 'console';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { Client, LocalAuth, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import { toFileStream } from 'qrcode';

import mongoose from 'mongoose';

const app = express();

const newsRouter = express.Router();

app.use(newsRouter);

// const SESSION_FILE_PATH = './session.json';

let sessionData: any;
let store: any;
let client: any;

// const phoneNumber = '375445591672';
// const phoneNumber = '375445683695';
const phoneNumber = '972546358982';

// const phoneNumber = '375295720237';
mongoose
  // .connect('mongodb://root:example@mongo:27017/bloggers_posts?authSource=admin')
  .connect(
    'mongodb+srv://lismgmk:2156Lis@cluster0.bebay.mongodb.net/whatsapp?retryWrites=true&w=majority'
  )
  .then(() => {
    console.log('hello dddddbbbbbb');
    store = new MongoStore({ mongoose: mongoose });
    // console.log(store);
    client = new Client({
      // session: sessionData ? JSON.parse(sessionData) : undefined,
      // authStrategy: new LocalAuth(),
      puppeteer: {
        args: ['--no-sandbox'],
        headless: false,
      },
      authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000,
        // clientId: 'first_device',
      }),
    });

    client.on('qr', (qr: any) => {
      // store.save({ session: 'my_session' });
      console.log('Scan this QR code with your phone: ');
      console.log(qr);
    });

    client.on('remote_session_saved', () => {
      console.log('save remote!!!!');
      // store.save({ session: 'my_session' });
    });

    client.on('message', (message: any) => {
      console.log(message, '+++++++++');
      if (message.from === `${phoneNumber}@c.us`) {
        console.log('ddddd');
        client.sendMessage(message.from, 'pong');
      }
    });

    client.initialize();
  });

newsRouter.get('/news/categories', (req: Request, res: Response) => {
  console.log('Client is readdy!');
  const message = 'Hello';
  const sentMessage = client.sendMessage(`${phoneNumber}@c.us`, message);

  res.status(200).send();
});

newsRouter.get('/qr', (req: Request, res: Response) => {
  console.log('Client is readdy!');
  return client.on('qr', (qr: any) => {
    return toFileStream(res, qr);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${process.env.PORT}`);
});
