export type TmdbMovieRaw = {
  id: number;
  title?: string;
  name?: string; // TMDB sometimes uses `name` for titles (esp. TV/trending)
  overview?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  first_air_date?: string | null; // trending might include this
  vote_average?: number;
};

export type TmdbPaged<T> = {
  page: number;
  results: T[];
  total_pages?: number;
  total_results?: number;
};
