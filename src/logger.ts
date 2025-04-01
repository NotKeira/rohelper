const colours: { [key: string]: string } = {
  ReadyEvent: "\x1b[34m",
  Event: "\x1b[33m",
  Command: "\x1b[32m",
  Default: "\x1b[0m",
  Error: "\x1b[31m",
  Warn: "\x1b[35m",
  System: "\x1b[36m",
};

const originalConsole = { ...console };

function colourise(message: string): string {
  if (typeof message !== "string") {
    return message;
  }
  for (const [key, colour] of Object.entries(colours)) {
    if (message.includes(`[${key}]`)) {
      const startIndex: number = message.indexOf(`[${key}]`);
      const endIndex: number = startIndex + `[${key}]`.length;
      return `${colour}${message.slice(startIndex, endIndex)}${
        colours.Default
      }${message.slice(endIndex)}`;
    }
  }
  return message;
}

console.log = (...args: any[]): void =>
  originalConsole.log(...args.map((arg) => colourise(arg)));
console.warn = (...args: any[]): void =>
  originalConsole.warn(
    ...args.map((arg) => `${colours.Warn}[Warning]${colours.Default} ${arg}`)
  );
console.error = (...args: any[]): void =>
  originalConsole.error(
    ...args.map((arg) => `${colours.Error}[Error]${colours.Default} ${arg}\n`)
  );
console.info = (...args: any[]): void =>
  originalConsole.info(...args.map((arg) => colourise(arg)));
console.debug = (...args: any[]): void =>
  originalConsole.debug(...args.map((arg) => colourise(arg)));
