'use client';
import ErrorFeedback from '@/components/feedbacks/error-feedback';
import {MobileBottomTab} from '@/components/layouts/dashboard/mobile-bottom-tab';
import {AddPostField} from '@/components/post/add-post-field';
import CommunityGuidelines from '@/components/post/community-guidelines';
import CreatePostSkeleton from '@/components/skeleton/create-post-skeleton';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {toast} from '@/components/ui/toast';
import {Sections} from '@/constants/data';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {usegoBack} from '@/hooks/use-smart-back';
import {queryClient} from '@/lib/client/query-client';
import {capitalizeName} from '@/lib/formatter';
import {SectionName} from '@/types/section';
import {useQuery} from '@tanstack/react-query';
import {ChevronLeft, FileImage, Trash2} from 'lucide-react';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';

import {postService} from '@/services/post-service';
import {formattedPostTitle, PostDto, UpdatePostDto} from '../dto/post-dto';
import {usePostActions} from '../post-hooks';

export const CreatePostPage = () => {
  const {currentUser} = useAuthStore(state => state);
  const [content, setContent] = useState('');
  const [selectedSection, setSelectedSection] = useState<SectionName>();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [images, setImages] = useState<File[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]); // Track removed public_ids
  const [originalImages, setOriginalImages] = useState<
    {secure_url: string; public_id: string}[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [postToEdit, setPostToEdit] = useState<any>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const goBack = usegoBack('/home');
  const navigate = useRouter();
  const location = useSearchParams();
  const {slugId} = useParams<{slugId: string}>();
  const {createPostRequest, updatePostRequest} = usePostActions();
  const postId = location.get('discussId');
  const theSection = location.get('section');
  console.log(theSection, 'section001');
  const shouldQuery = !!slugId;
  const {
    isLoading,
    error,
    data: post,
    refetch: refetchPost,
  } = useQuery({
    queryKey: ['edit-post', slugId],
    queryFn: () => postService.getPostBySlugIdRequestAction(slugId as string),
    retry: 1,
    enabled: shouldQuery,
  });
  console.log(shouldQuery, 'should query', error);

  console.log(post, 'should query dataa');
  console.log(currentUser, 'currentooo');

  useEffect(() => {
    if (theSection) {
      //setSelectedSection(theSection as SectionName);
      setSelectedSection(
        (theSection.charAt(0).toUpperCase() +
          theSection.slice(1)) as SectionName,
      );
    }
  }, [theSection]);

  useEffect(() => {
    if (post) {
      setIsEditing(true);
      setPostToEdit(post);
      setContent(post.content);
      setSelectedSection(capitalizeName(post.section) as SectionName);
      const originals = post.images || [];
      setOriginalImages(originals);
      setImageUrls(originals.map((img: any) => img.secure_url));
    }
  }, [post]);

  if (isEditing && (error?.message === 'Post not found' || !slugId)) {
    return (
      <ErrorFeedback
        showGoBack
        showRetry
        onRetry={refetchPost}
        message="Post not found"
      />
    );
  }

  if (isLoading) {
    return <CreatePostSkeleton />;
  }

  if (error) {
    return <ErrorFeedback showGoBack showRetry onRetry={refetchPost} />;
  }

  if (
    isEditing && // User is trying to edit
    post && // There is a post
    post.user._id !== currentUser?._id && // AND the user is NOT the owner of the post
    currentUser?.role !== 'super_admin' && // AND the user is NOT a super_admin
    currentUser?.role !== 'admin' // AND the user is NOT an admin
  ) {
    return (
      <ErrorFeedback
        showGoBack
        message="Access Denied: You are not authorized to edit this post."
      />
    );
  }

  const updatePost = (dataToUpdate: UpdatePostDto) => {
    console.log(dataToUpdate, 'dataa');
    setIsSubmitting(true);
    updatePostRequest.mutate(dataToUpdate, {
      onSuccess(data, variables, context) {
        console.log(data, 'post data');
        queryClient.invalidateQueries({queryKey: ['edit-post', slugId]});
        toast.success('Your post has been updated successfully.');
        navigate.push(`/discuss/${dataToUpdate.section}`);
      },
      onError(error, variables, context) {
        console.log(error, 'update post err');
        toast.error(error.message ?? 'Oops! Something went wrong.');
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    if (imageUrls.length + files.length > 4) {
      toast.info('You can only upload a maximum of 4 images');
      return;
    }

    Array.from(files).forEach(file => {
      // Create a blob URL for the image
      const imageUrl = URL.createObjectURL(file);
      console.log(imageUrl, 'imagerrrr');
      setImages(prev => [...prev, file]);
      setImageUrls(prev => [...prev, imageUrl]);
    });
  };

  const removeImage = (index: number) => {
    const urlToRemove = imageUrls[index];

    // If the removed image is from the original post
    const original = originalImages.find(img => img.secure_url === urlToRemove);
    if (original) {
      setRemovedImageIds(prev => [...prev, original.public_id]);
      setOriginalImages(prev =>
        prev.filter(img => img.secure_url !== urlToRemove),
      );
    } else {
      // Removing a newly uploaded image
      setImages(prev =>
        prev.filter((_, i) => i !== index - originalImages.length),
      );
    }

    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const addPost = (dataToPost: PostDto) => {
    console.log(dataToPost, 'dataa');
    setIsSubmitting(true);
    createPostRequest.mutate(dataToPost, {
      onSuccess(data, variables, context) {
        console.log(data, 'post data');
        toast.success('Your post has been published successfully.');
        navigate.push(`/discuss/${dataToPost.section}`);
      },
      onError(error, variables, context) {
        console.log(error, 'post err');
        toast.error(error.message ?? 'Oops! Something went wrong.');
      },
      onSettled(data, error, variables, context) {
        setIsSubmitting(false);
      },
    });
  };

  const handleSubmitPost = () => {
    if (!content.trim() || !selectedSection) {
      toast.error('Please enter content and select a section.');
      return;
    }

    if (content.length < 20) {
      toast.error('Minimum of 20 characters is required.');
      return;
    }

    if (isEditing && postToEdit) {
      // Update existing post
      updatePost({
        content: content,
        title: formattedPostTitle(content),
        images: images,
        section: selectedSection.toLowerCase() as SectionName,
        postId: post._id as string,
        removedImageIds: removedImageIds,
      });
    } else {
      // Create new post
      addPost({
        content: content,
        title: formattedPostTitle(content),
        section: selectedSection.toLowerCase() as SectionName,
        images: images,
      });
    }
  };

  const getButtonLabel = () => {
    if (isEditing) {
      return isSubmitting ? 'Updating...' : 'Update';
    }
    return isSubmitting ? 'Posting...' : 'Post';
  };
  return (
    <div className="pb-25">
      {/* <MobileNavigation /> */}
      <div className="sticky top-0 backdrop-blur-sm border-b z-10 bg-white/80 border-app-border dark:bg-background">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate.back()}>
              <ChevronLeft />
            </Button>
            <h1 className="text-xl font-bold">
              {isEditing ? 'Edit' : 'Create Post'}
            </h1>
          </div>
          <Button
            className="rounded-full bg-app hover:bg-app/90 md:hidden text-white"
            onClick={handleSubmitPost}
            disabled={!content.trim() || !selectedSection || isSubmitting}>
            {getButtonLabel()}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row md:gap-4">
          <Avatar className="h-10 w-10 md:h-12 md:w-12 mb-4 md:mb-0">
            <AvatarImage src={currentUser?.avatar ?? undefined} />
            <AvatarFallback className="capitalize text-app text-3xl">
              {currentUser?.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <AddPostField setContent={setContent} content={content} />

            {/* Hidden file input for image uploads */}
            <input
              type="file"
              accept="image/*"
              multiple
              ref={imageInputRef}
              onChange={handleImageUpload}
              className="hidden"
              max="4"
            />

            {/* Display image previews */}

            {imageUrls.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden w-24 h-24 sm:w-32 sm:h-32">
                    <img
                      src={url}
                      alt={`Post attachment ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-600 w-6 h-6"
                      onClick={() => removeImage(index)}>
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-app-border">
              <div className="flex space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-app h-8 w-8 p-0"
                  onClick={() => {
                    if (imageUrls.length < 4) {
                      imageInputRef.current?.click();
                    } else {
                      toast.error('Maximum of 4 images allowed');
                    }
                  }}
                  disabled={imageUrls.length >= 4}>
                  <FileImage size={18} />
                </Button>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="text-app h-8 w-8 p-0">
                  <SmileIcon size={18} />
                </Button> */}
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGuidelines(!showGuidelines)}
                  className="text-xs sm:text-sm">
                  Community Guidelines
                </Button>

                <Select
                  value={selectedSection}
                  onValueChange={(value: SectionName) =>
                    setSelectedSection(value)
                  }>
                  <SelectTrigger className="w-[140px] sm:w-[180px] text-xs sm:text-sm form-input">
                    <SelectValue placeholder="Select section" className="" />
                  </SelectTrigger>
                  <SelectContent>
                    {Sections.map(section => (
                      <SelectItem key={section.name} value={section.name}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="hidden md:block rounded-full bg-app hover:bg-app/90 text-white"
                  onClick={handleSubmitPost}
                  disabled={
                    !content.trim() || !selectedSection || isSubmitting
                  }>
                  {getButtonLabel()}
                </Button>
              </div>
            </div>

            {showGuidelines && (
              <Card className="mt-4">
                <CardContent className="px-4">
                  <CommunityGuidelines setShowGuidelines={setShowGuidelines} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className={`md:hidden fixed bottom-0 left-0 right-0 w-full z-50`}>
        <MobileBottomTab />
      </div>
    </div>
  );
};
