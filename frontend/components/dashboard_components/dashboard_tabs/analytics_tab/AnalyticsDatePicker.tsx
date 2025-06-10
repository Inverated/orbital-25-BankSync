import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

interface DatePickerProps {
    label: string;
    value: Dayjs | null;
    onChange: (value: Dayjs | null) => void;
}

export default function AnalyticsDatePicker({ label, value, onChange }: DatePickerProps) {
  const maxDate = dayjs().subtract(1, "month").endOf("month");

  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }

    return () => {};
  }, [cleared])
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker 
          label={label} 
          views={["month", "year"]}
          maxDate={maxDate}
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              helperText: "MMMM YYYY",
            },
            field: {
              clearable: true,
              onClear: () => setCleared(true)
            }
          }} 
        />
      </DemoContainer>
    </LocalizationProvider>
  )
}