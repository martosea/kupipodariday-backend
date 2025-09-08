import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => this.removePasswordField(data)));
  }

  private removePasswordField(data: any) {
    const seen = new WeakSet();

    const isPlainObject = (val: any) =>
      Object.prototype.toString.call(val) === '[object Object]';

    const walk = (val: any): any => {
      if (Array.isArray(val)) {
        return val.map((item) => walk(item));
      }
      if (val && isPlainObject(val)) {
        if (seen.has(val)) return val;
        seen.add(val);
        const entries = Object.entries(val).filter(([k]) => k !== 'password');
        const out: any = {};
        for (const [k, v] of entries) {
          out[k] = walk(v);
        }
        return out;
      }
      return val;
    };

    return walk(data);
  }
}
