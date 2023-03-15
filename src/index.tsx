import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AppConfiguration from "./AppConfig";
import Routers from "./Routers";
import log from "loglevel";
import { Provider } from "react-redux";
import {
  Box,
  CircularProgress,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { OidcProvider, OidcSecure } from "@axa-fr/react-oidc-context";
import { configureStore } from "./store/Store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

log.setLevel(AppConfiguration.LogLevel(), false);

// log.info(
//   `Commerce API: ${AppConfiguration.CommerceApiBase} (${process.env.REACT_APP_COMMERCE_API_BASE})`
// );
// log.info(
//   `Identity API: ${AppConfiguration.IdentityApiBase} (${process.env.REACT_APP_IDENTITY_API_BASE})`
// );
// log.info(
//   `App base    : ${AppConfiguration.AppBase} (${process.env.REACT_APP_BASE})`
// );
// log.info(
//   `window.location.origin    : ${AppConfiguration.AppBase} (${window.location.origin})`
// );
// log.info(
//   `auth/callback    : ${window.location.origin}${AppConfiguration.AppBase}/auth/callback`
// );

const store = configureStore();

const theme = createTheme();

const opidConfiguration = {
  client_id: "commerce-management-app",
  response_type: "code",
  scope: "openid profile commerce-id commerce", // offline_access scope allow your client to retrieve the refresh_token
  authority: AppConfiguration.IdentityApiBase,
  automaticSilentRenew: true,
  loadUserInfo: true,

  redirect_uri: `${window.location.origin}${AppConfiguration.AppBase}/auth/callback`,
  silent_redirect_uri: `${window.location.origin}${AppConfiguration.AppBase}/auth/silentcallback`,
  post_logout_redirect_uri: `${window.location.origin}${
    AppConfiguration.AppBase
  }${Routers.Home()}`,
};

class AuthenticatingPage extends React.Component {
  render() {
    return (
      <>
        <Box
          component="main"
          sx={{
            marginTop: "200px",
            alignItems: "center",
            display: "flex",
            flexGrow: 1,
            minHeight: "100%",
          }}
        >
          <Container maxWidth="sm" sx={{ textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mb: 3 }} variant="h4">
              Authenticating...
            </Typography>
          </Container>
        </Box>
      </>
    );
  }
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Router basename={AppConfiguration.AppBase}>
            <OidcProvider
              configuration={opidConfiguration}
              loadingComponent={AuthenticatingPage}
              authenticatingErrorComponent={AuthenticatingPage}
              authenticatingComponent={AuthenticatingPage}
              sessionLostComponent={AuthenticatingPage}
              serviceWorkerNotSupportedComponent={AuthenticatingPage}
              callbackSuccessComponent={AuthenticatingPage}
            >
              <OidcSecure>
                <App />
              </OidcSecure>
            </OidcProvider>
          </Router>
        </CssBaseline>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
