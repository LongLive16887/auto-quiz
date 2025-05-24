import { useStudentStore } from "@/store/student";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { studentEditSchema } from "../../schemas";
import { Button } from "../ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Student } from "@/types";
import { Calendar } from "../ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type StudentFormProps = {
  onPasswordChange: () => void;
  data: Student;
};

const StudentEditForm = ({ onPasswordChange, data }: StudentFormProps) => {
  const [loading, setLoading] = useState(false);
  const { editStudent } = useStudentStore();

  const form = useForm<z.infer<typeof studentEditSchema>>({
    resolver: zodResolver(studentEditSchema),
    defaultValues: {
      id: data.id,
      username: data.username,
      full_name: data.full_name,
      expiration_date: data.expiration_date,
    },
  });

  const onSubmit = (formData: z.infer<typeof studentEditSchema>) => {
    setLoading(true);
    editStudent(formData).then(() => {
      setLoading(false);
      onPasswordChange();
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full flex flex-col"
        autoComplete="off">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>to'liq ism</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiration_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Muddati</FormLabel>
              <FormControl>
                {/* <Popover>
									<PopoverTrigger asChild>
										<Button
											variant={'outline'}
											className={cn(
												'justify-start text-left font-normal py-6',
												!field.value && 'text-muted-foreground'
											)}
										>
											<CalendarIcon className='mr-2 h-4 w-4' />
											{field.value
												? format(new Date(field.value), 'PPP')
												: 'Sanani tanlang'}
										</Button>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0'>
										<Calendar
											mode='single'
											selected={field.value ? new Date(field.value) : undefined}
											onSelect={selectedDate => {
												field.onChange(selectedDate?.toISOString() || '')
											}}
											initialFocus
										/>
									</PopoverContent>
								</Popover> */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      onMouseDown={(e) => e.preventDefault()}
                      className={cn(
                        "justify-start text-left font-normal py-6",
                        !field.value && "text-muted-foreground"
                      )}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value
                        ? format(new Date(field.value), "PPP")
                        : "Sanani tanlang"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[9999]">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(selectedDate) => {
                        field.onChange(selectedDate?.toISOString() || "");
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="self-end"
          size="default"
          disabled={loading}>
          Saqlash
          {loading ? (
            <Loader2 color="white" className="animate-spin" />
          ) : (
            <LogIn />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default StudentEditForm;
