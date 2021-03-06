import { client } from "../../utils/prismicClient";
import { RichText } from "prismic-reactjs";
import markdownStyles from "../../styles/markdown-styles.module.css";
import BlogDate from "../../components/BlogDate";
import Image from "next/image";
import Prismic from "prismic-javascript";
import Head from "next/head";
import EmailListForm from "../../components/EmailListForm";
import { useRouter } from "next/router";

export default function post({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{post.data.blog_title[0].text}</title>
        <meta name="description" content={post.data.blog_excerpt[0].text} />
        <meta
          property="og:url"
          content={`https://louierichardson.com/blog/${post.uid}`}
        />
        <meta property="og:image" content={post.data.hero_image.url} />
        <meta property="og:site_name" content="Louie Richardson" />
        <meta
          name="og:title"
          property="og:title"
          content={`${post.data.blog_title[0].text} - Louie Richardson`}
        />
        <meta
          property="og:description"
          content={post.data.blog_excerpt[0].text}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:description"
          content={post.data.blog_excerpt[0].text}
        />
        <meta name="twitter:creator" content="@louie_rich99" />
      </Head>
      <main className="w-11/12 sm:w-3/4 md:max-w-3xl mx-auto mt-8 sm:mt-16 font-sans">
        <article className={markdownStyles["markdown"]}>
          {RichText.render(post.data.blog_title)}
          <div className="text-gray-700 mb-6 sm:mb-10 text-center -mt-8">
            <BlogDate dateString={post.first_publication_date} />
          </div>
          <Image
            className="rounded-xl mb-8 sm:mb-10"
            src={post.data.hero_image.url}
            alt={post.data.hero_image.alt}
            width={post.data.hero_image.dimensions.width}
            height={post.data.hero_image.dimensions.height}
          />
          {RichText.render(post.data.blog_content)}
        </article>
        <EmailListForm />
      </main>
    </>
  );
}

export async function getStaticPaths() {
  const posts = await client.query(
    Prismic.Predicates.at("document.type", "blog_post")
  );

  const paths = posts.results.map((post) => {
    return {
      params: { slug: post.uid },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const post = await client.getByUID("blog_post", slug);

  return {
    props: {
      post,
    },
    revalidate: 600,
  };
}
