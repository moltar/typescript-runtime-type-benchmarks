import {
  ClassValidatorAsyncCase,
  ClassValidatorSyncCase,
} from './class-validator';
import { FunvalCase } from "./funval";
import { IoTsCase } from './io-ts';
import { MarshalCase } from './marshal';
import { PurifyCase } from "./purify-ts";
import { RuntypesCase } from './runtypes';
import { ToiCase } from './toi';
import { TsJsonValidatorCase } from './ts-json-validator';
import { TsUtilsCase } from "./ts-utils";
import { ZodCase } from './zod';

export const cases = [
  ClassValidatorAsyncCase,
  ClassValidatorSyncCase,
  FunvalCase,
  IoTsCase,
  MarshalCase,
  PurifyCase,
  RuntypesCase,
  ToiCase,
  TsJsonValidatorCase,
  TsUtilsCase,
  ZodCase,
];
