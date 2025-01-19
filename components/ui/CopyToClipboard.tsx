"use client";
import React from "react";
import { Button } from "./button";
import toast from "react-hot-toast";

const CopyToClipboard = ({ url }: { url: string }) => {
  const copyToClipboard = (string: string) => {
    if (typeof window !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(string)
        .then(() => console.log("Text copied"))
        .catch(() => console.log("Copy failed"));
    } else {
      console.log("Clipboard API not supported or server-side execution");
      toast.error("Copy failed, tip: try manually copying the link");
    }
  };

  return (
    <div>
      <Button variant={"outline"} onClick={() => copyToClipboard(url)}>
        Copy link
      </Button>
    </div>
  );
};

export default CopyToClipboard;
