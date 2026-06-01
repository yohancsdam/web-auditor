import type { APIRoute } from 'astro';
import { runAudit } from '../../lib/audit/engine';
import { validateUrl } from '../../lib/utils/url-validator';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const rawUrl = typeof body?.url === 'string' ? body.url : '';

    const validation = validateUrl(rawUrl);
    if (!validation.valid || !validation.url) {
      return new Response(JSON.stringify({ error: validation.error, code: 'INVALID_URL' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await runAudit({ url: validation.url });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Audit error:', error);
    return new Response(
      JSON.stringify({
        error: 'Error interno al analizar la web. Por favor, inténtalo de nuevo.',
        code: 'INTERNAL_ERROR',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
