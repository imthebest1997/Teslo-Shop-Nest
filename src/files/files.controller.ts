import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {

  constructor(
    private readonly filesService: FilesService,
  ) {}

  @Get('product/:imgName')
  findProductImg(
    @Res() res: Response,
    @Param('imgName') imgName: string
  ){
    const path = this.filesService.getStaticProductImage(imgName);

    res.sendFile( path );
  }


  @Post('product')
  @UseInterceptors(FileInterceptor('file', {  
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    }),
    // limits: { fileSize: 1024 * 1024 },
  }))
  uploadProductFile(
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.filesService.uploadProductFile(file);    
  }


  @Post('product/cloudinary')
  @UseInterceptors(FileInterceptor('file', {  
    fileFilter: fileFilter,
    storage: diskStorage({
      filename: fileNamer
    }),
    // limits: { fileSize: 1024 * 1024 },
  }))
  uploadProductFileToCloudinary(
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.filesService.uploadProductFileToCloudinary(file);    
  }
}
