# NestJS API SERVER CORE

## 개요
***
NestJS로 API 서버를 구축할 때 사용하기 위해 만들었다. 다시 생각해보면 Core라기 보다는 Boilerplate Template가 맞는 것 같다..

## 기능
***
- 인증
    
    JWT 인증 방식을 통하여 자격 인증.
    AccessToken의 경우 헤더 값으로 bearer + token 의 형태로 받습니다.
    RefreshToken의 경우 쿠키 값에서 'Refresh' 키의 값을 불러와 받습니다.

- 미들웨어

    AuthTokenMiddleware를 app.module 적용하여 설정된 path별로 특정 메소드에 적용할 수 있습니다. 기본적인 세팅으로는 모든 경로의 모든 메소드[GET, POST, UPDATE 등..]에서 항상 작동합니다.
    기능의 경우 request 객체의 해더값에서 bearer + token 의 형태를 가져와 user객체를 조회합니다. 만약 조회값이 없다면 아무것도 반환하지 않습니다.
    컨트롤러에서는 @GetUser 데코레이터 혹은 @Req 데코레이터를 이용하여 user 객체를 가져올 수 있습니다.
    
    사용 예시.
    ```typescript
    @Get('/user')
    async getUserExample(@GetUser() user: User, @Req req){
        console.log(user + "==" + req.user)
    }
    ```

- 데코레이터

    1. AdminInterceptor
    
        해당 기능은 AuthToeknMiddleware가 user 객체를 조회하여 정상적으로 Return 해준 경우 request 객체에서 user 객체를 가져온 뒤 권한이 저장된 컬럼을 '3(해당 값과 로직은 상황에 맞게 변경하시면 됩니다.)' 초과 인 경우에만 허용하며 그 외는 403 에러를 반환합니다.
        만약 user 객체가 정상적으로 반환되지 않아 가져올 수 없다면 401 에러를 발환합니다.
        
        사용 예시.
        ```typescript
        @UseInterceptors(AdminInterceptor)
        export class AdminControllerExample{
            ...
        }
        ```
        위의 예시는 컨트롤러 전체에 적용하는 모습입니다.
    
    2. TransactionInterceptor & TransactionManager

        해당 기능은 하나의 큰 플로우에서 중간 과정에 예상치 못한 Excetption이 일어났을 경우 해당 플로우 안에서 일어난 모든 쿼리가 롤백 될 수 있도록 합니다.
        
        예를 들면 게시판 작성 로직이 다음과 같을 경우입니다.

        1. 유저가 정상적인 사용자인지 확인
        2. 게시글을 DB에 업로드
        3. 유저의 DB 컬럼 중 게시글 수를 1 더함
        4. 로직 종료

        해당 로직에서 2번 로직이 정상적으로 수행 된 뒤 3번 로직에서 Exception이 생긴 경우 2번 로직에서 수행 된 쿼리가 RollBack됩니다.

        다음은 사용 예시입니다.
        ```typescript
            @UseInterceptors(AdminInterceptor)
            @UseInterceptors(TransactionInterceptor)
            export class ExampleController{
                ...

                // 게시판 작성
                @Post('/board')
                async postBoard(
                    @GetUser() user: User,
                    @Body() body: any,
                    @TransactionManager() queryRunnerManager: EntityManager
                ): Promise<any> {
                    
                    ...

                    const result = await boardService.createBoard(
                        user, body, queryRunnerManager
                    );

                    return result;
                }
            }

            ``` 아래는 서비스 로직 ```
            async createBoard(
                user: User, body: any, queryRunnerManager: EntityManager
            ): Promise<any> {
                const user = await queryRunnerManager.find(User, {
                    where:{
                        ...
                    }, 
                    ...
                });
                ...
                const board = await queryRunnerManager.save(user, body);
                return board;
            }
        ``` 
        위와 같이 queryRunnerManager 객체를 통해 쿼리를 실행시키면 됩니다.

    3. GetUser

        미들웨어와 로직은 같지만, 상세하게 커스텀이 가능하기 때문에 추후 개발을 위해 따로 만들었습니다. 마찬가지로 request객체에서 user 객체를 가져와 반환합니다.

        사용 예시.
        ```typescript
        @Get('/user')
        async getUserExample(@GetUser() user: User){
            console.log(user)
        }
        ```
- Guard

    Nestjs에서 기본적으로 제공하는 Guard는 허용된 요청이 아니면 요청 자체를 막아주는 일종의 미들웨어입니다. ( 허용된 요청의 기준은 사용자가 커스터마이징 )
    
    이를 이용하여 jwt 와 jwt-refresh-token 두 요청을 통해 필요한 상황에서 허용된 유저가 아닌 경우 요청에 응답하지 않습니다.

    각각의 정책은 jwt.strategy.ts 와 jwt-refresh.strategy.ts 에서 다룹니다.
    
    사용 예시.
    ```typescript
        @Get('/myInfo')
        @UseGuards(AuthGuard("jwt"))
        async getMyInfo(...){
            ...
        }

        @Get('/myInfoWithRefresh')
        @UseGuards(AuthGuard("jwt-refresh-token"))
        async getMyInfoWithRefresh(...){
            ...
        }
    ```
    위와 같이 원하는 곳에 넣게 될 경우 해당 조건을 만족하지 않으면 미들웨어 단계에서 응답을 처리하여 서버 부담을 줄일 수 있습니다.

- Socket.io

    socket.io를 이용하여 서버-클라이언트 간 소켓 통신을 지원합니다.
    필요에 따라 소켓 통신 과정에서 jwt토큰을 통해 최초 connection에서 인증 과정을 거칩니다.

    다음은 socket 통신을 위한 gateway 설명입니다.

    src\gateways 경로에서 모든 소켓 통신 관련 모듈 및 코드가 관리됩니다.
    
    gateway.core.ts는 gateway의 모든 신호를 우선 처리하는 일종의 인터셉터로 기획하였으나, 추후 변경 될 수 있습니다.
    
    gateway.module.ts는 gateway.core를 포함한 모든 게이트웨이들을 provide/export 하며, 각 게이트웨이가 외부의 모듈을 사용할 수 있도록 import 하고 있습니다.

    따라서 신규로 gateway를 추가하고자 할 땐, src\gateways 경로 아래에 새로 폴더를 만들고 gateway.[name].ts 파일을 생성한 뒤 코드를 작성하면 됩니다. 그 후 gateway.module.ts에서 해당 파일을 provides와 exports에 등록하면 됩니다.

    다음은 gateway 생성 시 신규 코드 예시입니다.
    ```typescript
    import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
    import { Server } from "socket.io";
    // 만약 외부 서비스/dto 등을 사용하고 싶은 경우 미리 gateway.module.ts에서 imports에 해당 모듈을 등록한 뒤 아래와 같이 import 하면 된다.
    import { ... } from "src/pages/[importModuleName]/dto/[importModuleName].dto";
    import { [importModuleName]Service } from "src/pages/[importModuleName]/[importModuleName].service";
    @WebSocketGateway(8080, {
        transports: ['websocket'],
        cors: {
            origin: '*',
        },
    })
    export class ExampleGateway {
        constructor() {
            // 마찬가지로 꼭 gateway.module.ts에서 imports에 등록되어있는지 확인.
            private readonly [importModuleName]Service : [importModuleName]Service,
            ...
        }
        @WebSocketServer()
        server: Server;

        // Api 서비스 혹은 컨트롤러에서 소켓통신을 사용할 경우 아래 함수를 호출할 수 있도록 할수도 있다. 단, 해당 모듈에서 gateway.module.ts를 해당 모듈의 imports에 등록해아한다.
        // 중요한 건 서로 상호 참조할 경우 충돌이 일어날 수 있으므로, forwardRef(()=> Module) 을 통해 방지하도록 하자.
        async usedAtApi(
            socketId: string,
            ...
        ) {
            this.server.to(socketId).emit(info_type, {
                userId: userId,
                matchInfo: matchInfo,
            });
        }

        @SubscribeMessage('test')
        async handleChat(
            @MessageBody() data: { ... },
            @ConnectedSocket() client: Socket
        ) {
            try {
                ...
                this.server.emit('receive_chat');
            } catch (err) {
                ...
                client.emit('error');
            }
        }
    }
    ```
    
    
## Todo.
***
