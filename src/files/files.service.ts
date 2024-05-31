import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {

    constructor(
        private readonly configService: ConfigService
    ){}

    getStaticProductImage(imgName: string){
        const path = join(__dirname, '..', '..', 'static', 'products', imgName);                

        if( !existsSync(path) )
            throw new BadRequestException('Image not found');

        return path;        

    }
    
    // This method is used to upload the file to the server
    uploadProductFile(file: Express.Multer.File){
        if( !file )
            throw new BadRequestException('Make sure that the file is an image and is not empty');
        
        const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;
        
        return {
            secureUrl
        };
    }

    // This method is used to upload the file to Cloudinary
    async uploadProductFileToCloudinary(file: Express.Multer.File){
        if( !file )
            throw new BadRequestException('Make sure that the file is an image and is not empty');

        try {
            const {secure_url, public_id } = await v2.uploader.upload(file.path, {
                folder: 'products',
                use_filename: true            
            });   

            // console.log({public_id});         
            return {
                secureUrl: secure_url
            };
        } catch (error) {
            throw new BadRequestException('Error uploading the file to Cloudinary');            
        }
    }

    // This method is used to delete the file from the server
    async deleteProductFileFromCloudinary(publicId: string){
        try {
            await v2.uploader.destroy(publicId);
            return true;
        } catch (error) {
            throw new BadRequestException('Error deleting the file from Cloudinary');
        }
    }

    // Upload multiple files to Cloudinary
    async uploadMultipleFilesToCloudinary(files: Express.Multer.File[]){
        const secureUrls = [];

        for( const file of files ){
            const { secureUrl } = await this.uploadProductFileToCloudinary(file);
            secureUrls.push(secureUrl);
        }

        return secureUrls;
    }


}
