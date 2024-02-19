import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.css";
import React, { useCallback, useState } from "react";
const App = () => {
  const [records, setRecords] = useState([]);
  const [newRecords, setNewRecords] = useState([]);
  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Specify the sheet name you want to read
      const sheetName = "Attend. Logs";
      const worksheet = workbook.Sheets[sheetName];

      // Convert the selected sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Implement adjustment algorithm
      const adjustedData = adjustTimes(jsonData); // Implement this function

      setRecords(adjustedData);
    };

    reader.readAsArrayBuffer(file);
  };
  // This function adjusts the time logged for each employee
  const adjustTimes = (data) => {
    let empLog = [];
    data.forEach((log, index) => {
      const row = log;
      if (row.includes("Name :")) {
        const employeeId = row[row.indexOf("ID :") + 2];
        const employeeName = row[row.indexOf("Name :") + 2];
        const employeeDept = row[row.indexOf("Dept. :") + 2];

        empLog.push({ employeeId, employeeName, employeeDept, logs: {} });

        const logsIndex = index;
        if (logsIndex < data.length) {
          const logs = data[logsIndex];
          const datesIndex = index + 5;
          const timesIndex = index + 1;
          // console.info(logs, datesIndex -2, timesIndex-2);
          // Check if logs exist for the employee
          if (logs && datesIndex < data.length && timesIndex < data.length) {
            const dates = data[datesIndex];
            const times = data[timesIndex];

            // Loop through the dates and times to populate the logs
            for (let j = 0; j < dates.length; j++) {
              const date = dates[j];
              const time = times[j];
              if (date !== undefined && time !== undefined) {
                // Split the time into logged in and logged out times
                const loggedTime = time.trim().split("\n");

                // Add the loggedTime to the existing logs for the employee
                const empIndex = empLog.length - 1;
                const logsCount = Object.keys(empLog[empIndex].logs).length;
                empLog[empIndex].logs[logsCount] = { date, loggedTime };
              }
            }
          }
        }
      }
    });
 

    return empLog;
  };
 
  return (
    <div>
      <hr />
      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
      <hr />
      {/* {JSON.stringify(records)} */}
      <div className="row">
        <div className="col">
          {records.map((log, index) => (
            <div key={index}>
              {/* <ul> */}
              {Object.values(log.logs).length > 0 && (
                <>
                  <h6>Employee ID: {log.employeeId}</h6>
                  <table className="table">
                    <thead>
                      <tr>
                        <td>Date</td>
                        <td>Logged Time</td>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(log.logs).map((row, index) => (
                        <tr key={index}>
                          <td>{row.date}</td>
                          <td>
                            <table className="table table-bordered my-auto">
                              <tbody>
                                <tr>
                                  {row.loggedTime.map((item, index) => (
                                    <td key={index}>{item} </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="col">
          {newRecords.map((log, index) => (
            <div key={index}>
              {/* <ul> */}
              {Object.values(log.logs).length > 0 && (
                <>
                  <h6>Employee ID: {log.employeeId}</h6>
                  <table className="table">
                    <thead>
                      <tr>
                        <td>Date</td>
                        <td>Logged Time</td>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(log.logs).map((row, index) => (
                        <tr key={index}>
                          <td>{row.date}</td>
                          <td>
                            <table className="table table-bordered my-auto">
                              <tbody>
                                <tr>
                                  {row.loggedTime.map((item, index) => (
                                    <td key={index}>{item} </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default App;
