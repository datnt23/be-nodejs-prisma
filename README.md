# API Back-End Ecommerce NodeJs

- Programming language: Javascript
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

- Open query tool in your database.
- Execute the `CreateTable_vn_units.sql` in the [postgresql directory](postgresql) first in the target database to generate all the table structure.
- Then follow up by executing the `ImportData_vn_units.sql` to import data to these generated tables.
