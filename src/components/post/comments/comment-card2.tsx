import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {toast} from '@/components/ui/toast';
import {useAuthStore} from '@/hooks/stores/use-auth-store';
import {CommentFeedProps} from '@/types/post-item.type';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import CommentActions from './comment-actions';
import CommentContent from './comment-content';
import CommentEditForm from './comment-edit-form';
import CommentHeader from './comment-header';

interface CommentCardProps {
  comment: CommentFeedProps;
  onQuote?: () => void;
  handleQuoteClick: (quote: string) => void;
}

const CommentCard2 = ({
  comment,
  onQuote,
  handleQuoteClick,
}: CommentCardProps) => {
  const [user] = useState({id: '3'});
  const {currentUser} = useAuthStore(state => state);
  const [liked, setLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editImagePreview, setEditImagePreview] = useState<string>();
  // default to an empty array if undefined
  const navigate = useRouter();

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleReport = () => {
    toast.success(
      'Thank you for reporting this comment. Our team will review it.',
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
    // setEditImagePreview(comment.images || []);
  };
  const updateComment = (updatedComment: Comment) => {
    // setComments(prevComments =>
    //   prevComments.map(comment =>
    //     comment.id === updatedComment.id ? updatedComment : comment
    //   )
    // );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.info('Image too large. Please select an image less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.info('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        setEditImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setEditImagePreview(undefined);
  };

  const handleSaveEdit = () => {
    if (!editContent.trim() && !editImagePreview) {
      toast.info('Comment cannot be empty');
      return;
    }

    // updateComment({
    //   ...comment,
    //   content: editContent.trim(),
    //   image: editImagePreview
    // });

    setIsEditing(false);
    toast.success(
      // "Comment Updated",
      'Your comment has been updated successfully',
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
    // setEditImagePreview(comment.images || []);
  };

  const handleQuote = () => {
    if (onQuote) {
      onQuote();
      return;
    }

    // Extract only the direct content, not any nested quotes
    const contentToQuote = extractDirectContent(comment.content);
    //const quoteText = `> ${comment.username}: ${contentToQuote}`;

    // Navigate to reply page with quoted text
    // navigate(`/post/${postId}/reply`, {
    //   state: {
    //     quote: quoteText,
    //     quotedUser: comment.username
    //   }
    // });
  };

  // Function to extract direct content, ignoring any nested quotes
  const extractDirectContent = (content: string): string => {
    // If content has a quote block
    if (content.startsWith('> ')) {
      const quoteEndIndex = content.indexOf('---QUOTE_END---');
      if (quoteEndIndex !== -1) {
        // Return only the content after the quote (the user's added text)
        return content.substring(quoteEndIndex + 15);
      }
    }
    return content;
  };

  const handleQuoteClick2 = (quotedUsername: string) => {
    // Find the comment element by username and scroll to it
    const commentElements = document.querySelectorAll('[data-username]');
    const targetComment = Array.from(commentElements).find(
      el => el.getAttribute('data-username') === quotedUsername,
    );

    if (targetComment) {
      targetComment.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      // Add a highlight effect
      targetComment.classList.add(
        'bg-blue-50',
        'border-l-4',
        'border-blue-500',
      );
      setTimeout(() => {
        targetComment.classList.remove(
          'bg-blue-50',
          'border-l-4',
          'border-blue-500',
        );
      }, 2000);
    }
  };

  const isOwnComment = currentUser?._id === comment.commentBy._id;

  return (
    <div
      className="border-b border-app-border p-4 hover:bg-app-hover transition-colors"
      data-username={comment.commentBy.username}>
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.commentBy.avatar ?? undefined} />
          <AvatarFallback className="capitalize text-app text-3xl">
            {comment.commentBy.username.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <CommentHeader
            comment={comment}
            isOwnComment={isOwnComment}
            onEdit={handleEdit}
            onReport={handleReport}
          />

          <CommentContent
            content={comment.content}
            isEditing={isEditing}
            editContent={editContent}
            onEditContentChange={setEditContent}
            onQuoteClick={handleQuoteClick}
            commentId={comment._id}
          />

          {!isEditing && comment.images && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <img
                // src={comment.images}
                alt="Comment attachment"
                className="max-h-60 object-contain"
              />
            </div>
          )}

          {isEditing ? (
            <CommentEditForm
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
              // imagePreview={editImagePreview}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
            />
          ) : (
            <CommentActions
              comment={comment}
              liked={liked}
              onLike={handleLike}
              onQuote={handleQuote}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard2;
