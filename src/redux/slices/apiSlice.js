import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SUGAR_MONITORING_ENDPOINT, // Corrected base URL
    prepareHeaders: (headers) => {
      // Add the authorization token from localStorage (if it exists)
      const token = localStorage.getItem("token");
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set("Accept", "application/json"); // JSON content type
      return headers;
    },
  }),
  tagTypes: ['Users', 'DailySugar'],
  endpoints: (builder) => ({
    // Login endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: `/login`,
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export the generated hooks
export const {
  useLoginMutation
} = apiSlice;
