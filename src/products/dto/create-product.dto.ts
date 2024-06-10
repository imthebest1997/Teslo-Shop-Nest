import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {    

    @ApiProperty({
        description: 'The title of the product',
        type: String,
        required: true,
        minLength: 1    
    })
    @IsString()
    @MinLength(1)    
    title: string;

    @ApiProperty({
        description: 'The price of the product',
        type: Number,
        required: false,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'The description of the product',
        type: String,
        required: false,
        minLength: 1
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The slug of the product',
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'The stock of the product',
        type: Number,
        required: false,
        minimum: 0
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'The sizes of the product',
        type: [String],
        required: false
    })
    @IsString({ each: true })    
    @IsArray()
    sizes: string[];    

    @ApiProperty()
    @IsIn(['men', 'women', 'kids', 'unisex'])
    gender: string;

    @ApiProperty({
        description: 'The tags of the product',
        type: [String],
        required: false
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty({
        description: 'The images of the product',
        type: [String],
        required: false
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];

}
