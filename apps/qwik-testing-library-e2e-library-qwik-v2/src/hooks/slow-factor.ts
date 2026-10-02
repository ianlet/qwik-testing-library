// Delays this module's evaluation so that segments importing it load slowly.
await new Promise((resolve) => setTimeout(resolve, 50));

export const factor = 2;
