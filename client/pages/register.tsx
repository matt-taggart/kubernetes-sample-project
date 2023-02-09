import { useState } from "react";
import { useRouter } from "next/router";
import NuxtLink from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "all" });
  const router = useRouter();

  watch(() => setServerError(""));

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await axios({
        url: "/v1/register",
        method: "post",
        data: {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        },
        withCredentials: true,
      });
      setLoading(false);
      router.push("/");
    } catch (error) {
    console.log("%cerror", "color:cyan; ", error);
      setLoading(false);
      setServerError("Username already exists");
    }
  };
  return (
    <>
      <div className="relative py-12 bg-gray-100 dark:bg-gray-900 dark:bg-opacity-40">
        <div className="container xl:max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap flex-row -mx-4 justify-center">
            <div className="max-w-full w-full md:w-2/3 lg:w-1/2 px-6 sm:px-12">
              <div className="relative">
                <div className="p-6 sm:py-8 sm:px-12 rounded-lg bg-white dark:bg-gray-800 shadow-xl">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-2xl leading-normal mb-6 font-bold text-gray-800  dark:text-gray-300 text-center">
                      Register
                    </h1>
                    <hr className="block w-12 h-0.5 mx-auto my-5 bg-gray-700 border-gray-700" />
                    <div
                      className={clsx("mb-6 form-group", {
                        "has-danger": errors.fullName,
                      })}
                    >
                      <input
                        {...register("fullName", {
                          required: "Full name is required",
                        })}
                        className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                        placeholder="Full Name"
                        aria-label="full name"
                        type="text"
                      />
                      {errors.fullName && (
                        <div className="pristine-error text-help">
                          {errors.fullName.message}
                        </div>
                      )}
                    </div>
                    <div
                      className={clsx("mb-6 form-group", {
                        "has-danger": errors.email,
                      })}
                    >
                      <input
                        {...register("email", {
                          required: "Email address is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                        placeholder="Email address"
                        aria-label="email"
                        type="email"
                      />
                      {errors.email && (
                        <div className="pristine-error text-help">
                          {errors.email.message}
                        </div>
                      )}
                    </div>
                    <div
                      className={clsx("mb-6 form-group", {
                        "has-danger": errors.password,
                      })}
                    >
                      <input
                        {...register("password", {
                          required: "Password is required",
                        })}
                        className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                        placeholder="Password"
                        aria-label="password"
                        type="password"
                      />
                      {errors.password && (
                        <div className="pristine-error text-help">
                          {errors.password.message}
                        </div>
                      )}
                    </div>
                    <div
                      className={clsx("mb-6 form-group", {
                        "has-danger": errors.confirmPassword,
                      })}
                    >
                      <input
                        {...register("confirmPassword", {
                          required: "You must confirm your password",
                          validate: (confirmPassword, { password }) => {
                            return (
                              password === confirmPassword ||
                              "Passwords must match"
                            );
                          },
                        })}
                        className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                        placeholder="Confirm Password"
                        aria-label="confirm password"
                        type="password"
                      />
                      {errors.confirmPassword && (
                        <div className="pristine-error text-help">
                          {errors.confirmPassword.message}
                        </div>
                      )}
                    </div>
                    <div
                      className={clsx("mb-6 form-group", {
                        "has-danger": errors.termsAndConditions,
                      })}
                    >
                      <input
                        className="form-checkbox h-5 w-5 text-indigo-500 dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded focus:outline-none"
                        type="checkbox"
                        id="terms"
                        {...register("termsAndConditions", {
                          required: "You must accept the terms and conditions",
                        })}
                      />
                      <label className="ml-2 mr-2" htmlFor="terms">
                        I agree to the <a href="#">Terms and Conditions</a>
                      </label>
                      {errors.termsAndConditions && (
                        <div className="pristine-error text-help">
                          {errors.termsAndConditions.message}
                        </div>
                      )}
                    </div>
                    <div className="grid">
                      <button
                        type="submit"
                        disabled={loading}
                        className="py-2 px-4 inline-block text-center rounded leading-normal text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0"
                      >
                        {loading ? (
                          <svg
                            className="inline-block w-4 h-4 mr-2 ml-2 bi bi-box-arrow-in-right animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="inline-block w-4 h-4 mr-2 ml-2 bi bi-box-arrow-in-right"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"
                            />
                            <path
                              fillRule="evenodd"
                              d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                            />
                          </svg>
                        )}

                        {loading ? "Loading..." : "Register"}
                      </button>
                    </div>
                  </form>
                  {serverError && (
                    <div className="relative bg-red-100 text-red-900 py-3 px-6 rounded mb-4 mt-6">
                      {serverError}
                    </div>
                  )}
                  <div className="mt-3">
                    <p className="text-center mb-4">
                      Already have an account?{" "}
                      <NuxtLink className="hover:text-indigo-500" href="/login">
                        Login
                      </NuxtLink>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white p-6 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-800">
        <div className="mx-auto px-4">
          <div className="flex flex-wrap flex-row -mx-4">
            <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:text-left md:text-right">
              <ul className="pl-0 pr-0">
                <li className="inline-block mr-3 ml-3">
                  <a className="hover:text-indigo-500" href="#">
                    Support
                  </a>
                </li>
                <li className="inline-block mr-3 ml-3">
                  <a className="hover:text-indigo-500" href="#">
                    Help Center
                  </a>
                </li>
                <li className="inline-block mr-3 ml-3">
                  <a className="hover:text-indigo-500" href="#">
                    Privacy
                  </a>
                </li>
                <li className="inline-block mr-3 ml-3">
                  <a className="hover:text-indigo-500" href="#">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex-shrink max-w-full px-4 w-full md:w-1/2 text-center md:text-right md:text-left">
              <p className="mb-0 mt-3 md:mt-0">
                <a href="" className="hover:text-indigo-500">
                  Card Couture
                </a>{" "}
                | All right reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

Register.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};
