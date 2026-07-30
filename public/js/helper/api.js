export const apiRequest = async (url) => {
  const response = await fetch(url);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw createApiError(response, data, url);
  return data;
};

export async function fetchRequest(url, values) {
  const init = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values }),
  };

  const response = await fetch(url, init);
  const data = await response.json().catch(() => null);
  if (!response.ok){
    throw createApiError(response, data, url);
  }
  return data;
}

function createApiError(res, data, url, method = 'GET') {
  return {
    status: res.status,
    message: data?.error?.message || res.statusText || 'Request failed',
    details: data?.error?.details || null,
    url,
    method,
  };
}
