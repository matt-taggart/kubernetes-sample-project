import AppLayout from "../components/AppLayout";
import { checkAuthRoute } from "../middleware/checkAuthRoute";

function Home() {
  return (
    <main className="">
      <div className="mx-auto p-2">
        <div className="flex flex-wrap flex-row">
          <div className="flex-shrink max-w-full px-4 w-full">
            <p className="text-xl font-bold mt-3 mb-5">Create New Card</p>
          </div>
          <div className="flex-shrink max-w-full px-4 w-full mb-6">
            <div className="p-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full">
              <div className="relative">
                <h1 className="text-center">Insert your content</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap flex-row">
        <div className="flex-shrink max-w-full px-4 w-full lg:w-1/2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-row justify-between pb-4">
              <div className="flex flex-col">
                <h3 className="text-base font-bold">Web Development</h3>
              </div>
            </div>

            <div className="flex flex-col pb-4">
              <div className="flex flex-row items-center">
                <p className="text-sm text-gray-500">
                  Creating a website redesign project plan is vital to making
                  your redesign go smoothly.There’s who you think your customers
                  are, who you want your customers to be.{" "}
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-3">
              <div>
                <span className="text-sm inline-block text-gray-500 dark:text-gray-100">
                  Task done :{" "}
                  <span className="text-gray-700 dark:text-white font-bold">
                    26
                  </span>
                  /50
                </span>
              </div>
              <div>
                <span className="px-2 py-1 text-xs rounded font-semibold text-green-500 bg-green-50">
                  Front End
                </span>
                <span className="px-2 py-1 text-xs rounded text-indigo-500 font-semibold bg-indigo-100">
                  UI/UX
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink max-w-full px-4 w-full lg:w-1/2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-row justify-between pb-4">
              <div className="flex flex-col">
                <h3 className="text-base font-bold">Web Development</h3>
              </div>
            </div>

            <div className="flex flex-col pb-4">
              <div className="flex flex-row items-center">
                <p className="text-sm text-gray-500">
                  Creating a website redesign project plan is vital to making
                  your redesign go smoothly.There’s who you think your customers
                  are, who you want your customers to be.{" "}
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-3">
              <div>
                <span className="text-sm inline-block text-gray-500 dark:text-gray-100">
                  Task done :{" "}
                  <span className="text-gray-700 dark:text-white font-bold">
                    26
                  </span>
                  /50
                </span>
              </div>
              <div>
                <span className="px-2 py-1 text-xs rounded font-semibold text-green-500 bg-green-50">
                  Front End
                </span>
                <span className="px-2 py-1 text-xs rounded text-indigo-500 font-semibold bg-indigo-100">
                  UI/UX
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

Home.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getServerSideProps(context) {
  return checkAuthRoute(context);
}

export default Home;
