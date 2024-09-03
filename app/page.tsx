import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main
      className="flex h-full flex-col items-center justify-center bg-radialgradient"
    >
      <div className="space-y-6 text-center">
        <h1 className=" text-6xl font-semibold text-white drop-shadow-md">
          {" "}
          Auth
        </h1>
        <p className="text-white text-lg mb-8">
          {" "}
          A simple Authentication Service
        </p>
        <div>
          <LoginButton>
            <Button variant={"secondary"} size={"lg"}>
              Sign up{" "}
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
