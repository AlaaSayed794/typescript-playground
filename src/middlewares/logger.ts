import { Request, Response, NextFunction } from 'express';

const logger = (
    req: Request,
    _res: Response,
    next: NextFunction //resolve linter error to not use Function as a type
): void => {
    //to destructure with types you have to assign a type to the whole list
    const { url, method }: { url: string, method: string } = req;
    console.log(`visited ${url}. With method ${method}`);
    next();
};

export default logger;
