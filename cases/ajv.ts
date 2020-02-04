import 'reflect-metadata';
import {Case} from './abstract';
import Ajv from 'ajv';

const schema = {
  "$id": "http://example.com/schemas/defs.json",
  "type": "object",
  "properties": {
    "number": {"type": "integer"},
    "negNumber": {"type": "integer", "maximum": 0},
    "maxNumber": {"type": "integer"},
    "string": {"type": "string"},
    "longString": {
      "type": "string",
      "minLength": 100
    },
    "boolean": {"type": "boolean"},
    "deeplyNested": {"$ref": "#/definitions/deeplyNested"},
  },
  "required": ["number", "negNumber", "maxNumber", "string", "longString", "boolean", "deeplyNested"],
  "definitions": {
    "deeplyNested": {
      "type": "object",
      "properties": {
        "foo": {"type": "string"},
        "num": {"type": "number"},
        "bool": {"type": "boolean"}
      },
      "required": ["foo", "num", "bool"]
    }
  }
};
const ajv = new Ajv();
const validate = ajv.compile(schema);

export class AjvCase extends Case implements Case {
  name = 'ajv';

  validate() {
    const valid = validate(this.data);
    if (valid) {
      return this.data;
    }

    throw new Error('Invalid');
  }
}
