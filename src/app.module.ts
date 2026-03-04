import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import LocalSession from 'telegraf-session-local';

const sessions = new LocalSession();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
