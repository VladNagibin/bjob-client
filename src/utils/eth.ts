import { BigNumber } from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: 30 });

export const formatEther = (value: string | BigNumber) => {
  if (typeof value === 'string') {
    value = new BigNumber(value);
  }
  return value.div(10 ** 18);
};

export const parseEther = (value: string | BigNumber) => {
  if (typeof value === 'string') {
    value = new BigNumber(value);
  }
  return value.multipliedBy(10 ** 18);
};
