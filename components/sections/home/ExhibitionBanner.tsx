import { Calendar, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";

interface ExhibitionBannerProps {
  title?: string;
  date?: string;
  location?: string;
  booth?: string;
  isActive?: boolean;
}

export function ExhibitionBanner({
  title = "Upcoming Exhibition: EMO Hannover",
  date = "September 18-23, 2026",
  location = "Hannover, Germany",
  booth = "Hall 11, Booth D32",
  isActive = true,
}: ExhibitionBannerProps) {
  if (!isActive) return null;

  return (
    <div className="bg-primary text-primary-foreground">
      <Container className="py-3 sm:py-4">
        <div className="flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:text-base">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6 text-center sm:text-left">
            <strong className="font-semibold tracking-wide uppercase text-xs sm:text-sm bg-background/20 px-2 py-1 rounded">
              Meet Us
            </strong>
            <span className="font-medium">{title}</span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-primary-foreground/80 text-xs sm:text-sm text-center">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {location} ({booth})
              </span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
