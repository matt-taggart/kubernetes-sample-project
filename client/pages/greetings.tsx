import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import AppLayout from "../components/AppLayout";
import { X } from "lucide-react";
import { checkAuthRoute } from "../middleware/checkAuthRoute";

export default function Greetings({ accessToken }) {
  const [greetings, setGreetings] = useState([]);
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

  useEffect(() => {
    fetchGreetings();
  }, [fetchGreetings]);
  return (
    <>
      <div className="mx-auto p-2">
        <div className="flex flex-wrap flex-row">
          <div className="flex-shrink max-w-full px-4 w-full">
            <p className="text-xl font-bold mt-3 mb-5">Create new greeting</p>
          </div>
          <div className="flex-shrink max-w-full px-4 w-full mb-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full">
              <form className="flex flex-wrap flex-row -mx-4">
                <div className="flex-shrink max-w-full px-4 w-full mb-4">
                  <label htmlFor="inputdes" className="inline-block mb-2">
                    Description
                    <p>
                      <small>
                        This text will help the AI algorithm create a custom
                        greeting for you.
                      </small>
                    </p>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Ex. high school graduation, 16 bar rap, in the style of Wu-tang Clan"
                    className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                  ></textarea>
                </div>

                <div className="flex-shrink max-w-full px-4 w-full">
                  <button
                    type="submit"
                    className="py-2 px-4 block lg:inline-block text-center rounded leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0"
                  >
                    Submit Greeting
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
            <li className="group">
              <div className="border border-gray-200 border-b-0 list-none rounded-sm py-3 px-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <button
                    style={{
                      position: "absolute",
                      alignSelf: "flex-end",
                    }}
                  >
                    <X size={18} />
                  </button>
                  <p>
                    poem, 50th anniversary of two people of love Corgis, in the
                    style of Shakespeare.
                  </p>
                  <p className="mt-2">
                    <small>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
                    </small>
                  </p>
                  <div
                    style={{ alignSelf: "flex-end" }}
                    className="text-xs text-gray-500 self-center mr-3 ml-3 mt-2"
                  >
                    Aug 26, 2025 03:21 am
                  </div>
                </div>
              </div>
            </li>
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
