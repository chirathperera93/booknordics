import { Attribute } from "./Attribute";

export interface Product {
  id: string;
  name: string;
  category: CategoryLabel;
  fulfillmentSchemaId: string;
  externalId: string;
  isEnabled: boolean;
  enabledFrom: string | undefined;
  enabledTo: string | undefined;
  attributes: Attribute[];
}

export interface Fulfillment {
  productId: string;
  fulfillmentSchemaId: string;
}

export interface ProductPage {
  nextPage: string;
  products: Product[];
}

export interface CategoryLabel {
  id: string;
  name: string;
  attributeDefinitions: any;
}

export interface ProductRequest {
  id?: string;
  name: string;
  categoryId?: string;
  fulfillment?: {
    productId: string;
    fulfillmentId: string;
  };
  enabledFrom?: string;
  enabledTo?: string;
  attributes: Attribute[];
}

export interface ProductCreateRequest {
  id?: string;
  attributes: Attribute[];
  categoryId?: string;
  enabledFrom?: string;
  enabledTo?: string;
  externalId?: string;
  fulfillmentSchemaId?: string;
  name: string;
}
