
/**
 * AuthHeader Component
 * 
 * This component displays the header used across authentication pages (login, register, personality test).
 * It contains the Gathr logo centered in the header and a tagline to reinforce the brand message.
 */
import GathrLogo from "./GathrLogo";

const AuthHeader = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex flex-col items-center justify-center py-4">
        <GathrLogo />
        <p className="text-sm text-muted-foreground mt-1">Connect through shared experiences</p>
      </div>
    </header>
  );
};

export default AuthHeader;
