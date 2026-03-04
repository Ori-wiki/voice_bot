import { InjectBot } from '@grammyjs/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot, Context } from 'grammy';
import { SpeechService } from 'src/services/speeach.service';
import { clearInterval } from 'timers';

@Injectable()
export class TelegramService {
  private readonly botToken: string;

  constructor(
    @InjectBot() private readonly bot: Bot<Context>,
    private readonly configService: ConfigService,
    private readonly speechService: SpeechService,
  ) {
    this.botToken = configService.get<string>('TELEGRAM_BOT_TOKEN') ?? '';
  }

  async processVoiceMessage(ctx: Context) {
    const voice = ctx.message?.voice ?? ctx.channelPost?.voice;
    if (!voice) return;

    const duration = voice.duration;
    let progressMessageId: number | undefined;
    let interval: NodeJS.Timeout | undefined;
    let percent = 10;
    let isUpdating = false;

    try {
      const file = await ctx.getFile();
      const filePath = file.file_path;
      if (!filePath) {
        throw new Error('Не удалось получить путь к аудиофайлу из Telegram');
      }

      await ctx.reply(`Длительность голосового сообщения: ${duration} сек.`);

      const progressMsg = await ctx.reply(this.renderProgress(percent));
      progressMessageId = progressMsg.message_id;

      interval = setInterval(
        async () => {
          if (isUpdating) return;
          if (percent >= 90) {
            clearInterval(interval);
            return;
          }
          if (progressMessageId == null || ctx.chat?.id == null) return;

          isUpdating = true;
          percent += 5;
          try {
            await ctx.api.editMessageText(
              ctx.chat.id,
              progressMessageId,
              this.renderProgress(percent),
            );
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            if (!errorMessage.includes('message is not modified')) {
              console.error('Ошибка обновления прогресса:', errorMessage);
            }
          } finally {
            isUpdating = false;
          }
        },
        duration > 300 ? 3000 : 2000,
      );

      const transcription = await this.speechService.transcribeVoice(filePath);
      console.log('Распознавание завершено:', transcription);
    } catch (error) {
      clearInterval(interval);
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Ошибка обработки голосового сообщения:', errorMessage);
      await ctx.reply(`Ошибка при обработке голосового сообщения: ${errorMessage}`);
    }

    console.log('Получено голосовое сообщение, длительность:', duration);
  }

  private renderProgress(percent: number): string {
    const totalBlocks = 10;
    const filledBlockChar = '#';
    const emptyBlockChar = ' ';

    const filledBlocks = Math.max(1, Math.round((percent / 100) * totalBlocks));
    const emptyBlocks = totalBlocks - filledBlocks;

    return `Прогресс: ${percent}% [${filledBlockChar.repeat(filledBlocks)}${emptyBlockChar.repeat(emptyBlocks)}]`;
  }
}

