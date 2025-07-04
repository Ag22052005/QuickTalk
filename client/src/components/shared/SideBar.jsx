import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContextProvider";
import { useTabSwitchContext } from "@/context/TabSwitchContext";
import UserChatBox from "./UserChatBox";
import AddContact from "./AddContact";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  UserPlus,
  Filter,
  MoreVertical,
  LogOut,
  Settings,
  UserCircle,
  Search,
} from "lucide-react";
import useGetContacts from "@/hooks/useGetContacts";

function SideBar() {
  const { contacts, setAuthUser } = useAuthContext();
  const {getContact} = useGetContacts()
  const { currentReceiver, setCurrentReceiver } = useContext(ChatContext);
  const { setCurrentTab } = useTabSwitchContext();
  const [toggleAddContact, setToggleAddContact] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    
    getContact()
  }, []);

  useEffect(()=>{
    // console.log("setting filteredcontacts",contacts);
    setFilteredContacts(contacts);

  },[contacts])

  useEffect(() => {
    if (searchUser.toLowerCase().trim()) {
      const result = contacts?.filter((contact) =>
        contact?.contactName
          ?.toLowerCase()
          .includes(searchUser.toLowerCase().trim())
      );
      setFilteredContacts(result);
    }
  }, [searchUser, contacts]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthUser(null);
    navigate("/login");
  };

  return (
    <div
      className={`artboard w-full md:w-[35%] h-full rounded-lg overflow-hidden ${
        currentReceiver ? "hidecontainer" : ""
      }`}
    >
      <div className="mx-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center py-3 px-2 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm rounded-md">
          <h1 className="text-2xl font-semibold">Chats</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCurrentReceiver(null);
                setToggleAddContact(!toggleAddContact);
              }}
            >
              <UserPlus className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter className="w-5 h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <UserCircle className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className="relative my-2">
          <Input
            type="text"
            placeholder="Search"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute top-2.5 left-3 w-4 h-4 text-muted-foreground" />
        </div>

        {/* Chat List / Add Contact */}
        <div className="flex-grow overflow-y-auto">
          {toggleAddContact ? (
            <AddContact
              setToggleAddContact={setToggleAddContact}
              toggleAddContact={toggleAddContact}
            />
          ) : (
            <ul className="space-y-1">
              {filteredContacts?.length > 0 ? (
                filteredContacts.map((contact) => (
                  <UserChatBox contact={contact} key={contact._id} />
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No Contacts Found
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
