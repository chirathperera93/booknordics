import http from "../http-common";
import urlList from "../assets/json/url-list.json";
import { AttributeDefinitionRequest } from "../model/Attribute";

class AttributeService {
  public async getAllAttributes(accessToken: string, ceniumTenantId: any) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.get<any>(
        `${urlList.AllAttributes}?tenantid=97AA1E21-488F-45E3-8A53-0979A3972AB8`,
        {
          headers: headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async createAttributeDefinition(
    attribute: AttributeDefinitionRequest,
    accessToken: string,
    ceniumTenantId: any
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.post(`${urlList.AllAttributes}`, attribute, {
        headers: headers,
      });

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async updateAttributeDefinition(
    accessToken: string,
    ceniumTenantId: any,
    attribute: AttributeDefinitionRequest
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.put(
        `${urlList.AllAttributes}/${attribute.id}`,
        attribute,
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

export default new AttributeService();
