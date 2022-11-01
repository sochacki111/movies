import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { AppConfigService } from './app-config.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ load: [config] })],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
