import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext"; 
import { FiCamera } from "react-icons/fi";
const Profile = () => {
  const [name, setName] = useState("Ashish");
  const [about, setAbout] = useState("Can't talk, WhatsApp only");
  const phoneNumber = "+91 72085 06052";
  const [avatar, setAvatar] = useState("https://via.placeholder.com/100"); // Default profile image
  const {authUser} = useAuthContext()
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };
  console.log(authUser)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 relative">
      {/* Half Box Background */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-indigo-800 to-blue-700 rounded-b-3xl"></div>

      {/* Profile Card */}
      <div className="relative bg-gray-800 text-white rounded-lg shadow-lg p-6 w-96 mt-20">
        {/* Profile Image Section */}
        <div className="relative w-40 h-40 rounded-full mx-auto -mt-24 border-4 border-gray-800 ">
          <img src={authUser.profilePic} alt="Profile" className="w-full h-full object-cover rounded-full z-10" />
          <label htmlFor="avatar-upload" className="absolute bottom-2 right-2 bg-green-500 w-8 h-8 p-1 rounded-full cursor-pointer ">
            <FiCamera className="text-black text-2xl"/>
          </label>
          <input type="file" id="avatar-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Editable Name Section */}
        <div className="mt-6">
          <label className="text-gray-400">Name</label>
          <input
            type="text"
            className="w-full bg-gray-700 p-2 rounded mt-1 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Editable About Section */}
        <div className="mt-4">
          <label className="text-gray-400">About</label>
          <input
            type="text"
            className="w-full bg-gray-700 p-2 rounded mt-1 outline-none"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </div>

        {/* Phone Number (Non-editable) */}
        <div className="mt-4">
          <label className="text-gray-400">Phone</label>
          <div className="w-full bg-gray-700 p-2 rounded mt-1">{phoneNumber}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
