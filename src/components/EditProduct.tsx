import {
  Box,
  Typography,
  styled,
  alpha,
  DialogTitle,
  Divider,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { SyntheticEvent } from "react";
import { Product, ProductCreateRequest } from "../model/Product";
import {
  DataGrid,
  gridClasses,
  GridColDef,
  GridRowModel,
} from "@mui/x-data-grid";
import { v4 as uuidv4 } from "uuid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { EditProductFormState, FulfillmentSystem } from "../model/Common";
import { DateTime } from "luxon";
import log from "loglevel";
import CommonService from "../services/common.service";
import moment from "moment";
import { AttributeNew } from "../model/Attribute";
import { ProductCategory } from "../model/ProductCategory";
import ClearIcon from "@mui/icons-material/Clear";
import AppState from "../store/Store";
import { useSelector } from "react-redux";
import { useOidcAccessToken } from "@axa-fr/react-oidc-context";

type IEditProductProps = {
  type: string;
  product: Product | null | undefined;
  category: ProductCategory | undefined;
  updateFormFields: (arg1: {}, arg2: string) => void;
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
    type: "text",
  },
  {
    field: "value",
    headerName: "Value",
    flex: 1,
    editable: true,
    type: "text",
  },
];

export default function EditProduct(props: IEditProductProps) {
  const [selectedProduct, setSelectedProduct] = React.useState<Product>();
  const [selectedCategory, setSelectedCategory] =
    React.useState<ProductCategory>();
  const [attributesData, setAttributes] = React.useState<
    AttributeNew[] | undefined
  >();

  const [isLoading, setIsLoading] = React.useState(true);
  const [isDisabledFileds, setIsDisabledFileds] = React.useState(false);
  const [editProductForm, setEditProductForm] =
    React.useState<EditProductFormState>({});
  const [fulfillmentSystems, setFulfillmentSystems] = React.useState<
    FulfillmentSystem[]
  >([]);
  const [isValidForm, setIsValidForm] = React.useState<boolean>(false);
  const user = useSelector((state: AppState) => state.user);
  const { accessToken } = useOidcAccessToken();

  React.useEffect(() => {
    if (user) {
      loadFulfillmentSystems(
        accessToken,
        user.currentTenantId,
        setFulfillmentSystems
      );
    }
  }, []);

  React.useEffect(() => {
    setIsValidForm(validateForm(editProductForm));
  }, [editProductForm]);

  React.useEffect(() => {
    if (props.category) {
      setSelectedCategory(props.category);
    }

    setEditProductForm({
      name: "",
      fulfillmentSystemId: "",
      fulfillmentProductId: "",
      enabledFrom: null,
      enabledTo: null,
    });

    if (props.product) {
      setSelectedProduct(props.product);
      setEditProductForm({
        name: props.type !== "add" ? props.product.name : "",
        fulfillmentSystemId:
          props.type !== "add" ? props.product?.fulfillmentSchemaId : "",
        fulfillmentProductId:
          props.type !== "add" ? props.product?.externalId : "",
        enabledFrom:
          props.type !== "add"
            ? parseLocaltime(props.product?.enabledFrom)
            : null,
        enabledTo:
          props.type !== "add"
            ? parseLocaltime(props.product?.enabledTo)
            : null,
      });
    }

    setIsLoading(false);
  }, [props]);

  React.useEffect(() => {
    if (props.type === "update" || props.type === "copy") {
      setIsDisabledFileds(true);
      setAttributes([]);
      if (props.product) {
        setIsDisabledFileds(false);
        setAttributes(
          props.product.attributes.map((a) => ({
            id: uuidv4(),
            name: a.name,
            value: a.value,
          }))
        );
      }
    }

    if (props.type === "add") {
      const attributeDefinitions = props.category?.attributeDefinitions.map(
        (item) => ({
          id: item.id,
          name: item.name,
          value: undefined,
        })
      );
      setAttributes(attributeDefinitions);
    }
  }, [props]);

  function classNames(...args: any[]) {
    return args.filter(Boolean).join(" ");
  }

  const processRowUpdate = React.useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) =>
      new Promise<GridRowModel>((resolve, reject) => {
        const foundAttribute = attributesData?.find(
          (item: any) => item.id === oldRow.id
        );
        if (foundAttribute) {
          foundAttribute.value = newRow.value;
        }
      }),
    [attributesData]
  );

  const clearFields = () => {
    props.updateFormFields({}, "");
  };

  return (
    <>
      <div
        className={classNames(
          "row w-100 p-0 m-0",
          (props.type === "add" || props.type === "copy") && "p-3"
        )}
      >
        <div className="row  m-0 p-0" style={{ position: "relative" }}>
          <DialogTitle>
            <Typography variant="h5" component="span">
              {props.type === "update" ? "Update product" : "Add new product"}

              {props.type !== "update" && (
                <Button variant="outlined" sx={{ marginLeft: "20px" }}>
                  {props.category?.name}
                </Button>
              )}
            </Typography>
            {props.type !== "update" && (
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
          </DialogTitle>

          <Divider />
        </div>

        <div className="row m-0 p-0 ">
          <form onSubmit={(e: SyntheticEvent) => saveProduct(e)}>
            <div
              className={classNames(
                "row  m-0 p-0",
                (props.type === "add" || props.type === "copy") &&
                  "editProductDialogBody"
              )}
            >
              <DialogContent>
                <Box className="mb-3">
                  <TextField
                    id="outlined-basic"
                    label="Product name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    required={true}
                    value={editProductForm.name ? editProductForm.name : ""}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) =>
                      setEditProductForm({
                        ...editProductForm,
                        name: e.target.value,
                      })
                    }
                    disabled={isDisabledFileds}
                  />
                </Box>

                <Box className="mb-3">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      ampm={false}
                      renderInput={(props: any) => <TextField {...props} />}
                      label="For sale from"
                      value={editProductForm.enabledFrom ?? null}
                      onChange={(d: any) =>
                        setEditProductForm({
                          ...editProductForm,
                          enabledFrom: d["$d"],
                        })
                      }
                      disabled={isDisabledFileds}
                    />
                  </LocalizationProvider>
                </Box>

                <Box className="mb-3">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      ampm={false}
                      renderInput={(props: any) => <TextField {...props} />}
                      label="For sale until"
                      value={editProductForm.enabledTo ?? null}
                      onChange={(d: any) =>
                        setEditProductForm({
                          ...editProductForm,
                          enabledTo: d["$d"],
                        })
                      }
                      disabled={isDisabledFileds}
                    />
                  </LocalizationProvider>
                </Box>

                <Box className="mb-3">
                  <FormControl fullWidth>
                    <InputLabel id="fulfillmentsystem-label">
                      Fulfillment system
                    </InputLabel>
                    <Select
                      id="fulfillmentsystem"
                      labelId="fulfillmentsystem-label"
                      value={editProductForm.fulfillmentSystemId ?? "-"}
                      onChange={(e: any) =>
                        setEditProductForm({
                          ...editProductForm,
                          fulfillmentSystemId:
                            (e.target.value as string) === "-"
                              ? undefined
                              : (e.target.value as string),
                        })
                      }
                      disabled={isDisabledFileds}
                    >
                      {[
                        <MenuItem id="menu-none" value={"-"} key={"none"}>
                          none
                        </MenuItem>,
                      ].concat(
                        fulfillmentSystems.map((f) => (
                          <MenuItem id={`menu-${f.id}`} value={f.id} key={f.id}>
                            {f.fulfillmentSchemaName}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Box>

                <Box className="mb-3">
                  <TextField
                    id="fulfillment-product"
                    label="Fulfillment product id"
                    fullWidth
                    disabled={!editProductForm.fulfillmentSystemId}
                    required={true}
                    value={
                      editProductForm.fulfillmentProductId
                        ? editProductForm.fulfillmentProductId
                        : ""
                    }
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) =>
                      setEditProductForm({
                        ...editProductForm,
                        fulfillmentProductId: e.target.value,
                      })
                    }
                  />
                </Box>

                <Box className="mb-3">
                  <Typography variant="h6" component="h6" className="mb-2">
                    {props.type === "update"
                      ? "Edit attributes"
                      : "Add new attributes"}
                  </Typography>
                  <div style={{ height: 360, width: "100%" }}>
                    {attributesData && (
                      <StripedDataGrid
                        rows={attributesData}
                        columns={columns}
                        pageSize={10}
                        rowHeight={40}
                        rowsPerPageOptions={[10]}
                        experimentalFeatures={{ newEditingApi: true }}
                        getRowClassName={(params: any) =>
                          params.indexRelativeToCurrentPage % 2 === 0
                            ? "even"
                            : "odd"
                        }
                        loading={isLoading}
                        processRowUpdate={processRowUpdate}
                      />
                    )}
                  </div>
                </Box>
              </DialogContent>
            </div>

            <Divider />

            <div className="row m-0 p-0">
              <DialogActions>
                <Button
                  variant="contained"
                  color="error"
                  className="m-2"
                  type="reset"
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  className="m-2"
                  type="submit"
                  disabled={!isValidForm}
                >
                  {props.type === "update" ? "Update" : "Add"}
                </Button>
              </DialogActions>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  function getTimes(time: DateTime | null | undefined) {
    if ((props.type === "update" || props.type === "copy") && time !== null && time !== undefined) {
      if (Object.prototype.toString.call(time) === "[object Date]") {
        return moment(time).format("YYYY-MM-DDTHH:mm:ss");
      } else {
        return time
          ?.setZone("UTC", { keepLocalTime: true })
          .toFormat("yyyy-MM-dd'T'HH:mm:ss");
      }
    } else if (
      (props.type === "add" ) &&
      time !== null &&
      time !== undefined
    ) {
      return moment(time).format("YYYY-MM-DDTHH:mm:ss");
    } else {
      return undefined;
    }
  }

  async function saveProduct(event: SyntheticEvent): Promise<void> {
    event.preventDefault();

    const newProduct: ProductCreateRequest = {
      id: props.type === "update" ? selectedProduct?.id : undefined,
      name: editProductForm.name ? editProductForm.name : "",
      categoryId:
        props.type === "update" || props.type === "copy"
          ? selectedProduct?.category.id
          : selectedCategory?.id,

      enabledFrom: getTimes(editProductForm.enabledFrom),
      enabledTo: getTimes(editProductForm.enabledTo),
      externalId: undefined,
      fulfillmentSchemaId: undefined,
      attributes: [],
    };

    if (props.type === "add") {
      const attriWithValuesCreate = attributesData
        ?.filter((at) => at.value !== undefined)
        .map((x: any) => ({
          name: x.name,
          value: x.value,
        }));

      newProduct.attributes = attriWithValuesCreate ?? [];
    }

    if (props.type === "update" || props.type === "copy") {
      const attriWithValuesUpdate = attributesData?.map((x: any) => ({
        name: x.name,
        value: x.value,
      }));

      newProduct.attributes = attriWithValuesUpdate ?? [];
    }

    if (editProductForm.fulfillmentSystemId) {
      newProduct.fulfillmentSchemaId = editProductForm.fulfillmentSystemId;
    }

    if (editProductForm.fulfillmentProductId) {
      newProduct.externalId = editProductForm.fulfillmentProductId;
    }

    console.log("newProduct = ", newProduct);
    // props.updateFormFields(newProduct, props.type);
  }
}

function parseLocaltime(datetime: string | undefined): DateTime | null {
  if (datetime) {
    const parsed = DateTime.fromISO(datetime).setZone("UTC", {
      keepLocalTime: true,
    });
    if (parsed.isValid) {
      return parsed;
    }
  }
  return null;
}

async function loadFulfillmentSystems(
  accessToken: string,
  currentTenantId: any,
  setFulfillmentSystems: React.Dispatch<
    React.SetStateAction<FulfillmentSystem[]>
  >
): Promise<void> {
  try {
    const f = await CommonService.GetFulfillmentSystems(
      accessToken,
      currentTenantId
    );
    setFulfillmentSystems(f);
  } catch {
    log.error("Failed when trying to load fulfillment systems from service");
  }
}

function validateForm(form: EditProductFormState): boolean {
  if (!form.name || form.name === "") {
    return false;
  }
  return true;
}
