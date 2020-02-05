import {
  ClassValidatorAsyncCase,
  ClassValidatorSyncCase
} from "./class-validator";
import { IoTsCase } from "./io-ts";
import { MarshalCase } from "./marshal";
import { RuntypesCase } from "./runtypes";
import { ToiCase } from "./toi";
import { TsJsonValidatorCase } from "./ts-json-validator";
import { PurifyTsCase } from "./purify-ts";

export const cases = [
  ClassValidatorAsyncCase,
  ClassValidatorSyncCase,
  IoTsCase,
  MarshalCase,
  RuntypesCase,
  ToiCase,
  TsJsonValidatorCase,
  PurifyTsCase
];
