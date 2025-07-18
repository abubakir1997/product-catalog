import {isFunction} from 'lodash'
import type { SetStateAction } from "react";

export function getSetStateActionValue<T>(setStateAction: SetStateAction<T>, value: T) {
  return isFunction(setStateAction) ?  setStateAction(value) : value
}