#!/bin/bash

query="This was an amazing evening. Food, service, interior great."

invoke_url=***REMOVED***

curl -X POST -H "Content-Type: application/json" -d "{\"query\":\"$query\"}" "$invoke_url"

echo ""
