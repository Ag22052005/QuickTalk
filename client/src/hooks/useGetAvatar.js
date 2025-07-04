import { useState } from 'react'

const useGetAvatar = () => {
  const [avatars, setAvatars] = useState([]);

  const urls = [
    "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
    // "https://avatar.iran.liara.run/public",
  ];
  const getAvatars = () => {
    // Promise.allSettled(urls.map((url) => fetch(url))).then((results) => {
    //   const avt = results.map((result) => {
    //     // console.log(result)
    //     if (result.status === "fulfilled") return result.value.url;
    //   });
    //   setAvatars(avt);
    // });
    
  };
  return {avatars,getAvatars}
}

export default useGetAvatar