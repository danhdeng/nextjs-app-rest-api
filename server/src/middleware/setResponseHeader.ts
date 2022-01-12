import { Request, Response, NextFunction } from 'express';

const setResponseHeader = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
};

export default setResponseHeader;
