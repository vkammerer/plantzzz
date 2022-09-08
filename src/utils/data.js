export const getData = async (test) => {
  return await fetch(`/${test}.json`).then((res) => res.json());
};

export const getConfig = async () => {
  return await fetch("/tests.json").then((res) => res.json());
};
