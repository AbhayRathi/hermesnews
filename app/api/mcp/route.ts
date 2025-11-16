import { NextResponse } from 'next/server';
import { getArticlesByIds } from '@/services/articleService';

const USD_PER_IV_POINT = 0.50;

export async function POST(request: Request) {
  try {
    const { action, payload } = await request.json();

    if (action === 'getQuote') {
      const { articleIds } = payload;
      if (!Array.isArray(articleIds)) {
        return NextResponse.json({ error: 'articleIds must be an array' }, { status: 400 });
      }

      const articles = getArticlesByIds(articleIds);
      
      const totalIV = articles.reduce((sum, article) => sum + article.informationValue, 0);
      const totalPrice = totalIV * USD_PER_IV_POINT;
      
      // In a real app, generate a real macaroon and invoice for the bundle.
      const mockToken = Buffer.from(JSON.stringify({ articleIds })).toString('base64');
      const mockInvoice = `ln_mcp_${Buffer.from(JSON.stringify(articleIds)).toString('hex')}`;

      return NextResponse.json({
        quote: {
          itemCount: articles.length,
          totalPrice: totalPrice.toFixed(2),
        },
        token: mockToken,
        invoice: mockInvoice,
      });
    }

    if (action === 'purchase') {
      const { token, preimage } = payload;
      
      // For our mock, we just check that the required payload exists.
      // A real server would validate the preimage against the invoice and macaroon.
      if (!token || !preimage) {
        return NextResponse.json({ error: 'Missing token or preimage' }, { status: 400 });
      }
      
      // Decode the token to get the article IDs
      const { articleIds } = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      
      const articles = getArticlesByIds(articleIds);
      
      console.log(`MCP Purchase validated for articles: ${articleIds.join(', ')}. Delivering content.`);

      return NextResponse.json({ articles });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error("Error in MCP route:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
