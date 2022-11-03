import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigModule } from './common/config/app-config.module';
import { DbJsonModule } from './common/db/db-json.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [MoviesModule, DbJsonModule, AppConfigModule],
  providers: [AppService],
})
export class AppModule {}
