import { parseSafe, parseStrict, assertLoose } from './build';
import { addCase } from '../../benchmarks';

addCase('spectypes', 'parseSafe', data => {
  const parsed = parseSafe(data);

  if (parsed.tag === 'failure') {
    throw new Error(JSON.stringify(parsed.failure));
  }

  return parsed.success;
});

addCase('spectypes', 'parseStrict', data => {
  const parsed = parseStrict(data);

  if (parsed.tag === 'failure') {
    throw new Error(JSON.stringify(parsed.failure));
  }

  return parsed.success;
});

addCase('spectypes', 'assertLoose', data => {
  const parsed = assertLoose(data);

  if (parsed.tag === 'failure') {
    throw new Error(JSON.stringify(parsed.failure));
  }

  return true;
});

addCase('spectypes', 'assertStrict', data => {
  const parsed = parseStrict(data);

  if (parsed.tag === 'failure') {
    throw new Error(JSON.stringify(parsed.failure));
  }

  return true;
});
