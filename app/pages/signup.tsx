import { Grid, Typography } from "@material-ui/core";
import { useTheme } from "@/lib/theme.context";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Mail from "@mui/icons-material/Mail"
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";

export default function Signup() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();

  const { status } = useSession();

  useEffect(() => {
    if (status == "authenticated") push("/dashboard");
  }, [status]);

  const handleClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (prop: any) => (event: any) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setOpen(false);
    setLoading(true);
    setError("");
    fetch(`/api/auth/signup`, {
      method: "POST",
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
      headers: {
        "content-type": "application/json",
      },
    }).then((resp) => {
      resp.json().then((data) => {
        if (!resp.ok) {
          setError(data.message);
          setOpen(true);
        }
        else {
          push("/login")
        }
      });
      setLoading(false);
    });
  };

  return (
    <div>
      {status !== "loading" ? (
        <Grid style={{ marginTop: "3em" }}>
          <Grid
            item
            container
            xs={12}
            sm={6}
            md={4}
            style={{ margin: "auto" }}
            spacing={2}
            direction="column"
          >
            <Typography variant="h5">FRC 7419 Attendance</Typography>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", alignItems: "flex-end", width: 1 }}>
                <AccountCircle
                  sx={{ color: "action.active", mr: 1, my: 0.5 }}
                />
                <TextField
                  id="name"
                  label="Name"
                  value={values.name}
                  onChange={handleChange("name")}
                  variant="standard"
                  fullWidth
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-end", width: 1 }}>
                <Mail
                  sx={{ color: "action.active", mr: 1, my: 0.5 }}
                />
                <TextField
                  id="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange("email")}
                  variant="standard"
                  fullWidth
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <VpnKeyIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={handleChange("password")}
                  variant="standard"
                  fullWidth
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 5, px: "32px", py: "10px" }}
              >
                Sign Up
              </Button>
            </form>
          </Grid>
          {error && (
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert
                // onClose={handleClose}
                severity="error"
                elevation={6}
                variant="filled"
              >
                {error}
              </Alert>
            </Snackbar>
          )}
        </Grid>
      ) : (
        ""
      )}
    </div>
  );
}
