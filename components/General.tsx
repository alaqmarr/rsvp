"use client";
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
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
const formSchema = z.object({
  first: z.string().nonempty("First name is required"),
  last: z.string().nonempty("Last name is required"),
  willAttend: z.boolean(),
});
export function General() {
  const params = useParams();
  const router = useRouter();
  const rsvpId = params.rsvpId;
  const [formState, setFormState] = useState<"none" | "pending" | "success">("none");
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first: "",
      last: "",
      willAttend: true,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Processing request");
    setFormState("pending");
    try {
      const request = await axios.post(`/api/rsvp/${rsvpId}`, values);
      if (request.status === 200) {
        toast.remove();
        toast.success("RSVP created successfully");
        setFormState("success");
      } else {
        toast.error("RSVP failed");
        setFormState("none");
      }
    } catch (error) { }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" className="text-xs">
          <SaveIcon />
          Click here to confirm your presence
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[60vw] lg:max-w-[60vw] xl:max-w-[30vw] 2xl:max-w-[30vw] rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>😃 Thank you for RSVPing!</AlertDialogTitle>
          <AlertDialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="first"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="First Name" {...field} disabled={formState === "pending" ? true : formState === "success" ? true : false} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} disabled={formState === "pending" ? true : formState === "success" ? true : false} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="willAttend"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={formState === "pending" ? true : formState === "success" ? true : false}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Will attend this event
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

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
