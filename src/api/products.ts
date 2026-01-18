import { Product } from "@/types";
import { apiFetch } from "./client";

export type ProductCreateDto = {
  name: string;
  manufacturer: string;
  serialNumber?: string;
  countryOrigin: string;
  description?: string;
};

export function createProduct(data: ProductCreateDto) {
  return apiFetch("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getProducts(): Promise<Product[]> {
  return apiFetch("/products", {
    method: "GET",
  });
}

export function updateProduct(id: number, data: ProductCreateDto) {
  return apiFetch(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: number) {
  return apiFetch(`/products/${id}`, {
    method: "DELETE",
  });
}
