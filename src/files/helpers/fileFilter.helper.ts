export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function ) => {
    
    if( !file ) return callback(new Error('No file provided'), false);

    const fileExtension = file.originalname.split('.').pop();
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

    if( validExtensions.includes(fileExtension) ) {
        return callback(null, true);
    }

    return callback(null, false);

}