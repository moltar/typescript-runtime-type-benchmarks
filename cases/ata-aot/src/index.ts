// The two files below are written by `src/generate.ts` during the build, so
// they do not exist in the repository and TypeScript cannot see them here.

// @ts-expect-error generated at build time
import { isValid as looseIsValid } from './generated/loose';
// @ts-expect-error generated at build time
import { isValid as strictIsValid } from './generated/strict';

export const isValidLoose = looseIsValid as (data: unknown) => boolean;
export const isValidStrict = strictIsValid as (data: unknown) => boolean;
