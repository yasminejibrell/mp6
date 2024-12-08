import { Button } from "@mui/material";

interface SignOutButtonProps {
  handleSignOut: () => void;
  disabled?: boolean;
}

export default function SignOutButton({ handleSignOut, disabled }: SignOutButtonProps): JSX.Element {
  const signOut = async (): Promise<void> => {
    await fetch("/api/auth/logout");
    handleSignOut();
  };

  return (
    <Button
      color="inherit"
      onClick={signOut}
      disabled={disabled}
    >
      Sign Out
    </Button>
  );
}
