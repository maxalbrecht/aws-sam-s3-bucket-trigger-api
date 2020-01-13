export const ONE_DAY = "1 day";
export const TWO_DAYS = "2 days";
export const THREE_DAYS = "3 days";
export const FOUR_DAYS = "4 days";

export function ConvertPriorityStringToInt(priority) {
  switch(priority) {
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