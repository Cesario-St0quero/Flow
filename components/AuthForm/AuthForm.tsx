import { PageType, UserInfoType } from "@/app/auth/page";
import { AppRoutes } from "@/lib/utils/constants/AppRoutes";
import { pageLabels } from "@/lib/utils/constants/pageLabels";
import { signIn } from "next-auth/react";
import { FormEvent, FormEventHandler, useState } from "react";

interface AuthFormProps {
  page: PageType;
  userInfo: UserInfoType;
  setUserInfo: (info: UserInfoType) => void;
  setPage: (page: PageType) => void;
}

export default function AuthForm(props: AuthFormProps) {
  const { page, userInfo, setPage, setUserInfo, ...formProps } = props;
  const { signInLabels, signUpLabels } = pageLabels;
  const [loading, setLoading] = useState(false);

  const handleLogin: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!userInfo.email || !userInfo.password) return;

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: userInfo.email,
        password: userInfo.password,
        callbackUrl: AppRoutes.Home,
        redirect: true,
      });

      if (res?.ok) setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePageChange = () => {
    setPage(page === "login" ? "register" : "login");
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password } = userInfo;
    if (!name || !email || !password) return;

    try {
      setLoading(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        setLoading(false);
        setPage("login");
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={page === "login" ? handleLogin : handleRegister}
      className="flex flex-col w-2/3 md:w-1/3 gap-2"
      {...formProps}
    >
      {page === "register" && (
        <input
          placeholder="name"
          value={userInfo.name}
          onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          className="input-primary"
        />
      )}

      <input
        value={userInfo.email}
        onChange={({ target }) =>
          setUserInfo({ ...userInfo, email: target.value })
        }
        type="email"
        placeholder="email@gmail.com"
        className="input-primary"
      />

      <input
        value={userInfo.password}
        onChange={({ target }) =>
          setUserInfo({ ...userInfo, password: target.value })
        }
        type="password"
        placeholder="********"
        className="input-primary"
      />

      <button disabled={loading} type="submit" className="btn-primary">
        {page === "login" ? signInLabels.event : signUpLabels.event}
      </button>

      {/* Botão Google: antes do texto "Não tem uma conta?" */}
      {page === "login" && (
        <div className="mt-2 flex flex-col items-center w-full">
          <button
            type="button"
            onClick={() => signIn("google")}
            className="flex items-center justify-center gap-2 bg-white text-black border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-100 transition w-full"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">Entrar com Google</span>
          </button>
        </div>
      )}

      {/* Texto de troca entre login e cadastro */}
      <p className="text-center text-sm mt-2">
        {page === "login" ? signInLabels.formFooter : signUpLabels.formFooter}{" "}
        <span className="underline cursor-pointer" onClick={handlePageChange}>
          {page === "login" ? signUpLabels.event : signInLabels.event}
        </span>
      </p>
    </form>
  );
}
