#!/bin/sh

rover subgraph introspect http://localhost:4001 | rover subgraph publish DevoxxFr-2022@current --name speakers --routing-url http://localhost:4001 --schema -
