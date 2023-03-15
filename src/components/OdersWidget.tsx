import { alpha, CardHeader, Stack, styled, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import RemoveIcon from "@mui/icons-material/Remove";
import { OrderRequest } from "../model/Order";
import React from "react";
import OrderService from "../services/order.service";
import log from "loglevel";
import AppState from "../store/Store";
import { useSelector } from "react-redux";
import { useOidcAccessToken } from "@axa-fr/react-oidc-context";

type IOdersWidgetProps = {
  title: string;
  orderCount: string;
  columnData: any;
  dataList: any;
};

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

export default function OdersWidget({
  title,
  orderCount,
  columnData,
  dataList,
}: IOdersWidgetProps) {
  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [totalOrderCount, setTotalOrderCount] = React.useState([]);
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

    if (allOrders) {
      setOrders(
        allOrders.map((x: any) => ({
          ...x,
          customerName: x.customer.name,
          customerphoneNumber: x.customer.phoneNumber,
          customerEmail: x.customer.email,
        }))
      );
      setTotalOrderCount(allOrders.length);
    }
    setIsLoading(false);
  }

  return (
    <>
      <Card>
        <Stack direction="row" alignItems="center" spacing={2}>
          <CardHeader title={title} sx={{ p: "12px 0px  12px 12px" }} />
          <RemoveIcon />
          <Typography sx={{ fontSize: "24px" }}>{totalOrderCount}</Typography>
        </Stack>

        <div style={{ height: 400, width: "100%" }}>
          <StripedDataGrid
            columns={columnData}
            rows={orders}
            pageSize={5}
            rowHeight={50}
            rowsPerPageOptions={[2]}
            experimentalFeatures={{ newEditingApi: true }}
            getRowClassName={(params: any) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            loading={isLoading}
          />
        </div>
      </Card>
    </>
  );
}
