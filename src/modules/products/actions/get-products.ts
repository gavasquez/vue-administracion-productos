import { tesloApi } from '@/api/tesloApi';
import type { Product } from '../interfaces/product.interface';
import { getProductImageAction } from './get-producto-image.action';

export const geProductsActions = async (page = 1, limit = 10) => {
  try {
    const { data } = await tesloApi.get<Product[]>(
      `/products?limit=${limit}&offset=${(page - 1) * limit}`,
    );
    return data.map((product) => {
      return {
        ...product,
        images: product.images.map((imageName) => getProductImageAction(imageName)),
      };
    });
  } catch (error) {
    console.log({ error });
    throw new Error('Error getting products');
  }
};
