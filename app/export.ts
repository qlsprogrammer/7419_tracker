import prisma from "./lib/prisma";

// get dot vars
require("dotenv").config();

const startDate = new Date("2024-01-06");

async function main() {
  const users = await prisma.user.findMany({
    include: {
      hours: true,
    },
  });
     for (const user of users) {
       const firstrow = user.name
       let hours = ""
       for (const hour of user.hours) {
           const e = [hour.date, hour.name, hour.description, hour.hours, hour.supervisor_name, hour.approved]
           hours += e.join("|") + "\r\n";
       }
       console.log(firstrow)
       if (user.hours.length == 0) console.log("None")
       console.log(hours)
     }
  //for (const user of users) {
  //  const hours = user.hours
  //      .filter((hour) => hour.approved)
  //      .filter((hour) => hour.date >= startDate)
  //      .reduce((a, b) => +a + +b.hours, 0);
  //  console.log(user.name + "," + hours);
  //}
}

main();
