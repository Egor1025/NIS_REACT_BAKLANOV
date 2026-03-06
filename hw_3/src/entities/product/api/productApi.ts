import { baseApi } from '@/shared/api/baseApi'
import type { Product, ProductsQueryParams, ProductsResponse } from '@/entities/product/model/types'

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsQueryParams>({
      query: ({ limit, skip, q }) => {
        const normalizedQuery = q?.trim()

        if (normalizedQuery) {
          return {
            url: '/products/search',
            params: {
              q: normalizedQuery,
              limit,
              skip,
            },
          }
        }

        return {
          url: '/products',
          params: {
            limit,
            skip,
          },
        }
      },
      providesTags: (result) => {
        if (!result) {
          return [{ type: 'Product', id: 'LIST' }]
        }

        return [
          { type: 'Product', id: 'LIST' },
          ...result.products.map((product) => ({ type: 'Product' as const, id: product.id })),
        ]
      },
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
      providesTags: (result, _, id) => [{ type: 'Product', id: result?.id ?? id }],
    }),
  }),
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productApi
