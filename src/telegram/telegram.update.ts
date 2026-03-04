import { InjectBot, Update, Start, On } from '@grammyjs/nestjs';
import { Injectable } from '@nestjs/common';
import { Context } from 'grammy';
import { TelegramService } from './telegram.service';

@Update()
@Injectable()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @Start()
  async onStart(ctx: Context): Promise<void> {
    await ctx.reply('Привет! Отправь мне голосовое сообщение.');
  }

  @On(':voice')
  async onVoiceMessage(ctx: Context): Promise<void> {
    return this.telegramService.processVoiceMessage(ctx);
  }
}

