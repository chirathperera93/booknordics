import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import log from "loglevel";
import Papa from "papaparse";
import React from "react";
import ReportsService from "../services/reports.service";
import { v4 as uuidv4 } from "uuid";
import { Card, TextField, Typography } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Popover from "@mui/material/Popover";
import moment from "moment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AppState from "../store/Store";
import { useSelector } from "react-redux";
import { useOidcAccessToken } from "@axa-fr/react-oidc-context";

type IReportsProps = {};

export default function Reports({}: IReportsProps) {
  const [reportData, setReportData] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [state, setState] = React.useState([
    {
      startDate: new Date("2023-01-01"),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const user = useSelector((state: AppState) => state.user);
  const { accessToken } = useOidcAccessToken();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const columnData: GridColDef[] = [
    {
      field: "Product Title",
      headerName: "Product Title",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Product country",
      headerName: "Product country",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Commerce Product Id",
      headerName: "Commerce Product Id",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Fulfilment system Product ID",
      headerName: "Fulfilment system Product ID",
      minWidth: 220,
      flex: 1,
    },

    {
      field: "Fulfilment system Booking ID",
      headerName: "Fulfilment system Booking ID",
      minWidth: 220,
      flex: 1,
    },
    {
      field: "Name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Email",
      headerName: "Email",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Phone number",
      headerName: "Phone number",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Booking date",
      headerName: "Booking date",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Arrival date",
      headerName: "Arrival date",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Departure date",
      headerName: "Departure date",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Total PAX",
      headerName: "Total PAX",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Commision Rate",
      headerName: "Commision Rate",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Supplier price after commision",
      headerName: "Supplier price after commision",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Payment status",
      headerName: "Payment status",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Sales channel",
      headerName: "Sales channel",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Supplier",
      headerName: "Supplier",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "CMS Product ID",
      headerName: "CMS Product ID",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "Fulfilment system ID - Not currently fetched",
      headerName: "Fulfilment system ID - Not currently fetched",
      minWidth: 200,
      flex: 1,
    },

    {
      field: "Sales currency",
      headerName: "Sales currency",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Exchange rate sale currency to NOK",
      headerName: "Exchange rate sale currency to NOK",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Supplier currency",
      headerName: "Supplier currency",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Exchange rate supplier currency to NOK",
      headerName: "Exchange rate supplier currency to NOK",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Gross sales in sales currency",
      headerName: "Gross sales in sales currency",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Sales discount",
      headerName: "Sales discount",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Price After Discount",
      headerName: "Price After Discount",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "Price in NOK After Discount",
      headerName: "Price in NOK After Discount",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Commission amount NOK",
      headerName: "Commission amount NOK",
      minWidth: 200,
      flex: 1,
    },

    {
      field: "Sales VAT25% NOK base",
      headerName: "Sales VAT25% NOK base",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Sales VAT15% NOK base",
      headerName: "Sales VAT15% NOK base",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Sales VAT12% NOK base",
      headerName: "Sales VAT12% NOK base",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Sales VAT06% NOK base",
      headerName: "Sales VAT06% NOK base",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Commission VAT25% NOK base",
      headerName: "Commission VAT25% NOK base",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Commission VAT12% NOK base",
      headerName: "Commission VAT12% NOK base",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "Commission VAT06% NOK base",
      headerName: "Commission VAT06% NOK base",
      minWidth: 200,
      flex: 1,
    },

    {
      field: "Payment method",
      headerName: "Payment method",
      minWidth: 150,
      flex: 1,
    },
  ];

  React.useEffect(() => {
    setTimeout(() => {
      if (user) {
        getReports(
          moment(state[0].startDate).format("YYYY-MM-DD"),
          moment(state[0].endDate).format("YYYY-MM-DD")
        );
      }
    }, 1);
  }, []);

  function handleSelect(item: any) {
    setState([item.selection]);

    getReports(
      moment(item.selection.startDate).format("YYYY-MM-DD"),
      moment(item.selection.endDate).format("YYYY-MM-DD")
    );
  }

  async function getReports(startDate: string, endDate: string) {
    setIsLoading(true);
    try {
      setReportData([]);
      const reports = await ReportsService.getReports(
        accessToken,
        user.currentTenantId,
        startDate,
        endDate
      );

      if (reports) {
        const jsonData = Papa.parse(reports, { header: true });

        const rows = jsonData.data.map((a: any) => ({
          id: uuidv4(),
          ...a,
        }));

        setReportData(rows);
        setIsLoading(false);
      }
    } catch (e) {
      log.error("Failed to get reports", e);
      setIsLoading(false);
    }
  }

  const iconBackground = {
    backgroundImage:
      "linear-gradient(135deg, rgba(16, 57, 150, 0) 0%, rgba(16, 57, 150, 0.24) 100%)",
    borderRadius: "20%",
    padding: "4px",
    color: "#103996",
  };

  return (
    <>
      <div className="row w-100 m-auto mb-3">
        <div className="col-5 d-flex">
          <TextField
            id="outlined-basic"
            label="Date from"
            variant="outlined"
            value={moment(state[0].startDate).format("YYYY-MM-DD")}
            InputLabelProps={{ shrink: true }}
            sx={{ marginRight: "16px" }}
            inputProps={{ readOnly: true }}
          />

          <TextField
            id="outlined-basic"
            label="Date to"
            variant="outlined"
            value={moment(state[0].endDate).format("YYYY-MM-DD")}
            InputLabelProps={{ shrink: true }}
            sx={{ marginRight: "16px", position: "relative" }}
            inputProps={{ readOnly: true }}
          />

          <Card
            sx={iconBackground}
            style={{
              textAlign: "center",
              cursor: "pointer",
              width: "40px",
              height: "40px",
              marginTop: "8px",
            }}
          >
            <Typography onClick={handleClick}>
              <CalendarMonthIcon />
            </Typography>
          </Card>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <DateRangePicker
              onChange={handleSelect}
              showDateDisplay={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={state}
              direction="horizontal"
            />
          </Popover>
        </div>
      </div>
      <div className="row w-100 m-auto">
        <div className="col-12">
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              components={{ Toolbar: GridToolbar }}
              columns={columnData}
              rows={reportData}
              pageSize={10}
              rowHeight={50}
              rowsPerPageOptions={[2]}
              loading={isLoading}
              componentsProps={{
                toolbar: {
                  printOptions: { disableToolbarButton: true },
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
