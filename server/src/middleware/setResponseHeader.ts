import { Request, Response, NextFunction } from 'express';

const setResponseHeader = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    // res.header(
    //     'Access-Control-Allow-Headers',
    //     'Origin, X-Requested-With, Content-Type, Accept'
    // );
    res.header(
        'Access-Control-Allow-Methods',
        'GET,PUT,POST,DELETE,UPDATE,OPTIONS'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
    );
    next();
};

export default setResponseHeader;
