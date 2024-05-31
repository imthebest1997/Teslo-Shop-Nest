import { v4 as uuid } from 'uuid';

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function ) => {
    
    if( !file ) return callback(new Error('No file provided'), false);

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${fileExtension}`;

    callback(null, fileName);

}