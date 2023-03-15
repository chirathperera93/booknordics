import http from "../http-common";
import urlList from "../assets/json/url-list.json";

export default class CommonService {
  public static async GetTenants(accessToken: string, tenantIds: string[]) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const response = await http.post(
        `${urlList.tenant.bulk}`,
        JSON.stringify(tenantIds),
        {
          headers: headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public static async GetFulfillmentSystems(
    accessToken: string,
    ceniumTenantId: any
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.get(
        `${urlList.Products.fulfillmentschemas}`,
        {
          headers: headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}
