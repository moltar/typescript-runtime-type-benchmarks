import {
  ClassValidatorAsyncCase,
  ClassValidatorSyncCase,
} from './class-validator';
import { FunvalCase } from "./funval";
import { IoTsCase } from './io-ts';
import { JsonDecoderCase } from './json-decoder'
import { MarshalCase } from './marshal';
import { MyzodCase } from './myzod';
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
  JsonDecoderCase,
  MarshalCase,
  MyzodCase,
  PurifyCase,
  RuntypesCase,
  ToiCase,
  TsJsonValidatorCase,
  TsUtilsCase,
  ZodCase,
];
