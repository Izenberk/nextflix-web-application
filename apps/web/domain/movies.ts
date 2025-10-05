export type MovieSummary = {
  id: number;
  title: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  overview: string;
  voteAverage: number;
};