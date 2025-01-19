"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import the CSS for the phone input component
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "next/navigation";

const formSchema = z.object({
  first: z.string().nonempty("First name is required"),
  last: z.string().nonempty("Last name is required"),
  count: z.number().int().positive("Please enter a valid number"),
  mobile: z.string().refine((value) => isValidPhoneNumber(value), {
    message: "Please enter a valid phone number",
  }),
});

const Invitations = () => {
  const params = useParams();
  const rsvpId = params.rsvpId;
  const [phoneNumber, setPhoneNumber] = useState("");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first: "",
      last: "",
      mobile: "",
      count: 1,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Processing request");
    try {
      const request = await axios.post(`/api/invite/${rsvpId}`, values);
      toast.success("Invite sent successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to send invite");
    }
    console.log(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="first"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
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
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
  control={form.control}
  name="count"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Number of Guests</FormLabel>
      <FormControl>
        <Input
          type="text" // Change type to text
          {...field}
          onChange={(e) => field.onChange(Number(e.target.value))} // Convert input to number on change
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  {/* Phone Number Input */}
                  <Controller
                    control={form.control}
                    name="mobile"
                    render={() => (
                      <PhoneInput
                        international
                        defaultCountry="IN" // Default country to India
                        value={phoneNumber}
                        onChange={(value) => {
                          setPhoneNumber(value ?? "");
                          field.onChange(value);
                        }}
                        className="border p-2 rounded w-full"
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default Invitations;
