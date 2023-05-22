import { HttpException, Injectable, NestInterceptor } from "@nestjs/common";

@Injectable()
export class AdminInterceptor implements NestInterceptor {
    async intercept(context: any, next: any) {
        const req = context.switchToHttp().getRequest();
        try{
            const user = req.user;
            if(!user) throw new HttpException('unauthorized', 401);
            if(user.role <=3) throw new HttpException('forbidden', 403);
            return next.handle();
        }catch(e){
            throw new HttpException(e.message, e.status);
        }
    }
}