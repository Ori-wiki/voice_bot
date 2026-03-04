import { NestjsGrammyModule } from '@grammyjs/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { SpeechService } from 'src/services/speeach.service';

@Module({
  imports: [
    ConfigModule,
    NestjsGrammyModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
      }),
    }),
  ],
  providers: [TelegramUpdate, TelegramService, SpeechService],
})
export class TelegramModule {}
