import { useEffect, useState, useMemo, useLayoutEffect, useRef } from "react";
import axios from "axios";
import clsx from "clsx";
// import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Toast from "@radix-ui/react-toast";
import { useWindowVirtualizer } from "@tanstack/react-virtual";

import AppLayout from "../components/AppLayout";
import { checkAuthRoute } from "../middleware/checkAuthRoute";
import { IMAGE_POLLING_INTERVAL } from "../constants/polling-constants";
import { MODEL_DESCRIPTIONS } from "../constants/model-constants";

export default function Images({ accessToken }) {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [model, setModel] = useState(MODEL_DESCRIPTIONS.ANIME);
  const [pendingImages, setPendingImages] = useState([]);
  const [jumpImageId, setJumpImageId] = useState("");
  const [greetingIdToDelete, setGreetingIdToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [nsfwContentMessage, setNsfwContentMessage] = useState("");

  const parentRef = useRef<HTMLDivElement>(null);

  const parentOffsetRef = useRef(0);

  useLayoutEffect(() => {
    parentOffsetRef.current = parentRef.current?.offsetTop ?? 0;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: images.length,
    estimateSize: () => 512,
    scrollMargin: parentOffsetRef.current,
  });
  const items = virtualizer.getVirtualItems();
  console.log("%citems", "color:cyan; ", items);

  const arr = [];
  for (let i = 0; i < items.length; i++) {
    if (i % 3) {
      arr.push(items[i]);
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "all" });

  const fetchImages = useMemo(
    () =>
      async function fetchImages() {
        const { data } = await axios({
          url: "v1/images",
          method: "get",
          withCredentials: true,
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        if (data.error) {
          setNsfwContentMessage(data.error);
        }

        setImages(data.images);
        setPendingImages(data.pendingImages);

        return data;
      },
    [accessToken, setImages]
  );

  async function addImage(values) {
    try {
      setLoading(true);
      await axios({
        url: "v1/images",
        method: "post",
        withCredentials: true,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        data: { ...values, model },
      });
      setLoading(false);

      reset();

      await fetchImages();
    } catch (error) {
      setLoading(false);
    }
  }

  async function deleteImage(id) {
    try {
      setDeleteLoading(true);
      await axios({
        url: `v1/greetings/${id}`,
        method: "delete",
        withCredentials: true,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      setGreetingIdToDelete(null);
      setDeleteLoading(false);
      setOpen(false);
      await fetchImages();
    } catch (error) {
      setDeleteLoading(false);
    }
  }

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    let id;

    const NSFW_ALERT_TIMEOUT = 5000;

    id = window.setTimeout(() => {
      setNsfwContentMessage("");
    }, NSFW_ALERT_TIMEOUT);

    return () => clearTimeout(id);
  }, [nsfwContentMessage]);

  useEffect(() => {
    let id;
    if (pendingImages.length) {
      // poll to get status
      id = window.setInterval(async () => {
        const data = await fetchImages();
        const currentPendingImageCount = pendingImages.length;
        const updatedPendingImageCount = data.pendingImages.length;

        if (currentPendingImageCount !== updatedPendingImageCount) {
          const pendingImageIds = pendingImages.map(
            (pendingImage) => pendingImage.id
          );
          const updatedPendingImageIds = data.pendingImages.map(
            (pendingImage) => pendingImage.id
          );

          let processedImageId = "";

          pendingImageIds.forEach((pendingImageId) => {
            if (!updatedPendingImageIds.includes(pendingImageId)) {
              processedImageId = pendingImageId;
            }
          });

          setJumpImageId(processedImageId);
          await fetchImages();
          setToastOpen(true);
        }
      }, IMAGE_POLLING_INTERVAL);
    }

    return () => clearInterval(id);
  }, [pendingImages, fetchImages]);

  const isModelSelected = (currentModel, modelType) => {
    return currentModel === modelType;
  };

  return (
    <>
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <div className="mx-auto p-2">
          <div className="flex flex-wrap flex-row">
            <div className="flex-shrink max-w-full px-4 w-full">
              <p className="text-xl font-bold mt-3 mb-5">Generate Image</p>
            </div>
            <div className="flex-shrink max-w-full px-4 w-full mb-6">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full">
                <form
                  className="flex flex-wrap flex-row -mx-4"
                  onSubmit={handleSubmit(addImage)}
                >
                  <div className="flex-shrink flex flex-col max-w-full px-4 w-full mb-4">
                    <label className="inline-block mb-2">Choose Style</label>
                    <div className="inline-flex" role="group">
                      <button
                        type="button"
                        onClick={() => setModel(MODEL_DESCRIPTIONS.ANIME)}
                        className={clsx(
                          "rounded-l py-2 px-4 inline-block text-center mb-3 leading-normal text-indigo-500 bg-white border border-indigo-500 hover:text-gray-100 hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 -mr-0.5 -ml-0.5",
                          {
                            "text-gray-100": isModelSelected(
                              model,
                              MODEL_DESCRIPTIONS.ANIME
                            ),
                            "bg-indigo-600": isModelSelected(
                              model,
                              MODEL_DESCRIPTIONS.ANIME
                            ),
                            "border-indigo-600": isModelSelected(
                              model,
                              MODEL_DESCRIPTIONS.ANIME
                            ),
                            "outline-none": isModelSelected(
                              model,
                              MODEL_DESCRIPTIONS.ANIME
                            ),
                            "ring-0": isModelSelected(
                              model,
                              MODEL_DESCRIPTIONS.ANIME
                            ),
                          }
                        )}
                      >
                        Anime
                      </button>
                      <button
                        type="button"
                        onClick={() => setModel(MODEL_DESCRIPTIONS.REALISTIC)}
                        className={clsx(
                          "rounded-r py-2 px-4 inline-block text-center mb-3 leading-normal text-indigo-500 bg-white border border-indigo-500 hover:text-gray-100 hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 -ml-0.5 -mr-0.5",
                          {
                            "text-gray-100": isModelSelected(
                              model,
                              MODEL_DESCRIPTIONS.REALISTIC
                            ),
                            "bg-indigo-600": isModelSelected(
                              model,
                              MODEL_DESCRIPTIONS.REALISTIC
                            ),
                            "border-indigo-600": isModelSelected(
                              model,
                              MODEL_DESCRIPTIONS.REALISTIC
                            ),
                            "outline-none": isModelSelected(
                              model,
                              MODEL_DESCRIPTIONS.REALISTIC
                            ),
                            "ring-0": isModelSelected(
                              model,
                              MODEL_DESCRIPTIONS.REALISTIC
                            ),
                          }
                        )}
                      >
                        Realistic
                      </button>
                    </div>
                  </div>

                  <div className="flex-shrink max-w-full px-4 w-full mb-4">
                    <label className="inline-block mb-2">Description</label>
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
                        placeholder="Ex. stunning environment, landscape, panoramic, lush vegetation, idyllic, insanely detailed, lush detail, 8k, breathtaking, hard shadows, cinematic lighting, bioluminescent details, backlighting"
                        className="w-full leading-5 relative py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                      ></textarea>

                      {errors.prompt && (
                        <div className="pristine-error text-help">
                          {errors.prompt.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex align-center flex-shrink max-w-full px-4 w-full"
                    style={{ gap: "2rem" }}
                  >
                    <button
                      type="submit"
                      className={clsx(
                        "py-2 px-4 block lg:inline-block text-center rounded leading-5 text-gray-100 bg-indigo-500 border border-indigo-500 hover:text-white hover:bg-indigo-600 hover:ring-0 hover:border-indigo-600 focus:bg-indigo-600 focus:border-indigo-600 focus:outline-none focus:ring-0",
                        { disabled: loading }
                      )}
                    >
                      <div className="flex">
                        {loading && (
                          <div className="mr-2">
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
                          </div>
                        )}

                        <div>
                          {loading ? "Generating image..." : "Submit Image"}
                        </div>
                      </div>
                    </button>
                    {loading && (
                      <small>
                        Hang tight! This process can take up to several minutes.
                      </small>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          {nsfwContentMessage ? (
            <div className="relative bg-red-100 text-red-900 py-3 px-6 rounded mb-4">
              {nsfwContentMessage}
            </div>
          ) : null}
        </div>

        {pendingImages.length ? (
          <div className="mx-auto p-2 px-6">
            <div className="flex flex-wrap flex-row">
              <div className="relative bg-yellow-100 text-yellow-900 py-3 px-6 rounded mb-4">
                {pendingImages.length > 1 ? (
                  <>
                    There are currently <strong>{pendingImages.length}</strong>{" "}
                    images processing.
                  </>
                ) : (
                  <>
                    There is currently <strong>{pendingImages.length}</strong>{" "}
                    image processing
                  </>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mx-auto p-2" ref={parentRef}>
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${
                  items[0]?.start - virtualizer.options.scrollMargin
                }px)`,
              }}
            >
              {items.map((virtualRow) => {
                const image = images[virtualRow.index];
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={virtualizer.measureElement}
                    className={
                      virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
                    }
                  >
                    <ImageCard {...image} jumpImageId={jumpImageId} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <AlertDialog.Portal>
          <AlertDialog.Overlay className="AlertDialogOverlay" />
          <AlertDialog.Content className="AlertDialogContent">
            <AlertDialog.Title className="AlertDialogTitle">
              Are you sure you want to delete this image?
            </AlertDialog.Title>
            <AlertDialog.Description className="AlertDialogDescription mt-4">
              This action cannot be undone. This will permanently delete this
              greeting from the system.
            </AlertDialog.Description>
            <div
              style={{ display: "flex", gap: 20, justifyContent: "flex-end" }}
            >
              <button
                type="button"
                className="text-sm py-2 px-4 inline-block text-center mb-3 rounded leading-5 text-gray-800 bg-gray-100 border border-gray-100 hover:text-gray-900 hover:bg-gray-200 hover:ring-0 hover:border-gray-200 focus:bg-gray-200 focus:border-gray-200 focus:outline-none focus:ring-0"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className={clsx(
                  "text-sm py-2 px-4 inline-block text-center mb-3 rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 hover:ring-0 hover:border-red-600 focus:bg-red-600 focus:border-red-600 focus:outline-none focus:ring-0",
                  { disabled: deleteLoading }
                )}
                onClick={() => deleteImage(greetingIdToDelete)}
              >
                <div className="flex">
                  <div className="mr-2">
                    {deleteLoading && (
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

                  <div>Yes, delete image</div>
                </div>
              </button>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="ToastRoot"
          open={toastOpen}
          onOpenChange={setToastOpen}
        >
          <Toast.Title className="ToastTitle">Success!</Toast.Title>
          <Toast.Description asChild>
            <p className="ToastDescription">Your image has been processed</p>
          </Toast.Description>
          <Toast.Action
            className="ToastAction"
            asChild
            altText="Goto schedule to undo"
          >
            <a href={`#${jumpImageId}`}>
              <button className="Button small green">Jump to Image</button>
            </a>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
    </>
  );
}

const ImageCard = ({ id, photoUrl, createdAt, prompt, jumpImageId }) => {
  return (
    <div
      id={id}
      key={id}
      style={{ width: 512, height: 512, borderWidth: "2.5px" }}
      className={clsx(
        "flex flex-col bg-white dark:bg-gray-800 mb-12 rounded overflow-hidden",
        {
          border: id === jumpImageId,
          "border-indigo-500": id === jumpImageId,
          shadow: id === jumpImageId,
        }
      )}
    >
      <div className="relative overflow-hidden">
        <a href="#">
          <div className="absolute inset-0 hover:bg-white opacity-0 transition duration-700 hover:opacity-10"></div>
          <img className="w-full" src={photoUrl} alt="alt title" />
        </a>
      </div>
      <div className="p-6 flex-1">
        <div className="mb-2">
          <div className="flex align-center text-gray-500">
            <div className="mr-2">
              <svg
                className="bi bi-calendar mr-2 inline-block"
                width=".8rem"
                height=".8rem"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M14 0H2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"
                  clip-rule="evenodd"
                ></path>
                <path
                  fillRule="evenodd"
                  d="M6.5 7a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm-9 3a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm-9 3a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <span>{format(parseISO(createdAt), "MMM d, y h:mm aaa")}</span>
          </div>
        </div>
        <p>{prompt}</p>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return checkAuthRoute(context);
}

Images.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};
