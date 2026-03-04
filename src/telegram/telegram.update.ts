import { InjectBot, Update, Start, On } from '@grammyjs/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, Context } from 'grammy';
import { TelegramService } from './telegram.service';

@Update()
@Injectable()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @Start()
  async onStart(ctx: Context): Promise<void> {
    await ctx.reply('Привет, отправь мне голосовое сообщение.');
  }
  @On(':voice')
  async onVoiceMessage(ctx: Context): Promise<void> {
    return this.telegramService.processVoiceMessage(ctx);
  }
}
