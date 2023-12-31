export type Suspended<T> = {
  read: () => T;
};

export function wrapPromise<T>(promise: Promise<T>): Suspended<T> {
  let status: "pending" | "error" | "success" = "pending";
  let result: T;
  let error: Error;

  const suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      error = e;
    }
  );

  return {
    read() {
      switch (status) {
        case "pending":
          throw suspender;
        case "error":
          throw error;
        case "success":
          return result;
        default:
          throw suspender;
      }
    },
  };
}
