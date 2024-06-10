import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {validate as isUUID} from "uuid";
import { ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    try {

      const {images = [], ...productDetails} = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user,
      });

      await this.productRepository.save(product);

      return {...product, images: product.images.map(image => image.url)};      

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;

      const products =  await this.productRepository.find({
        skip: offset,
        take: limit,
        relations: {
          images: true,        
        },
      });      

      return products.map(product => ({...product, images: product.images.map(image => image.url)}));
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error creating product');
    }
  }

  async findOne(term: string) {

    let product: Product;

    if( isUUID(term) ){
      product = await this.productRepository.findOneBy({ id: term });
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', { 
          title: term.toUpperCase(),
          slug: term.toLowerCase(),  
        })
        .leftJoinAndSelect('product.images', 'images')
        .getOne();
    }

    if(!product){
      throw new NotFoundException(`Product not found with term: ${term}`);
    }
    
    return product;
  }

  async findOnePlain( term: string ){
    const { images = [], ...product} = await this.findOne(term);

    return {
      ...product, 
      images: images.map(image => image.url)
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
        
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate });

    if(!product)
      throw new NotFoundException(`Product not found with id: ${id}`);

    // Create query runner to handle transaction
    const queryRunner = this.dataSource.createQueryRunner();

    // Establish real database connection using our new query runner
    await queryRunner.connect();

    // Execute the transaction
    await queryRunner.startTransaction();

    try {
      if( images ){
        // Delete all images and add new ones
        await queryRunner.manager.delete(ProductImage, { product: {id} });
        product.images = images.map( image => this.productImageRepository.create({ url: image }));
      }
      
      product.user = user;
      
      // Save product
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();      
      this.handleDBExceptions(error);      
    } finally {
      await queryRunner.release();
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error creating product');
  }

  //! Don't execute this method in production 
  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleDBExceptions(error);      
    }
  }


}
