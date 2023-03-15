import http from "../http-common";
import urlList from "../assets/json/url-list.json";
import {
  Product,
  ProductCreateRequest,
  ProductPage,
  ProductRequest,
} from "../model/Product";

class ProductService {
  public async getAllProducts(accessToken: string, ceniumTenantId: any) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.get<any>(
        `${urlList.AllProducts}?tenantid=97AA1E21-488F-45E3-8A53-0979A3972AB8`,
        {
          headers: headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async getProductsGetItemCount(
    accessToken: string,
    ceniumTenantId: any
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.get<any>(`${urlList.Products.Statistics}`, {
        headers: headers,
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async getAllProductsByCategoryId(
    accessToken: string,
    ceniumTenantId: any,
    categoryId: string | null | undefined,
    includeDisabled: boolean
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.get<ProductPage>(
        `${urlList.AllProducts}:Paged?includeDisabled=${includeDisabled}&category=${categoryId}&maxresults=100`,
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async SetProduct(
    accessToken: string,
    ceniumTenantId: any,
    product: ProductCreateRequest
  ): Promise<Product> {
    return product.id
      ? this.UpdateProduct(accessToken, ceniumTenantId, product)
      : this.CreateProduct(accessToken, ceniumTenantId, product);
  }

  private async CreateProduct(
    accessToken: string,
    ceniumTenantId: any,
    product: ProductRequest
  ): Promise<any> {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.post(
        `${urlList.AllProducts}`,
        JSON.stringify(product),
        {
          headers: headers,
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  private async UpdateProduct(
    accessToken: string,
    ceniumTenantId: any,
    product: ProductRequest
  ): Promise<any> {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.put(
        `${urlList.AllProducts}/${product.id}`,
        JSON.stringify(product),
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

export default new ProductService();
