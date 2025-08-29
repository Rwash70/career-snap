export const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.careersnap.l5.ca'
    : 'http://localhost:3003';
