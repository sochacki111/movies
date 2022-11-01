import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  get<K extends keyof AppConfig, V = AppConfig[K]>(key: K): V {
    const value = this.configService.get<V>(key);

    if (value) {
      return value;
    }

    throw new Error(`${key} is not defined`);
  }
}
