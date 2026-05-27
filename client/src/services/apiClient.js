export const apiFetch = (input, init = {}) => {
  const headers = new Headers(init.headers || {});

  const hasBody = init.body !== undefined && init.body !== null;
  if (hasBody && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Rely on httpOnly cookie for auth; include credentials so cookies are sent.
  return fetch(input, {
    ...init,
    headers,
    credentials: 'include',
  });
};