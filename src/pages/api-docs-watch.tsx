import { getBaseUrl } from '@/libs/url';
import { GetServerSideProps, InferGetServerSidePropsType, NextApiRequest } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';


//@ts-ignore
const SwaggerUI = dynamic<{ spec: any; }>(import('swagger-ui-react'), { ssr: false });
function ApiDoc({ spec }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const baseUrl = getBaseUrl(req as NextApiRequest)

  await fetch(baseUrl + '/api/doc-generate')

  const response = await fetch(baseUrl + '/api/doc')
  const result = await response.json()

  const spec: Record<string, any> = createSwaggerSpec({
    definition: result
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
