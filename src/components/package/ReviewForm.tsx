import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reviewText.trim()) return;
    
    setSubmitting(true);
    try {
      await onSubmit(rating, reviewText);
      setReviewText('');
      setRating(5);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="mb-8 shadow-md">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Rating</label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`h-6 w-6 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-full w-full fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Comment</label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              placeholder="Share your experience..."
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !reviewText.trim()}
            className="bg-green-600 hover:bg-green-700 text-sm py-2"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;