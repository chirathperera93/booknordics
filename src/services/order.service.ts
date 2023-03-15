import http from "../http-order";
import urlList from "../assets/json/url-list.json";
import { OrderRequest } from "../model/Order";

class OrderService {
  public async GetOrders(
    accessToken: string,
    ceniumTenantId: any,
    orderRequest: OrderRequest
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.post(`${urlList.Order}`, orderRequest, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      // console.error(error);
    }
  }
}

export default new OrderService();
