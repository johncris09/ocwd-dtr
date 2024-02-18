import React from "react";
import data from './data'
import './custom.css'


class EmployeeLogs extends React.Component {
  pairLogs = () => {
    let allPairedLogs = [];

    data.forEach((row, index) => {
      const { id, logs } = row;
      let pairedLogs = {};
      let loginTime = null;
      let currentDate = null;

      Object.keys(logs).forEach((key, index) => {
        const currentDay = logs[key];
        const currentTime = currentDay[0].time;

        if (currentTime.length > 1) {
          pairedLogs[key] = [
            { date: currentDay[0].date, time: [currentTime[0], currentTime[1]] },
          ];
        } else {
          if (!loginTime) {
            loginTime = currentTime[0];
            currentDate = currentDay[0].date;
          } else {
            pairedLogs[key] = [
              { date: currentDate, time: [loginTime, currentTime[0]] },
            ];
            loginTime = null;
          }
        }
      });

      allPairedLogs.push({ id, logs: pairedLogs });
    });

    return allPairedLogs;
};


  render() {
    const pairedLogs = this.pairLogs();

    return (
      <div>
        {/* <h1>Employee Logs</h1> */}
        {/* {JSON.stringify(pairedLogs )} */}

        {pairedLogs.map((log, index) => (
          <div key={index}>
            <h2>Employee ID: {log.id}</h2>
            {/* {JSON.stringify(log)} */}
            {/* <ul> */}
            <table  >
              <thead>
                <tr>
                  <td>Date</td>

                  <td>In</td>
                  <td>Out</td>
                </tr>
              </thead>
              <tbody>
                {Object.values(log.logs).map((row, index) =>
                (
                  <tr key={index}>
                    <td>{row[0].date}</td>
                    <td>{row[0].time[0]}</td>
                    <td>{row[0].time[1]}</td>
                  </tr>
                )
                )}
              </tbody>
            </table>

          </div>
        ))}
      </div>
    );
  }

}

export default EmployeeLogs;
