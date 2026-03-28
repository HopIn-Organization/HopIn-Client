export async function mockDelay(duration = 180): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
