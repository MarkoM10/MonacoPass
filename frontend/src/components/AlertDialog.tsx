import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { hideAlert } from "../store/alertSlice";

const AlertDialog = () => {
  const { show, success, message } = useSelector(
    (state: RootState) => state.alert
  );

  const dispatch = useDispatch();

  return (
    <div className="fixed top-5 inset-x-0 flex justify-center items-center">
      <div className="w-11/12 max-w-[28rem]">
        {show && (
          <>
            {!success && (
              <>
                <div
                  className="bg-danger-100 border border-danger-400 text-danger-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Greška!</strong>
                  <span className="block sm:inline"> {message}</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg
                      className="fill-current h-6 w-6 text-danger-500"
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      onClick={() => dispatch(hideAlert())}
                    >
                      <title>Close</title>
                      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                  </span>
                </div>
              </>
            )}
            {success && (
              <>
                <div
                  className="bg-success-100 border border-success-400 text-success-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Uspešno!</strong>
                  <span className="block sm:inline"> {message}</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg
                      className="fill-current h-6 w-6 text-success-500"
                      role="button"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      onClick={() => dispatch(hideAlert())}
                    >
                      <title>Zatvori</title>
                      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                    </svg>
                  </span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AlertDialog;
