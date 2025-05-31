import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TransactionsTable from './AccountsTransactionsTable';
import { Account } from '@/components/types';

export interface AccordionProps {
  account: Account;
}

export default function AccountsAccordion({ account } : AccordionProps) {
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
            <TransactionsTable account={account}/>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}