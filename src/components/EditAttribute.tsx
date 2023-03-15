import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Divider } from "@mui/material";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ClearIcon from "@mui/icons-material/Clear";

type IAddAttributeProps = {
  type: string;
  attribute: any;
  updateFormFields: (arg: {}) => void;
};

export default function EditAttribute({
  type,
  attribute,
  updateFormFields,
}: IAddAttributeProps) {
  const validationSchema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Atribute name is required" }),
    description: z.string().min(1, { message: "Description name is required" }),
  });

  type ValidationSchema = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    values: {
      id: attribute ? (type === "copy" ? "" : attribute.id) : "",
      description: attribute ? attribute.description : "",
      name: attribute ? attribute.name : "",
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data: any) => {
    updateFormFields(data);
  };

  const clearFields = () => {
    updateFormFields([]);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ position: "relative" }}>
          <DialogTitle>
            <Typography variant="h5" component="span">
              {type === "update" ? "Update attribute" : "Add new attribute"}
            </Typography>
          </DialogTitle>

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
        </div>

        <Divider />
        <DialogContent>
          <Box className="mb-3">
            <TextField
              disabled
              id="outlined-basic"
              label="Attribute id"
              variant="outlined"
              fullWidth
              type="text"
              {...register("id")}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box className="mb-3">
            <TextField
              id="outlined-basic"
              variant="outlined"
              fullWidth
              label="Attribute name"
              type="text"
              {...register("name")}
              InputLabelProps={{ shrink: true }}
            />

            {errors.name && (
              <Typography className="text-danger" sx={{ fontSize: "12px" }}>
                {errors.name?.message}
              </Typography>
            )}
          </Box>

          <Box className="mb-3">
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="Attribute description"
              fullWidth
              type="text"
              {...register("description")}
              InputLabelProps={{ shrink: true }}
            />
            {errors.description && (
              <Typography className="text-danger" sx={{ fontSize: "12px" }}>
                {errors.description?.message}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
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
        </DialogActions>
      </form>
    </>
  );
}
