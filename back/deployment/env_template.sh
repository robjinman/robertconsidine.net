# Copy and rename to env_dev.sh and/or env_prod.sh. Set values accordingly and
# use by running `source /path/to/file`

# Used by docker-compose for prisma service
export DATABASE_HOST=localhost
export DATABASE_PASSWORD=password

# Used by prisma deploy
export PRISMA_ENDPOINT=http://localhost:4466
export PRISMA_MANAGEMENT_API_SECRET=XXXXXXXX
export PRISMA_SECRET=XXXXXXXX

# Used by back-end app
export APP_SECRET=XXXXXXXX
export RECAPTCHA_SECRET_KEY=XXXXXXXX
export EMAIL_PASSWORD=XXXXXXXX
