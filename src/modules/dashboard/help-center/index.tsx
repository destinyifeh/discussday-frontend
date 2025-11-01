'use client';

import {PageHeader} from '@/components/app-headers';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {
  Book,
  FileText,
  HelpCircle,
  Info,
  Mail,
  MessageCircle,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import {useState} from 'react';

export const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      icon: <Book className="h-8 w-8" />,
      title: 'Getting Started',
      description: 'Learn the basics of using our forum',
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Account Management',
      description: 'Managing your profile and settings',
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: 'Posting & Commenting',
      description: 'How to engage in discussions',
    },
    {
      icon: <Info className="h-8 w-8" />,
      title: 'Community Guidelines',
      description: 'Our rules and policies',
    },
  ];

  const faqs = [
    {
      question: 'How do I create a new post?',
      answer:
        "To create a new post, click on the 'Create Post' button on the home page or in the sidebar. Fill in the title, content, and select a section for your post. You can also add images if needed. Once you're done, click 'Post' to publish your content.",
    },
    {
      question: 'How do I follow other users?',
      answer:
        "To follow another user, visit their profile page by clicking on their username or avatar. On their profile page, you'll find a 'Follow' button. Click on it to start following their content. You can view all users you're following in your profile under the 'Following' tab.",
    },
    {
      question: 'How do I change my profile picture?',
      answer:
        "To change your profile picture, go to your profile page by clicking on your avatar in the navigation bar, then select 'Edit Profile'. In the edit profile page, you'll find an option to upload a new profile picture or avatar.",
    },
    {
      question: 'What are the posting rules?',
      answer:
        'Our community guidelines require respectful communication, no spam, no harassment, and relevant content. Posts should be appropriate for all audiences and not contain offensive material. Violations may result in content removal or account suspension.',
    },
    {
      question: 'How do I report inappropriate content?',
      answer:
        "If you come across content that violates our community guidelines, you can report it by clicking on the three dots menu (...) next to the post or comment and selecting 'Report'. Provide details about why you're reporting it, and our moderation team will review it.",
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFaqs = searchQuery
    ? faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : faqs;

  return (
    <div>
      <PageHeader title="" />

      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-app/10 rounded-full mb-4">
            <HelpCircle className="h-6 w-6 text-app" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Help Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of
            our forum.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for help topics..."
              className="pl-10 py-6 text-base form-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {!searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {sections.map((section, index) => (
              <Card
                key={index}
                className="transition-all hover:shadow-md border-app/20">
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="p-2 bg-app/10 rounded-full mb-2">
                    {section.icon}
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground mb-2">
                  No results found for "{searchQuery}"
                </p>
                <p>Please try different keywords or browse our sections.</p>
              </Card>
            )}
          </Accordion>
        </div>

        <Card className="mb-12 border-app/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
                <p className="text-muted-foreground">
                  Our support team is ready to assist you
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* <Button variant="outline" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Live Chat
                </Button> */}
                <Link href="/contact-support">
                  <Button className="flex items-center gap-2 bg-app hover:bg-app/90 dark:text-white">
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
