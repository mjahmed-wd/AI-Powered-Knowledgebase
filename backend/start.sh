#!/bin/bash

echo "Starting backend application..."

echo "Waiting for database to be ready..."
dockerize -wait tcp://db:5432 -timeout 60s

echo "Generating Prisma client..."
npx prisma generate

echo "Deploying database migrations..."
npx prisma migrate deploy

echo "Starting the application..."
npm start
