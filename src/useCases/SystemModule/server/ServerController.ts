import { apiCache } from "@providers/constants/cacheConstants";
import { Request, Response } from "express";
import { controller, httpGet, interfaces, request, response } from "inversify-express-utils";
import { HttpStatus } from "types/ServerTypes";

@controller("/")
export class ServerController implements interfaces.Controller {
  @httpGet("/")
  private index(@request() req: Request, @response() res: Response): Response<any> {
    return res.status(HttpStatus.OK).send({
      message: "API is running successfully!",
    });
  }

  @httpGet("cache", apiCache("1 hour"))
  private cachedRoute(@request() req: Request, @response() res: Response): Response<any> {
    return res.status(HttpStatus.OK).send({
      message: "This route is cached",
    });
  }
}
