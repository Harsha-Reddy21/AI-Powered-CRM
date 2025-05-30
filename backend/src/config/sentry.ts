// Sentry configuration disabled for now due to TypeScript compatibility issues
// TODO: Fix Sentry configuration later

export const captureException = (error: Error) => {
  console.error('Error:', error);
};

export const captureMessage = (message: string) => {
  console.log('Message:', message);
};

export default {
  captureException,
  captureMessage
}; 