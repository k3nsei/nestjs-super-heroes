import {
  Inject,
  Injectable,
  Logger,
  LoggerService as ILoggerService,
  Optional,
  Scope,
} from '@nestjs/common';

export const LOGGER_CONTEXT: symbol = Symbol('LOGGER_CONTEXT');
export const LOGGER_TIMESTAMPABLE: symbol = Symbol('LOGGER_TIMESTAMPABLE');

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger implements ILoggerService {
  constructor(
    @Optional() @Inject(LOGGER_CONTEXT) context: string | null,
    @Optional() @Inject(LOGGER_TIMESTAMPABLE) timestampable: boolean | null,
  ) {
    super(context ?? void 0, timestampable ?? true);
  }

  public error(error: Error | unknown, context?: string): void {
    let message: string;
    let trace: string;

    if (error instanceof Error) {
      message = error.message;
      trace = error.stack;
    } else {
      message = String(error);
    }

    return super.error(message, trace, context);
  }
}
