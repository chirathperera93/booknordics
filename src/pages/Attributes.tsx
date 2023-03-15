import {
  alpha,
  Box,
  Card,
  Dialog,
  Grid,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import log from "loglevel";
import React from "react";
import AttributeService from "../services/attribute.service";
import {
  DataGrid,
  GridColDef,
  gridClasses,
  GridEventListener,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditAttribute from "../components/EditAttribute";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import attributeService from "../services/attribute.service";
import { AttributeDefinitionRequest } from "../model/Attribute";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AppState from "../store/Store";
import { useSelector } from "react-redux";
import { useOidcAccessToken } from "@axa-fr/react-oidc-context";

type IAttributeProps = {};

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

const iconBackground = {
  backgroundImage:
    "linear-gradient(135deg, rgba(183, 129, 3, 0) 0%, rgba(183, 129, 3, 0.24) 100%)",
  borderRadius: "20%",
  padding: "4px",
  color: "#B78103",
};

const Attributes: React.FunctionComponent<IAttributeProps> = (props) => {
  const [attribute, setAllAttributes] = React.useState([]);
  const [selectedAttribute, setSelectedAttribute] = React.useState({
    id: "",
    name: "",
    description: "",
    requirement: "",
    scope: "",
    type: "",
    affectsAvailability: false,
    affectsPrice: false,
    forSearch: false,
  });
  const [selectedAttributeCopy, setSelectedAttributeCopy] = React.useState({
    id: "",
    name: "",
    description: "",
    requirement: "",
    scope: "",
    type: "",
    affectsAvailability: false,
    affectsPrice: false,
    forSearch: false,
  });
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [openAddNewAttribute, setOpenAddNewAttribute] = React.useState(false);
  const [openAddNewAttributeCopy, setOpenAddNewAttributeCopy] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const user = useSelector((state: AppState) => state.user);
  const { accessToken } = useOidcAccessToken();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "action",
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation();
          setSelectedAttributeCopy(params.row);
          handleAddAttributeCopyClickOpen();
        };
        return (
          <Tooltip title="Copy attribute" placement="top">
            <ContentCopyIcon
              onClick={onClick}
              color="primary"
              sx={{ fontSize: "16px", cursor: "pointer" }}
            />
          </Tooltip>
        );
      },
      width: 100,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
    },
  ];

  React.useEffect(() => {
    setTimeout(() => {
      try {
        if (user) {
          loadAttributes(false, null);
        }
      } catch (e) {
        log.error("Failed to get Product Categories", e);
      }
    }, 10);
  }, []);

  async function loadAttributes(isEdit: boolean, id: any) {
    const allAttributes = await AttributeService.getAllAttributes(
      accessToken,
      user.currentTenantId
    );
    setAllAttributes(allAttributes);
    if (!isEdit) {
      if (allAttributes && allAttributes.length > 0) {
        setSelectedAttribute(allAttributes[0]);
        setSelectionModel(allAttributes[0].id);
      }
    } else {
      const updateAttribute: any = attribute.find((x: any) => x.id === id);
      setSelectedAttribute(updateAttribute);
      setSelectionModel(updateAttribute.id);
    }

    setIsLoading(false);
  }

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    setSelectedAttribute(params?.row);
  };

  const handleAddAttributeClickOpen = () => {
    setOpenAddNewAttribute(true);
  };

  const handleAddAttributeCopyClickOpen = () => {
    setOpenAddNewAttributeCopy(true);
  };

  const handleAddAttributeCopyClose = () => {
    setOpenAddNewAttributeCopy(false);
  };

  const handleAddAttributeClose = () => {
    setOpenAddNewAttribute(false);
  };

  const updateFormFields = async (fields: any): Promise<void> => {
    if (fields && fields.name) {
      const reqData: AttributeDefinitionRequest = {
        id: fields.id,
        name: fields.name,
        description: fields.description,
      };
      try {
        if (fields.id) {
          setIsLoading(true);
          const response = await attributeService.updateAttributeDefinition(
            accessToken,
            user.currentTenantId,
            reqData
          );

          if (response) {
            toast.success(`Attribute updated successfully`, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
          setIsLoading(true);
          loadAttributes(true, fields.id);
        } else {
          setIsLoading(true);
          const response = await attributeService.createAttributeDefinition(
            reqData,
            accessToken,
            user.currentTenantId
          );
          if (response) {
            toast.success(`Attribute added successfully`, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
          handleAddAttributeClose();
          handleAddAttributeCopyClose();
          setIsLoading(true);
          loadAttributes(false, null);
        }
      } catch (e) {
        log.error("Failed to get valid tenants", e);
      }
    } else {
      loadAttributes(false, null);
      handleAddAttributeClose();
      handleAddAttributeCopyClose();
    }
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} className="drawerMargin">
        <Grid container spacing={2} className="mt-2 row category-row">
          <Grid className="col-7">
            <Card className="attributeCard">
              <div className="mb-3 row">
                <div className="col-10">
                  <Typography variant="h5" component="span">
                    Attribute list
                  </Typography>
                </div>

                <div className="col-2">
                  <Tooltip title="Add new attribute">
                    <Card
                      sx={iconBackground}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "40px",
                        float: "right",
                        cursor: "pointer",
                      }}
                    >
                      <Typography onClick={handleAddAttributeClickOpen}>
                        <AddIcon />
                      </Typography>
                    </Card>
                  </Tooltip>

                  <Dialog
                    open={openAddNewAttribute}
                    onClose={handleAddAttributeClose}
                    fullWidth
                    maxWidth="sm"
                  >
                    <EditAttribute
                      type="add"
                      attribute={null}
                      updateFormFields={updateFormFields}
                    />
                  </Dialog>
                </div>
              </div>
              <div style={{ height: 360, width: "100%" }}>
                <StripedDataGrid
                  rows={attribute}
                  columns={columns}
                  pageSize={5}
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
          <Grid className="col-5">
            <Card className="attributeCard">
              <EditAttribute
                type="update"
                attribute={selectedAttribute}
                updateFormFields={updateFormFields}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
      <Dialog
        open={openAddNewAttributeCopy}
        onClose={handleAddAttributeCopyClose}
        fullWidth
        maxWidth="sm"
      >
        <EditAttribute
          type="copy"
          attribute={selectedAttributeCopy}
          updateFormFields={updateFormFields}
        />
      </Dialog>
    </>
  );
};

export default Attributes;
