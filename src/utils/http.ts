export class HTTP {
  public uuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  public urlEncode(data: string): string {
    return encodeURIComponent(data);
  }

  public jsonEncode(data: any): string {
    return JSON.stringify(data);
  }

  public urlDecode(data: string): string {
    return decodeURIComponent(data);
  }

  public jsonDecode(data: string): any {
    return JSON.parse(data);
  }
}
