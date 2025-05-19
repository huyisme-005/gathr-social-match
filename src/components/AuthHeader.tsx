
/**
 * AuthHeader Component
 * 
 * This component displays the header used across authentication pages (login, register, personality test).
 * It contains the Gathr logo centered in the header.
 */
import GathrLogo from "./GathrLogo";

const AuthHeader = () => {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-center px-4">
        <GathrLogo />
      </div>
    </header>
  );
};

export default AuthHeader;
