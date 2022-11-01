import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { AppConfigService } from '../config/app-config.service';
import { AppConfig } from '../config/config';
import { DbJson } from './interfaces/db-json.interface';

@Injectable()
export class DbJsonService {
  private readonly dbJsonPath: AppConfig['dbJsonPath'];

  constructor(private readonly configService: AppConfigService) {
    this.dbJsonPath = this.configService.get('dbJsonPath');
  }

  async read(): Promise<DbJson> {
    const dbFile = await fs.promises.readFile(this.dbJsonPath, {
      encoding: 'utf-8',
    });
    return JSON.parse(dbFile);
  }

  async save(dbJson: DbJson): Promise<void> {
    await fs.promises.writeFile(
      this.dbJsonPath,
      JSON.stringify(dbJson, null, 2),
    );
  }
}
