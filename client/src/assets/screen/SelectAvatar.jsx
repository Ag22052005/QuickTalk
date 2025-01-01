import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Blocks } from "react-loader-spinner";
import { updateAvatar } from "../store/Avatar";
import useGetAvatar from "../hooks/useGetAvatar";

const SelectAvatar = () => {
  const {avatars,getAvatars} = useGetAvatar();
  useEffect(() => {
    getAvatars();
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center ">
      <div className="border-2 w-[40%] h-[80%] flex py-4 items-center flex-col gap-8 overflow-hidden avatar-box">
        <h1 className="font-extrabold text-2xl">Select Avatar</h1>
        <div className="w-[50%] h-max-[90%] flex justify-center items-center avatar-container">
          {avatars.length === 0 ? (
            <div className="flex justify-center items-center">
              <Blocks />
            </div>
          ) : (
            <ul className="flex flex-wrap justify-between gap-8 avatar-ul">
              {avatars.map((avatar, index) => (
                <Link
                  to="/"
                  key={index}
                  onClick={(e) => updateAvatar(e.target.src)}
                >
                  <img
                    src={avatar}
                    className="w-[50px] h-[50px]"
                    alt="this is an avatar"
                  />
                </Link>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectAvatar;
