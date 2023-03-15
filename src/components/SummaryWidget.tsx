import { Box, CardContent, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CountUp from "react-countup";

type ISummaryWidgetProps = {
  title: string;
  total: string;
  icon: any;
  iconBackground: any;
  iconToolTip: string;
  sx: object;
};

export default function SummaryWidget({
  title,
  total,
  icon,
  iconBackground,
  iconToolTip,
  sx,
}: ISummaryWidgetProps) {
  return (
    <>
      <Card sx={sx}>
        <Typography>
          <Tooltip title={iconToolTip}>
            <LibraryAddIcon
              sx={{
                position: "absolute",
                top: "8px",
                float: "right",
                right: "8px",
              }}
            />
          </Tooltip>
        </Typography>

        <CardContent>
          <Box sx={{ mb: 1.5, display: "flex", justifyContent: "center" }}>
            <Card sx={iconBackground}>{icon}</Card>
          </Box>

          <h3>{total}</h3>
          <Typography sx={{ opacity: 0.72, fontWeight: "500" }}>
            {title}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
