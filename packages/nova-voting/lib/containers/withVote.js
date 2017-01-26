import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { operateOnItem } from '../vote.js';
import { Utils } from 'meteor/nova:core'; 

const withVote = component => {

  return graphql(gql`
    mutation vote($documentId: String, $voteType: String, $collectionName: String) {
      vote(documentId: $documentId, voteType: $voteType, collectionName: $collectionName) {
        _id
        upvotes
        upvoters {
          _id
        }
        downvotes
        downvoters {
          _id
        }
        baseScore
      }
    }
  `, {
    props: ({ownProps, mutate}) => ({
      vote: ({document, voteType, collection, currentUser}) => {
        const voteResult = operateOnItem(collection, document, currentUser, voteType, true);
        console.log('collection operated on', collection._name);
        console.log('withVote result summary', {upvotes: voteResult.upvotes, upvoters: voteResult.upvoters});
        return mutate({ 
          variables: {
            documentId: document._id, 
            voteType,
            collectionName: collection._name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            vote: {
              ...voteResult,
            },
          }
        })
      }
    }),
  })(component);
}

export default withVote;
