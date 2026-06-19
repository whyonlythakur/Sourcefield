'use client';

import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = getSocket();
    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  return socket;
}
