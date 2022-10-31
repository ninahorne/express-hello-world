const fetchHistoricSpotsData = async () => {
  const data = await axios.get('/api/historic-spots').then(res => res.data);
  console.log({ data });
};

fetchHistoricSpotsData();
