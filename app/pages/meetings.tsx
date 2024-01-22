import MaterialTable, { Column } from "@material-table/core";
import {
  CardContent,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";

const EDITABLE_COLUMNS: Column<Meeting>[] = [
  {
    field: "date",
    title: "Date",
    type: "date",
    defaultSort: "desc",
    // validate: (rowData) =>
    //   (rowData.date || "") instanceof Date && !isNaN(rowData.date || ""),
    validate: (rowData) => {
      return rowData.date != null && rowData.date !== undefined;
    },
  },
  {
    field: "name",
    title: "Meeting Name",
    validate: (rowData) => (rowData.name || "").length > 0,
  },
  {
    field: "hours",
    title: "Hours",
    type: "numeric",
    validate: (rowData) => (rowData.hours || 0) > 0,
  },
];

export default function Dashboard() {
  const [data, setData] = useState<Meeting[]>([]);
  const [openMeetings, setOpenMeetings] = useState<Meeting[]>([])

  const [meetingId, setMeetingId] = useState();
  const [code, setCode] = useState();
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  function handleMeetingIdChange(e: any) {
    const value = e.target.value
    setMeetingId(value)
  }

  function onSubmit() {
    (async function() {
      setMessage("")
      const response = await fetch(`/api/meeting/verifymeeting`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          meeting_id: meetingId,
          code: code
        })
      })
      const r = await response.json();
      setMessage(r.message)
      if (r.ok) {
        setData([...data, r.data]);
      }
    })()
  }

  useEffect(() => {
    (async function () {
      const response = await fetch(`/api/meeting/getusermeetings`, {
        method: "GET",
        credentials: "include",
      });
      const {meetings}= await response.json();
      console.log(meetings);
      setData(meetings);
      setIsLoading(false);
    })();
  }, [message]);

  useEffect(() => {
    (async function () {
      const response = await fetch(`/api/meeting/getopenmeetings`, {
        method: "GET",
        credentials: "include",
      });
      const openmeetings = await response.json();
      console.log(openmeetings);
      setOpenMeetings(openmeetings);
    })();
  }, [message]);

  return (
    <>
      <Header />
      <Container>
        <Box component="main" sx={{ p: 3 }}>
          <MaterialTable
            style={{ marginTop: "1em" }}
            data={data}
            isLoading={isLoading}
            columns={EDITABLE_COLUMNS}
            options={{
              rowStyle: { fontFamily: "Roboto", fontSize: "0.875rem" },
              search: false,
              actionsColumnIndex: -1,
              pageSize: 5,
              pageSizeOptions: [5, 10],
            }}
            title="Meetings Attended"
          />
          <Card style={{maxWidth: 700, marginTop:50}}>
            <CardContent>
              <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                  <FormControl style={{ minWidth: 200 }}>
                    <InputLabel>Meeting Name</InputLabel>
                    <Select value={meetingId} onChange={handleMeetingIdChange}>
                      {openMeetings.map((m) => 
                        <MenuItem value={m.id} key={m.id}>{m.name}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <TextField value={code} onChange={(e: any) => {setCode(e.target.value)}} label="Code" variant="outlined" />
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={onSubmit}>Submit</Button>
                </Grid>
              </Grid>
              {message}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}
