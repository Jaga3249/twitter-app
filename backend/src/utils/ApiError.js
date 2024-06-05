export class ApiError extends Error {
  constructor(status, message = "something went wrong", statusCode) {
    super(message);
    this.status = status;
    this.message = message;
    this.sucess = false;
    this.data = null;
    this.statusCode = statusCode;
  }
}
