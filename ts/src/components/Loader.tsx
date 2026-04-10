// Minimal loader -- simple centered text, no skeleton

import React, { useEffect } from 'react';
import { Box, Text } from 'ink';

interface LoaderProps {
  onDone: () => void;
}

export default function Loader({ onDone }: LoaderProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box height={8} alignItems="center" justifyContent="center">
        <Text color="#444">loading...</Text>
      </Box>
    </Box>
  );
}
