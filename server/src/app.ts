import express, { Application, NextFunction } from 'express';
import connectDB from './utils/connect';
import IRoute from './interface/route.interface';
import log from './utils/logger';
import deserializeUser from './middleware/deserializeUser';
import setResponseHeader from './middleware/setResponseHeader';
import cors from 'cors';
import config from 'config';
import cookieParser from 'cookie-parser';
import { shouldSendSameSiteNone } from 'should-send-same-site-none';

class App {
    public express: Application;
    public port: number;

    constructor(routes: IRoute[], port: number) {
        this.express = express();
        this.port = port;
        this.initializeMiddleware();
        this.intializeRoutes(routes);
    }
    private initializeMiddleware() {
        //this.express.use(setResponseHeader);
        this.express.set('trust proxy', 1);
        this.express.use(
            cors({
                origin: 'http://localhost:3000',
                credentials: true,
            })
        );
        this.express.use(function (req, res, next) {
            // Website you wish to allow to connect
            res.setHeader(
                'Access-Control-Allow-Origin',
                'http://localhost:3000'
            );
            // Request methods you wish to allow
            res.setHeader(
                'Access-Control-Allow-Methods',
                'GET, POST, OPTIONS, PUT, PATCH, DELETE'
            );
            // Request headers you wish to allow
            res.setHeader(
                'Access-Control-Allow-Headers',
                'Origin,X-Requested-With,content-type,set-cookie'
            );
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            // Pass to next layer of middleware
            next();
        });
        this.express.use(shouldSendSameSiteNone);
        this.express.use(cookieParser());
        this.express.use(express.json());
        this.express.use(deserializeUser);
    }

    private intializeRoutes(routes: IRoute[]) {
        routes.forEach((route: IRoute) => {
            this.express.use('/api', route.router);
        });
    }

    public listen = (): void => {
        this.express.listen(this.port, async () => {
            await connectDB();
            log.info(`application is running at http://localhost:${this.port}`);
        });
    };
}

export default App;
