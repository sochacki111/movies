import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getConfigServiceMock, TestAppConfig } from '../test/helper';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './common/config/app-config.service';

describe('AppController', () => {
  let appController: AppController;

  const config: TestAppConfig = {
    durationRange: 10,
    dbJsonPath: 'path/mock',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        AppConfigService,
        {
          provide: ConfigService,
          useFactory: getConfigServiceMock(config),
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
