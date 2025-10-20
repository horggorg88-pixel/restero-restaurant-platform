import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import LoginBg from "@assets/images/login-bg.png";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@shared/api/login";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@shared/hooks/useAuth";
import { Helmet } from "react-helmet-async";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string[];
    password?: string[];
  }>({});

  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.access_token);
      localStorage.setItem("refreshToken", data.data.refresh_token);
      // Сохраняем роль сотрудника, если приходит из API
      if (data?.data?.user?.role) {
        localStorage.setItem("userRole", data.data.user.role);
      } else {
        localStorage.removeItem("userRole");
      }
      // Пробрасываем restaurant_id для сотрудника, чтобы админка знала контекст ресторана
      if (data?.data?.user?.restaurantId) {
        localStorage.setItem("restaurant_id", String(data.data.user.restaurantId));
      }
      setErrors({});
      setAuth();
      navigate("/gantt");
    },
    onError: (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        setErrors({
          password: ["Неверный логин или пароль"],
        });
      } else {
        console.error("Ошибка при выполнении запроса:", error);
      }
    },
  });

  // Если пришел restaurant_id через query, положим его в localStorage до логина
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const rid = params.get('restaurant_id');
      if (rid) {
        localStorage.setItem('restaurant_id', rid);
      }
    } catch {}
  }, []);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setErrors({});
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors({});
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    mutation.mutate({ username, password });
  };

  return (
    <>
      <Helmet>
        <title>Вход</title>
      </Helmet>
      <div className="w-full h-screen flex items-center justify-center relative gap-1">
        <img
          src={LoginBg}
          alt="Login Image"
          className="absolute inset-0 w-full h-full object-cover -z-10"
        />

        <form
          className="rounded-[20px] w-[452px] border-6 bg-6 h-auto p-8"
          onSubmit={handleSubmit}
        >
          <h2 className="flex justify-center text-xl font-semibold mt-2 mb-2">
            Вход администратора
          </h2>

          <div className="mb-4">
            <label className="flex flex-col gap-2 text-1 text-[10px]">
              Логин
              <Input
                className="w-full px-5"
                id="login"
                name="username"
                value={username}
                onChange={handleUsernameChange}
              />
              {errors.username && (
                <p className="text-red-500 text-xs">{errors.username[0]}</p>
              )}
            </label>
          </div>

          <div>
            <label className="flex flex-col gap-2 text-1 text-[10px]">
              Пароль
              <Input
                className="w-full px-5"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password[0]}</p>
              )}
            </label>
          </div>


          <div className="mt-5">
            <Button
              type="submit"
              className="w-full px-5"
              disabled={mutation.isPending || !password || !username}
            >
              {mutation.isPending ? "Загрузка..." : "Войти"}
            </Button>
          </div>

          {/* Удалено сообщение про поддержку */}
        </form>
      </div>
    </>
  );
};

export default Login;
