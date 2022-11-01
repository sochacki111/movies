import { Global, Module } from '@nestjs/common';
import { DbJsonService } from './db-json.service';

@Global()
@Module({
  providers: [DbJsonService],
  exports: [DbJsonService],
})
export class DbJsonModule {}
