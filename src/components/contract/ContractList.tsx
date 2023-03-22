import {
  FormControlLabel,
  InputLabel,
  Pagination,
  Radio,
  RadioGroup,
  SelectChangeEvent,
} from '@mui/material';
import React, { useMemo, useState } from 'react';

import { EJobOfferType } from '@/types';

import ContractElement from './ContractElement';
import NoContract from './NoContract';

interface IContractListProps {
  contracts: Array<{
    offerAddress: string;
    offerType: keyof typeof EJobOfferType;
  }>;
}

export default function ContractList({ contracts }: IContractListProps) {
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const handlePage = (event: React.ChangeEvent<unknown>, page: number) => {
    setPage(page);
  };

  const handlePerPage = (e: SelectChangeEvent<number>) => {
    setPerPage(Number(e.target.value));
  };

  const contractRender = useMemo(
    () =>
      [...contracts]
        .reverse()
        .slice((page - 1) * perPage, page * perPage)
        .map(contract => (
          <ContractElement
            address={contract.offerAddress}
            offerType={contract.offerType}
            key={contract.offerAddress}
          />
        )),
    [contracts, page, perPage]
  );

  const count = useMemo(
    () => Math.ceil(contracts.length / perPage),
    [contracts, perPage]
  );
  return (
    <div>
      {contracts.length ? (
        <>
          <InputLabel id="perPageLabel">Contracts per page</InputLabel>
          <RadioGroup
            aria-labelledby="perPageLabel"
            value={perPage}
            onChange={handlePerPage}
            name="per-page-group"
            sx={{ display: 'flex', flexDirection: 'row' }}
          >
            <FormControlLabel value={5} control={<Radio />} label="5" />
            <FormControlLabel value={10} control={<Radio />} label="10" />
            <FormControlLabel value={15} control={<Radio />} label="15" />
          </RadioGroup>
          {contractRender}
          {count > 1 ? (
            <Pagination
              page={page}
              count={count}
              showFirstButton
              showLastButton
              onChange={handlePage}
              sx={{ mt: '30px' }}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <NoContract />
      )}
    </div>
  );
}
