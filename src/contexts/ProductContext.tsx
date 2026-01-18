import {
  createProduct,
  deleteProduct,
  getProducts,
  ProductCreateDto,
  updateProduct,
} from "@/api/products";
import { Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";

type ProductContextType = {
  products: Product[];
  addProduct: (product: ProductCreateDto) => void;
  updateProduct: (id: number, product: ProductCreateDto) => void;
  deleteProduct: (id: number) => void;
};

export const ProductContext = createContext<ProductContextType | undefined>(
  undefined,
);

export function ProductProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    onError: (err) => {
      console.log("POST ERROR", err);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductCreateDto }) =>
      updateProduct(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    onError: (err) => {
      console.log("UPDATE ERROR", err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    onError: (err) => {
      console.log("DELETE ERROR", err);
    },
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct: (data) => createMutation.mutate(data),
        updateProduct: (id, data) => updateMutation.mutate({ id, data }),
        deleteProduct: (id) => deleteMutation.mutate({ id }),
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
