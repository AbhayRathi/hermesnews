import { NextResponse } from 'next/server';
import { getArticleById } from '@/services/articleService';
import type { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const article = getArticleById(id);

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  // Check for the L402 payment token (macaroon + preimage)
  const authHeader = request.headers.get('Authorization');

  // If no token is provided, challenge the client for payment.
  if (!authHeader || !authHeader.startsWith('L402')) {
    // In a real app, you would generate a real macaroon and invoice here.
    const mockInvoice = `ln_mock_${Buffer.from(id).toString('hex')}`;
    const mockMacaroon = Buffer.from(JSON.stringify({ articleId: id, price: (article.informationValue * 0.5).toFixed(2) })).toString('base64');
    
    const headers = new Headers();
    headers.set('WWW-Authenticate', `L402 token="${mockMacaroon}", invoice="${mockInvoice}"`);
    
    return NextResponse.json({ error: 'Payment Required' }, { status: 402, headers });
  }

  // If a token is provided, a real server would validate it here.
  // For our simulation, we'll assume any L402 header is valid proof of payment.
  console.log(`Authorization token received for article ${id}. Granting access.`);
  
  return NextResponse.json(article);
}
