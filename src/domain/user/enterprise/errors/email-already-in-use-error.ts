export class UserEmailAlreadyInUseError extends Error {
  constructor() {
    super("Email already in use.");
  }
}
