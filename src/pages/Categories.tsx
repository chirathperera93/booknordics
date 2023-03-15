import "../style.css";
import * as React from "react";
import ProductCategoryService from "../services/product-categories.service";
import { useOidcAccessToken } from "@axa-fr/react-oidc";
import {
  alpha,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AttributeService from "../services/attribute.service";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGrid,
  GridColDef,
  gridClasses,
  GridEventListener,
} from "@mui/x-data-grid";
import AppState from "../store/Store";
import { useSelector } from "react-redux";
import UpdateCategory from "../components/UpdateCategory";
import log from "loglevel";
import AddIcon from "@mui/icons-material/Add";
import { IProductCategoryData } from "../model/ProductCategory";
import { ToastContainer, toast } from "react-toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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

interface ICategoryProps {}

const Categories: React.FunctionComponent<ICategoryProps> = (props) => {
  const [productCategory, setProductCategory] = React.useState([]);
  const { accessToken } = useOidcAccessToken();
  const [selectedCategory, setSelectedCategory] = React.useState([]);
  const [selectedCategoryCopy, setSelectedCategoryCopy] = React.useState([]);
  const [attributes, setAttributes] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [openAddNewCategory, setOpenAddNewCategory] = React.useState(false);
  const [openAddNewCategoryCopy, setOpenAddNewCategoryCopy] =
    React.useState(false);
  const [parentData, setParentData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [deleteItemId, setDeleteItemId] = React.useState("");

  const user = useSelector((state: AppState) => state.user);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Category name",
      flex: 1,
    },
    {
      field: "delete",
      headerName: "",
      sortable: false,
      width: 20,
      renderCell: (params: any) => {
        return (
          <Tooltip title="Delete category">
            <DeleteIcon
              sx={{ fontSize: "16px", color: "red", cursor: "pointer" }}
              onClick={handleDeleteClick(params)}
            />
          </Tooltip>
        );
      },
      disableColumnMenu: true,
      align: "center",
    },
    {
      field: "copy",
      headerName: "",
      sortable: false,
      width: 50,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation();
          setSelectedCategoryCopy(params.row);
          handleAddCategoryCopyClickOpen();
        };
        return (
          <Tooltip title="Copy product category" placement="top">
            <ContentCopyIcon
              onClick={onClick}
              color="primary"
              sx={{ fontSize: "16px", cursor: "pointer" }}
            />
          </Tooltip>
        );
      },
      disableColumnMenu: true,
      align: "center",
    },
  ];

  localStorage.setItem("accessToken", accessToken);
  React.useEffect(() => {
    if (user) {
      getProductCategories(false, null);
    }
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      if (user) {
        getAllAttributes();
      }
    }, 10);
  }, []);

  async function getAllAttributes() {
    try {
      const allAttributes = await AttributeService.getAllAttributes(
        accessToken,
        user.currentTenantId
      );
      setAttributes(allAttributes);
    } catch (e) {
      log.error("Failed to get Product Categories", e);
    }
  }

  function getProductCategories(isEdit: boolean, categoryId: any) {
    ProductCategoryService.getProductsCategories(
      accessToken,
      user.currentTenantId
    )
      .then((response: any) => {
        setProductCategory(response.data);
        if (response.data && response.data.length > 0) {
          if (!isEdit) {
            setSelectedCategory(response.data[0]);
            setSelectionModel(response.data[0].id);
          } else {
            const updatedCategory: any = productCategory.find(
              (x: any) => x.id === categoryId
            );
            if (updatedCategory) {
              setSelectedCategory(updatedCategory);
              setSelectionModel(updatedCategory.id);
            }
          }
        }
      })
      .catch((e: Error) => {
        log.error(e);
      });
  }

  const iconBackground = {
    backgroundImage:
      "linear-gradient(135deg, rgba(16, 57, 150, 0) 0%, rgba(16, 57, 150, 0.24) 100%)",
    borderRadius: "20%",
    padding: "4px",
    color: "#103996",
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setSelectedCategory(params.row);
  };

  const handleAddCategoryClose = () => {
    setOpenAddNewCategory(false);
  };

  const handleAddCategoryCopyClose = () => {
    setOpenAddNewCategoryCopy(false);
  };

  const handleAddCategoryClickOpen = () => {
    setOpenAddNewCategory(true);
  };

  const handleAddCategoryCopyClickOpen = () => {
    setOpenAddNewCategoryCopy(true);
  };

  const handleDeleteClick = (params: any) => () => {
    setDeleteItemId(params.id);
    setOpen(true);
  };

  async function handleClose(isYes: boolean) {
    if (isYes) {
      await ProductCategoryService.deleteProductCategory(
        accessToken,
        user.currentTenantId,
        deleteItemId
      );
      toast.success(`Product category deleted successfully`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpen(false);
      getProductCategories(false, null);
    } else {
      setOpen(false);
    }
  }

  const updateFormFields = async (fields: any): Promise<void> => {
    if (fields && fields.name) {
      const reqData: IProductCategoryData = {
        id: fields.id,
        name: fields.name,
        attributeDefinitionIds: fields.attributeDefinitionIds,
      };

      try {
        if (fields.id) {
          const response = await ProductCategoryService.updateProductCategory(
            accessToken,
            user.currentTenantId,
            reqData
          );
          if (response) {
            toast.success(`Product category updated successfully`, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
          getProductCategories(true, fields.id);
        } else {
          const response = await ProductCategoryService.createProductCategory(
            accessToken,
            user.currentTenantId,
            reqData
          );
          if (response) {
            toast.success(`Product category created successfully`, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
          handleAddCategoryClose();
          handleAddCategoryCopyClose();
          getProductCategories(false, null);
        }
      } catch (e) {
        log.error("Failed to get valid tenants", e);
      }
      setParentData(fields);
    } else {
      getProductCategories(false, null);
      setParentData(fields);
      setOpenAddNewCategory(false);
    }
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} className="drawerMargin">
        <Grid container spacing={2} className="mt-2 row category-row">
          <Grid className="col-4">
            <Card className="categoriesDivider">
              <div className="mb-3 d-flex justify-content-between">
                <Typography variant="h5" component="span">
                  Category list
                </Typography>
                <Tooltip title="Add new category">
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
                    <Typography onClick={handleAddCategoryClickOpen}>
                      <AddIcon />
                    </Typography>
                  </Card>
                </Tooltip>
                <Dialog
                  open={openAddNewCategory}
                  onClose={handleAddCategoryClose}
                  fullWidth
                  maxWidth="md"
                >
                  <UpdateCategory
                    type="add"
                    category={null}
                    allAttributes={attributes}
                    updateFormFields={updateFormFields}
                  />
                </Dialog>
              </div>
              <div style={{ height: 510, width: "100%" }}>
                <StripedDataGrid
                  rows={productCategory}
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
                />
              </div>
            </Card>
          </Grid>
          <Grid className="col-8">
            <Card className="categoriesDivider">
              <UpdateCategory
                category={selectedCategory}
                allAttributes={attributes}
                type="update"
                updateFormFields={updateFormFields}
              ></UpdateCategory>
            </Card>
          </Grid>
        </Grid>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete cateogry"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to delete the selected category?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose(false)}>No</Button>
            <Button onClick={() => handleClose(true)} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <ToastContainer />
      <Dialog
        open={openAddNewCategoryCopy}
        onClose={handleAddCategoryCopyClose}
        fullWidth
        maxWidth="md"
      >
        <UpdateCategory
          category={selectedCategoryCopy}
          allAttributes={attributes}
          type="copy"
          updateFormFields={updateFormFields}
        ></UpdateCategory>
      </Dialog>
    </>
  );
};

export default Categories;
