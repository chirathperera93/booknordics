import http from "../http-common";
import urlList from "../assets/json/url-list.json";
import {
  IProductCategoryData,
  ProductCategory,
} from "../model/ProductCategory";

class ProductCategoryService {
  public async getProductsCategories(accessToken: string, ceniumTenantId: any) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    return http.get<Array<ProductCategory>>(
      `${urlList.Products.Categories}?tenantid=97AA1E21-488F-45E3-8A53-0979A3972AB8`,
      {
        headers: headers,
      }
    );
  }

  public async GetAllProductCategories(
    accessToken: string,
    ceniumTenantId: any
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.get<Array<ProductCategory>>(
        `${urlList.Products.Categories}?tenantid=97AA1E21-488F-45E3-8A53-0979A3972AB8`,
        {
          headers: headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async createProductCategory(
    accessToken: string,
    ceniumTenantId: any,
    category: IProductCategoryData
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.post(
        `${urlList.Products.Categories}`,
        category,
        {
          headers: headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async updateProductCategory(
    accessToken: string,
    ceniumTenantId: any,
    category: IProductCategoryData
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.put(
        `${urlList.Products.Categories}/${category.id}`,
        category,
        {
          headers: headers,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  public async deleteProductCategory(
    accessToken: string,
    ceniumTenantId: any,
    categoryId: any
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.delete(
        `${urlList.Products.Categories}/${categoryId}`,
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

export default new ProductCategoryService();
