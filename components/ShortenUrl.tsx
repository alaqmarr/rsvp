"use client";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const ShortenUrl = ({ longUrl }: { longUrl: string }) => {
  if (!longUrl) {
    return (
      <div>
        <h1>URL not found</h1>
      </div>
    );
  }

  const [url, setUrl] = useState<string>("");

  const shortenUrl = async () => {
    toast.loading("Shortening URL...");
    try {
      const response = await axios.post("/api/url/short", { longUrl });
      const data = response.data;

      if (!data.shortUrl) {
        toast.error("Failed to shorten the URL. Please try again.");
        return;
      }

      navigator.clipboard.writeText(data.shortUrl);
      toast.success("URL copied to clipboard");
      setUrl(data.shortUrl);
    } catch (error) {
      toast.error("An error occurred while shortening the URL.");
      console.error(error);
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div>
      <Button onClick={shortenUrl}>Shorten URL</Button>
      {url && (
        <div>
          <p>Shortened URL:</p>
          <code>{url}</code>
        </div>
      )}
    </div>
  );
};

export default ShortenUrl;
