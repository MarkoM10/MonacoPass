import { useSelector } from "react-redux";
import { BounceLoader } from "react-spinners";
import { RootState } from "../store/store";
const Spinner = () => {
  const { toggleSpinner } = useSelector(
    (state: RootState) => state.toggleSpinner
  );

  return (
    <>
      {toggleSpinner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
          <div className="sweet-loading">
            <BounceLoader
              color="#3AAFA9"
              loading={true}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Spinner;
