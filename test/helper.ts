import { AppConfig } from '../src/common/config/config';

export type TestAppConfig = Partial<AppConfig>;

type TestAppConfigKeys = keyof TestAppConfig;

type TestAppConfigValue = TestAppConfig[TestAppConfigKeys];

interface ConfigServiceMock {
  get: (key: TestAppConfigKeys) => TestAppConfigValue;
}

export function getConfigServiceMock(config: Partial<AppConfig>) {
  return (): ConfigServiceMock => ({
    get: (key: TestAppConfigKeys): TestAppConfigValue => config[key],
  });
}
