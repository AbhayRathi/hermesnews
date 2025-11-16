
export interface Article {
  id: string;
  title: string;
  publisher: string;
  author: string;
  time: string;
  category: string;
  article: string;
  summary: string;
  informationValue: number;
}

export type NewArticleData = Omit<Article, 'id' | 'summary' | 'informationValue' | 'time'>;
