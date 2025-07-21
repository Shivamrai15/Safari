import { Album, Song as s } from '@prisma/client';
import { useEffect, useRef, useCallback } from 'react';

type Song = s & {
  album: Album
}

interface Props {
  currentId: string;
  visited: string[];
  aiShuffle: boolean;
  queue: Song[];
  enQueue: (songs: Song[]) => void;
  setVisited: (visited: string[]) => void;
}

export const useAiShuffleWorker = ({
  currentId,
  visited,
  aiShuffle,
  queue,
  enQueue,
  setVisited
}: Props) => {
  const workerRef = useRef<Worker | null>(null);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const { success, data, error }: { success: boolean; data: Song[]; error?: string } = event.data;

      if (success) {
        enQueue(data);
        setVisited([currentId, ...data.map(song => song.id)]);
      } else {
        console.error('Worker error:', error);
      }
    },
    [currentId, enQueue, setVisited]
  );

  useEffect(() => {
    if (aiShuffle) {
      const workerUrl = new URL('/workers/aiWorker.js', window.location.origin);
      workerRef.current = new Worker(workerUrl.href);
      workerRef.current.onmessage = handleMessage;
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [aiShuffle, handleMessage]);

  useEffect(() => {
    if (queue.length <= 5 && aiShuffle && currentId && workerRef.current) {
      workerRef.current.postMessage({ currentId, visited: Array.from(visited) });
    }
  }, [queue.length, currentId, visited, aiShuffle]);
};