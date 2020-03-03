import defined from '../utils/defined';
import { ManualSync, QuickSync } from './../constants/order_types';
export const NORMAL = "Normal";
export const HIGH = "High";
export const ONE_DAY = "1 day";
export const TWO_DAYS = "2 days";
export const THREE_DAYS = "3 days";
export const FOUR_DAYS = "4 days";

export function ConvertPriorityStringToInt(priority) {
  switch(priority) {
    case NORMAL:
      return 1;
    case HIGH:
      return 2;
    case ONE_DAY:
      return 1;
      case TWO_DAYS:
      return 2;
      case THREE_DAYS:
      return 3;
      case FOUR_DAYS:
      return 4;
    default:
      return 1;
  }
}

export function ConvertPriorityIntToString(priority, orderType) {
  if(!defined(priority)) {
    throw Error('Error: Priority not defined');
  }
  else if(!defined(orderType)) {
    throw Error('Error; Order Type not defined');
  }

  if(orderType===(ManualSync)) {
    switch(priority) {
      case 1:
        return ONE_DAY;
      case 2:
        return TWO_DAYS;
      case 3:
        return THREE_DAYS;
      case 4:
        return FOUR_DAYS;
      default:
        return ONE_DAY;
    }
  }
  else if(orderType===QuickSync) {
    switch(priority) {
      case 1:
        return NORMAL;
      case 2:
        return HIGH;
      default:
        return NORMAL;
    }
  }
  else {
    throw Error(`Invalid Order Type value: ${orderType}`)
  }
}