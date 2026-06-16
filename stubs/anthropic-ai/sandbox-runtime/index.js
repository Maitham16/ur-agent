export class SandboxViolationStore {
  constructor() {}
  getViolations() { return []; }
  clear() {}
}

export class SandboxManager {
  constructor() {}
  start() { return Promise.resolve(); }
  stop() { return Promise.resolve(); }
  static isSupportedPlatform() { return false; }
  static initialize() { return Promise.resolve(); }
  static reset() {}
  static updateConfig() {}
  static checkDependencies() { return Promise.resolve([]); }
  static waitForNetworkInitialization() { return Promise.resolve(); }
  static wrapWithSandbox(command) { return command; }
  static cleanupAfterCommand() {}
  static annotateStderrWithSandboxFailures(_command, stderr) { return stderr; }
  static getFsReadConfig() { return undefined; }
  static getFsWriteConfig() { return undefined; }
  static getNetworkRestrictionConfig() { return undefined; }
  static getIgnoreViolations() { return []; }
  static getAllowUnixSockets() { return false; }
  static getAllowLocalBinding() { return false; }
  static getEnableWeakerNestedSandbox() { return false; }
  static getProxyPort() { return undefined; }
  static getSocksProxyPort() { return undefined; }
  static getLinuxHttpSocketPath() { return undefined; }
  static getLinuxSocksSocketPath() { return undefined; }
  static getSandboxViolationStore() { return new SandboxViolationStore(); }
}

export const SandboxRuntimeConfigSchema = {};
