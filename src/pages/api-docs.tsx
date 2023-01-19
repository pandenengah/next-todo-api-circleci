import { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import swaggerJson from '../../swagger.json';


//@ts-ignore
const SwaggerUI = dynamic<{ spec: any; }>(import('swagger-ui-react'), { ssr: false });
function ApiDoc({ spec }: InferGetServerSidePropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: swaggerJson
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
