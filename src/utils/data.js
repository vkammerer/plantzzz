export const getData = async () => {
  return await fetch('/data.json').then(res => res.json());
}