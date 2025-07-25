export const env = {
  appwrite: {
    endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
    apikey: String(process.env.APPWRITE_API_KEY),
    projectid: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
  },
  domain: String(process.env.NEXT_PUBLIC_DOMAIN_NAME),
};