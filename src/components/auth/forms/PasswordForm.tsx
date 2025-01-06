import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFormProps {
  password: string;
  setPassword: (value: string) => void;
}

export function PasswordForm({ password, setPassword }: PasswordFormProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="signupPassword">Password</Label>
      <Input
        id="signupPassword"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
    </div>
  );
}