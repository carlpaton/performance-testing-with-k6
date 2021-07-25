import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Gauge, Rate, Trend  } from "k6/metrics";

let ErrorCount = new Counter("foo_error_count");
let ErrorGauge = new Gauge("foo_gauge");
let ErrorRate = new Rate("foo_error_rate");
let ErrorTrend = new Trend("foo_trend");

let statusPercentage = __ENV.STATUS_PERCENTAGE;
let counter = 0;

export let options = {
  stages: [
    { duration: "15s", target: 50 },
    { duration: "30s", target: 50 },
    { duration: "15s", target: 0 }
  ],
  thresholds: {
    foo_error_count: ["count<10"],
    foo_error_rate: ["rate<0.1"],
    http_req_duration: ['p(99)<1100']
  }
};

export function setup() {
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
  console.log("STATUS_PERCENTAGE=" + statusPercentage);
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
}

export default function() {
  const status = Math.random() < statusPercentage ? "200" : "500";

  let response = http.get(`http://httpbin.org/status/${status}`);
  let success = check(response, {
    "status is 200": r => r.status === 200
  });
  counter++;

  if (!success) {
    ErrorCount.add(1);
    ErrorRate.add(true);
  } else {
    ErrorRate.add(false);
  }
  ErrorTrend.add(status);
  ErrorGauge.add(counter);

  sleep(0.5);
}
