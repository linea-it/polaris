# DES Portal Monitor

This tool has the purpose of monitoring executions of pipelines in the DES portal, as well as providing the history of executions and consumption information by process. This interface is part of a set of micro services of the DES portal, and is required to use centaurus API for data rescue.

---

## Installation

**1. Clone the repository and create .env**

```shell
git clone https://github.com/linea-it/polaris.git
cd polaris
cp .env.template .env
```

**2. Configuring the Centaurus API**

Modify `REACT_APP_API_URL key` in `.env` to a valid Centaurus API url <a href="https://github.com/linea-it/centaurus.git" target="_blank">(see Centaurus API).</a>

**3. Running** 

- If you're going to run in a development environment, use:
```shell
yarn install
yarn start
```
> Running at URL: http://localhost:3000

- Or by docker using docker-compose:
> Modify `REACT_APP_API_URL` key in `docker-compose.yml` to a valid Centaurus API url <a href="https://github.com/linea-it/centaurus.git" target="_blank">(see Centaurus API).</a>
```shell
cp docker-compose.yml.template docker-compose.yml
docker-compose up
```
> Running at URL: http://localhost/monitor

---

## Release History

* v1.0.0
   * INIT: First version
* v1.0.1
   * Table sorting disabled (only some columns)
   * Updates on README.rd

