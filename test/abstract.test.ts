import clone from 'clone';
import { expectTypeOf } from 'expect-type';
import { cases } from '../cases/index';
import { DATA } from '../data';

const caseClasses = Object.values(cases);

type CaseTuple = [string, typeof caseClasses[number]];

const caseTuples = caseClasses.map<CaseTuple>(caseClass => {
  return [new caseClass(DATA).name, caseClass];
});

const clonedData = () => clone({ ...DATA });

describe.each(caseTuples)('Case Class: %s', (_caseName, caseClass) => {
  let data = clonedData();

  beforeEach(() => {
    data = clonedData();
  });

  it('should validate type', async () => {
    expect.assertions(1);

    const c = new caseClass(data);

    const res = await c.validate();

    expectTypeOf(res).toMatchTypeOf(DATA);

    expect(c).toBeTruthy();
  });

  it('should return a validated data object', async () => {
    const c = new caseClass(data);
    expect(await c.validate()).toEqual(DATA);
  });

  it('should fail validation when type is wrong', async () => {
    expect.assertions(2);

    Object.assign(data, { boolean: 'foo' });

    const c = new caseClass(data);

    let err;

    try {
      await c.validate();
    } catch (e) {
      err = e;
    }

    expect(err).toBeTruthy();
    expect(err).toMatchSnapshot();
  });

  it('should fail validation when deeply nested type is wrong', async () => {
    expect.assertions(2);

    Object.assign(data.deeplyNested, { bool: 'foo' });

    const c = new caseClass(data);

    let err;

    try {
      await c.validate();
    } catch (e) {
      err = e;
    }

    expect(err).toBeTruthy();
    expect(err).toMatchSnapshot();
  });

  it('should fail validation when prop is missing', async () => {
    expect.assertions(2);

    delete data.boolean;
    const c = new caseClass(data);

    let err;

    try {
      await c.validate();
    } catch (e) {
      err = e;
    }

    expect(err).toBeTruthy();
    expect(err).toMatchSnapshot();
  });
});
