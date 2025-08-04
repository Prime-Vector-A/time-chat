import FirecrawlApp from '@mendable/firecrawl-js';

interface ErrorResponse {
  success: false;
  error: string;
}

interface ScrapeResponse {
  success: true;
  data: {
    markdown: string;
    html: string;
    metadata: {
      title: string;
      description: string;
      url: string;
    };
  };
}

type ScrapingResponse = ScrapeResponse | ErrorResponse;

export class WebScrapingService {
  private static API_KEY_STORAGE_KEY = 'firecrawl_api_key';
  private static firecrawlApp: FirecrawlApp | null = null;

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
    this.firecrawlApp = new FirecrawlApp({ apiKey });
    console.log('Firecrawl API key saved successfully');
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async testApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('Testing API key with Firecrawl API');
      this.firecrawlApp = new FirecrawlApp({ apiKey });
      const testResponse = await this.firecrawlApp.scrapeUrl('https://example.com');
      return testResponse.success;
    } catch (error) {
      console.error('Error testing API key:', error);
      return false;
    }
  }

  static async scrapeUrl(url: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return { success: false, error: 'Firecrawl API key not found. Please add your API key first.' };
    }

    try {
      console.log('Scraping URL:', url);
      if (!this.firecrawlApp) {
        this.firecrawlApp = new FirecrawlApp({ apiKey });
      }

      const response = await this.firecrawlApp.scrapeUrl(url, {
        formats: ['markdown', 'html'],
        includeTags: ['title', 'meta'],
        excludeTags: ['nav', 'footer', 'header', 'aside']
      }) as ScrapingResponse;

      if (!response.success) {
        console.error('Scraping failed:', (response as ErrorResponse).error);
        return { 
          success: false, 
          error: (response as ErrorResponse).error || 'Failed to scrape website' 
        };
      }

      console.log('Scraping successful');
      return { 
        success: true,
        data: response.data 
      };
    } catch (error) {
      console.error('Error during scraping:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to Firecrawl API' 
      };
    }
  }

  static async scrapeWikipedia(searchTerm: string): Promise<{ success: boolean; error?: string; data?: any }> {
    const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(searchTerm.replace(/ /g, '_'))}`;
    return await this.scrapeUrl(wikipediaUrl);
  }
}