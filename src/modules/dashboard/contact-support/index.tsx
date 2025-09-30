'use client';
import {useState} from 'react';

import {PageHeader} from '@/components/app-headers';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {toast} from '@/components/ui/toast';
import {SUPPORT_EMAIL, SUPPORT_NAME} from '@/constants/settings';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {MailUserDto} from '@/types/user.types';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  CheckCircle,
  HelpCircle,
  Mail,
  MessageSquare,
  PhoneCall,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {useUserActions} from '../actions/action-hooks/user.action-hooks';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  subject: z.string().min(5, {
    message: 'Subject must be at least 5 characters.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

export const ContactSupportPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {currentUser} = useAuthStore(state => state);
  const {MailUs} = useUserActions();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values, 'values');
    setIsSubmitting(true);

    const payload: MailUserDto = {
      ...values,
      username: SUPPORT_NAME,
      email: 'destechofficial@gmail.com',
      senderName: values.name,
      senderEmail: values.email,
    };

    console.log(payload, 'email payload');
    MailUs.mutate(payload, {
      onSuccess(data, variables, context) {
        form.reset();
        toast.success(
          `Your email was successfully sent to ${SUPPORT_EMAIL} 🎉`,
        );
      },
      onError(error, variables, context) {
        toast.error(
          `Oops! We couldn’t send your email to ${SUPPORT_EMAIL}. Please try again.`,
        );
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const supportSections = [
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: 'General Inquiries',
      description: 'Questions about our platform',
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Account Help',
      description: 'Issues with your account',
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: 'Report Abuse',
      description: 'Report inappropriate content',
    },
    {
      icon: <PhoneCall className="h-5 w-5" />,
      title: 'Technical Support',
      description: 'Help with technical issues',
    },
  ];

  return (
    <div>
      <PageHeader title="Contact Support" />
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-app/10 rounded-full mb-4">
            <Mail className="h-6 w-6 text-app" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Contact Support
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or need assistance? Our team is here to help. Fill
            out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {supportSections.map((section, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-2 bg-app/10 rounded-full">{section.icon}</div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-app" />
                  <span>support@discussday.com</span>
                </div>
                {/* <div className="flex items-center gap-3">
                  <PhoneCall className="h-5 w-5 text-app" />
                  <span>+1 (555) 123-4567</span>
                </div> */}
                <div className="mt-6">
                  <p className="mb-2 text-muted-foreground">Response Time</p>
                  <p>
                    We typically respond within 24-48 hours during business
                    days.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/help"
                  className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-accent">
                  <HelpCircle className="h-5 w-5" />
                  <span>Help Center</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-accent">
                  <Users className="h-5 w-5" />
                  <span>Account Settings</span>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below with your inquiry and we'll get back
                  to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="p-3 bg-app/10 rounded-full mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-center text-muted-foreground mb-6">
                      Thank you for reaching out. We've received your message
                      and will respond shortly.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  {...field}
                                  className="form-input"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your email"
                                  type="email"
                                  className="form-input"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Subject of your inquiry"
                                className="form-input"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({field}) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please describe your issue or question in detail"
                                className="min-h-[150px] resize-none form-input"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-app hover:bg-app/90 text-white"
                        disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
