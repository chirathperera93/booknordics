import "../style.css";
import { Box, Grid, Tooltip } from "@mui/material";
import * as React from "react";
import SummaryWidget from "../components/SummaryWidget";
import CategoryIcon from "@mui/icons-material/Category";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AttributionIcon from "@mui/icons-material/Attribution";
import OdersWidget from "../components/OdersWidget";
import log from "loglevel";
import ProductService from "../services/product.service";
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useOidcAccessToken } from "@axa-fr/react-oidc-context";

interface IDashboardProps {}

const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {
  const [productCategoryCount, setProductCategoryCount] = React.useState(0);
  const [productsCount, setProductsCount] = React.useState(0);
  const [attributesCount, setAttributesCount] = React.useState(0);
  const { accessToken } = useOidcAccessToken();

  React.useEffect(() => {
    setTimeout(() => {
      getAllProductCount();

      async function getAllProductCount() {
        try {
          if (accessToken && localStorage.getItem("Cenium-Tenant-Id")) {
            const allProducts = await ProductService.getProductsGetItemCount(
              accessToken,
              localStorage.getItem("Cenium-Tenant-Id")
            );

            setAttributesCount(allProducts.attributeCount);
            setProductCategoryCount(allProducts.categoryCount);
            setProductsCount(allProducts.productCount);
          }
        } catch (e) {
          log.error("Failed to get Item Count", e);
        }
      }
    }, 10);
  }, []);

  const columnData: GridColDef[] = [
    { field: "shortId", headerName: "Id", flex: 1 },
    { field: "customerName", headerName: "Name", flex: 1 },
    { field: "customerphoneNumber", headerName: "Pnone no", flex: 1 },
    { field: "customerEmail", headerName: "Email", flex: 1 },
    {
      field: "edit",
      headerName: "",
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Tooltip title="Edit order" placement="top">
            <EditIcon
              color="success"
              sx={{ fontSize: "16px", cursor: "pointer" }}
            />
          </Tooltip>
        );
      },
      disableColumnMenu: true,
      flex: 1,
      align: "center",
    },
    {
      field: "delete",
      headerName: "",
      sortable: false,
      renderCell: (params: any) => {
        return (
          <Tooltip title="Delete order">
            <DeleteIcon
              sx={{ fontSize: "16px", color: "red", cursor: "pointer" }}
            />
          </Tooltip>
        );
      },
      disableColumnMenu: true,
      flex: 1,
      align: "center",
    },
  ];

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} className="drawerMargin">
        <Grid container spacing={3} className="pb-3">
          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Product Categories"
              total={productCategoryCount.toLocaleString()}
              icon={<CategoryIcon />}
              iconToolTip="Add Product Category"
              iconBackground={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(16, 57, 150, 0) 0%, rgba(16, 57, 150, 0.24) 100%)",
                borderRadius: "20%",
                padding: "20px",
                color: "#103996",
              }}
              sx={{
                backgroundColor: "#D1E9FC",
                color: "#04297A",
                textAlign: "center",
                padding: "20px",
                position: "relative",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Products"
              total={productsCount.toLocaleString()}
              icon={<ProductionQuantityLimitsIcon />}
              iconToolTip="Add Products"
              iconBackground={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(12, 83, 183, 0) 0%, rgba(12, 83, 183, 0.24) 100%)",
                borderRadius: "20%",
                padding: "20px",
                color: "#04297A",
              }}
              sx={{
                backgroundColor: "#D0F2FF",
                color: "#04297A",
                textAlign: "center",
                padding: "20px",
                position: "relative",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SummaryWidget
              title="Attributes"
              iconToolTip="Add Attribute"
              total={attributesCount.toLocaleString()}
              icon={<AttributionIcon />}
              iconBackground={{
                backgroundImage:
                  "linear-gradient(135deg, rgba(183, 129, 3, 0) 0%, rgba(183, 129, 3, 0.24) 100%)",
                borderRadius: "20%",
                padding: "20px",
                color: "#B78103",
              }}
              sx={{
                backgroundColor: "#FFF7CD",
                color: "#7A4F01",
                textAlign: "center",
                padding: "20px",
                position: "relative",
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className="pt-3">
          <Grid item xs={9} sm={9} md={9}>
            <OdersWidget
              title="Active Orders"
              orderCount="589"
              columnData={columnData}
              dataList={null}
            />
          </Grid> 
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
