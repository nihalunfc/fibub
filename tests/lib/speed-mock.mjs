// Stand-in for Cloudflare's speed test server in the browser checks (#T950-#T952): no real network is used.
export async function mockSpeed(page) {
  await page.context().route('https://speed.cloudflare.com/**', async (route) => {
    const u = new URL(route.request().url());
    const cors = { 'access-control-allow-origin': '*', 'timing-allow-origin': '*' };
    await new Promise((r) => setTimeout(r, 15));
    if (u.pathname === '/meta') return route.fulfill({ headers: cors, json: { asOrganization: 'Test ISP', city: 'Toronto', colo: 'YYZ' } });
    if (u.pathname === '/__up') return route.fulfill({ headers: cors, body: '' });
    const n = Math.min(+(u.searchParams.get('bytes') || 0), 5e6);
    return route.fulfill({ headers: { ...cors, 'content-type': 'application/octet-stream' }, body: Buffer.alloc(n) });
  });
}
