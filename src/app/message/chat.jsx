"use client";

import * as Ably from "ably";
import ChatBox from "./chat-box.jsx";

export default function Chat() {
  const client = new Ably.Realtime({
    key: "zxGD6A.YJr3Dg:wDmDGCKIueAl5CpTM1m11p-9TXsgITEB-TDusC_TzZM",
  });
  return <ChatBox />;
}
