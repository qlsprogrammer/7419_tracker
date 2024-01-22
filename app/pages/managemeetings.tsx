import MaterialTable, { Column } from "@material-table/core";
import {
  CardContent,
  Checkbox,
  LinearProgress,
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

const validateEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};
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
  {
    field: 'code',
    title: "Code",
    validate: (rowData) => (rowData.code || "").length > 0,
  }
];

export default function Dashboard() {
  const [data, setData] = useState<Meeting[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const response = await fetch(`/api/meeting/getallmeetings`, {
        method: "GET",
        credentials: "include",
      });
      const hours = await response.json();
      console.log(hours);
      setData(hours);
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Box component="main" sx={{ p: 3 }}>
          <MaterialTable
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
            title="Meetings"
            editable={{
              onRowAddCancelled: (rowData) =>
                console.log("Row adding cancelled"),
              onRowUpdateCancelled: (rowData) =>
                console.log("Row editing cancelled"),
              onRowAdd: (newData) => {
                return new Promise<void>((resolve, reject) => {
                  fetch(`/api/meeting/create`, {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify(newData),
                    headers: {
                      "content-type": "application/json",
                    },
                  })
                    .then((response) => response.json())
                    .then((newHour) => {
                      console.log(newHour);
                      setData([...data, newHour]);
                      resolve();
                    })
                    .catch((error) => {
                      reject();
                    });
                });
              },
              onRowDelete: (oldData) => {
                return new Promise<void>((resolve, reject) => {
                  fetch(`/api/meeting/${oldData.id}`, {
                    method: "DELETE",
                    credentials: "include",
                  })
                    .then((response) => {
                      if (response.ok)
                        setData((prevData) =>
                          prevData.filter((el) => el.id != oldData.id)
                        );
                      resolve();
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                });
              },
              onRowUpdate: (newData: Meeting, oldData: any) => {
                return new Promise<void>((resolve, reject) => {
                  fetch(`/api/admin/${oldData.id}`, {
                    method: "PUT",
                    credentials: "include",
                    body: JSON.stringify(newData),
                    headers: {
                      "content-type": "application/json",
                    },
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(data);
                      setData(data);
                      resolve();
                    })
                    .catch((error) => {
                      reject();
                    });
                });
              },
            }}
          />
        </Box>
      </Container>
    </>
  );
}
