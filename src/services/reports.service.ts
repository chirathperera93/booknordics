import http from "../http-common";
import urlList from "../assets/json/url-list.json";

class ReportsService {
  public async getReports(
    accessToken: string,
    ceniumTenantId: any,
    startDate: string,
    endDate: string
  ) {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Cenium-Tenant-Id": `${ceniumTenantId}`,
    };
    try {
      const response = await http.get<any>(
        `${urlList.Reports}?dateFrom=${startDate}&dateTo=${endDate}`,
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

export default new ReportsService();
