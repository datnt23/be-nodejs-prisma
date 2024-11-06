import "dotenv/config";

export const env: any = {
  dev: "development",
  pro: "production",
  port: 3001,
};

export const PORT: number = Number(process.env.PORT) || env.port;
export const NODE_ENV: string = process.env.NODE_ENV || env.dev;
