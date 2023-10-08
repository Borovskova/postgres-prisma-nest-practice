export const currentSocketsEventInfo = 'socketEventInfo';

export enum avialiableWebSocketEvents {
    userInfo = "subscribe-user-info",
    userBookmarks= "subscribe-user-bookmarks",
    userNewBookmark= "subscribe-user-new-bookmark",
    userInfoUnsubscribe = "unsubscribe-user-info",
    userBookmarksUnsubscribe = "unsubscribe-user-bookmarks",
    userNewBookmarkUnsubscribe= "unsubscribe-user-new-bookmark",
}