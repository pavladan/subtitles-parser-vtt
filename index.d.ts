interface Subtitle {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

export function fromSrt(
  data: string,
  timeFormat?: "ms" | "s",
  isYoutubeAutoTranscript?: boolean
): Subtitle[];

export function toSrt(data: Subtitle[]): string;
