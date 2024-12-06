import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_RESEARCH_SYSTEM_ENDPOINT, // Corrected base URL
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
  tagTypes: ['Companies', 'Roles'],
  endpoints: (builder) => ({
    // Login endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: `/login`,
        method: 'POST',
        body: credentials,
      }),
    }),
   // Companies endpoints
  getCompanies: builder.query({
  query: ({ search, page, per_page, status }) => `/companies?search=${search}&page=${page}&per_page=${per_page}&status=${status}`,
  method: 'GET',
  providesTags: ['Companies'],
  }),
  addCompanies: builder.mutation({
    query: (companies) => ({
      url: `/companies`,
      method: 'POST',
      body: companies,
    }),
    invalidatesTags: ['Companies'],
  }),
  getRole: builder.query({
    query: ({ search, page, per_page, status }) => `/role?search=${search}&page=${page}&per_page=${per_page}&status=${status}`,
    method: 'GET',
    providesTags: ['Companies'],
    }),
    addRole: builder.mutation({
      query: (role) => ({
        url: `/role`,
        method: 'POST',
        body: role,
      }),
      invalidatesTags: ['Roles'],
    }),
    updateRole: builder.mutation({
      query: (role) => ({
        url: `/role/${role.id}`,
        method: 'PATCH',
        body: role,
      }),
      invalidatesTags: ['Roles'],
    }),
    archivedRole: builder.mutation({
      query: ({ id }) => ({
        url: `/Role-archived/${id}`,
        method: 'PUT',
        body: id,
      }),
      invalidatesTags: ['Roles'],
    }),
  }),
});

// Export the generated hooks
export const {
  useLoginMutation,
  useGetCompaniesQuery,
  useGetRoleQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useArchivedRoleMutation,
} = apiSlice;
