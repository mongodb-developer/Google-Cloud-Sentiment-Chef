#!/bin/bash

query="Everything was great. | Oh what a lovely restaurant. | This was great. | I'm coming back."

invoke_url=***REMOVED***_summary

curl -X POST -H "Content-Type: application/json" -d "{\"query\":\"$query\"}" "$invoke_url"

echo ""
