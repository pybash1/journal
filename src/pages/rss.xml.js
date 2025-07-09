import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: "Journal by PyBash",
    description:
      "A friendly, homegrown blog by your fellow internet user, PyBash.",
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.id}/`,
    })),
  });
}
