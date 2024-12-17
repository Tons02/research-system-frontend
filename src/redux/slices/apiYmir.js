import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiYmir = createApi({
  reducerPath: 'ymir',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_YMIR_ENDPOINT, // Corrected base URL
    prepareHeaders: (headers) => {
      // Add the authorization token from localStorage (if it exists)
      const token = import.meta.env.VITE_YMIR_TOKEN;
      if (token) {
        headers.set('Token', `Bearer ${token}`);
      }
      headers.set("Accept", "application/json"); // JSON content type
      return headers;
    },
  }),
  tagTypes: ['Companies', 'BusinessUnits', 'Departments', 'Units'],
  endpoints: (builder) => ({
  // Companies endpoints
  getYmirCompanies: builder.query({
  query: () => `/companies?pagination=none&status=active`,
  method: 'GET',
  providesTags: ['Companies'],
  }),
  getYmirBusinessUnits: builder.query({
    query: () => `/business-units?pagination=none&status=active`,
    method: 'GET',
    providesTags: ['BusinessUnits'],
  }),
  getYmirDepartments: builder.query({
    query: () => `/departments?pagination=none&status=active`,
    method: 'GET',
    providesTags: ['Departments'],
  }),
  getYmirUnits: builder.query({
    query: () => `/units_department?pagination=none&status=active`,
    method: 'GET',
    providesTags: ['Units'],
  }),
  }),
});

// Export the generated hooks
export const {
  useLazyGetYmirCompaniesQuery,
  useLazyGetYmirBusinessUnitsQuery,
  useLazyGetYmirDepartmentsQuery,
  useLazyGetYmirUnitsQuery 
} = apiYmir;
