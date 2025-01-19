"use client";
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

const formSchema = z.object({
  count: z.number().int().positive("Please select at least 1 attendee."),
  willAttend: z.boolean(),
});

export function Invited() {
  const params = useParams();
  const inviteId = params.inviteId;
  const [invited, setInvited] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/get-invite/${inviteId}`);
        if (response.status === 200) {
          setInvited(response.data.count); // Assuming this returns the count of allowed invites
        } else {
          toast.error("Failed to fetch invitation data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching invitation data.");
      }
    }
    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: 1,
      willAttend: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Processing RSVP...");
    try {
      const response = await axios.post(`/api/invited/${inviteId}`, values);
      if (response.status === 200) {
        toast.dismiss();
        toast.success("RSVP created successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Failed to submit RSVP.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting RSVP.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="lg">
          <SaveIcon /> RSVP NOW
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[80vw] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>😃 Thank you for RSVPing!</AlertDialogTitle>
          <AlertDialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Attendees</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of attendees" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: invited }, (_, index) => (
                            <SelectItem
                              key={index + 1}
                              value={(index + 1).toString()}
                            >
                              {index + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                out of {invited} invited
                <Button type="submit" className="w-full">
                  RSVP
                </Button>
              </form>
            </Form>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
