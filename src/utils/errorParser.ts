import { ContractsErrors, ESolidityTypes } from '@/types';

import { sliceAddress } from '.';
import { formatEther } from './eth';

export const errorParser = (message: string) => {
  try {
    const errorParsed = JSON.parse(
      (message as string).slice(49, (message as string).length - 1)
    );

    const errorValue = errorParsed.value.data.data.message.slice(
      78,
      errorParsed.value.data.data.message.length - 1
    );
    const errorName = errorValue.slice(0, errorValue.indexOf('('));
    const parsedParams = errorValue
      .slice(errorValue.indexOf('(') + 1, errorValue.indexOf(')'))
      .split(',');
    const error = ContractsErrors[errorName];
    if (!error) {
      return 'Transaction not successful';
    }
    const params = error.params
      .map((error, i) => {
        let value = parsedParams[i];
        if (error.type === ESolidityTypes.ETH_VALUE) {
          value = formatEther(value);
        }
        if (error.type === ESolidityTypes.ADDRESS) {
          value = sliceAddress(value);
        }
        return `${error.name}: ${value}`;
      })
      .join('\n');

    return `${error.name}\n ${params}`;
  } catch (e) {
    console.log(e);
    return 'Transaction not successful';
  }
};
