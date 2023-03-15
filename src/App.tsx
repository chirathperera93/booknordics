import "./App.css";
import React from "react";
import { useOidcAccessToken, useOidcUser } from "@axa-fr/react-oidc-context";
import log from "loglevel";
import CommonService from "./services/common.service";
import { useDispatch } from "react-redux";
import {
  setAuthorizationAction,
  setCurrentTenantAction,
  setTenantsAction,
} from "./store/UserState";
import MiniDrawer from "./components/MiniDrawer";
import { useNavigate } from "react-router-dom";

function App() {
  // This configuration use hybrid mode
  // ServiceWorker are used if available (more secure) else tokens are given to the client
  // You need to give inside your code the "access_token" when using fetch

  const { oidcUser } = useOidcUser();
  const { accessToken } = useOidcAccessToken();
  const [tenants, setTenants] = React.useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    GetUserDetail();
    async function GetUserDetail() {
      try {
        if (oidcUser?.valid_tenant_ids) {
          const tenantIds = JSON.parse(oidcUser.valid_tenant_ids);
          localStorage.setItem("accessToken", accessToken);

          const tenants = await CommonService.GetTenants(
            accessToken,
            tenantIds
          );

          if (oidcUser.name) {
            dispatch(setAuthorizationAction(oidcUser.name, ""));
          }
          // localStorage.setItem("Cenium-Tenant-Id", tenants[0].id);

          localStorage.setItem(
            "Cenium-Tenant-Id",
            "97AA1E21-488F-45E3-8A53-0979A3972AB8"
          );

          tenants[0].id = "97AA1E21-488F-45E3-8A53-0979A3972AB8";

          setTenants(tenants);

          dispatch(setTenantsAction(tenants));
          dispatch(setCurrentTenantAction(0));
        } else {
          log.warn(
            "Valid tenants not provided in profile\n" +
              JSON.stringify(oidcUser?.profile, null, 4)
          );
        }
      } catch (e) {
        log.error("Failed to get valid tenants", e);
      }
    }
  }, [oidcUser, dispatch, navigate]);

  return <>{tenants.length > 0 && <MiniDrawer />}</>;
}

export default App;
