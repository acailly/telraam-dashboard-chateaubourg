// Telraam API site: https://documenter.getpostman.com/view/8210376/TWDRqyaV#3bb3c6bd-ea23-4329-b885-0d142403ecbb

console.log("DEBUG", "fetchData", "start");

window.addEventListener("load", fetchData);

function fetchData() {
  console.log("DEBUG", "fetchData", "function start");

  const debugElement = document.getElementById("debug");
  const chartElement = document.getElementById("chart");

  // debugElement.innerText = "loading";
  chartElement.innerText = "loading";

  const headers = new Headers();
  headers.append("X-Api-Key", telraamConfig.key);
  headers.append("Content-Type", "application/json");

  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 001);

  const endDate = new Date();
  endDate.setUTCHours(23, 59, 59, 999);

  const body = {
    level: "segments",
    format: "per-hour",
    id: "9000002453",
    time_start: startDate,
    time_end: endDate,
  };

  const rawBody = JSON.stringify(body);

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: rawBody,
    redirect: "follow",
  };

  const apiEndpoint = "https://telraam-api.net/v1/reports/traffic";
  // const apiEndpoint = "https://telraam.net/api/segments/traffic/";

  const corsProxyURL = "https://acailly-cors-anywhere.herokuapp.com/";

  const proxyfiedApiEndpoint = `${corsProxyURL}${apiEndpoint}`;

  fetch(proxyfiedApiEndpoint, requestOptions)
    .then((response) => response.json())
    .then((results) => {
      console.log(results);
      // debugElement.innerText = JSON.stringify(results, null, 2);
      debugElement.innerText = "";
      showResults(results);
    })
    .catch((error) => {
      console.log("error", error);
      debugElement.innerText = "error" + error;
    });
}

function showResults(results) {
  const chartElement = document.getElementById("chart");

  const hourlyReports = results.report;

  chartElement.innerHTML = `
  <table id="chart-table" class="charts-css column show-labels">
    <caption> Nombre de voitures / heure </caption> 
    <tbody>
      ${hourlyReports
        .map((hourlyReport) => {
          const vehiculeCount =
            Math.round(hourlyReport.car) + Math.round(hourlyReport.heavy);
          const dataLabel = vehiculeCount ? vehiculeCount : "";
          const columnLabel = new Date(hourlyReport.date).getHours();
          return `
          <tr>
            <th scope="row"> ${columnLabel} </th>
            <td style="--size: calc( ${vehiculeCount} / 1000 )">
              <span class="data"> ${dataLabel} </span>
            </td>
          </tr>
        `;
        })
        .join("")}
    </tbody>
  </table>`;
}
