import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "http://127.0.0.1:4000";

const createRequests = (url) => ({
  url,
});
export const twitterApi = createApi({
  reducerPath: "twitterApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getTweets: builder.query({
      query: (url) => createRequests(`/api${url}`),
    }),
    getTweet: builder.query({
      query: (id) => createRequests(`/api/tweets/tweet/${id}`),
    }),
    getAuthor: builder.query({
      query: (id) => createRequests(`/api/user/${id}`),
    }),
    getProfile: builder.query({
      query: (username) => createRequests(`/api/user/username/${username}`),
    }),
    getLoggedInAccount: builder.query({
      query: () => createRequests(`/auth/user`),
    }),
    getIfFollowing: builder.query({
      query: ({ follower, followed }) =>
        createRequests(`/api/user/${follower}/${followed}`),
    }),
    getReplies: builder.query({
      query: ({ count, id }) =>
        createRequests(`/api/tweets/replies/${id}/${count}`),
    }),
  }),
});

export const {
  useGetTweetsQuery,
  useGetIfFollowingQuery,
  useGetAuthorQuery,
  useGetProfileQuery,
  useGetTweetQuery,
  useGetLoggedInAccountQuery,
  useGetRepliesQuery,
} = twitterApi;
