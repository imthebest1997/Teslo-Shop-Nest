import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetRawHeaders = createParamDecorator(
    ( data: string, ctx: ExecutionContext) => {
        
        const req = ctx.switchToHttp().getRequest();
        const headers = req.headers;

        if( !headers ) 
            throw new InternalServerErrorException("Headers not found in request.");

        return ( !data ) 
            ? headers 
            : headers[data];
    }
);