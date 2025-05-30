import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Accounts_TransactionsTable from './Accounts_TransactionsTable';
import { Account } from '@/components/types';

export interface AccordionProps {
  account: Account;
}

export default function TransactionsAccordion({ account } : AccordionProps) {
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">All Transactions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <Accounts_TransactionsTable account={account}/>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}