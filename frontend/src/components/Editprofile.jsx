import React, { useContext, useRef, useState } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";
import { Userdatacontext } from "../Context/UserContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthUserContext } from "../Context/Authcontext";

export default function Editprofile() {
  const { edit, setedit, userdata, setuserdata } = useContext(Userdatacontext);
  const { serveruri } = useContext(AuthUserContext);

  const [firstname, setfirstname] = useState(userdata.user.firstname || "");
  const [lastname, setlastname] = useState(userdata.user.lastname || "");
  const [username, setusername] = useState(userdata.user.username || "");
  const [headline, setheadline] = useState(userdata.user.headline || "");
  const [location, setlocation] = useState(userdata.user.location || "");
  const [gender, setgender] = useState(userdata.user.gender || "");
  const [skills, setskills] = useState(userdata.user.skills || []);
  const [newskills, setnewskills] = useState("");
  const [frontendprofileimg, setprofileimg] = useState(
    userdata.user.profileimg ||
      "https://cdn-icons-png.flaticon.com/128/848/848043.png",
  );
  const [backendprofileimg, setbackendprofileimg] = useState(null);
  const [frontendcoverimg, setcoverimg] = useState(
    userdata.user.coverimg ||
      "https://via.placeholder.com/300x100?text=Cover+Image",
  );
  const [backendcoverimg, setbackendcoverimg] = useState(null);
  const [education, seteducation] = useState(userdata.user.education || []);
  const [neweducation, setneweducation] = useState({
    college: "",
    degree: "",
    field: "",
  });
  const [experience, setexperience] = useState(userdata.user.experience || []);
  const [newexperience, setnewexperience] = useState({
    title: "",
    company: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const profileimgRef = useRef();
  const coverimgRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("username", username);
      formData.append("headline", headline);
      formData.append("location", location);
      if (gender) formData.append("gender", gender);

      formData.append("skills", JSON.stringify(skills));
      formData.append("education", JSON.stringify(education));
      formData.append("experience", JSON.stringify(experience));

      if (backendprofileimg) {
        formData.append("profileimg", backendprofileimg);
      }
      if (backendcoverimg) {
        formData.append("coverimg", backendcoverimg);
      }

      const response = await axios.put(
        `${serveruri}/api/updateprofile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        },
      );

      setuserdata({ ...userdata, user: response.data.user });
      setedit(false);

      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.data?.error === "Duplicate username"
          ? "Username already exists"
          : "Failed to update profile");

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeSkill = (skill) => {
    if (skills.includes(skill)) {
      setskills(skills.filter((s) => s !== skill));
    }
  };

  const addEducation = (e) => {
    e.preventDefault();
    if (neweducation.college && neweducation.degree && neweducation.field) {
      seteducation([...education, neweducation]);
      setneweducation({ college: "", degree: "", field: "" });
    }
  };

  const addExperience = (e) => {
    e.preventDefault();
    if (
      newexperience.title &&
      newexperience.company &&
      newexperience.description
    ) {
      setexperience([...experience, newexperience]);
      setnewexperience({ title: "", company: "", description: "" });
    }
  };

  const removeExperience = (index) => {
    setexperience(experience.filter((_, i) => i !== index));
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (newskills && !skills.includes(newskills)) {
      setskills([...skills, newskills]);
      setnewskills("");
    }
  };

  const removeEducation = (index) => {
    seteducation(education.filter((_, i) => i !== index));
  };

  const handleProfileImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setbackendprofileimg(file);
      setprofileimg(URL.createObjectURL(file));
    }
  };

  const handleCoverImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setbackendcoverimg(file);
      setcoverimg(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <input
          type="file"
          accept="image/*"
          hidden
          ref={profileimgRef}
          onChange={handleProfileImg}
        />
        <input
          type="file"
          accept="image/*"
          hidden
          ref={coverimgRef}
          onChange={handleCoverImg}
        />

        <div
          className="relative bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md h-[550px] overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
              .overflow-y-auto::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>

          <button
            onClick={() => setedit(false)}
            className="absolute top-3 right-1 text-gray-500 hover:text-red-500 transition"
          >
            <FiX size={22} />
          </button>

          <div className="w-full h-[140px] bg-gray-200 rounded-t-xl overflow-hidden flex items-center justify-center relative">
            <img
              onClick={() => coverimgRef.current.click()}
              src={frontendcoverimg}
              alt="Cover"
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>

          <div className="absolute top-[115px] left-1/2 transform -translate-x-1/2 w-full px-4">
            <div className="flex flex-col items-center">
              <img
                onClick={() => profileimgRef.current.click()}
                src={frontendprofileimg}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg bg-white object-cover cursor-pointer"
              />
            </div>
          </div>

          <div className="max-w-md mx-auto p-8 bg-white rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Profile Information
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    value={firstname}
                    onChange={(e) => setfirstname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    value={lastname}
                    onChange={(e) => setlastname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="headline"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Headline
                </label>
                <input
                  type="text"
                  id="headline"
                  value={headline}
                  onChange={(e) => setheadline(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setlocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  value={gender}
                  onChange={(e) => setgender(e.target.value)}
                  placeholder="e.g. Male, Female, Non-binary, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold">Skills</h1>
                {skills.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {skills.map((skill, index) => (
                      <div
                        key={index}
                        className="w-full min-h-[40px] border-[1px] border-gray-600 bg-gray-200 p-[6px] rounded-md flex items-center justify-between"
                      >
                        <span className="truncate">{skill}</span>
                        <button
                          className="text-gray-500 hover:text-red-500 transition flex-shrink-0 ml-2"
                          onClick={() => removeSkill(skill)}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  className="w-full flex flex-col sm:flex-row gap-3 mt-4"
                  onSubmit={addSkill}
                >
                  <input
                    type="text"
                    placeholder="Add new skills"
                    value={newskills}
                    onChange={(e) => setnewskills(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black border-2 border-[black] rounded-lg hover:border-gray-600 transition duration-200 sm:w-auto w-full"
                  >
                    Add Skill
                  </button>
                </form>
              </div>

              <div className="">
                <h1 className="text-2xl font-bold">Education</h1>
                {education.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {education.map((edu, index) => (
                      <div
                        key={index}
                        className="w-full border-[1px] border-gray-600 bg-gray-200 p-4 rounded-md flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              College: {edu.college}
                            </span>
                            <span className="font-medium">
                              Degree: {edu.degree}
                            </span>
                            <span className="font-medium">
                              Field: {edu.field}
                            </span>
                          </div>
                          <button
                            className="text-gray-500 hover:text-red-500 transition"
                            onClick={() => removeEducation(index)}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  className="w-full flex flex-col gap-3 mt-4"
                  onSubmit={addEducation}
                >
                  <input
                    type="text"
                    placeholder="College"
                    value={neweducation.college}
                    onChange={(e) =>
                      setneweducation({
                        ...neweducation,
                        college: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={neweducation.degree}
                    onChange={(e) =>
                      setneweducation({
                        ...neweducation,
                        degree: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={neweducation.field}
                    onChange={(e) =>
                      setneweducation({
                        ...neweducation,
                        field: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black border-2 border-[black] rounded-lg hover:border-gray-600 transition duration-200 self-end"
                  >
                    Add Education
                  </button>
                </form>
              </div>

              <div className="">
                <h1 className="text-2xl font-bold">Experience</h1>
                {experience.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {experience.map((exp, index) => (
                      <div
                        key={index}
                        className="w-full border-[1px] border-gray-600 bg-gray-200 p-4 rounded-md flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              Title: {exp.title}
                            </span>
                            <span className="font-medium">
                              Company: {exp.company}
                            </span>
                            <span className="font-medium">
                              Description: {exp.description}
                            </span>
                          </div>
                          <button
                            className="text-gray-500 hover:text-red-500 transition"
                            onClick={() => removeExperience(index)}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  className="w-full flex flex-col gap-3 mt-4"
                  onSubmit={addExperience}
                >
                  <input
                    type="text"
                    placeholder="Title"
                    value={newexperience.title}
                    onChange={(e) =>
                      setnewexperience({
                        ...newexperience,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newexperience.company}
                    onChange={(e) =>
                      setnewexperience({
                        ...newexperience,
                        company: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                  />
                  <textarea
                    placeholder="Description"
                    value={newexperience.description}
                    onChange={(e) =>
                      setnewexperience({
                        ...newexperience,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black border-2 border-[black] rounded-lg hover:border-gray-600 transition duration-200 self-end"
                  >
                    Add Experience
                  </button>
                </form>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-6 bg-white text-black border border-[black] hover:bg-[black] hover:text-white font-medium py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
          <p className="text-center text-gray-600 mt-[-20px]">
            The information you save will be permanently stored in your profile.
          </p>
        </div>
      </div>
    </>
  );
}
