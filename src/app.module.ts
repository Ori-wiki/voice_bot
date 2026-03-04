import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import LocalSession from 'telegraf-session-local';
import { TelegramModule } from './telegram/telegram.module';

const sessions = new LocalSession();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegramModule,
  ],
})
export class AppModule {}
