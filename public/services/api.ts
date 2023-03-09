let httpClient;
export const setHttpClient = (client) => {
  httpClient = client;
};
export const getHttpClient = () => {
  return httpClient;
};

export async function analyze(params) {
  return await httpClient.post('/api/analyze_api_ui/analyze', {body: JSON.stringify(params)});
}

export async function getFailedAlerts() {
  return await httpClient.post('/api/baalert/failed');
}

export async function getSuccessfullAlerts() {
  return await httpClient.post('/api/baalert/successfull');
}

export async function getTotalAlerts() {
  return await httpClient.post('/api/baalert/total');
}