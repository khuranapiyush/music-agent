import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import fetcher from '../src/dataProvider';

const Index = ({ privacyPolicy }) => {
  return (
    <div>
      <title>how it work</title>
      <style
        type='text/css'
        dangerouslySetInnerHTML={{
          __html:
            "\n\tbody{\n\t\tbackground-color: #0b091c;\n\t\tpadding: 0;\n\t\tmargin: 0;\n\t\tfont-family: 'Inter', sans-serif;\n     color: #fff\n\t\n\t}\n\n.PrivacyDetails p {font-size: 14px; font-weight: 400; margin-bottom: 20px; line-height: 22px}\n.wrapper{\npadding: 15px;\n}\n\n.howitworkHeading{display: flex; align-items: center; margin-bottom: 20px}\n.howitworkHeading h1{font-size: 20px; font-weight: 600; margin-left: 40px; margin-top: 0;}\n.howitworkHeading img {vertical-align: super;}\n",
        }}
      />
      <div className='wrapper'>
        <div className='PrivacyDetails'>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {privacyPolicy}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
export default Index;

export async function getStaticProps() {
  try {
    const termsData = await fetcher.get(
      `https://admin.artistfirst.in/api/legals`,
      {
        params: {
          [`filters[key][$eq]`]: 'privacy',
          [`filters[version][$eq]`]: 1,
        },
      }
    );

    return {
      props: {
        privacyPolicy: termsData?.data[0]?.attributes?.content || null,
        asLayout: 'EmptyLayout',
      },
    };
  } catch (error) {
    console.log('ERROR CATCH');
    console.error('Error fetching privacy policy:', error);

    return {
      props: {
        privacyPolicy: null,
        asLayout: 'EmptyLayout',
      },
    };
  }
}
