import { GraphQLSchema, Utils } from 'meteor/nova:core';
import { mutateItem, operateOnItem } from './vote.js';

const voteSchema = `
  type Vote {
    itemId: String
    power: Float
    votedAt: String
  }
  type VoteResult {
    _id: String
    upvoters: [User]
    upvotes: Float
    downvoters: [User]
    downvotes: Float
    baseScore: Float
  }
  
  union Votable = Post | Comment
`;

GraphQLSchema.addSchema(voteSchema);

const resolverMap = {
  Votable: {
    __resolveType(obj, context, info){
      if(obj.title){
        return 'Post';
      }

      if(obj.postId){
        return 'Comment';
      }

      return null;
    },
  },
};

GraphQLSchema.addResolvers(resolverMap);

/*

Note: although returning a VoteResult object should in theory work, 
this currently messes the automatic store update on the client. 
So return a Post for now. 

*/

// GraphQLSchema.addMutation('vote(documentId: String, voteType: String, collectionName: String) : VoteResult');
GraphQLSchema.addMutation('vote(documentId: String, voteType: String, collectionName: String) : Post');

const voteResolver = {
  Mutation: {
    vote(root, {documentId, voteType, collectionName}, context) {
      console.log('resolver collection:', collectionName);
      const collection = context[Utils.capitalize(collectionName)];
      const document = collection.findOne(documentId);
      Meteor._sleepForMs(5000);
      return context.Users.canDo(context.currentUser, `${collectionName.toLowerCase()}.${voteType}`) ? mutateItem(collection, document, context.currentUser, voteType, false) : false;
    },
  },
};

GraphQLSchema.addResolvers(voteResolver);
