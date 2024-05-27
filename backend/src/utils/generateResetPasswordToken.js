import jwt from "jsonwebtoken";
export const generateResetPasswordToken = () => {
  return jwt.sign({}, process.env.PASSWORD_RESET_SECRET, {
    expiresIn: process.env.PASSWORD_RESET_SECRET_EXPIRY,
  });
};
export default generateResetPasswordToken;
