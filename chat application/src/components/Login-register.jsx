import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useScreenWidth from "../Hooks/UseScreenWidth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setOverlayMessage } from "../redux/reducers";

function Loginregister() {
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    profile: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [login, setlogin] = useState(true);
  const width = useScreenWidth();
  const loginFields = [
    {
      name: "Email",
      type: "text",
      placeholder: "Email / Phone No",
      isrequired: true,
    },
    {
      name: "Password",
      type: "password",
      placeholder: "Password",
      isrequired: true,
    },
  ];

  const registerFields = [
    { name: "Name", type: "text", placeholder: "Full Name", isrequired: true },
    {
      name: "Email",
      type: "text",
      placeholder: "Email / phoneNo",
      isrequired: true,
    },
    {
      name: "profile",
      type: "file",
      placeholder: "add a profile",
      accept: "image/*",
      capture: "capture",
    },
    {
      name: "Password",
      type: "password",
      placeholder: "Password",
      isrequired: true,
    },
    {
      name: "ConfirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      isrequired: true,
    },
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fields = login ? loginFields : registerFields;
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(formData);

    if (login == false) {
      for (const [key, value] of Object.entries(formData)) {
        if (key !== "profile" && value.trim() === "") {
          dispatch(setOverlayMessage(`${key} is required...!`));
          return;
        }
        if (formData?.Password !== formData?.ConfirmPassword) {
          dispatch(setOverlayMessage(`Password and Confirm password not matched...!`));
          return;
        }
      }
    } else {
      if (formData?.Password.trim() == "" || formData?.Email.trim() == "") {
        dispatch(setOverlayMessage(`Email/PhoneNo and password not matched...!`));
        return;
      }
    }
    let Email = "";
    let PhoneNo = "";

    const formEmail = formData.Email;

    if (formEmail.includes("@")) {
      Email = formEmail;
    } else if (/^\d+$/.test(formEmail)) {
      PhoneNo = formEmail;
    } else {
      dispatch(setOverlayMessage("Please enter a valid email or phone number."));
      return;
    }

    try {
      const route = login ? "login" : "register";
      const data = new FormData();
      data.append("Name", formData.Name);
      data.append("Email", Email);
      data.append("PhoneNo", PhoneNo);
      data.append("Password", formData?.Password);
      data.append("ConfirmPassword", formData?.ConfirmPassword);
      const dataPost =route === "login" ? { ...formData, Email, PhoneNo } : data
      if (formData.profile) {
        data.append("profile", formData.profile);
      }
      const url = `${import.meta.env.VITE_API_URL}/api/v1/${route}`;

      // console.log(url);

      const response = await axios.post(url, dataPost, {
        withCredentials: true,
      });
      // console.log("response", response);
      dispatch(setOverlayMessage("Proceesing Please Wait..!"));
      if (response?.data?.Status == "Success") {
              

        response?.data?.Message == "Registeration is Success....!"
          ? (setlogin(true),  dispatch(setOverlayMessage("Registeration Success \n Redirecting to Login Page..!")))
          : (localStorage.setItem(
              "user",
              JSON.stringify({
                publickKey: response?.data?.Data?.publicKey,
              }),
            ),
            dispatch(setOverlayMessage("Login Success..! \n Redirecting to home page...!")),
            localStorage.setItem("userName", response?.data?.Data?.name),
            localStorage.setItem("userProfile",response.data?.Data?.userProfile),
            navigate("/"));
      } else {
        dispatch(setOverlayMessage(response?.data?.Message));
      }
    } catch (error) {
      error.toString().includes("status code 409") ? dispatch(setOverlayMessage("User Already exists with this ID, \n Please Login..!")) : dispatch(setOverlayMessage("Please use Valid data..!"))
      console.log("res-error", error);

    }
  };
  useEffect(() => {
    const isauthenticated = localStorage.getItem("user");
    isauthenticated ? navigate("/") : "";
  }, []);
  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* input fields */}
      <div
        className={`flex h-full w-full flex-col items-center overflow-y-scroll scrollbar-none  shadow-[0px_0px_10px_5px_var(--shadow2)] md:h-[40rem] md:w-[60rem] md:flex-row md:rounded-2xl`}
      >
        <AnimatePresence mode="wait">
          <motion.form
            layout
            key={width < 786 ? login : ""}
            initial={
              width < 786
                ? {
                    opacity: 1,
                    scale: 0,
                  }
                : {
                    opacity: 1,
                  }
            }
            animate={
              width < 786
                ? {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }
                : {
                    x: login ? "0%" : "100%",
                    y: "0%",
                  }
            }
            exit={
              width < 786
                ? {
                    opacity: 0,
                    y: -20,
                  }
                : ""
            }
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
            style={{
              transformOrigin: "top",
            }}
            onSubmit={handleSubmit}
            className="flex h-full w-full flex-col  items-center justify-center gap-7 bg-[var(--bg)] py-8 md:w-1/2"
          >
            <h1 className="text-4xl tracking-wide text-[var(--text)]">
              {login ? "Login" : "Register"}
            </h1>
            {fields.map((field) =>
              field.name === "profile" ? (
                <label
                  key={field.name}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);

                    const file = e.dataTransfer.files[0];

                    if (file) {
                      setFormData((prev) => ({
                        ...prev,
                        profile: file,
                      }));
                    }
                  }}
                  className={`group relative flex h-40 w-80 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300
    ${
      dragActive
        ? "border-red-600 bg-red-100 scale-105"
        : "border-gray-400 bg-[var(--accent)]/30  hover:bg-[var(--accent)]/60 hover:shadow-xl hover:scale-[1.02]"
    }`}
                >
                  <input
                    type="file"
                    name="profile"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleChange}
                  />

                  {formData.profile ? (
                    <>
                      <img
                        src={URL.createObjectURL(formData.profile)}
                        alt="profile"
                        className="h-24 w-24 rounded-full object-cover shadow-lg"
                      />

                      <p className="mt-3 text-sm font-medium">
                        {formData.profile.name}
                      </p>

                      <span className="mt-1 text-xs text-gray-500">
                        Click or Drag another image
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="text-5xl transition-transform duration-300 group-hover:scale-110">
                        📷
                      </div>

                      <p className="mt-3 text-lg font-semibold">
                        Upload Profile Photo
                      </p>

                      <span className="text-sm text-gray-500">
                        Drag & Drop or Click
                      </span>
                    </>
                  )}
                </label>
              ) : (
                <input
                  key={field.name}
                  type={field?.type}
                  name={field?.name}
                  onChange={handleChange}
                  placeholder={field?.placeholder}
                  required={field?.isrequired}
                  className="w-80 rounded-[15px] bg-[var(--accent)]/60 p-2 px-6 text-lg tracking-wide outline-0 placeholder:font-medium placeholder:text-[var(--text)]/70 hover:bg-[var(--accent)]/60 hover:shadow-xl hover:scale-[1.02] transition-all duration-100 ease-linear  "
                />
              ),
            )}
            <button
              type="submit"
              className="mt-4 rounded-full bg-[#7c0707] px-9 py-1.5 text-lg font-medium tracking-wide text-[#feffff] shadow-[#0f0f0f] transition-all duration-100 ease-in-out hover:scale-[1.03] hover:shadow-[inset_0px_-10px_20px]"
            >
              {login ? "Login" : "Register"}
            </button>
          </motion.form>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            key={width < 786 ? login : ""}
            initial={
              width < 786
                ? {
                    opacity: 1,
                    y: 20,
                  }
                : {
                    opacity: 1,
                  }
            }
            animate={
              width < 786
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                  }
                : {
                    x: login ? "0%" : "-100%",
                    y: "0%",
                  }
            }
            exit={
              width < 786
                ? {
                    opacity: 0,
                    y: 20,
                  }
                : ""
            }
            transition={{
              duration: "0.2",
              ease: "easeIn",
            }}
            className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#7c0707] text-white md:w-1/2"
          >
            <h2 className="text-4xl tracking-wider italic">
              {login ? "New here?" : "Welcome Back!"}
            </h2>
            <p className="leading-12 font-medium">
              {login
                ? "Create an account to get started."
                : "Already have an account?"}
            </p>
            <button
              onClick={() => {
                setlogin(!login);
              }}
              className="mt-4 rounded-full border bg-white px-8 py-2 text-[#7c0707] shadow-[#a81b1b] transition-all duration-100 ease-in-out hover:scale-[1.03] hover:shadow-[inset_0px_-10px_20px]"
            >
              {login ? "Register" : "Login"}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Loginregister;
