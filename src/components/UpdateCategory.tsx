import {
  alpha,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import {
  DataGrid,
  GridColDef,
  gridClasses,
  GridSelectionModel,
} from "@mui/x-data-grid";
import React from "react";
import { date, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import Products from "../pages/Products";
import ClearIcon from "@mui/icons-material/Clear";

interface IUpdateCategory {
  category: any;
  allAttributes: any[];
  type: string;
  updateFormFields: (arg: {}) => void;
}

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
    field: "description",
    headerName: "Description",
    flex: 1,
  },
];

export default function UpdateCategory({
  category = {},
  allAttributes,
  type,
  updateFormFields,
}: IUpdateCategory) {
  const [openProduct, setOpenProduct] = React.useState(false);

  const validationSchema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Category name is required" }),
  });

  type ValidationSchema = z.infer<typeof validationSchema>;

  const iconBackground = {
    backgroundImage:
      "linear-gradient(135deg, rgba(16, 57, 150, 0) 0%, rgba(16, 57, 150, 0.24) 100%)",
    borderRadius: "20%",
    padding: "4px",
    color: "#103996",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    values: {
      id: category ? (type === "copy" ? "" : category.id) : "",
      name: category ? category.name : "",
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data: any) => {
    data.attributeDefinitionIds = selectionModel;
    updateFormFields(data);
  };

  const validFormInput = (values: unknown) => {
    const parsedData = validationSchema.parse(values);
    return parsedData;
  };

  const clearFields = () => {
    updateFormFields([]);
  };

  const [selectionModel, setSelectionModel] =
    React.useState<GridSelectionModel>([]);
  React.useEffect(() => {
    if (type === "update" || type === "copy") {
      setSelectionModel(
        allAttributes
          .filter((r) =>
            category.attributeDefinitions.find((x: any) => x.name === r.name)
          )
          .map((r) => r.id)
      );
    }
  }, [category]);

  const handleProductDialogClose = () => {
    setOpenProduct(false);
  };

  const handleProductOpen = () => {
    setOpenProduct(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row  m-0 p-0" style={{ position: "relative" }}>
        <DialogTitle className="category-header ">
          <Typography variant="h5" component="span">
            {type === "update" ? "Update category" : "Add new category"}
          </Typography>
          <Tooltip title="View product">
            <Card
              sx={iconBackground}
              style={{
                textAlign: "center",
                position: "absolute",
                right: "36px",
                top: "12px",
                cursor: "pointer",
                width: "40px",
              }}
            >
              <Typography onClick={handleProductOpen}>
                <ProductionQuantityLimitsIcon />
              </Typography>
            </Card>
          </Tooltip>
          {type !== "update" && (
            <ClearIcon
              sx={{
                position: "absolute",
                right: "8px",
                top: "8px",
                cursor: "pointer",
              }}
              onClick={clearFields}
            />
          )}
          <Dialog
            open={openProduct}
            onClose={handleProductDialogClose}
            fullWidth
            maxWidth="xl"
          >
            <Products selectedCategoryId={category} stylesData={undefined} />
          </Dialog>
        </DialogTitle>
      </div>

      <div className="row w-100">
        <div className="col-12">
          <DialogContent className="category-dialog">
            <div className="row">
              <div className="col-6">
                <TextField
                  disabled
                  id="outlined-required"
                  label="Category id"
                  className="w-100 mb-3"
                  size="small"
                  {...register("id")}
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div className="col-6">
                <TextField
                  required
                  id="outlined-required"
                  label="Category Name"
                  className="w-100 mb-3"
                  {...register("name")}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                {errors.name && (
                  <Typography className="text-danger" sx={{ fontSize: "12px" }}>
                    {errors.name?.message}
                  </Typography>
                )}
              </div>
            </div>

            <div>
              <h5 className="mb-2">Attributes</h5>
              <div style={{ height: 317, width: "100%" }}>
                <StripedDataGrid
                  rows={allAttributes}
                  columns={columns}
                  pageSize={10}
                  rowHeight={40}
                  rowsPerPageOptions={[5]}
                  experimentalFeatures={{ newEditingApi: true }}
                  getRowClassName={(params: any) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
                  }
                  checkboxSelection
                  selectionModel={selectionModel}
                  onSelectionModelChange={setSelectionModel}
                />
              </div>
            </div>
          </DialogContent>
          <Divider />
          <DialogActions>
            <div className="d-flex justify-content-end">
              <Button
                variant="contained"
                color="error"
                className="m-2"
                onClick={clearFields}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                color="success"
                className="m-2"
                type="submit"
              >
                {type === "update" ? "Update" : "Add"}
              </Button>
            </div>
          </DialogActions>
        </div>
      </div>
    </form>
  );
}
