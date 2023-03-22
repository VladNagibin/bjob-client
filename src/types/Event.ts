export interface IReturnValues {
  myIndexedParam: number;
  myOtherIndexedParam: string;
  myNonIndexParam: string;
}

export interface IRaw {
  data: string;
  topics: string[];
}

export interface IEvent {
  returnValues: IReturnValues;
  raw: IRaw;
  event: string;
  signature: string;
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
}

export enum EventType {
  CONTRACT_SIGNED = 'ContractSigned',
  SALARY_PAID = 'SalaryPaid',
  CONTRACT_CLOSED = 'ContractClosed',
  CONTRACT_NEEDS_TO_BE_FUNDED = 'ContractNeedsToBeFunded',
}
