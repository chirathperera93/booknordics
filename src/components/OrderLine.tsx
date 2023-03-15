import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import {
  DataGrid,
  gridClasses,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";

type IOrderLineProps = {
  line: any;
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

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "value",
    headerName: "Value",
    flex: 1,
  },
];

export default function OrderLine({ line }: IOrderLineProps) {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            {line?.$type}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {" "}
            {line?.product?.name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="row">
            <div className="col-6">
              <Box className="mb-3">
                <TextField
                  disabled
                  id="outlined-basic"
                  label="Start"
                  variant="outlined"
                  fullWidth
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  value={line?.start.split("T")[0]}
                />
              </Box>

              <Box className="mb-3">
                <TextField
                  disabled
                  id="outlined-basic"
                  variant="outlined"
                  fullWidth
                  label="End"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  value={line?.end.split("T")[0]}
                />
              </Box>
            </div>
            <div className="col-6">
              <Box className="mb-3">
                <TextField
                  disabled
                  id="outlined-basic"
                  label="Product"
                  variant="outlined"
                  fullWidth
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  value={line?.product?.name}
                />
              </Box>

              <Box className="mb-3">
                <TextField
                  disabled
                  id="outlined-basic"
                  variant="outlined"
                  label="Price"
                  fullWidth
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  value={line?.price?.net}
                />
              </Box>
            </div>
          </div>
          <div className="row">
            <Typography className="mb-3">Attributes</Typography>
            <div style={{ height: 360, width: "100%" }}>
              <StripedDataGrid
                rows={line?.attributes}
                columns={columns}
                pageSize={5}
                rowHeight={40}
                rowsPerPageOptions={[5]}
                experimentalFeatures={{ newEditingApi: true }}
                getRowId={(row: any) => row.name + row.value}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
