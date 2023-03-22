import { useRouter } from 'next/router';
import React from 'react';

import Contract from '@/components/contract/Contract';
import NoContractFound from '@/components/contract/NoContractFound';

export default function ContractPage() {
  const router = useRouter();
  const { id } = router.query;
  if (!id || Array.isArray(id)) {
    return <NoContractFound />;
  }
  return <Contract address={id as string} />;
}
