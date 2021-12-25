const production: boolean = process.env.NODE_ENV === "production";
export const hostAPI = production ? `${window.location.origin}/api` : 'http://localhost:8000/api';