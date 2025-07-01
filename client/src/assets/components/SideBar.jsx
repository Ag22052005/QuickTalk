import React, { useContext, useEffect, useState } from "react";
import { IoPersonAdd } from "react-icons/io5";
import { MdFilterList, MdMoreVert } from "react-icons/md";
import UserChatBox from "./UserChatBox";
import AddContact from "./AddContact";
import { useAuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContextProvider";
import { Link, useNavigate } from "react-router-dom";
function SideBar() {
  const { contacts } = useAuthContext();
  const [toggleAddContact, setToggleAddContact] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentReceiver, setCurrentReceiver } = useContext(ChatContext);
  const { setAuthUser } = useAuthContext();
  const [searchUser, setSearchUser] = useState("");
  const navigate = useNavigate();
  const [filteredContacts, setFilteredContacts] = useState(contacts || []);
  const handleSearchContacts = () => {
    setFilteredContacts(
      contacts.filter((contact) =>
        contact.contactName.toLowerCase().includes(searchUser.toLowerCase().trim())
      )
    );
  };
  useEffect(() => {
    handleSearchContacts();
  }, [toggleAddContact, searchUser,contacts]);

  return (
    <>
      <div
        className={`artboard w-full md:w-[35%] h-full rounded-lg overflow-hidden ${
          currentReceiver ? "hidecontainer" : ""
        }`}
      >
        <div className="mx-4 h-full flex flex-col">
          <div className="sideBar-header flex justify-between p-2">
            <h1 className="text-2xl">Chats</h1>
            <div className="flex items-center gap-2 relative">
              <div
                className="flex justify-center items-center text-2xl cursor-pointer"
                onClick={() => {
                  setCurrentReceiver(null);
                  setToggleAddContact(!toggleAddContact);
                }}
              >
                <IoPersonAdd />
              </div>
              <MdFilterList className="text-2xl cursor-pointer" />

              <div
                className="relative"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <MdMoreVert className="text-2xl cursor-pointer" />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#1d232a] rounded-md shadow-lg z-10">
                    <ul className="py-2">
                      <Link to ="/profile"
                        className="px-4 py-2 hover:bg-slate-800 cursor-pointer block"
                        onClick={() => {
                          // Handle profile settings
                          setShowDropdown(false);
                        }}
                      >
                        Profile
                      </Link>
                      <Link to=""
                        className="px-4 py-2 hover:bg-slate-800  cursor-pointer block"
                        onClick={() => {
                          // Handle settings
                          setShowDropdown(false);
                        }}
                      >
                        Settings
                      </Link>
                      <Link to ="/"
                        className="px-4 py-2 hover:bg-slate-800  cursor-pointer text-red-500 block"
                        onClick={() => {
                          localStorage.removeItem("authToken");
                          localStorage.removeItem("user");
                          setAuthUser(null);
                          navigate("/login");
                        }}
                      >
                        Logout
                      </Link>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <hr className="w-[95%] m-auto" />
          <label className="input input-bordered flex items-center gap-2 my-2">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <div className="flex-grow overflow-y-auto">
            {toggleAddContact ? (
              <AddContact
                setToggleAddContact={setToggleAddContact}
                toggleAddContact={toggleAddContact}
              />
            ) : (
              <ul className="w-auto">
                {filteredContacts.length ? filteredContacts?.map((contact) => (
                  <div key={contact._id} >
                    <UserChatBox contact={contact} />
                  </div>
                )):<div className="text-white text-center m-8 ">Contact Not Found </div>}
              </ul>
              
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;
