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
  tagTypes: ['Companies', 'Roles', 'BusinessUnits','Departments','Units', 'Location'],
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
  syncCompanies: builder.mutation({
    query: (companies) => ({
      url: `/companies`,
      method: 'POST',
      body: companies,
    }),
    invalidatesTags: ['Companies'],
  }),
  // business units endpoints
  getBusinessUnits: builder.query({
    query: ({ search, page, per_page, status }) => `/business-units?search=${search}&page=${page}&per_page=${per_page}&status=${status}`,
    method: 'GET',
    providesTags: ['BusinessUnits'],
    }),
    syncBusinessUnits: builder.mutation({
      query: (businessUnits) => ({
        url: `/business-units`,
        method: 'POST',
        body: businessUnits,
      }),
      invalidatesTags: ['BusinessUnits'],
    }),
    // departments endpoints
  getDepartments: builder.query({
    query: ({ search, page, per_page, status }) => `/departments?search=${search}&page=${page}&per_page=${per_page}&status=${status}`,
    method: 'GET',
    providesTags: ['Departments'],
    }),
    syncDepartments: builder.mutation({
      query: (departments) => ({
        url: `/departments`,
        method: 'POST',
        body: departments,
      }),
      invalidatesTags: ['Departments'],
    }),
    // units endpoints
  getUnits: builder.query({
    query: ({ search, page, per_page, status }) => `/units?search=${search}&page=${page}&per_page=${per_page}&status=${status}`,
    method: 'GET',
    providesTags: ['Units'],
    }),
    syncUnits: builder.mutation({
      query: (units) => ({
        url: `/units`,
        method: 'POST',
        body: units,
      }),
      invalidatesTags: ['Units'],
    }),
    // sub units endpoints
  getSubUnits: builder.query({
    query: ({ search, page, per_page, status }) => `/sub-units?search=${search}&page=${page}&per_page=${per_page}&status=${status}`,
    method: 'GET',
    providesTags: ['SubUnits'],
    }),
  syncSubUnits: builder.mutation({
      query: (subUnits) => ({
        url: `/sub-units`,
        method: 'POST',
        body: subUnits,
      }),
      invalidatesTags: ['SubUnits'],
    }),
    // locations endpoints
  getLocations: builder.query({
    query: ({ search, page, per_page, status }) => `/locations?search=${search}&page=${page}&per_page=${per_page}&status=${status}`,
    method: 'GET',
    providesTags: ['Locations'],
    }),
  syncLocations: builder.mutation({
      query: (locations) => ({
        url: `/locations`,
        method: 'POST',
        body: locations,
      }),
      invalidatesTags: ['Locations'],
    }),
  getRole: builder.query({
    query: ({ search, page, per_page, status }) => `/role?search=${search}&page=${page}&per_page=${per_page}&status=${status}`,
    method: 'GET',
    providesTags: ['Roles'],
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
        url: `/role-archived/${id}`,
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
  useSyncCompaniesMutation,
  useGetBusinessUnitsQuery,
  useSyncBusinessUnitsMutation,
  useGetDepartmentsQuery,
  useSyncDepartmentsMutation,
  useGetUnitsQuery,
  useSyncUnitsMutation,
  useGetSubUnitsQuery,
  useSyncSubUnitsMutation,
  useGetLocationsQuery,
  useSyncLocationsMutation,
  useGetRoleQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useArchivedRoleMutation,
} = apiSlice;
