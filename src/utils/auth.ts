export const setToken = (token: string) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const removeToken = () => localStorage.removeItem('token');

export const setRefreshToken = (token: string) => localStorage.setItem('refreshToken', token);
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const removeRefreshToken = () => localStorage.removeItem('refreshToken');

export const isLoggedIn = (): boolean => {
  const token = getToken();
  return !!token;
};

export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return;
  const res = await fetch('http://localhost:8000/api/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  const data = await res.json();
  setToken(data.access);
};
