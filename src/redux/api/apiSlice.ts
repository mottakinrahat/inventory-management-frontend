import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://inventory-backend-d.vercel.app/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Category', 'Product', 'Order', 'ActivityLog', 'RestockQueue'],
  endpoints: (builder) => ({
    // ---- AUTH ----
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/user',
        method: 'POST',
        body: userData,
      }),
    }),
    getUserMe: builder.query({
      query: () => '/user/me',
      providesTags: ['User'],
    }),

    // ---- CATEGORIES ----
    getCategories: builder.query({
      query: () => '/category',
      providesTags: ['Category'],
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: '/category',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    removeCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // ---- PRODUCTS ----
    getProducts: builder.query({
      query: () => '/product',
      providesTags: ['Product'],
    }),
    getMyProducts: builder.query({
      query: () => '/product/my-products',
      providesTags: ['Product'],
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: '/product',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product', 'RestockQueue', 'Category'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/product/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Product', 'RestockQueue'],
    }),
    removeProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'RestockQueue'],
    }),

    // ---- ORDERS ----
    getOrders: builder.query({
      query: () => '/order',
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/order',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order', 'Product', 'RestockQueue'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/order/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}`,
        method: 'PATCH',
        body: { status: 'Cancelled' },
      }),
      invalidatesTags: ['Order', 'Product', 'RestockQueue'],
    }),

    // ---- RESTOCK QUEUE ----
    getRestockQueue: builder.query({
      query: () => '/restock-queue',
      providesTags: ['RestockQueue'],
    }),
    removeFromRestockQueue: builder.mutation({
      query: (id) => ({
        url: `/restock-queue/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RestockQueue'],
    }),

    // ---- ACTIVITY LOG ----
    getActivityLogs: builder.query({
      query: () => '/activity-log',
      providesTags: ['ActivityLog'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetUserMeQuery,
  useLazyGetUserMeQuery,

  useGetCategoriesQuery,
  useAddCategoryMutation,
  useRemoveCategoryMutation,

  useGetProductsQuery,
  useGetMyProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useRemoveProductMutation,

  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,

  useGetRestockQueueQuery,
  useRemoveFromRestockQueueMutation,

  useGetActivityLogsQuery,
} = apiSlice;