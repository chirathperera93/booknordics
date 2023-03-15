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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";
import { DataGrid, gridClasses, GridColDef, GridEventListener } from "@mui/x-data-grid";

type IConsumerProps = {
    consumer: any;
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


export default function Consumer({
    consumer,
}: IConsumerProps) {

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '60%', flexShrink: 0 }}>
                        {consumer?.id}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>  {consumer?.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="row">
                        <div className="col-6">
                            <Box className="mb-3">
                                <TextField
                                    disabled
                                    id="outlined-basic"
                                    label="Id"
                                    variant="outlined"
                                    fullWidth
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    value={consumer?.id}
                                />
                            </Box>

                            <Box className="mb-3">
                                <TextField
                                    disabled
                                    id="outlined-basic"
                                    variant="outlined"
                                    fullWidth
                                    label="Name"
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    value={consumer?.name}
                                />
                            </Box>

                        </div>
                        <div className="col-6">
                            <Box className="mb-3">
                                <TextField
                                    disabled
                                    id="outlined-basic"
                                    label="Phone"
                                    variant="outlined"
                                    fullWidth
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    value={consumer?.phoneNumber}
                                />
                            </Box>

                            <Box className="mb-3">
                                <TextField
                                    disabled
                                    id="outlined-basic"
                                    variant="outlined"
                                    label="Email"
                                    fullWidth
                                    type="text"
                                    InputLabelProps={{ shrink: true }}
                                    value={consumer?.email}
                                />
                            </Box>

                        </div>
                    </div>
                    <div className="row">
                        <Typography className="mb-3">Attributes</Typography>
                        <div style={{ height: 360, width: "100%" }}>
                            <StripedDataGrid
                                rows={consumer?.attributes}
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
