function createApiError(res, data, url, method = 'GET') {
  return {
    status: res.status,
    message: data?.error?.message || res.statusText || 'Request failed',
    details: data?.error?.details || null,
    url,
    method,
  };
}

function createPostInit(values){
  return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      };
}
export async function apiRequest(url, values) {

  const response = values !== undefined ? await fetch(url, createPostInit(values)) : await fetch(url);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw createApiError(response, data, url);
  }

  return data;
}

