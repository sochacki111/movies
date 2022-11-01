import { required } from '../util/required';

export interface AppConfig {
  port: number;
  dbJsonPath: string;
  durationRange: number;
}

export const config = (): AppConfig => ({
  port: parseInt(process.env.PORT ?? required('PORT')),
  dbJsonPath: process.env.DB_JSON_PATH ?? required('DB_JSON_PATH'),
  durationRange: parseInt(
    process.env.DURATION_RANGE ?? required('DURATION_RANGE'),
  ),
});
