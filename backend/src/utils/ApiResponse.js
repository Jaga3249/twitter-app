export class ApiResponse {
  constructor(status, message, statusCode, data) {
    this.status = status;
    this.message = message;
    this.success = statusCode < 400;
    this.statusCode = statusCode;

    this.data = data;
  }
}
