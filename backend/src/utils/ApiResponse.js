export class ApiResponse {
  constructor(status, message, statusCode, data) {
    this.status = status;
    this.message = message;
    this.sucess = statusCode < 400;
    this.statusCode = statusCode;

    this.data = data;
  }
}
