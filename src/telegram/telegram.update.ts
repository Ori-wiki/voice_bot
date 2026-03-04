import { InjectBot, Update, Start } from '@grammyjs/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, Context } from 'grammy';

@Update()
@Injectable()
export class TelegramUpdate {
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
}
