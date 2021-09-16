const production: boolean = true;
export const hostAPI = production ? `${window.location.origin}/api` : 'http://localhost:8000/api';