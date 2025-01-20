"use client";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "./ui/button";

const ShortenUrl = ({ longUrl }: { longUrl: string }) => {
  const [url, setUrl] = useState<string>("");
  const shortenUrl = async (longUrl: string) => {
    const response = await axios.post("/api/url/short", {
      longUrl,
    });

    const data = await response.data;

    return data.shortUrl;
    setUrl(data.shortUrl);
  };

  return (
    <div>
      <Button onClick={() => shortenUrl}>Shorten URL</Button>

      <code>{url}</code>
    </div>
  );
};

export default ShortenUrl;
