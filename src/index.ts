import express, { Request, Response, Application } from 'express';

import logger from './middlewares/logger';
import routes from './routes';


const app: Application = express();
const port: number = 3000;

//app.use a list of your custom middlewares
app.use([logger])

//app.use routes takes url and routes object. now to access routes root url you need to access /api
app.use('/api', routes);


//app.Method takes two parameters, URI and callback function
//callback function takes request and response objects as parameters
app.get('/', async (_req: Request, res: Response): Promise<void> => {
    res.send('todo app root route');
}
);

//use this function to map your app to a port
app.listen(port, () => {
    console.log('server started on port: ' + port);
});

export default app;