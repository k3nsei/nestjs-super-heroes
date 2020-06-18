import { DynamicModule, Module } from '@nestjs/common';
import {
  LoggerService,
  LOGGER_CONTEXT,
  LOGGER_TIMESTAMPABLE,
} from './logger.service';

@Module({})
export class LoggerModule {
  public static register(
    context: string,
    timestampable?: boolean,
  ): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LOGGER_CONTEXT,
          useValue: context,
        },
        {
          provide: LOGGER_TIMESTAMPABLE,
          useValue: timestampable,
        },
        LoggerService,
      ],
      exports: [LoggerService],
    };
  }
}
