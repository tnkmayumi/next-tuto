import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

// 各ブログポストの型定義
type Post = {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    description?: string;
  };
};

export default async function Blogs() {
  // contentディレクトリ内のマークダウンファイル一覧を取得
  const postsDirectory = path.join(process.cwd(), 'content');
  const fileNames: string[] = fs.readdirSync(postsDirectory);

  // 各ファイルの中身を取得
  const posts: Post[] = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      // slugとfrontmatter(title, date, description)を取得
      return {
        slug: fileName.replace('.md', ''),
        frontmatter: {
          title: data.title as string,
          date: data.date as string,
          description: data.description as string | undefined,
        },
      };
    })
  ).then((posts) =>
    // 最新日付順に並び替え
    posts.sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
  );

  return (
    <div className="bg-white py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blog</h2>
        <div className="mt-10 space-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="group relative">
                {/* 日付を表示 */}
                <div className="flex items-center gap-x-4 text-xs">
                  <div className="text-gray-500">{post.frontmatter.date}</div>
                </div>
                {/* 記事タイトル・リンク */}
                <h3 className="mt-3 text-lg font-semibold leading-6 text-blue-700 group-hover:text-blue-400">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-3 text-lg font-semibold leading-6 text-blue-700 group-hover:text-blue-400"
                  >
                    {post.frontmatter.title}
                  </Link>
                </h3>
                {/* 記事説明文を表示 */}
                <p
                  className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: `${post.frontmatter.description}` }}
                ></p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}
