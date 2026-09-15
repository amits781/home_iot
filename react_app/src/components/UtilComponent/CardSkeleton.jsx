import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/material';

export default function CardSkeleton() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rounded" width={210} height={60} />
      <Skeleton variant="rounded" width={210} height={60} />
    </Stack>
  );
}