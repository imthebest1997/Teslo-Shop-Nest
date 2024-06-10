import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "../../auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({ 
        example: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
        description: 'The id of the Product',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt',
        description: 'The title of the Product',
    })
    @Column('text', {
        unique: true,
        nullable: false,
    })
    title: string;

    @ApiProperty({
        example: 10.99,
        description: 'The price of the Product',
    })
    @Column('float', {
        default: 0,
    })
    price: number;

    @ApiProperty({
        example: 'This is a T-shirt',
        description: 'The description of the Product',
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty({
        example: 't_shirt',
        description: 'The slug of the Product',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'The stock of the Product',
    })
    @Column('int', {
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'L', 'XL'],
        description: 'The colors of the Product',
    })
    @Column('text', {
        array: true,
        default: [],
    })
    sizes: string[];

    @ApiProperty({
        example: 'Male | Female',
        description: "Gender of the product",
        default: null
    })
    @Column('text')
    gender: string;
    
    @ApiProperty({
        example: ['red', 'blue'],
        description: 'The colors of the Product',
    })
    @Column('text', {
        array: true,
        default: [],
    })
    tags: string[];
    
    @ApiProperty({
        example: 'https://www.google.com',
        description: 'The link of the Product',
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {
            cascade: true,
            eager: true,
        }
    )
    images?: ProductImage[];


    @ManyToOne(
        () => User,
        (user) => user.products,
        {
            onDelete: 'CASCADE',
            eager: true,// eager true para que traiga el usuario con el producto
        }        
    )
    user: User;


    @BeforeInsert()
    checkSlugInsert(){

        if(!this.slug){
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .trim()
            .replaceAll(" ", '_')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .trim()
            .replaceAll(" ", '_')
            .replaceAll("'", '');
    }
}
