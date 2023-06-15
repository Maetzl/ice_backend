const {
    InvalidTokenError,
    UnauthorizedError,
    InsufficientScopeError,
  } = require("express-oauth2-jwt-bearer");
  
  const errorHandler = (error: { status: any; }, request: any, response: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }, next: any) => {
    if (error instanceof InsufficientScopeError) {
      const message = "Permission denied";
  
      response.status(error.status).json({ message });
  
      return;
    }
  
    if (error instanceof InvalidTokenError) {
      const message = "Bad credentials";
      response.status(error.status).json({ message });
  
      return;
    }
  
    if (error instanceof UnauthorizedError) {
      const message = "Requires authentication";
  
      response.status(error.status).json({ message });
  
      return;
    }
  
    const status = 500;
    const message = "Internal Server Error";
  
    response.status(status).json({ message });
  };
  
  module.exports = {
    errorHandler,
  };