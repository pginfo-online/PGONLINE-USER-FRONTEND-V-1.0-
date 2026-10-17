import { NextRequest, NextResponse } from 'next/server';

const getBackendBase = () => {
  return (
    process.env.LIVE_BACKEND_URL ||
    process.env.BACKEND_URL ||
    'https://pginfo.business/api/v1'
  ).replace(/\/+$/, '');
};

async function handleProxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  let cleanPath = (path || []).join('/');

  // Normalize path if /api/v1 or /v1 prefix is passed
  if (cleanPath.startsWith('api/v1/')) {
    cleanPath = cleanPath.slice(7);
  } else if (cleanPath === 'api/v1') {
    cleanPath = '';
  } else if (cleanPath.startsWith('v1/')) {
    cleanPath = cleanPath.slice(3);
  } else if (cleanPath === 'v1') {
    cleanPath = '';
  }

  const backendBase = getBackendBase();
  const searchParams = request.nextUrl.search;
  const targetUrl = cleanPath
    ? `${backendBase}/${cleanPath.replace(/^\/+/, '')}${searchParams}`
    : `${backendBase}${searchParams}`;

  // Forward necessary headers while stripping origin/host to prevent CORS rejection from remote server
  const forwardHeaders = new Headers();
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!['host', 'origin', 'referer', 'connection'].includes(lower)) {
      forwardHeaders.set(key, value);
    }
  });

  const body = ['GET', 'HEAD'].includes(request.method)
    ? undefined
    : await request.blob();

  try {
    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body,
      redirect: 'follow',
      cache: 'no-store',
    });

    const responseHeaders = new Headers();
    backendRes.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!['content-encoding', 'transfer-encoding'].includes(lower)) {
        responseHeaders.set(key, value);
      }
    });

    const data = await backendRes.arrayBuffer();
    return new NextResponse(data, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Proxy error connecting to live backend',
        error: error.message,
      },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
export const HEAD = handleProxy;
