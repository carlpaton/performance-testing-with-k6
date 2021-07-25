# Performance Testing with K6

Forked and based on the work by [Chris James - Performance testing with k6](https://github.com/cajames/performance-testing-with-k6)

- https://k6.io/docs
- https://www.youtube.com/watch?v=Hu1K2ZGJ_K4

## Run Tests

### Simple single container

Parameters

- `-TestName simple-poll` matches to [simple-poll.test.js](./tests/simple-poll.test.js)
- `-StatusPercentage 0.1` here `0.1` means 10% of tests will be status 200 and 90% will be 500. If you want more tests to pass then set this to `0.9` so that 90% will be status 200.

```
.\Run_Tests.ps1 -TestName simple-poll -StatusPercentage 0.1
.\Run_Tests.ps1 -TestName staged-poll -StatusPercentage 0.1
```

### Orchestrate local environment

- `docker-compose up -d influxdb grafana`
- Open http://localhost:3000, and import [grafana_dashboard.json](./docs/grafana_dashboard.json) as config to a new dashboard
- Run `docker-compose run k6 run /tests/simple-poll.test.js`

#### Run in the cloud

- [You will need a LoadImpact account (first 50 tests are free)](https://app.loadimpact.com/account/login)
- Replace `LI_TOKEN` in [Dockerfile.cloud](./Dockerfile.cloud) with your account token
- Update [docker-compose.yml](./docker-compose.yml) for `k6` to build using this dockerfile

```
  k6:
    build:
      context: .
      dockerfile: Dockerfile.cloud
    ports:
      - "6565:6565"
    volumes:
      - "./tests:/tests"
    environment:
      - K6_OUT=influxdb=http://influxdb:8086/k6
      - STATUS_PERCENTAGE=0.9
    command: "version"
```

- `docker-compose run k6 cloud /tests/simple-poll.test.js` to run the test in the cloud