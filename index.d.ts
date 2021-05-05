interface Subtitle {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export function fromVtt(
  data: string,
  timeFormat?: "ms" | "s",
  isYoutubeAutoTranscript?: boolean
): Subtitle[];

export function toVtt(data: Subtitle[]): string;
