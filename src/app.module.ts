import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import LocalSession from 'telegraf-session-local';

const sessions = new LocalSession();

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: '8295066134:AAH5M9DS13uJi34TpNYi3_7BACa9QM97Nps',
    }),
  ],
})
export class AppModule {}
