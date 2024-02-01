import dontenv from 'dotenv';
import Server from './models/server';
dontenv.config();


const server = new Server();

server.listen();
