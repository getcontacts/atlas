
export class FPValueError {
  constructor(message) {
    this.message = 'Value error: ' + message;
  }

  toString() {
    return this.message;
  }
}
