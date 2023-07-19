import { Module, forwardRef } from '@nestjs/common';
import { CoreGateway } from './gateway.core';
import { UsersModule } from 'src/pages/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisCacheModule } from 'src/cache/redis.module';
import { ChatModule } from 'src/pages/chat/chat.module';
import { ChatGateWay } from './chat/gateway.chat';

@Module({
    imports:[
        UsersModule,
        AuthModule,
        RedisCacheModule,
        ChatModule,
    ],
    providers: [
        CoreGateway,
        ChatGateWay,
    ],
    exports: [
        CoreGateway,
        ChatGateWay,
    ],
})
export class GatewayModule { }