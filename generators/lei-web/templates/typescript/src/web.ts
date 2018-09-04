import * as base from "@leizm/web";
import { v4 as uuid } from "uuid";
import { IPageParams, getLogger, errors, config } from "./global";
import { Service, Model } from "./global/gen/core.gen";
import { IPageResult } from "./models/base";
export * from "@leizm/web";

export type MiddlewareHandle = (ctx: Context, err?: base.ErrorReason) => Promise<void> | void;

export class Application extends base.Application<Context> {
  protected contextConstructor = Context;
  /** 获取日志实例 */
  public getLogger(opt: Record<string, any>) {
    return getLogger("app", opt);
  }
  /** 服务 */
  public service = new Service(this);
  /** 模型 */
  public model = new Model(this);
}

export class Router extends base.Router<Context> {
  protected contextConstructor = Context;
}

export class Context extends base.Context<Request, Response> {
  protected requestConstructor = Request;
  protected responseConstructor = Response;

  /** 请求ID */
  public $reqId = "";
  /** 错误信息 */
  public errors = errors;
  /** 服务 */
  public service = new Service(this);
  /** 模型 */
  public model = new Model(this);
  /** 获取日志实例 */
  public getLogger(opt: Record<string, any>) {
    return getLogger(this.request.path, Object.assign({ reqId: this.$reqId }, opt));
  }
  /** 日志 */
  public get log() {
    return getLogger(this.request.path, { reqId: this.$reqId });
  }

  public inited() {
    this.$reqId = String(this.request.getHeader("X-Request-Id") || uuid());
    this.response.setHeader("X-Request-Id", this.$reqId);
  }
}

// 扩展 Request
export class Request extends base.Request {
  /** 参数 */
  public $params: Record<string, any> = {};
  /** 分页参数 */
  private pages?: IPageParams;
  /** excel parse */
  public $sheet: any[] = [];
  /** IP地址 */
  public get $ip() {
    const ip = String(
      this.req.headers["x-real-ip"] || this.req.headers["x-forwarded-for"] || this.req.socket.remoteAddress
    ).match(/\d+\.\d+\.\d+\.\d+/);
    return (ip && ip[0]) || "";
  }
  /** 分页参数 */
  public get $pages() {
    if (this.pages) return this.pages;
    const param = this.query || {};
    const page = (param.page && Number(param.page)) || 1;
    const pageCount = (param.page_count && Number(param.page_count)) || 30;
    const limit = param.limit || pageCount;
    const offset = param.offset || (page - 1) * pageCount;
    const order = param.order;
    const asc = param.asc;
    this.pages = { page, limit, offset, order, asc };
    return this.pages;
  }
}

// 扩展 Response
export class Response extends base.Response {
  /** 返回成功 */
  public ok(data: any) {
    this.json({ ok: true, result: data !== undefined ? data : {} });
  }
  /** 返回 操作成功 操作失败 */
  public isOk(ok: boolean | number) {
    this.ok(ok ? config.message.success : config.message.error);
  }
  /**
   * 出错返回
   * @param err 错误
   * @param code 错误码
   */
  public err(err: any, code?: number) {
    this.json({
      ok: false,
      error_code: code || err.code || -1,
      message: err.message || err.toString(),
      msg: err.msg || err.message || err.toString(),
    });
  }
  /** 返回成功分页数据 */
  public page(data: IPageResult<any>) {
    this.ok({
      page_data: {
        page: (this.ctx.request as Request).$pages.page,
        page_count: (this.ctx.request as Request).$pages.limit,
        count: data.count || 0,
      },
      list: data.list || [],
    });
  }
  /**
   * 返回文件下载
   * @param filename 文件名
   * @param filetype 文件类型（后缀）
   * @param buffer 文件内容
   */
  public files(filename: string, filetype: string, buffer: Buffer) {
    this.type(filetype);
    this.setHeader("Content-Description", "File Transfer");
    this.setHeader("Content-Disposition", `attachment; filename=${filename}.${filetype}`);
    this.setHeader("Content-Length", String(buffer.length));
    this.end(buffer);
  }
}
