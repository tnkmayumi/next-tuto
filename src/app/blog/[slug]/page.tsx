import './content.css';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

type Params = {
  params: {
    slug: string;
  };
};

// ブログ記事ページ
export default async function BlogPost({ params }: Params) {
  // URLのパラメータから該当するファイル名を取得
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);

  // ファイルの中身を取得
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const title = data.title as string; // 記事のタイトル
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(content);

  const contentHtml = processedContent.toString(); // 記事の本文をHTMLに変換

  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        <div
          className="mt-6"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        ></div>
      </div>
    </div>
  );
}
