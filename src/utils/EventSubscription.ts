import { Contract, EventData } from 'web3-eth-contract';

interface ISubscription {
  id: string | null;
  unsubscribe: () => void;
}

export class EventSubscription {
  public id: string | null = null;
  private subscription: ISubscription;
  constructor(
    contract: Contract,
    eventCallback: (error: unknown, event: EventData) => void
  ) {
    this.subscription = contract.events
      .allEvents(
        {
          fromBlock: 'latest',
        },
        eventCallback
      )
      .on('connection', (id: string) => (this.id = id));
  }
  unsubscribe() {
    this.subscription.unsubscribe();
  }
}
