"use client";
import React from "react";
import { Button } from "./ui/button";

const OpenLink = ({ url }: { url: string }) => {
  function openLink(url: string) {
    window.open(url, "_blank");
  }
  return (
    <div>
      <Button variant={"outline"} onClick={() => openLink(url)}>
        Open Link
      </Button>
    </div>
  );
};

export default OpenLink;
