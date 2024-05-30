import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
  ){}

  async runSeed() {
    await this.insertNewProducts();
    return `Seed executed successfully!`;
  }


  private async insertNewProducts(){
    // Delete all products
    await this.productsService.deleteAllProducts();

    // Insert new products
    const products = initialData.products;    
    const insertPromises = [];

    products.forEach(product => {
      insertPromises.push( this.productsService.create(product) );
    });

    await Promise.all( insertPromises );

    return true;
  }
}
