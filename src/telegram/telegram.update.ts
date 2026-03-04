import { InjectBot, Update, Start, On } from '@grammyjs/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, Context } from 'grammy';

@Update()
@Injectable()
export class TelegramUpdate {
  private readonly logger = new Logger(TelegramUpdate.name);
  private readonly botToken: string;

  constructor(
    @InjectBot() private readonly bot: Bot<Context>,
    private readonly configService: ConfigService,
  ) {
    this.botToken = configService.get<string>('TELEGRAM_BOT_TOKEN') ?? '';
  }

  @Start()
  async onStart(ctx: Context): Promise<void> {
    await ctx.reply('Привет, отправь мне голосовое сообщение.');
  }
  @On(':voice')
  async onVoiceMessage(ctx: Context): Promise<void> {
    const voice = ctx.message?.voice ?? ctx.channelPost?.voice;
    if (!voice) return;
    const duration = voice.duration;

    console.log('voice msg:', duration);
  }
}
