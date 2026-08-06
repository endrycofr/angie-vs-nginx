import http from 'k6/http';
import { sleep, check } from 'k6';
import { Trend, Counter } from 'k6/metrics';

// Custom metrics tracking
const customLatencyTrend = new Trend('waiting_time_trend');
const totalErrorsCounter = new Counter('error_counter');

export const options = {
  // 1. Abaikan verifikasi SSL untuk SSL lokal (mkcert/localhost)
  insecureSkipTLSVerify: true,

  // 2. Ramping Configuration (Load Curve)
  stages: [
    { duration: '30s', target: 20 },  // Ramp up dari 1 ke 20 VUs dalam 30 detik
    { duration: '1m', target: 20 },   // Stress phase: pertahankan 20 VUs selama 1 menit
    { duration: '30s', target: 0 },   // Ramp down ke 0 VUs dalam 30 detik
  ],

  // 3. Performance Gates (SLAs)
  thresholds: {
    // 95% dari seluruh request harus di bawah 500ms
    http_req_duration: ['p(95)<500'],
    // 99% request sukses (200) harus di bawah 1000ms
    'http_req_duration{status:200}': ['p(99)<1000'],
    // Error rate total harus di bawah 1%
    http_req_failed: ['rate<0.01'],
  },
};

// Targetkan ke server Angie/NGINX lokal Anda
const BASE_URL = 'https://localhost';

export default function () {
  const url = `${BASE_URL}/`;
  const payload = JSON.stringify({
    message: 'Performance testing with k6',
    timestamp: new Date().toISOString(),
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'X-Target-Source': 'k6-load-suite',
    },
  };

  // Eksekusi POST request ke Angie/NGINX
  const response = http.post(url, payload, params);

  // Validation Checks
  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    // k6 standar akan menegosiasikan HTTP/2.0 via TLS ALPN
    'protocol is HTTP/2': (r) => r.proto === 'HTTP/2.0',
  });

  // Custom metrics logic
  if (!success) {
    totalErrorsCounter.add(1);
  } else {
    // Catat Time-To-First-Byte (waiting time) dari response
    customLatencyTrend.add(response.timings.waiting);
  }

  // Pacing untuk mensimulasikan jeda interaksi user
  sleep(Math.random() * 1 + 1);
}
