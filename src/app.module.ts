import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthorModule, UserModule, BookModule } from './resources/index';
import ormconfig from '../ormconfig';
import { AuthMiddleware } from './common/middlewares/index';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    BookModule,
    AuthorModule,
    UserModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/signup', method: RequestMethod.POST },
        { path: 'users/signin', method: RequestMethod.POST },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
