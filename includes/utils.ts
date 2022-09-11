export const fetcher = async (url: string, method: string, body?: object) => {
  return await fetch(url, {
    method: method,
    body: JSON.stringify(body),
  }).then((res) => {
    return res.json();
  });
};