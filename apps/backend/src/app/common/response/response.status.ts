export class ResponseStatus {
  private readonly code: number;
  private readonly systemMessage: string;
  private readonly displayMessage: string | string[];
  constructor(
    _code: number,
    _systemMessageLstring,
    _displayMessage: string | string[]
  ) {
    this.code = _code;
    this.systemMessage = _systemMessageLstring;
    this.displayMessage = _displayMessage;
  }

  get getCode(): number {
    return this.code;
  }

  get getSystemMessage(): string {
    return this.systemMessage;
  }
  get getDisplayMessage(): string | string[] {
    return this.displayMessage;
  }
}
