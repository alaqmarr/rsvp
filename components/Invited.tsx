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
import { CheckCircleIcon, Loader2Icon, SaveIcon } from "lucide-react";
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
import { stringify } from "querystring";

const formSchema = z.object({
  count: z.number().int(),
  willAttend: z.boolean(),
});

export function Invited() {
  const [formState, setFormState] = useState<"none" | "pending" | "success">("none");
  const params = useParams();
  const inviteId = params.inviteId;
  const [invited, setInvited] = useState(1);  // Initial value as 1

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`/api/get-invite/${inviteId}`);
      if (response.status === 200) {
        const inviteCount = response.data.data.invites; // Ensure this is correct based on your API
        setInvited(inviteCount);  // Set the count of invites to the state
      } else {
        toast.error("Failed to fetch invitation data.");
      }
    }
    fetchData();
  }, [inviteId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: 1,
      willAttend: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Processing RSVP...");
    setFormState("pending");
    toast.success(stringify(values));
    try {
      const response = await axios.post(`/api/invited/${inviteId}`, values);
      if (response.status === 200) {
        toast.dismiss();
        toast.success("RSVP created successfully.");
        setFormState("success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Failed to submit RSVP.");
        setFormState("none");
      }
    } catch (error) {
      toast.error("An error occurred while submitting RSVP.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="text-xs">
          <SaveIcon />
          Click here to confirm your presence
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[80vw] lg:max-w-[80vw] xl:max-w-[40vw] 2xl:max-w-[40vw] rounded-lg">
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
                        value={field.value.toString()}  // Ensure value updates with form state
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number of attendees" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: invited + 1 }, (_, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {index} {/* Display index+1 for a 1-based count */}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                out of {invited} invited
                {
                  formState === "none" ?

                    <Button type="submit" className="w-full">
                      RSVP
                    </Button>

                    :

                    <Button type="button" className={`w-full ${formState === "success" ? "bg-emerald-500" : "bg-slate-300"}`} disabled={true}>
                      {
                        formState === "pending" ? <Loader2Icon /> : formState === "success" ?
                          <p>
                            <CheckCircleIcon className="inline-block mr-2" />
                            RSVP Successful
                          </p>
                          : "Unexpected Error Occurred"
                      }
                    </Button>


                }
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
