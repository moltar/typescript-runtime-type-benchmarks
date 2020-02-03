import clone from 'clone'
import cases from '../cases/index'
import { DATA } from '../data'

const CaseClasses = Object.values(cases)

type CaseTuple = [string, (typeof CaseClasses)[0]]

const caseTuples = CaseClasses.map<CaseTuple>((CaseClass) => {
  return [new CaseClass(DATA).name, CaseClass]
})

const clonedData = () => clone({ ...DATA })

describe.each(caseTuples)('Case Class: %s', (_caseName, CaseClass) => {
  let data = clonedData()

  beforeEach(() => {
    data = clonedData()
  })

  it('should return a validated data object', async () => {
    const c = new CaseClass(data)
    expect(await c.validate()).toEqual(DATA)
  })

  it('should fail validation when number is not negative', async () => {
    expect.assertions(2)

    data.negNumber = 1
    const c = new CaseClass(data)

    let err

    try {
      await c.validate()
    } catch (e) {
      err = e
    }

    expect(err).toBeTruthy()
    expect(err).toMatchSnapshot()
  })

  it('should fail validation when string is too short', async () => {
    expect.assertions(2)

    data.longString = ''
    const c = new CaseClass(data)

    let err

    try {
      await c.validate()
    } catch (e) {
      err = e
    }

    expect(err).toBeTruthy()
    expect(err).toMatchSnapshot()
  })
})
