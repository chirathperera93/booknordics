import { DateTime } from "luxon";

export class CommerceException {
  public status: number;
  public statusText?: string;
  public constructor(status: number, statusText?: string) {
    this.status = status;
    this.statusText = statusText;
  }
}

export class EditProductFormState {
  name?: string;
  enabledFrom?: DateTime | null;
  enabledTo?: DateTime | null;
  fulfillmentSystemId?: string;
  fulfillmentProductId?: string;
}

export interface FulfillmentSystem {
  id: string;
  fulfillmentSchemaName: string;
}
