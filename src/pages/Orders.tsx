import { useOidcAccessToken } from "@axa-fr/react-oidc-context";
import { alpha, Box, Card, Grid, styled, Typography } from "@mui/material";
import {
  DataGrid,
  gridClasses,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import log from "loglevel";
import React from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SingleOrder from "../components/SingleOrder";
import { OrderRequest } from "../model/Order";
import OrderService from "../services/order.service";
import AppState from "../store/Store";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

const columns: GridColDef[] = [
  {
    field: "shortId",
    headerName: "Id",
    flex: 1,
  },
  {
    field: "customerName",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "customerphoneNumber",
    headerName: "Phone No",
    flex: 1,
  },
];

type IOrdersProps = {};

const Orders: React.FunctionComponent<IOrdersProps> = (props) => {
  const [orders, setOrders] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const user = useSelector((state: AppState) => state.user);
  const { accessToken } = useOidcAccessToken();

  React.useEffect(() => {
    setTimeout(() => {
      try {
        if (user) {
          getOrders();
        }
      } catch (e) {
        log.error("Failed to get orders", e);
      }
    }, 10);
  }, []);

  async function getOrders() {
    const filter: OrderRequest = {
      shortId: "",
      customerName: "",
      customerEmail: "",
      customerPhoneNumber: "",
    };
    setIsLoading(true);
    const allOrders = await OrderService.GetOrders(
      accessToken,
      user.currentTenantId,
      filter
    );
    setIsLoading(false);

    if (allOrders) {
      setOrders(
        allOrders.map((x: any) => ({
          ...x,
          customerName: x.customer.name,
          customerphoneNumber: x.customer.phoneNumber,
        }))
      );
      setSelectedOrder(allOrders[0]);
    }
  }

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setSelectedOrder(params.row);
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} className="drawerMargin">
        <Grid container spacing={2} className="mt-2 row category-row">
          <Grid className="col-4">
            <Card className="single-order-Card">
              <div className="mb-3 row">
                <div className="col-10">
                  <Typography variant="h5" component="h4">
                    Order list
                  </Typography>
                </div>

                <div className="col-2"></div>
              </div>
              <div style={{ height: 520, width: "100%" }}>
                <StripedDataGrid
                  rows={orders}
                  columns={columns}
                  pageSize={10}
                  rowHeight={40}
                  rowsPerPageOptions={[5]}
                  experimentalFeatures={{ newEditingApi: true }}
                  onRowClick={handleRowClick}
                  getRowClassName={(params: any) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                  }
                  onSelectionModelChange={(newSelectionModel: any) => {
                    setSelectionModel(newSelectionModel);
                  }}
                  selectionModel={selectionModel}
                  loading={isLoading}
                />
              </div>
            </Card>
          </Grid>
          <Grid className="col-8">
            <Card className="single-order-Card">
              <SingleOrder order={selectedOrder} />
            </Card>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </>
  );
};

export default Orders;
