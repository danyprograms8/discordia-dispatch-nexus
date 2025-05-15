
import { Card, CardContent } from "@/components/ui/card";

export const LoadingState = () => {
  return (
    <Card className="bg-discord-secondary border-discord-background">
      <CardContent className="flex justify-center items-center p-10">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-discord-accent rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-discord-muted">Loading calendar data...</p>
        </div>
      </CardContent>
    </Card>
  );
};
