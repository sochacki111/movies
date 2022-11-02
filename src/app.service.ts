import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import fs from 'fs';
import { AppConfigService } from './common/config/app-config.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly configService: AppConfigService) {}

  // TODO change to healthz
  getHello(): string {
    return 'Hello World!';
  }

  onApplicationBootstrap(): void {
    // Intentional use of sync blocking code to check if db file exist on app bootstrap
    if (!fs.existsSync(this.configService.get('dbJsonPath'))) {
      throw new Error('Database file not found');
    }
  }
}
