"use client";
import React from "react";
import { Button } from "./ui/button";
import { DeleteIcon, TrashIcon } from "lucide-react";
import axios from "axios";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

const DeleteInvite = ({id} : {id:string}) => {
  const deleteInvite = async () => {
    const request = await axios.get(`/api/delete/invite/${id}`);
    if (request.status === 200) {
      alert("Invite Deleted Successfully");
    } else {
      alert("Error Deleting Invite");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" size={"icon"}>
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[280px]">
        <AlertDialogTitle>
          Are you sure you want to delete this attendee?
        </AlertDialogTitle>

        <AlertDialogDescription>
            This will also delete the invite if that exists.
        </AlertDialogDescription>

        <AlertDialogCancel>Cancel</AlertDialogCancel>

        <AlertDialogAction onClick={deleteInvite} className="bg-red-500">Delete</AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteInvite;
