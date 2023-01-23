import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import AppLayout from "../components/AppLayout";
import { checkAuthRoute } from "../middleware/checkAuthRoute";

export default function Greetings({ accessToken }) {
  const [loading, setLoading] = useState(false);
  const [greetings, setGreetings] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "all" });

  const fetchGreetings = useMemo(
    () =>
      async function fetchGreetings() {
        const { data } = await axios({
          url: "v1/greetings",
          method: "get",
          withCredentials: true,
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        setGreetings(data.greetings);
      },
    [accessToken, setGreetings]
  );

  async function addGreeting(values) {
    try {
      setLoading(true);
      await axios({
        url: "v1/greetings",
        method: "post",
        withCredentials: true,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        data: values,
      });
      setLoading(false);

      await fetchGreetings();
      reset();
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGreetings();
  }, [fetchGreetings]);
  return (
    <>
      <div className="mx-auto p-2">
        <div className="flex flex-wrap flex-row">
          <div className="flex-shrink max-w-full px-4 w-full">
            <p className="text-xl font-bold mt-3 mb-5">Create New Greeting</p>
          </div>
          <div className="flex-shrink max-w-full px-4 w-full mb-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full">
              <form
                className="flex flex-wrap flex-row -mx-4"
                onSubmit={handleSubmit(addGreeting)}
              >
                <div className="flex-shrink max-w-full px-4 w-full mb-4">
                  <label htmlFor="inputdes" className="inline-block mb-2">
                    Description
                    <p>
                      <small>
                        This will help the AI algorithm create a custom greeting
                        for you.
                      </small>
                    </p>
                  </label>
                  <div
                    className={clsx("form-group", {
                      "has-danger": errors.prompt,
                    })}
                  >
                    <textarea
                      rows={5}
                      {...register("prompt", {
                        required: "Description is required",
                      })}
                      placeholder="Ex. high school graduation, 16 bar rap, in the style of Wu-tang Clan"
                      className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                    ></textarea>

                    {errors.prompt && (
                      <div className="pristine-error text-help">
                        {errors.prompt.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink max-w-full px-4 w-full">
                  <button
                    type="submit"
                    className={clsx(
                      "py-2 px-4 block lg:inline-block text-center rounded leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0",
                      { disabled: loading }
                    )}
                  >
                    <div className="flex">
                      <div className="mr-2">
                        {loading && (
                          <svg
                            className="animate-spin h-5 w-5 text-white-700"
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
                        )}
                      </div>

                      <div>Submit Greeting</div>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink max-w-full px-4 w-full mb-6">
        <div className="p-6 bg-white rounded-lg shadow-lg h-full">
          <ul className="px-0 border-b border-gray-200 dark:border-gray-700">
            {greetings.map((greeting) => (
              <li className="group" key={greeting.id}>
                <div className="border border-gray-200 border-b-0 list-none rounded-sm py-3 px-4 flex justify-between items-center">
                  <div className="flex flex-col">
                    <button
                      style={{
                        position: "absolute",
                        alignSelf: "flex-end",
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                    <p>{greeting.prompt}</p>
                    <p className="mt-2">
                      <small>{greeting.generatedText}</small>
                    </p>
                    <div
                      style={{ alignSelf: "flex-end" }}
                      className="text-xs text-gray-500 self-center mr-3 ml-3 mt-2"
                    >
                      {format(
                        parseISO(greeting.createdAt),
                        "MMM d, y hh:mm aaa"
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  return checkAuthRoute(context);
}

Greetings.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
