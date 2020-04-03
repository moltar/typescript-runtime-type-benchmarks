import { v } from "quartet";
import { Case } from "./abstract";
import { Data } from "../data";

const checkData = v<Data>({
  number: v.safeInteger,
  negNumber: v.number,
  maxNumber: v.number,
  string: v.string,
  longString: v.string,
  boolean: v.boolean,
  deeplyNested: {
    foo: v.string,
    num: v.number,
    bool: v.boolean
  }
});

export class QuartetCase extends Case implements Case {
  name = "quartet";

  validate() {
    const { data } = this;

    if (checkData(data)) {
      return data;
    }

    throw new Error("Invalid");
  }
}
