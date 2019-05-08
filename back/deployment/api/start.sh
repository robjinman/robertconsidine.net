#!/bin/bash

prisma deploy

pm2-runtime src/index.js
