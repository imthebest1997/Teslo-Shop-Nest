import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @ApiProperty({
        default: 10,
        minimum: 1,
        description: 'The number of items to return',
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        default: 0,
        minimum: 0,
        description: 'The number of items to skip',
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}