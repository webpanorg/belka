import { createServer } from 'http';
import { AddressInfo } from 'net';

/**
 * Return a random, unused port.
 */
export function getRandomPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0);
    server.once('listening', () => {
      const { port } = server.address() as AddressInfo;
      server.close(() => resolve(port));
    });
    server.once('error', reject);
  });
}
