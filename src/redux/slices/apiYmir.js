import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiYmir = createApi({
  reducerPath: 'ymir',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_YMIR_ENDPOINT, // Corrected base URL
    prepareHeaders: (headers) => {
      // Add the authorization token from localStorage (if it exists)
      const token = import.meta.env.VITE_YMIR_TOKEN;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set("Accept", "application/json"); // JSON content type
      return headers;
    },
  }),
  tagTypes: ['Companies'],
  endpoints: (builder) => ({
  // Companies endpoints
  getYmirCompanies: builder.query({
  query: () => `/companies?pagination=none&status=active`,
  method: 'GET',
  providesTags: ['Companies'],
  }),
  }),
});

// Export the generated hooks
export const {
  useLazyGetYmirCompaniesQuery 
} = apiYmir;
