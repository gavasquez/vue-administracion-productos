import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interface';
import { getProductImageAction } from './get-producto-image.action';

export const getProductById = async (productId: string): Promise<Product> => {
  //Todo: Pensar la creacion de un nuevo product
  if (productId === 'create') {
    return {
      id: '',
      title: '',
      slug: '',
      description: '',
      price: 0,
      stock: 0,
      images: [],
      tags: [],
      gender: '' as any,
      user: {} as any,
      sizes: [],
    };
  }
  try {
    const { data } = await tesloApi.get<Product>(`/products/${productId}`);

    return {
      ...data,
      images: data.images.map(getProductImageAction),
    };
  } catch (error) {
    throw new Error(`Error getting product by id ${productId}`);
  }
};
