import { saveSwaggerFile } from '@/libs/file';
import { getBaseUrl } from '@/libs/url';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const baseUrl = getBaseUrl(req)
  const response = await fetch(baseUrl + '/api/doc')
  const result = await response.json()
  await saveSwaggerFile(JSON.stringify(result))
  res.status(204).json()
}
