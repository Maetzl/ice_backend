
const notFoundHandler = (request: any, response: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }, next: any) => {
    const message = "Not Found";
  
    response.status(404).json({ message });
  };
  
  module.exports = {
    notFoundHandler,
  };