export type TmdbMovieSearchResponse = {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovieSummary[];
};

export type TmdbMovieSummary = {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
};

export type TmdbMovieDetail = {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  runtime: number | null;
  genres: Array<{
    id: number;
    name: string;
  }>;
};

export type MovieSearchItem = {
  id: string;
  title: string;
  originalTitle: string | null;
  releaseYear: string | null;
  posterUrl: string | null;
};

export type SelectedMovie = {
  externalMovieId: string;
  title: string;
  originalTitle: string | null;
  releaseDate: string | null;
  posterUrl: string | null;
  overview: string | null;
  runtime: number | null;
  genres: string[];
};

export type MovieSearchResult =
  | {
      ok: true;
      items: MovieSearchItem[];
    }
  | {
      ok: false;
      message: string;
      items: [];
    };
