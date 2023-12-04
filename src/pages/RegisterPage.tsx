import { useSearchParams } from "react-router-dom";
import LoginComponent from "../components/LoginComponent";
import SignUpComponent from "../components/SignupComponent";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  return (
    <main className="from-secondary-100 to-primary-100 flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-40% to-40%">
      <section className="flex h-1/3 w-1/3 flex-col gap-8 max-lg:w-2/3 max-md:w-5/6 max-sm:w-11/12">
        <h2 className="font-mono text-3xl uppercase text-white">ChatMan</h2>
        {searchParams.get("sec") === null ||
        searchParams.get("sec") === "login" ? (
          <LoginComponent />
        ) : null}
        {searchParams.get("sec") === "signup" ? <SignUpComponent /> : null}
      </section>
    </main>
  );
};

export default RegisterPage;
