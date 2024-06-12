import { IsString, MinLength } from "class-validator";

export class NewMessageDto{
    sender: string;

    @IsString()
    @MinLength(1)
    message: string;
}