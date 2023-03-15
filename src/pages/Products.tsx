import {
  Box,
  Typography,
  Card,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  SelectChangeEvent,
  Switch,
  styled,
  alpha,
  Grid,
  Tooltip,
  Dialog,
} from "@mui/material";
import log from "loglevel";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AppState from "../store/Store";
import ProductCategoryService from "../services/product-categories.service";
import { ProductCategory } from "../model/ProductCategory";
import ProductService from "../services/product.service";
import { Product } from "../model/Product";
import {
  DataGrid,
  GridColDef,
  gridClasses,
  GridEventListener,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditProduct from "../components/EditProduct";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useOidcAccessToken } from "@axa-fr/react-oidc-context";

type IProductsProps = {
  selectedCategoryId: ProductCategory | undefined;
  stylesData: any | undefined;
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

export default function Products({
  selectedCategoryId,
  stylesData,
}: IProductsProps) {
  const user = useSelector((state: AppState) => state.user);
  const [productCategories, setProductCategories] = useState<
    ProductCategory[] | undefined
  >(undefined);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>();
  const [products, setProducts] = useState<Product[]>([]);
  const [includeDisabledProducts, setIncludeDisabledProducts] =
    useState<boolean>(false);
  const [selectionModel, setSelectionModel] = React.useState<any>([]);
  const [openEditProduct, setOpenEditProduct] = React.useState(false);
  const [openEditProductCopy, setOpenEditProductCopy] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedProduct, setSelectedProduct] =
    React.useState<Product | null>();
  const { accessToken } = useOidcAccessToken();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },

    {
      field: "fulfillmentSchemaId",
      headerName: "Fulfillment schema id",
      flex: 1,
    },

    {
      field: "id",
      headerName: "Id",
      flex: 1,
    },
    {
      field: "action",
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation();
          handleEditProductCopyOpen();
        };
        return (
          <Tooltip title="Copy product" placement="top">
            <ContentCopyIcon
              onClick={onClick}
              color="primary"
              sx={{ fontSize: "16px", cursor: "pointer" }}
            />
          </Tooltip>
        );
      },
      width: 50,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
    },
  ];

  React.useEffect(() => {
    setIsLoading(true);

    if (user) {
      getProductCategories();
    }
  }, []);

  async function getProductCategories(): Promise<void> {
    try {
      const categories = await ProductCategoryService.GetAllProductCategories(
        accessToken,
        user.currentTenantId
      );

      if (categories) {
        categories.sort((a, b) => a.name.localeCompare(b.name));

        setProductCategories(categories);

        if (selectedCategoryId !== undefined) {
          setSelectedCategory(selectedCategoryId);
          getProducts(selectedCategoryId.id);
        } else {
          setSelectedCategory(categories[0]);
          getProducts(categories[0].id);
        }
      }
    } catch {
      log.error("Unable to retrieve product categories");
    }
  }

  async function getProducts(catId: any): Promise<void> {
    setIsLoading(true);
    try {
      const productsData = await ProductService.getAllProductsByCategoryId(
        accessToken,
        user.currentTenantId,
        catId,
        false
      );

      if (productsData && productsData.products.length > 0) {
        productsData.products.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(productsData.products);
        setSelectedProduct(productsData.products[0]);
        setSelectionModel(productsData.products[0].id);
      } else {
        setProducts([]);
        setSelectedProduct(null);
        setSelectionModel("");
      }
      setIsLoading(false);
    } catch {
      log.error("Unable to retrieve products");
      setIsLoading(false);
    }
  }

  const updateFormFields = async (fields: any, type: any): Promise<void> => {
    if (fields && fields.categoryId) {
      try {
        const response = await ProductService.SetProduct(
          accessToken,
          user.currentTenantId,
          fields
        );
        if (response) {
          handleEditProductClose();
          handleEditProductCopyClose();
          toast.success(
            `Product ${
              type === "update" ? " updated " : " added "
            } successfully`,
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
          setProducts([]);

          getProducts(fields.categoryId);
        }
      } catch {
        log.error("Failed to save product");
      }
    } else {
      handleEditProductClose();
      handleEditProductCopyClose();
    }
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params: any) => {
    setSelectedProduct(params?.row);
  };

  const handleEditProductOpen = () => {
    setOpenEditProduct(true);
  };

  const handleEditProductCopyOpen = () => {
    setOpenEditProductCopy(true);
  };

  const handleEditProductClose = () => {
    setOpenEditProduct(false);
  };

  const handleEditProductCopyClose = () => {
    setOpenEditProductCopy(false);
  };

  function handleCategorySelected(event: SelectChangeEvent): void {
    setIsLoading(true);
    const selection = event.target.value as string;

    const selectionPcat = productCategories?.find(
      (pCat) => pCat.id === selection
    );

    if (selectionPcat) {
      setSelectedCategory(selectionPcat);
      setProducts([]);
      getProducts(selectionPcat.id);
    }
  }

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, p: 3, stylesData }}>
        <form>
          <FormGroup>
            <div className="row mb-3">
              <div className="col-4">
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="category-selector-label">
                    Product category
                  </InputLabel>
                  <Select
                    labelId="category-selector-label"
                    id="category-selector"
                    value={selectedCategory?.id ? selectedCategory?.id : "all"}
                    onChange={handleCategorySelected}
                  >
                    {productCategories &&
                      productCategories.map((c) => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-8">
                <FormControlLabel
                  control={
                    <Switch
                      checked={includeDisabledProducts}
                      onChange={() =>
                        setIncludeDisabledProducts(!includeDisabledProducts)
                      }
                    />
                  }
                  label="Include disabled products"
                />
              </div>
            </div>
          </FormGroup>
        </form>

        <Grid container spacing={2} className="mt-2 row category-row">
          <Grid className="col-6">
            <Card className="productCard">
              <div className="mb-3 row">
                <div className="col-10">
                  <Typography variant="h5" component="span">
                    Product list
                  </Typography>
                </div>

                <div className="col-2">
                  <Tooltip title="Add new product">
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
                      <Typography onClick={handleEditProductOpen}>
                        <AddIcon />
                      </Typography>
                    </Card>
                  </Tooltip>
                  <Dialog
                    open={openEditProduct}
                    onClose={handleEditProductClose}
                    fullWidth
                    maxWidth="md"
                  >
                    <EditProduct
                      type="add"
                      product={selectedProduct}
                      category={selectedCategory}
                      updateFormFields={updateFormFields}
                    />
                  </Dialog>
                </div>
              </div>
              <div style={{ height: 360, width: "100%" }}>
                <StripedDataGrid
                  rows={products}
                  columns={columns}
                  pageSize={10}
                  rowHeight={40}
                  rowsPerPageOptions={[10]}
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
          <Grid className="col-6">
            <Card className="productCard">
              <EditProduct
                type="update"
                product={selectedProduct}
                category={selectedCategory}
                updateFormFields={updateFormFields}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
      <Dialog
        open={openEditProductCopy}
        onClose={handleEditProductCopyClose}
        fullWidth
        maxWidth="md"
      >
        <EditProduct
          type="copy"
          product={selectedProduct}
          category={selectedCategory}
          updateFormFields={updateFormFields}
        />
      </Dialog>
    </>
  );
}
const iconBackground = {
  backgroundImage:
    "linear-gradient(135deg, rgba(12, 83, 183, 0) 0%, rgba(12, 83, 183, 0.24) 100%)",
  borderRadius: "20%",
  padding: "4px",
  color: "#04297A",
};
