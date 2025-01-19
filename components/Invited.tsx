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
import { useEffect, useState } from "react";
const formSchema = z.object({
  count: z.number().int().positive("Please enter a valid number"),
  willAttend: z.boolean(),
});
export function Invited() {
  const params = useParams();
  const router = useRouter();
  const rsvpId = params.rsvpId;
  const inviteId = params.inviteId;
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: 1,
      willAttend: true,
    },
  });

  const [invited, setInvited] = useState(1);
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(`/api/get-inv/${inviteId}`);
      if (request.status === 200) {
        setInvited(request.data.data);
      } else {
        toast.error("Failed to fetch data");
      }
    }
    fetchData();
  }, [inviteId]);
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Processing request");
    try {
      const request = await axios.post(`/api/invited/${inviteId}`, values);
      if (request.status === 200) {
        toast.remove();
        toast.success("RSVP created successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("RSVP failed");
      }
    } catch (error) {}
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="lg">
          <SaveIcon />
          RSVP NOW
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[80vw] rounded-lg">
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
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toFixed()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select count of Attendees" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: invited }).map((_, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {index}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
