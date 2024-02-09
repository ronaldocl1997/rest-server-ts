
import express, {Application} from 'express';
import userRoutes from '../routes/usuarios';
import roleRoutes from '../routes/roles';
import authRoutes from '../routes/auth';
import cors from 'cors';
import db from '../db/connection';

class Server{

    private app: Application;
    private port: string;
    private apiPaths = {
        usuarios: '/api/usuarios',
        roles: '/api/roles',
        auth: '/api/auth'
    }

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '8080';

        this.dbConnection();
        this.middlewares();
        //Definir mis rutas
        this.routes();
    };

    async dbConnection() {
        try {
            await db.authenticate();
            console.log("base de datos online")
        } catch (error) {
            if (typeof error === 'string') {
                throw new Error(error);
            } else {
                throw new Error('Error desconocido');
            }
        }
    }

    middlewares() {
        
        // cors
        this.app.use( cors());

        // Lectura del body
        this.app.use( express.json());

        //carga carpeta punlica
        this.app.use ( express.static('public'));

    }

    routes() {
        this.app.use(this.apiPaths.auth, authRoutes);
        this.app.use(this.apiPaths.usuarios, userRoutes);
        this.app.use(this.apiPaths.roles, roleRoutes);
    }

    listen(){
        this.app.listen( this.port, () =>{
            console.log('El servidor corriendo en puerto:' + this.port);
        } );
    }
}

export default Server;