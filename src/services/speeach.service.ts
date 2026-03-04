import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { OPENAI_API, TELEGRAM_API } from 'src/constants';
import * as FormData from 'form-data';

@Injectable()
export class SpeechService {
  private readonly botToken: string;
  private readonly openaiApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.botToken = this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    this.openaiApiKey = this.configService.getOrThrow<string>('OPENAI_API_KEY');
  }

  async transcribeVoice(filePath: string): Promise<string> {
    const fileUrl = `${TELEGRAM_API}/file/bot${this.botToken}/${filePath}`;
    const fileResponse = await axios.get(fileUrl, { responseType: 'stream' });

    const formData = new FormData.default();
    formData.append('file', fileResponse.data, { filename: 'audio.ogg' });
    formData.append('model', 'whisper-1');

    try {
      const response = await axios.post<{ text: string }>(
        `${OPENAI_API}/audio/transcriptions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            ...formData.getHeaders(),
          },
        },
      );
      return response.data.text;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: { message?: string } }>;
      const status = axiosError.response?.status;
      const message =
        axiosError.response?.data?.error?.message ?? axiosError.message;
      throw new Error(`Ошибка запроса распознавания (${status}): ${message}`);
    }
  }
}
