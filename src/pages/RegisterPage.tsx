import { useSearchParams } from "react-router-dom";
import LoginComponent from "../components/LoginComponent";
import SignUpComponent from "../components/SignupComponent";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#00A884] from-40% to-[#111B21] to-40%">
      <section className="w-1/3 h-1/3 flex flex-col gap-8 ">
        <h2 className="text-3xl uppercase font-mono text-white">ChatMan</h2>
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
