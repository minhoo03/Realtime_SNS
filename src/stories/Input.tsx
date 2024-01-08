import { Input } from "../components/auth-components";

interface InputProps {
  value: string;
  placeholder: string;
  type?: string;
}

export const Inputs = ({
  ...props
}: InputProps) => {
  return (
    <Input {...props} />
  );
};
