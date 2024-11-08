export const extractBearerToken = async (token: string) => {
  return await token.substring(`Bearer `.length);
};
