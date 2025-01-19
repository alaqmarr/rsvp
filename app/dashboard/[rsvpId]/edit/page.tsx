"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { stringify } from "querystring";
import Loading from "@/components/loading";

const formSchema = z.object({
  by: z.string().nonempty("Organiser's name is required"),
  date: z.date(),
  time: z.string().nonempty("Time is required"),
  name: z.string().nonempty("Event name is required"),
  description: z.string().nonempty("Description is required"),
  venue: z.string().nonempty("Location is required"),
  organiser: z.string().nonempty("This field is required"),
});

const Create = () => {
  const params = useParams();
  const rsvpId = params.rsvpId;
  const [currentData, setCurrentData] = useState<any>(null);

  useEffect(() => {
    toast.loading(rsvpId);
    const fetchData = async () => {
      if (rsvpId) {
        try {
            const url = `/api/event/${rsvpId}`;
          const response = await axios.get(url);
          setCurrentData(response.data.data); // Ensure response contains the data
            toast.remove();
            toast.success(stringify(response.data.data));
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };
    fetchData();

  }, [rsvpId]);

  

  // Always initialize the form regardless of `currentData`
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        by: "",
        date: new Date(),
        time: "",
        name: "",
        description: "",
        venue: "",
        organiser: "",
    },
  });


  //set current data to form values

    useEffect(() => {
        if (currentData) {
        form.setValue("by", currentData.by);
        form.setValue("date", currentData.date);
        form.setValue("time", currentData.time);
        form.setValue("name", currentData.name);
        form.setValue("description", currentData.description);
        form.setValue("venue", currentData.venue);
        form.setValue("organiser", currentData.organiser);
        }
    }, [currentData]);

  // Show a loading state while fetching data
  if (!currentData) {
    return (
      <Loading/>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Processing request");
    try {
      const request = await axios.post(`/api/update/${rsvpId}`, values);
      if (request.status === 200) {
        toast.remove();
        toast.success("Event updated successfully");
      }
    } catch (error: any) {
      toast.remove();

      // Improved error handling
      const errorMessage =
        error.response?.data?.body?.status +
        " - " +
        error.response?.data?.body?.error ||
        error.message ||
        "An error occurred. Please try again";

      toast.error(errorMessage);
      console.error("Error:", error);
    }
}

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <Card className="flex flex-col items-center max-w-[80vw] min-w-[300px] shadow-md gap-y-3">
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create Event</h2>
        </CardHeader>
        <Separator />

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid sm:gris-cols-1 md:gris-cols-1 lg:gris-cols-2 xl:grid-cols-2 gap-x-3 gap-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Event Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>By</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organiser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organiser</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe & Family" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date > new Date("2026-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input placeholder="12:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Apple Park" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button variant={"secondary"} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Create;
