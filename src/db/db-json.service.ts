import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { DbJson } from './interfaces/db-json.interface';
import fs from 'fs';

@Injectable()
export class DbJsonService {
  async read(): Promise<DbJson> {
    // TODO Hide in env
    const dbFile = await fs.promises.readFile(
      join(process.cwd(), 'src', 'db', 'db.json'),
    );
    return JSON.parse(dbFile.toString());
  }

  async save(dbJson: DbJson): Promise<void> {
    await fs.promises.writeFile(
      // TODO Hide in env
      join(process.cwd(), 'src', 'db', 'db.json'),
      JSON.stringify(dbJson, null, 2),
    );
  }
}
