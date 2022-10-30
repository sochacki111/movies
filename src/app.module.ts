import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbJsonModule } from './db/db-json.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [MoviesModule, DbJsonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
