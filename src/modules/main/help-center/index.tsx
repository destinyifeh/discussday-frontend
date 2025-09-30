'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

export const PublicHelpCenterPage = () => {
  return (
    <div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="py-8 border-b border-app-border">
          <h1 className="text-3xl font-bold">Help Center</h1>
          <p className="mt-2">
            Find answers to your questions and learn how to use Discussday
          </p>
        </div>

        <div className="py-8">
          {/* FAQ Tabs */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">
              Frequently Asked Questions
            </h2>
            <Tabs defaultValue="account" className="max-w-3xl">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      How do I create an account?
                    </AccordionTrigger>
                    <AccordionContent>
                      To create an account, click on the "Sign up" button on the
                      login page. Fill in your details including name, email,
                      and password. You'll receive a verification email to
                      confirm your account.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      How do I reset my password?
                    </AccordionTrigger>
                    <AccordionContent>
                      If you've forgotten your password, click on the "Forgot
                      password?" link on the login page. Enter your email
                      address, and we'll send you a link to reset your password.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How do I change my username?
                    </AccordionTrigger>
                    <AccordionContent>
                      You can change your username in your profile settings. Go
                      to your profile, click "Edit profile", and update your
                      username. Note that you can only change your username once
                      every 30 days.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>
                      How do I delete my account?
                    </AccordionTrigger>
                    <AccordionContent>
                      To delete your account, go to Settings, scroll down to the
                      "Danger Zone" section, and click "Delete Account". You'll
                      need to confirm this action. Note that account deletion is
                      permanent and cannot be undone.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="features">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I create a post?</AccordionTrigger>
                    <AccordionContent>
                      To create a post, click the "Post" button in the sidebar
                      or the pen icon in the mobile navigation. Select a
                      category, write your content, and click "Post" to publish.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      How do I follow other users?
                    </AccordionTrigger>
                    <AccordionContent>
                      To follow another user, visit their profile and click the
                      "Follow" button. You can also find users to follow in the
                      "Who to follow" section on the right sidebar.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How do I bookmark posts?
                    </AccordionTrigger>
                    <AccordionContent>
                      To bookmark a post, click the bookmark icon below the
                      post. You can access all your bookmarked posts by clicking
                      on "Bookmarks" in the sidebar.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How do categories work?</AccordionTrigger>
                    <AccordionContent>
                      Categories help organize posts by topic. When creating a
                      post, you can select a category. You can also browse posts
                      by category by clicking on a category name in the sidebar
                      or in a post.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="privacy">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How is my data used?</AccordionTrigger>
                    <AccordionContent>
                      We collect and use your data as described in our Privacy
                      Policy. This includes information you provide when
                      creating your account, posts you create, and your
                      interactions with other users and content.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      How do I report inappropriate content?
                    </AccordionTrigger>
                    <AccordionContent>
                      To report inappropriate content, click the three dots menu
                      on a post or comment and select "Report". Choose the
                      reason for reporting and submit. Our moderation team will
                      review the report.
                    </AccordionContent>
                  </AccordionItem>
                  {/* <AccordionItem value="item-3">
                    <AccordionTrigger>
                      How do I block another user?
                    </AccordionTrigger>
                    <AccordionContent>
                      To block a user, go to their profile, click the three dots
                      menu, and select "Block". Blocked users won't be able to
                      see your posts or interact with you.
                    </AccordionContent>
                  </AccordionItem> */}
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Who can see my posts?</AccordionTrigger>
                    <AccordionContent>
                      By default, all posts are public and can be seen by
                      anyone. In the future, we plan to add privacy options that
                      will allow you to limit who can see your posts.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          {/* User Guide Section */}
          <div
            id="user-guide"
            className="mb-12 pt-8 border-t border-app-border">
            <h2 className="text-xl font-semibold mb-6">User Guide</h2>
            <div className="space-y-6 max-w-3xl">
              <div className="p-6 rounded-lg max-w-3xl bg-muted/30">
                <h3 className="font-medium text-lg mb-3">Getting Started</h3>
                <p className=" mb-4">
                  Welcome to Discussday! This guide will help you navigate our
                  platform and make the most of your experience.
                </p>
                <ul className="list-disc list-inside  space-y-2 ml-2">
                  <li>
                    Create your profile and customize it to reflect your
                    interests
                  </li>
                  <li>Follow topics and users to personalize your feed</li>
                  <li>Join conversations by commenting on posts</li>
                  <li>Create your own posts to start discussions</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg max-w-3xl bg-muted/30">
                <h3 className="font-medium text-lg mb-3">Creating Posts</h3>
                <p className=" mb-4">
                  Sharing your thoughts and starting discussions is easy on
                  Discussday.
                </p>
                <ol className="list-decimal list-inside  space-y-2 ml-2">
                  <li>
                    Click the "Post" button in the sidebar or the pen icon in
                    mobile navigation
                  </li>
                  <li>Select a section for your post</li>
                  <li>Write your content and add any images or links</li>
                  <li>Click "Post" to publish</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Privacy & Safety Section */}
          {/* <div id="privacy" className="mb-12 pt-8 border-t border-app-border">
            <h2 className="text-xl font-semibold mb-6">Privacy & Safety</h2>
            <div className="space-y-6 max-w-3xl">
              <div className="p-6 rounded-lg max-w-3xl bg-muted/30">
                <h3 className="font-medium text-lg mb-3">Privacy Settings</h3>
                <p className=" mb-4">
                  Control who can see your content and how your information is
                  used.
                </p>
                <ul className="list-disc list-inside  space-y-2 ml-2">
                  <li>Adjust your profile visibility in Privacy Settings</li>
                  <li>Control who can message you directly</li>
                  <li>Manage email notifications and preferences</li>
                  <li>Download your data or request account deletion</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg max-w-3xl bg-muted/30">
                <h3 className="font-medium text-lg mb-3">Staying Safe</h3>
                <p className=" mb-4">
                  Tips for maintaining your safety and security on Discussday.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    Use a strong, unique password and enable two-factor
                    authentication
                  </li>
                  <li>
                    Be cautious about sharing personal information publicly
                  </li>
                  <li>Report inappropriate content or behavior</li>
                  <li>Block users who are harassing or bothering you</li>
                </ul>
              </div>
            </div>
          </div> */}

          {/* Community Guidelines Section */}
          <div id="community" className="mb-12 pt-8 border-t border-app-border">
            <h2 className="text-xl font-semibold mb-6">Community Guidelines</h2>
            <div className="p-6 rounded-lg max-w-3xl bg-muted/30">
              <p className=" mb-6">
                Our community guidelines are designed to ensure Discussday
                remains a respectful, inclusive, and constructive platform for
                everyone.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Be Respectful</h3>
                  <p className="">
                    Treat others with respect and kindness, even in
                    disagreement.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">No Harassment</h3>
                  <p className="">
                    Harassment, bullying, or intimidation is not tolerated.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">No Hate Speech</h3>
                  <p className="">
                    Content that promotes hate based on identity or
                    vulnerability is prohibited.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">No Misinformation</h3>
                  <p className="">
                    Avoid sharing false information that could cause harm.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Respect Privacy</h3>
                  <p className="">
                    Do not share others' personal information without consent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support Section */}
          <div id="contact" className="mb-12 pt-8 border-t border-app-border">
            <h2 className="text-xl font-semibold mb-6">Contact Support</h2>
            <div className="p-6 rounded-lg max-w-3xl bg-muted/30">
              <p className=" mb-6">
                Need help with something specific? Our support team is here to
                assist you.
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Email Support</h3>
                  <p className="">
                    For general inquiries and non-urgent issues, email us at{' '}
                    <a
                      href="mailto:support@discussday.com"
                      className="text-[#0A66C2] hover:underline">
                      support@discussday.com
                    </a>
                  </p>
                  <p className=" mt-1">
                    We typically respond within 24-48 hours.
                  </p>
                </div>

                {/* <div>
                  <h3 className="font-medium mb-2">Live Chat</h3>
                  <p className=" mb-3">
                    For immediate assistance, our live chat is available Monday
                    through Friday, 9am-5pm EST.
                  </p>
                  <Button className="bg-app text-white hover:bg-app/90">
                    Start Live Chat
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
