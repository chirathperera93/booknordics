import log from "loglevel";

/**
 * Class for accessing application configuration information
 */
export default class AppConfiguration {
  /** Base URL for the Commerce API.  May contain an origin, or the app origin will be used. */
  public static get CommerceApiBase(): string {
    return process.env.REACT_APP_COMMERCE_API_BASE
      ? process.env.REACT_APP_COMMERCE_API_BASE
      : window.location.origin;
  }

  /** Base URL of the identity service.  May contain an origin, or the app origin will be used. */
  public static get IdentityApiBase(): string {
    return process.env.REACT_APP_IDENTITY_API_BASE
      ? process.env.REACT_APP_IDENTITY_API_BASE
      : window.location.origin;
  }

  /** Base URL of this application.  It should not contain the origin, i.e., it should be "/app" not "https://hostname:port/app". */
  public static get AppBase(): string {
    return process.env.REACT_APP_BASE ? process.env.REACT_APP_BASE : "";
  }

  public static get ApiBaseURL(): string {
    return "https://aks.nordicadventuregroup.com";
  }

  public static get ApiOrderURL(): string {
    return "https://aks.nordicadventuregroup.com";
  }

  public static LogLevel(): log.LogLevelNumbers {
    const level: string | undefined = process.env.REACT_APP_LOGLEVEL;
    if (!level) {
      return log.levels.WARN;
    }

    if (
      level.toLowerCase() === "error" ||
      parseInt(level) === log.levels.ERROR
    ) {
      return log.levels.ERROR;
    }
    if (level.toLowerCase() === "warn" || parseInt(level) === log.levels.WARN) {
      return log.levels.WARN;
    }
    if (level.toLowerCase() === "info" || parseInt(level) === log.levels.INFO) {
      return log.levels.INFO;
    }
    if (
      level.toLowerCase() === "debug" ||
      parseInt(level) === log.levels.DEBUG
    ) {
      return log.levels.DEBUG;
    }
    if (
      level.toLowerCase() === "trace" ||
      parseInt(level) === log.levels.TRACE
    ) {
      return log.levels.TRACE;
    }
    if (
      level.toLowerCase() === "silent" ||
      parseInt(level) === log.levels.SILENT
    ) {
      return log.levels.SILENT;
    }

    return log.levels.WARN;
  }
}
