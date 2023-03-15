import * as React from "react";
import {
  styled,
  Theme,
  CSSObject,
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AccountCircle } from "@mui/icons-material";
import { useOidc } from "@axa-fr/react-oidc-context";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import AppState from "../store/Store";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Routers from "../Routers";
import Dashboard from "../pages/Dashboard";
import Categories from "../pages/Categories";
import adminLogo from "../assets/images/booknordics_admin_image.png";
import { makeStyles } from "@mui/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AttributionIcon from "@mui/icons-material/Attribution";
import Attributes from "../pages/Attributes";
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Reports from "../pages/Reports";
import AppConfiguration from "../AppConfig";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const useStyles = makeStyles({
  active: {
    backgroundColor: "#919eab29 !important",
    color: "#00193c !important",
    "& .MuiListItemIcon-root": {
      color: "#00193c",
    },
  },
});

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(true);
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: AppState) => state.user);
  const classes = useStyles();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const { logout } = useOidc();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout(
      `${window.location.origin}${AppConfiguration.AppBase}${Routers.Home()}`
    );
  };

  const themeDrawer = createTheme({
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: "#F9F9F9",
            // background: "#00193c",
            boxShadow: "10px 0px 4px -4px #ececec",
          },
        },
      },
    },
  });

  const navigate = useNavigate();

  const navigateToPage = (_page: string, index: number) => {
    _page = _page.toLowerCase();
    let selectedPage = _page === "product categories" ? "categories" : _page;
    navigate(selectedPage);
  };

  function renderMenuIconSwitch(index: any) {
    switch (index) {
      case 0:
        return <DashboardIcon />;
      case 1:
        return <ArticleIcon />;
      case 2:
        return <CategoryIcon />;
      case 3:
        return <ProductionQuantityLimitsIcon />;
      case 4:
        return <AttributionIcon />;
      case 5:
        return <AssessmentIcon />;
      default:
        return <DashboardIcon />;
    }
  }

  function capitalizeFirst(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: "#F9F9F9", color: "#00193c" }}
      >
        <Toolbar className="d-flex justify-content-between">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography noWrap sx={{ fontSize: "18px", fontWeight: "500" }}>
            {capitalizeFirst(location.pathname.split("/")[1])}
          </Typography>

          {user && (
            <div>
              <IconButton
                sx={{
                  color: "#00193c",
                  "&:hover": {
                    backgroundColor: "transparent",
                    cursor: "default",
                  },
                }}
              >
                <LocalMallIcon sx={{ marginRight: "4px" }}></LocalMallIcon>
                <Typography>
                  {user.currentTenant !== undefined &&
                    user.tenants[user.currentTenant].name}
                </Typography>
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}
              >
                <AccountCircle sx={{ marginRight: "4px" }} />

                <Typography>{user.username}</Typography>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themeDrawer}>
          <Drawer variant="permanent" open={open}>
            <DrawerHeader sx={{ backgroundColor: "#F9F9F9" }}>
              <div>
                <Box
                  onClick={() => navigateToPage("/", -1)}
                  component="img"
                  sx={{
                    margin: "20px 10px 10px 10px",
                    height: 40,
                    width: 210,
                    cursor: "pointer",
                  }}
                  src={adminLogo}
                />
              </div>
            </DrawerHeader>
            <Divider />
            <List
              sx={{
                backgroundColor: "#F9F9F9",
                color: "#637381",
              }}
            >
              {[
                "Dashboard",
                "Orders",
                "Product Categories",
                "Products",
                "Attributes",
                "Reports",
              ].map((text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  sx={{
                    display: "block",
                    "& .Mui-selected": {
                      backgroundColor: "#919eab29 !important",
                      color: "#00193c !important",
                      fontWeight: "900",
                      "& .MuiListItemIcon-root": {
                        color: "#00193c !important",
                      },
                      "&:hover": {
                        backgroundColor: "transparent !important",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "#919eab14",
                      color: "#00193c",
                      "& .MuiListItemIcon-root": {
                        color: "#00193c",
                      },
                    },
                  }}
                  className={
                    location.pathname ===
                    "/" +
                      (text === "Product Categories"
                        ? "categories"
                        : text.toLowerCase())
                      ? classes.active
                      : "null"
                  }
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    onClick={() => navigateToPage(text, index)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "#637381",
                      }}
                    >
                      {renderMenuIconSwitch(index)}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Drawer>

          <div className="mainRouterDiv">
            <Routes>
              <Route
                path={Routers.Home()}
                element={<Navigate to={Routers.Dashboard()} />}
              />

              <Route path={Routers.Dashboard()} element={<Dashboard />} />
              <Route path={Routers.Categories()} element={<Categories />} />
              <Route path={Routers.Attributes()} element={<Attributes />} />
              <Route path={Routers.Orders()} element={<Orders />} />
              <Route path={Routers.Reports()} element={<Reports />} />
              <Route
                path={Routers.Products()}
                element={
                  <Products
                    selectedCategoryId={undefined}
                    stylesData={{ marginTop: "20px !important" }}
                  />
                }
              />
            </Routes>
          </div>
        </ThemeProvider>
      </StyledEngineProvider>
    </Box>
  );
}
