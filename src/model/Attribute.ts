export interface Attribute {
  name: string;
  value?: string;
}
export interface AttributeNew {
  id: string;
  name: string;
  value?: string;
}

export interface AttributeDefinitionRequest {
  id?: string;
  name: string;
  description: string | null;
}
export interface AttributeDefinition {
  id: string;
  name: string;
  description: string | null;
}
