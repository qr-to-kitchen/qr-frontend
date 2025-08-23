export interface VerificationDto {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
  invalidateTokens: boolean;
}
