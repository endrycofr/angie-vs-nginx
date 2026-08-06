import express from "express";
import os from "node:os";

const app = express();
const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Node.js Test Server</title>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #0f172a;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .card {
      width: 100%;
      max-width: 650px;
      background: #1e293b;
      padding: 30px;
      border-radius: 14px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, .35);
    }

    h1 {
      color: #22c55e;
      text-align: center;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    td {
      padding: 10px 8px;
      border-bottom: 1px solid rgba(255,255,255,.08);
      vertical-align: top;
      word-break: break-word;
    }

    td:first-child {
      width: 170px;
      color: #94a3b8;
      font-weight: bold;
    }

    .footer {
      margin-top: 20px;
      text-align: center;
      color: #94a3b8;
      font-size: 14px;
    }
  </style>
</head>
<body>

<div class="card">
  <h1>🚀 Node.js Test Server</h1>

  <table>
    <tr>
      <td>Hostname</td>
      <td>${os.hostname()}</td>
    </tr>

    <tr>
      <td>Node Version</td>
      <td>${process.version}</td>
    </tr>

    <tr>
      <td>Current Time</td>
      <td id="time"></td>
    </tr>

    <tr>
      <td>Client IP</td>
      <td>${req.headers["x-forwarded-for"] || req.socket.remoteAddress}</td>
    </tr>

    <tr>
      <td>User Agent</td>
      <td>${req.headers["user-agent"]}</td>
    </tr>

    <tr>
      <td>Host Header</td>
      <td>${req.headers.host}</td>
    </tr>
  </table>

  <div class="footer">
    Running with Express.js inside Docker 🚀
  </div>
</div>

<script>
  const formatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  function updateTime() {
    document.getElementById("time").textContent =
      formatter.format(new Date());
  }

  updateTime();
  setInterval(updateTime, 1000);
</script>

</body>
</html>
  `);
});
app.listen(port, host, () => {
  console.log(`🚀 Server running on http://${host}:${port}`);
});
