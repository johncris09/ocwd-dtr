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
      let prevDate = null;
      // allPairedLogs.push([{id: id}]);
      Object.keys(logs).forEach((key, index) => {
        const currentDay = logs[key];
        const currentTime = currentDay[0].time;

        if (currentTime.length > 1) {

          // console.info(currentTime)
          pairedLogs[key] = [
            { date: currentDay[0].date - 1 + 1, time: [currentTime[0], currentTime[1]] },
          ];
        } else {


          // Check if the day already has a paired log
          if (allPairedLogs.some(log => log.date === currentDay[0].date)) {
            return; // Skip this day
          }

          if (!loginTime) {
            loginTime = currentTime[0];
          } else {
            pairedLogs[key] = [
              { date: currentDay[0].date - 1, time: [loginTime, currentTime[0]] },
            ];
            loginTime = null;
          }

          if (currentDay[0].time.length > 1) {
            loginTime = currentDay[0].time[1];
          }
        }

      });

      allPairedLogs.push({ id, logs: pairedLogs });
      // allPairedLogs = [,...allPairedLogs, ...Object.values(pairedLogs)];
      // console.info(pairedLogs);
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
