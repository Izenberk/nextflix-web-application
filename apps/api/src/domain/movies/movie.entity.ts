export interface MovieSummary {
  id: number;
  title: string;
  overview?: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  voteAverage: number;
}
