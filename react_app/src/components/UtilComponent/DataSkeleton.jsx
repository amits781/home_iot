import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/material';

export default function DataSkeleton() {
  return (
    <Stack spacing={1}>
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
    </Stack>
  );
}