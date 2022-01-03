
let userFriends = []

const addFriend = (socketId, userId) => {
    !userFriends.some(user => user.socketId === socketId) && userFriends.push({
        socketId, userId
    })
}

const lookingForFriends = users.find(e => e.userId !== userId)

if (lookingForFriends) {

    const findThisUserEmail = await User.findOne({ _id: userId })


    if (findThisUserEmail) {


        const findTheRoomFriends = await User.findOne({ "friends.friendEmail": { $eq: findThisUserEmail.email } })

        if (findTheRoomFriends) {

            const { firstName, lastName, photoUrl, email } = findTheRoomFriends

            const activFriendDetails = findTheRoomFriends.friends.filter(e => e.friendEmail === findThisUserEmail.email).map(({ roomId, _id }) => {
                return {
                    friendName: `${firstName} ${lastName}`,
                    friendEmail: email,
                    photoUrl,
                    roomId,
                    _id
                }
            })

            if (activeUsers[userId]) {

                activeUsers[userId].push({
                    ...activFriendDetails
                })
                socket.emit("getActiveUser", activeUsers[userId])

            } else {
                activeUsers[userId] = activFriendDetails
                socket.emit("getActiveUser", activeUsers[userId])

            }
        } else {
            activeUsers[userId] = []
            socket.emit("getActiveUser", activeUsers[userId])
        }
    } else {
        socket.emit("getActiveUser", activeUsers[userId])

    }

}
