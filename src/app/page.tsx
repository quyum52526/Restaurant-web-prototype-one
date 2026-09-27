import Hero from "@/components/home/Hero";
import StoryTeaser from "@/components/home/StoryTeaser";
import CategoryBento from "@/components/home/CategoryBento";
import ReservationTeaser from "@/components/home/ReservationTeaser";
import Reviews from "@/components/home/Reviews";

export default function Home() {
  return (
    <>
      <Hero />
      <StoryTeaser />
      <CategoryBento />
      <ReservationTeaser />
      <Reviews />
    </>
  );
}
