const baseUrl = process.env.LOAD_TEST_BASE_URL ?? "http://localhost:3000";
const startedAt = performance.now();
const requests = Array.from({ length: 100 }, async (_, index) => {
  const [page, ready] = await Promise.all([
    fetch(`${baseUrl}/`, { headers: { "x-ruta-load-user": String(index + 1) } }),
    fetch(`${baseUrl}/api/ready`, { headers: { "x-ruta-load-user": String(index + 1) } }),
  ]);
  if (!page.ok || !ready.ok) throw new Error(`Iteration ${index + 1} failed: page=${page.status}, ready=${ready.status}`);
  await Promise.all([page.arrayBuffer(), ready.arrayBuffer()]);
});

await Promise.all(requests);
const durationMs = Math.round(performance.now() - startedAt);
if (durationMs > 15_000) throw new Error(`100-user burst exceeded 15 seconds: ${durationMs}ms`);
console.log(`100-user burst passed: 200 responses in ${durationMs}ms.`);

