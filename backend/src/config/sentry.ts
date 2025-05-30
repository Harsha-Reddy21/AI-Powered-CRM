import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
    environment: process.env.NODE_ENV,
    integrations: [
        nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
});

export default Sentry;

export const captureException = (error: Error) => {
  Sentry.captureException(error);
};

export const captureMessage = (message: string) => {
  Sentry.captureMessage(message);
}; 