// class ApiError extends Error {
//     constructor(message, status ) {
//         super(message);
//         this.status = status;
//     }
//     static badRequest(message){
//         return new ApiError(message, 404);
//     }
//     static internal(message){
//         return new ApiError(message, 500);
//     }
//     static forbidden(message){
//         return new ApiError(message, 403);
//     }
// }
// module.exports = ApiError;

class ApiError extends Error {
    constructor(status, message) {
      super(message);
      this.status = status;
    }
  
    static badRequest(message) {
      return new ApiError(400, message);
    }
  
    static unauthorized(message) {
      return new ApiError(401, message);
    }
  
    static forbidden(message) {
      return new ApiError(403, message);
    }
  
    static notFound(message) {
      return new ApiError(404, message);
    }
  
    static internal(message) {
      return new ApiError(500, message);
    }
  }
  
  module.exports = ApiError;
  
