import gql from 'graphql-tag';
import { registerFragment, getFragment } from 'meteor/nova:core';

registerFragment(gql`
  fragment VotedItem on Vote {
    itemId
    power
    votedAt
  }
`);

registerFragment(gql`
  fragment UsersMinimumInfo on User {
    _id
    slug
    username
    displayName
    emailHash
  }
`);

registerFragment(gql`
  fragment UsersProfile on User {
    ...UsersMinimumInfo
    createdAt
    isAdmin
    bio
    htmlBio
    groups
    twitterUsername
    website
    newsletter_subscribeToNewsletter
    notifications_users
    notifications_posts
    karma
    postCount
    commentCount
    downvotedComments {
      ...VotedItem
    }
    downvotedPosts {
      ...VotedItem
    }
    upvotedComments {
      ...VotedItem
    }
    upvotedPosts {
      ...VotedItem
    }
  }
  ${getFragment('UsersMinimumInfo')}
  ${getFragment('VotedItem')}
`);

registerFragment(gql`
  fragment CategoriesMinimumInfo on Category {
    _id
    name
    slug
  }
`);

registerFragment(gql`
  fragment CategoriesList on Category {
    ...CategoriesMinimumInfo
    description
    order
    image
    parentId
    parent {
      _id
    }
  }
  ${getFragment('CategoriesMinimumInfo')}
`);

const PostsFragment = gql`
  fragment PostsList on Post {
    _id
    title
    url
    slug
    thumbnailUrl
    postedAt
    sticky
    status
    categories {
      ...CategoriesMinimumInfo
    }
    commentCount
    commenters {
      ...UsersMinimumInfo
    }
    upvoters {
      _id
    }
    downvoters {
      _id
    }
    upvotes # should be asked only for admins?
    downvotes # should be asked only for admins?
    baseScore # should be asked only for admins?
    score # should be asked only for admins?
    viewCount # should be asked only for admins?
    clickCount # should be asked only for admins?
    user {
      ...UsersMinimumInfo
    }
    userId
  }
  ${getFragment('UsersMinimumInfo')}
  ${getFragment('CategoriesMinimumInfo')}
`;

registerFragment(PostsFragment);
// also register the same fragment as "PostsPage"
registerFragment(PostsFragment, 'PostsPage');

registerFragment(gql`
  fragment CommentsList on Comment {
    _id
    postId
    parentCommentId
    topLevelCommentId
    body
    htmlBody
    postedAt
    user {
      ...UsersMinimumInfo
    }
    post {
      _id
      commentCount
      commenters {
        ...UsersMinimumInfo
      }
    }
    userId
    upvoters {
      _id
    }
    downvoters {
      _id
    }
    upvotes # should be asked only for admins?
    downvotes # should be asked only for admins?
    baseScore # should be asked only for admins?
    score # should be asked only for admins?
  }
  ${getFragment('UsersMinimumInfo')}
`);
