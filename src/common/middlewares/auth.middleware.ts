import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { IExpressRequest } from '../models';
import { UserService } from '@app/resources';
import { JWT_SECRET } from '@app/../config';
import { FindIdDTO } from '../dtos';

/* Эта логика позволяет аутентифицировать пользователя на основе JWT-токена
 и добавлять информацию о пользователе в объект запроса
  для последующего использования в контроллерах и других middleware
*/

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, JWT_SECRET) as FindIdDTO;
      const user = await this.userService.findOne(+decode.id);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;

      next();
    }
  }
}
