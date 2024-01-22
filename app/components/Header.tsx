import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Tooltip } from "@material-ui/core";
import { useTheme } from "../lib/theme.context";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Divider from "@mui/material/Divider";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function MenuAppBar() {
  const [accountAnchorEl, setAccountAnchorEl] = React.useState(null);
  const [navAnchorEl, setNavAnchorEl] = React.useState(null);

  const {push} = useRouter();

  const { data: session} = useSession();

  const { theme, toggleTheme } = useTheme();

  const handleAccountMenu = (event: any) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAccountAnchorEl(null);
  };

  const handleNavMenu = (event: any) => {
    setNavAnchorEl(event.currentTarget);
  };

  const handleNavClose = () => {
    setNavAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={auth}
              onChange={handleChange}
              aria-label="login switch"
            />
          }
          label={auth ? "Logout" : "Login"}
        />
      </FormGroup> */}
      <AppBar position="static">
        <Toolbar>
          <Tooltip title="Menu">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleNavMenu}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={navAnchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(navAnchorEl)}
            onClose={handleNavClose}
          >
            <MenuItem
              onClick={() => {
                push("/dashboard");
              }}
            >
              Dashboard
            </MenuItem>
            <MenuItem
              onClick={() => {
                push("/meetings");
              }}
            >
              Meetings
            </MenuItem>
            {session?.user?.role?.includes("ADMIN") && (
              <MenuItem
                onClick={() => {
                  push("/admin");
                }}
              >
                Admin
              </MenuItem>
            )}
            {session?.user?.role == "SITEADMIN" && (
              <MenuItem
                onClick={() => {
                  push("/siteadmin");
                }}
              >
                Site Admin
              </MenuItem>
            )}
          </Menu>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FRC 7419 Attendance
          </Typography>
          <div>
            <Tooltip title="Account">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleAccountMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={accountAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(accountAnchorEl)}
              onClose={handleAccountClose}
            >
              <Box sx={{ px: 2, pb: 2, pt: 1 }}>
                <Typography>{session?.user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {session?.user?.email}
                </Typography>
              </Box>
              <Divider />
              <Box component="li" sx={{ px: 2, pt: 1 }}>
                {theme} mode
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={toggleTheme}
                  color="inherit"
                >
                  {theme === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Box>
              <MenuItem
                onClick={() => {
                  signOut();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
