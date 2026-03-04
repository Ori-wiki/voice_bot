import { InjectBot } from '@grammyjs/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, Context } from 'grammy';

@Injectable()
export class TelegramService {
  // private readonly logger = new Logger(TelegramUpdate.name);
  private readonly botToken: string;

  constructor(
    @InjectBot() private readonly bot: Bot<Context>,
    private readonly configService: ConfigService,
  ) {
    this.botToken = configService.get<string>('TELEGRAM_BOT_TOKEN') ?? '';
  }
  async processVoiceMessage(ctx: Context) {
    const voice = ctx.message?.voice ?? ctx.channelPost?.voice;
    if (!voice) return;
    const duration = voice.duration;

    console.log('voice msg:', duration);
  }
}
