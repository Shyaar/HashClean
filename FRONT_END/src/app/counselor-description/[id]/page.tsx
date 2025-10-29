"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "../../components/header";
import { BottomNavigation } from "../../components/bottom-navigation";
import { Star, ThumbsUp, MessageCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import UiButton from "../../components/ui/modals/uiButton";


export default function CounselorDetailsPage() {
  const router = useRouter()
  function handleBack() {
    router.back();
  }
  const { id } = useParams();

  // TODO: replace this with a fetch/prop-based data source later
  const counselors = [
    {
      id: "1",
      name: "Alfredo Calzoni",
      rating: 4.5,
      description: "Specialist...",
      fee: "2.5 Eth",
      reviews: 11,
      image: "/counselor-profile.jpg",
    },
    {
      id: "2",
      name: "Sarah Akpan",
      rating: 4.7,
      description: "Focused on stress...",
      fee: "3.0 Eth",
      reviews: 8,
      image: "/counselor2.jpg",
    },
    {
      id: "3",
      name: "John Doe",
      rating: 4.3,
      description: "Personal growth...",
      fee: "2.0 Eth",
      reviews: 5,
      image: "/counselor3.jpg",
    },
  ];

  const counselor = counselors.find((c) => c.id === id);

  if (!counselor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Counselor not found.</p>
      </div>
    );
  }

  const reviews = [
    {
      id: 1,
      author: "Nicolas Jensen",
      rating: 5,
      text: "Really helpful!",
      time: "about 1 hour ago",
    },
    {
      id: 2,
      author: "Mary Okoro",
      rating: 4,
      text: "Very patient.",
      time: "2 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 pb-24">
      <Header showSearch={false} showMenu={false} />
      <div className="mx-24">
        <div className="">
        <div className="flex w-full justify-start my-2">
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => handleBack()}
          >
            <div className="flex">
              <ArrowLeft size={24} color="#071133" />
              <p>Back</p>
            </div>
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex gap-4 mb-4">
            <Image
              src={counselor.image}
              alt={counselor.name}
              width={120}
              height={120}
              className="rounded-xl"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  {[...Array(Math.round(counselor.rating))].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {counselor.reviews} Reviews
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                {counselor.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {counselor.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Fee/hour</span>
                <span className="font-semibold text-foreground">
                  {counselor.fee}
                </span>
              </div>
            </div>
          </div>
          <UiButton text="Book a session" type="button" />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Image
                    src="/reviewer-avatar.jpg"
                    alt={review.author}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h5 className="font-semibold text-foreground">
                      {review.author}
                    </h5>
                    <div className="flex gap-1 mt-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {review.text}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{review.time}</span>
                  <button className="flex items-center gap-1 hover:text-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    Like
                  </button>
                  <button className="flex items-center gap-1 hover:text-foreground">
                    <MessageCircle className="h-3 w-3" />
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
