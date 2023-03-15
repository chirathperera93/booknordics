import { AttributeDefinition } from "./Attribute";

export interface ProductCategory {
  id: string;
  name: string;
  ruleSetId: string | null;
  attributeDefinitions: AttributeDefinition[];
}

export interface ProductCategoryRequest {
  id?: string;
  name: string;
  ruleSetId: string | null;
  attributeDefinitions: AttributeDefinition[];
}

export interface IProductCategoryData {
  id: string;
  name: string;
  attributeDefinitionIds: [];
}
