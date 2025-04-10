export interface Review {
    id?: number;
    book: number;
    rating: number;
    comment: string;
    timestamp?: string;
  }
  
  export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    published_year: number;
    average_rating: number | null;
    reviews: Review[];
  }
  