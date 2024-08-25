"use client";
import { formatDate } from '@/lib/format';
import LikeButton from './like-icon';
import { togglePostLikeStatus } from '@/action/posts';
import { useOptimistic } from 'react'
function Post({ post , action }) {
  // console.log(`Post ID : ${JSON.stringify(post)}`);

  return (
    <article className="post">
      <div className="post-image">
        <img src={post.image} alt={post.title} />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          {/* Here binds first argument is the this key word */}
          <div><form action={action.bind(null, post.id )} className={post.isLiked ? 'liked' : ''}>
            <LikeButton />
          </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default  function Posts({ posts }) {
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(posts, (prevPosts, updatedPostId) => {
    const updatePostIndex = prevPosts.findIndex(post => post.id == updatedPostId);
    if (updatePostIndex === -1){
      return prevPosts;
    }
    const updatedPost = {...prevPosts[updatePostIndex]}
    updatedPost.likes = updatedPost.like + (updatedPost.isLiked ? -1 : 1)
    updatedPost.isLiked = !updatedPost.isLiked;
    const newPosts = [ ...prevPosts];
    newPosts[updatePostIndex] = updatedPost;
    return newPosts
  });

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  async function updatePost(postId){
    updateOptimisticPosts(postId);
    await togglePostLikeStatus(postId);
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}
