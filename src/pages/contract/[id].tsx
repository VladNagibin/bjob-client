import { GetServerSideProps } from 'next';
import React from 'react';

import Contract from '@/components/contract/Contract';

export default function contract({ id }: { id: string }) {
  return <Contract address={id} />;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      id: params?.id,
    },
  };
};
