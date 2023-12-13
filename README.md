# Foodstore Server with ExpressJs
change directory:
  > cd foodstore-server

install dependencies:
  > npm install / pnpm install

run the app:
  > SET DEBUG=foodstore-server:* & npm start
  
  or
  > SET DEBUG=foodstore-server:* & pnpm start

## .env file
```
SERVICE_NAME=foodstore-service

DB_HOST=[HOST]

DB_PORT=[PORT]

# SESUAIKAN dengan username mongo di mesinmu
DB_USER=[USER_NAME]

# SESUAIKAN dengan password user di mesinmu
DB_PASS=[PASSWORD]

# SESUAIKAN dengan nama database yang sudah kamu buat
DB_NAME=[DATABASE]
```
## History
Finish: Membuat endpoint Login

Belum di uji:
- endpoint product yang mempunyai relasi
- endpoint register dan login

Next: 232 of 602 - Membuat Middleware untuk Menerjemahkan Auth Headers Menjadi User 