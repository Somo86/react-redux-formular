import * as R from 'ramda';

export const isEmptyOrNil = R.allPass([R.isEmpty, R.isNil]);
