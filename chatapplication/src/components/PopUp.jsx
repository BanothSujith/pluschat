import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOverlayMessage } from "../redux/reducers";

function PopUp({ message }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (message?.toString()?.toLowerCase()?.includes("success")) {
      const timer = setTimeout(() => {
        dispatch(setOverlayMessage(""));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key="popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-0 bg-[#00000042] backdrop-blur-xs w-full h-full flex justify-center items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, ease: "anticipate" }}
            className="capitalize text-center bg-[var(--border)] text-[var(--text)] w-[90%] md:w-1/2 lg:w-1/2 xl:w-1/4 xl:min-w-[40rem] rounded-2xl aspect-video flex flex-col justify-center items-center px-6 py-4"
          >
            <p className="text-xl md:text-2xl font-semibold whitespace-pre-line">
              {message}
            </p>

            {!message?.toString()?.toLowerCase()?.includes("success") && (
              <button
                onClick={() => dispatch(setOverlayMessage(""))}
                className="mt-6 border px-6 md:px-8 lg:px-10 py-1 md:py-2 text-xl rounded-3xl font-semibold tracking-wider shadow-[inset_0px_10px_30px_#1cc8df,inset_0px_-7px_20px_#1cb1df] hover:shadow-[0px_4px_6px_-3px_#fff] transition-all duration-75 ease-linear"
              >
                {message?.toString()?.toLowerCase()?.includes("not matched")
                  ? "Try again"
                  : "Login"}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PopUp;
