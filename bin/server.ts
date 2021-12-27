import { app } from '../src/app';
import { createServer } from 'http';
import { debug } from 'debug';

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = createServer(app);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

server.on('error', onError);
server.on('listening', onListening);

export function normalizePort(val: any) {
    const port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }

    if(port >= 0){
        return port;
    }

    return false;
}

export function onError (error: any) {
    if(error.syscall !== 'listen'){
        throw error;
    }

    const bind = typeof port === 'string' ?
    'Pipe ' + port : 
    'Port ' + port;

    switch(error.code){
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default: 
            throw error;
    }
}

export function onListening(){
    const addr = server.address();
    const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
