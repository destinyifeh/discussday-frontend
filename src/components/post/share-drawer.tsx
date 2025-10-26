import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useState} from 'react';

import {
  Copy,
  Facebook,
  Linkedin,
  MessageCircle,
  Monitor,
  QrCode,
  Twitter,
  X,
} from 'lucide-react';
import {QRCodeSVG} from 'qrcode.react';
import {toast} from '../ui/toast';

interface ShareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postTitle: string;
}

const ShareDrawer = ({
  open,
  onOpenChange,
  postId,
  postTitle,
}: ShareDrawerProps) => {
  const postUrl = `${window.location.origin}/post/${postId}`;
  const [showQRCode, setShowQRCode] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        toast.success('Post link has been copied to clipboard.');
      })
      .catch(() => {
        toast.error('Failed to copy link, please try again.');
      });
  };

  const handleSendToDevices = async () => {
    // Check if Web Share API is available and not in iframe
    const isShareSupported =
      typeof navigator.share !== 'undefined' && window.self === window.top;

    if (isShareSupported) {
      try {
        await navigator.share({
          title: postTitle,
          url: postUrl,
        });
        toast.success('Post shared to your device.');
      } catch (error) {
        // User cancelled the share dialog
        if ((error as Error).name === 'AbortError') {
          return;
        }
        // Other errors - fallback to copy
        toast.success(
          'Link copied to clipboard. You can now share it on your device.',
        );
        handleCopyLink();
      }
    } else {
      // Fallback: just copy the link
      handleCopyLink();
      toast.success(
        'Link copied! Open this on your mobile device to use native sharing.',
      );
    }
  };

  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  const handleSocialShare = (
    platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp',
  ) => {
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(postTitle);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleContactShare = (contactName: string) => {
    handleCopyLink();
    toast.success(`Link copied! You can now share it with ${contactName}.`);
  };

  // Mock contacts for demonstration
  const mockContacts = [
    {id: 1, name: 'John Doe', avatar: ''},
    {id: 2, name: 'Jane Smith', avatar: ''},
    {id: 3, name: 'Mike Johnson', avatar: ''},
    {id: 4, name: 'Sarah Wilson', avatar: ''},
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle>Sharing link</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X size={20} />
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription className="sr-only">
            Share this post via link or social media
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* URL with copy button */}
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/discussday-logo.png" />
              <AvatarFallback>DD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm truncate text-foreground">{postUrl}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopyLink}>
              <Copy size={20} />
            </Button>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 justify-start gap-2"
              onClick={handleSendToDevices}>
              <Monitor size={18} />
              Send to devices
            </Button>
            <Button
              variant="outline"
              className="flex-1 justify-start gap-2"
              onClick={handleShowQRCode}>
              <QrCode size={18} />
              QR code
            </Button>
          </div>

          {/* Social media sharing */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              Share to social media
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => handleSocialShare('whatsapp')}>
                <MessageCircle size={18} />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => handleSocialShare('facebook')}>
                <Facebook size={18} />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => handleSocialShare('twitter')}>
                <Twitter size={18} />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => handleSocialShare('linkedin')}>
                <Linkedin size={18} />
                LinkedIn
              </Button>
            </div>
          </div>

          {/* Contacts tabs */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="personal" className="flex-1">
                Personal
              </TabsTrigger>
              <TabsTrigger value="work" className="flex-1">
                Work
              </TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-4">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {mockContacts.map(contact => (
                  <button
                    key={contact.id}
                    className="flex flex-col items-center gap-2 min-w-[70px]"
                    onClick={() => handleContactShare(contact.name)}>
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-center text-foreground line-clamp-2">
                      {contact.name}
                    </span>
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="work" className="mt-4">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {mockContacts.slice(0, 2).map(contact => (
                  <button
                    key={contact.id}
                    className="flex flex-col items-center gap-2 min-w-[70px]"
                    onClick={() => handleContactShare(contact.name)}>
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-center text-foreground line-clamp-2">
                      {contact.name}
                    </span>
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to share the post
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG value={postUrl} size={256} level="H" includeMargin />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {postUrl}
            </p>
            <Button onClick={handleCopyLink} className="w-full">
              <Copy size={16} className="mr-2" />
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Drawer>
  );
};

export default ShareDrawer;
