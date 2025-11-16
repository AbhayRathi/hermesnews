/**
 * @file This is a mock service to simulate the Locus wallet SDK.
 * In a real-world application, this would be replaced with the actual
 * Locus library for wallet interactions.
 */

/**
 * Simulates connecting to a Locus wallet.
 * @returns A promise that resolves with a mock wallet address.
 */
export const connectWallet = (): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Generate a random-like hex address for demonstration
      const mockAddress = `0x${[...Array(40)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('')}`;
      console.log(`Locus Wallet Connected: ${mockAddress}`);
      resolve(mockAddress);
    }, 500); // Simulate connection delay
  });
};

/**
 * Simulates disconnecting from a Locus wallet.
 * @returns A promise that resolves when disconnection is complete.
 */
export const disconnectWallet = (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Locus Wallet Disconnected");
      resolve();
    }, 300);
  });
};

/**
 * Simulates paying a Lightning Network invoice via a WebLN provider.
 * @param invoice - The mock LN invoice string.
 * @returns A promise that resolves with a mock preimage (proof of payment).
 */
export const payInvoice = (invoice: string): Promise<string> => {
    console.log(`Simulating payment for invoice: ${invoice}`);
    return new Promise(resolve => {
        setTimeout(() => {
            // Generate a random 64-character hex string to act as the preimage
            const mockPreimage = [...Array(64)]
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join('');
            console.log(`Payment successful. Preimage: ${mockPreimage}`);
            resolve(mockPreimage);
        }, 1500); // Simulate payment processing delay
    });
};