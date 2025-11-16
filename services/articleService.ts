import { SAMPLE_NEWS_DATA } from '@/constants';
import type { Article, NewArticleData } from '@/types';

// In-memory "database"
let articles: Article[] = [];

// Function to generate a simple unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Initialize the data from the constant
const initializeData = () => {
  if (articles.length === 0) {
    try {
      articles = SAMPLE_NEWS_DATA.trim().split('\n').map(line => {
        const parsed = JSON.parse(line);
        return {
          ...parsed,
          id: generateId(),
          summary: parsed.summary || 'Summary not available.',
          informationValue: Math.random() * 10 + 1, // Assign a random IV
        };
      });
      console.log('Mock database initialized with', articles.length, 'articles.');
    } catch (error) {
      console.error("Failed to parse sample news data:", error);
      articles = [];
    }
  }
};

initializeData();

export const getAllArticles = (): Article[] => {
  return articles;
};

export const getArticleById = (id: string): Article | undefined => {
  return articles.find(article => article.id === id);
};

export const getArticlesByIds = (ids: string[]): Article[] => {
    return articles.filter(article => ids.includes(article.id));
};

export const addArticle = (data: NewArticleData, summary: string): Article => {
  const newArticle: Article = {
    ...data,
    id: generateId(),
    time: new Date().toISOString(),
    summary,
    informationValue: Math.random() * 10 + 5, // Higher IV for new content
  };
  articles.unshift(newArticle); // Add to the beginning of the list
  return newArticle;
};
