# API Back-End Ecommerce NodeJs

- Programming language: Typescript
- Database: Postgresql
- ORM: Prisma
- Server: NodeJs, ExpressJS

```
*
* npm install
* npx prisma migrate dev --name initial
* npm start
*
```

### Open Database Postgres

- Step 1: Open query tool in your database.
- Step 2: Execute the `CreateTable_vn_units.sql` in the [postgresql directory](postgresql) first in the target database to generate all the table structure.
- Step 3: Then follow up by executing the `ImportData_vn_units.sql` to import data to these generated tables.

- If run this command: npx prisma migrate dev --name initial
  => So just do step 1 and 3.
