import "dotenv/config";

export const env: any = {
  dev: "development",
  pro: "production",
  port: 3001,
};

export const PORT: number = Number(process.env.PORT) || env.port;
export const NODE_ENV: string = process.env.NODE_ENV || env.dev;
export const EMAIL_ADMIN: string = process.env.EMAIL_ADMIN || "admin@gmail.com";
export const PASSWORD_ADMIN: string = process.env.PASSWORD_ADMIN || "password";
export const FIRSTNAME_ADMIN: string = process.env.FIRSTNAME_ADMIN || "Super";
export const LASTNAME_ADMIN: string = process.env.LASTNAME_ADMIN || "Admin";
export const FULLNAME_ADMIN: string =
  process.env.FULLNAME_ADMIN || "Super Admin";
