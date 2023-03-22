import { useRouter } from 'next/router';
import React from 'react';

import Contract from '@/components/contract/Contract';
import NoContractFound from '@/components/contract/NoContractFound';

export default function ContractPage() {
  const router = useRouter();
  const { address } = router.query;
  console.log(router);
  if (!address || Array.isArray(address)) {
    return <NoContractFound />;
  }
  return <Contract address={address as string} />;
}
