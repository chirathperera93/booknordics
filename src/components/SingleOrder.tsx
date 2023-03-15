import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Consumer from "./Consumer";
import OrderLine from "./OrderLine";

type ISingleOrderProps = {
  order: any;
};

export default function SingleOrder({ order }: ISingleOrderProps) {
  return (
    <>
      <div>
        <DialogTitle>
          <Typography variant="h5" component="span">
            Order
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <div className="row">
            <Typography variant="h6" component="h4" className="mb-3">
              Customer
            </Typography>
            <div className="col-6">
              <Box className="mb-3">
                <TextField
                  disabled
                  id="outlined-basic"
                  label="Short id"
                  variant="outlined"
                  fullWidth
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  value={order?.shortId ? order?.shortId : ""}
                />
              </Box>

              <Box className="mb-3">
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  fullWidth
                  label="Customer name"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  value={order?.customer?.name ? order?.customer?.name : ""}
                />
              </Box>
            </div>
            <div className="col-6">
              <Box className="mb-3">
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label="Customer Phone"
                  fullWidth
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  value={
                    order?.customer?.phoneNumber
                      ? order?.customer?.phoneNumber
                      : ""
                  }
                />
              </Box>

              <Box className="mb-3">
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  label="Customer Email"
                  fullWidth
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  value={order?.customer?.email ? order?.customer?.email : ""}
                />
              </Box>
            </div>
            <div className="row order-line-row">
              <Typography variant="h6" component="h4" className="mb-3">
                Order lines
              </Typography>
              <div className="order-line-row">
                {order?.orderLines?.map((line: any) => (
                  <OrderLine key={line.id} line={line}></OrderLine>
                ))}
              </div>
            </div>
          </div>
          <div className="row">
            <Typography variant="h6" component="h4" className="mb-3 mt-3">
              Consumers
            </Typography>
            <div>
              {order?.consumers?.map((consumer: any) => (
                <Consumer key={consumer.id} consumer={consumer}></Consumer>
              ))}
            </div>
          </div>
        </DialogContent>
        <Divider />
        <DialogActions />
      </div>
    </>
  );
}
