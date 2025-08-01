#!/bin/bash

# Clean up ports
lsof -ti:3000 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Wait for ports to be fully released
sleep 2