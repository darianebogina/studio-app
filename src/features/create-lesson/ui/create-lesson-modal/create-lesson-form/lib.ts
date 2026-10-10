import type { LessonType } from '@/shared/types';
import type { CreateLessonResult } from '../../../lib';

export const DEFAULT_TYPE: LessonType = 'vogue';

export const DEFAULT_TIME = '19:00';

export const DEFAULT_DURATION_MIN = '60';

export const NETWORK_ERROR_RESULT: CreateLessonResult = { ok: false, error: 'unknown' };

export const getStudentFullName = (lastName: string, firstName: string) => `${lastName} ${firstName}`;
