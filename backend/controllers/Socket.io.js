const User = require('../Models/User');
const Messenger = require('../Models/Messenger');

const socket = require("socket.io");

let users = []

let activeUsers = []


const addUser = (socketId, userId) => {
    const chack = users.some(user => user.userId === userId)

    if (!chack) {
        users.push({
            socketId, userId
        })
    }
}

const addActiveUser = (socketId, userEmail) => {
    const chack = activeUsers.some(user => user.userEmail === userEmail)
    if (!chack) {
        activeUsers.push({
            socketId,
            userEmail
        })
    }
}



const removeAtciveuser = (socketId) => {
    activeUsers = activeUsers.filter(e => e.socketId !== socketId)
}



const removeUser = (socketId) => {
    users = users.filter(e => e.socketId !== socketId)
}

const SOCKET_IO = (server) => {

    const io = socket(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },

    });
    io.on("connection", socket => {
        UserFrineds(socket)

        // to careate new convercation
        NewConversationIsCreated(io, socket)

        GetRoomConversations(io, socket)
        SendMessage(socket, io)

        UserActiveFrineds(io, socket)

        socket.on("disconnect", () => {
            removeUser(socket.id)
            ActiveFriendOverDose(io, socket)

        })
    })

}



const UserFrineds = (socket) => {
    socket.on("userFriends", async (id) => {
        try {
            const userFriends = await User.findOne({ _id: id })

            addUser(socket.id, id)
            let thisUserFriends = []

            if (userFriends.friends.length !== 0) {

                userFriends.friends.forEach(async ({ friendEmail, roomId, _id }) => {
                    const userEachFiend = await User.findOne({ email: friendEmail })
                    const { firstName, lastName, photoUrl } = userEachFiend
                    thisUserFriends.push({
                        friendName: `${firstName} ${lastName}`,
                        friendEmail,
                        photoUrl,
                        roomId,
                        _id
                    })

                    if (userFriends.friends.length === thisUserFriends.length) {

                        socket.emit("userFriends", {
                            success: true,
                            friends: thisUserFriends
                        })
                    }
                })
            }
            else if (userFriends.friends.length === 0) {
                socket.emit("userFriends", {
                    success: true,
                    friends: userFriends.friends
                })
            }



        } catch (err) {
            throw new Error(err.message);
        }
    })
}


const UserActiveFrineds = (io, socket) => {


    socket.on("giveMeMyFriends", async (userId) => {
        try {
            const thisUser = await User.findById(userId)

            if (thisUser) {
                addActiveUser(socket.id, thisUser.email)

                let thisUserFriends = []
                if (thisUser.friends.length !== 0) {

                    thisUser.friends.forEach(async ({ friendEmail, roomId, _id }) => {
                        const userEachFiend = await User.findOne({ email: friendEmail })
                        const { firstName, lastName, photoUrl } = userEachFiend
                        thisUserFriends.push({
                            friendName: `${firstName} ${lastName}`,
                            friendEmail,
                            photoUrl,
                            roomId,
                            _id
                        })
                        if (thisUser.friends.length === thisUserFriends.length) {


                            const getActiveUser = thisUserFriends.filter(currentUser => {
                                return activeUsers.some(activeUser => activeUser.userEmail === currentUser.friendEmail)
                            })


                            const userWhoisConnectedWithuser = activeUsers.filter(activeUser => {
                                return getActiveUser.some(currentUser => activeUser.userEmail === currentUser.friendEmail)
                            })


                            userWhoisConnectedWithuser.map(async (e) => {
                                const existRoom = await User.findOne(
                                    { email: e.userEmail })

                                if (existRoom) {

                                    let existRoomFriends = []

                                    existRoom.friends.forEach(
                                        async ({ friendEmail, roomId, _id }) => {
                                            const userEachFiend = await User.findOne({ email: friendEmail })
                                            const { firstName, lastName, photoUrl } = userEachFiend
                                            existRoomFriends.push({
                                                friendName: `${firstName} ${lastName}`,
                                                friendEmail,
                                                photoUrl,
                                                roomId,
                                                _id
                                            })
                                            if (existRoom.friends.length === existRoomFriends.length) {

                                                const friendWhoIsActive = existRoomFriends.filter(user => user.friendEmail === thisUser.email)

                                                io.to(e.socketId).emit("activeUser", friendWhoIsActive)
                                            }
                                        })

                                    // const friendWhoIsActive = existRoom.friends.filter(user => user.friendEmail === thisUser.email)

                                    // io.to(e.socketId).emit("activeUser", friendWhoIsActive)
                                }
                            })

                            socket.emit("activeUser", getActiveUser)

                        }
                    })

                } else if (thisUser.friends.length === 0) {
                    socket.emit("activeUser", [])

                }



                // const getActiveUser = thisUser.friends.filter(currentUser => {
                //     return activeUsers.some(activeUser => activeUser.userEmail === currentUser.friendEmail)
                // })


                // const userWhoisConnectedWithuser = activeUsers.filter(activeUser => {
                //     return getActiveUser.some(currentUser => activeUser.userEmail === currentUser.friendEmail)
                // })


                // userWhoisConnectedWithuser.map(async (e) => {
                //     const existRoom = await User.findOne({ email: e.userEmail })
                //     if (existRoom) {
                //         const friendWhoIsActive = existRoom.friends.filter(user => user.friendEmail === thisUser.email)

                //         io.to(e.socketId).emit("activeUser", friendWhoIsActive)
                //     }
                // })

                // socket.emit("activeUser", getActiveUser)

            }
        } catch (err) {
            throw new Error(err.message)
        }
    })

}


const ActiveFriendOverDose = async (io, socket,) => {

    try {

        const disconnectdUser = activeUsers.find(e => e.socketId === socket.id)
        if (disconnectdUser) {

            const whoIsDisconnected = await User.findOne({ email: disconnectdUser.userEmail })

            removeAtciveuser(socket.id)

            setTimeout(() => {
                const activeUserWhoisConnectedWithuser = activeUsers.filter(currentUser => {
                    return whoIsDisconnected.friends.some(activeUser => activeUser.userEmail === currentUser.friendEmail)
                })

                activeUserWhoisConnectedWithuser.map(whoisActive => {
                    io.to(whoisActive.socketId).emit("activeUserOver", whoIsDisconnected.email)
                })

                // socket.emit("activeUserOver", getActiveUser)
            }, 1000);
        }

    } catch (err) {
        throw new Error(err.message)
    }
    // socket.emit("activeUser", async (userId) => {

    // })
}


const SendMessage = (socket, io) => {
    socket.on("sendMessage", async ({ roomId, sender, text, friendEmail }) => {
        try {

            const whoSendingThis = await User.findOne({ _id: sender })

            const findTheSender = users.find(e => e.userId === whoSendingThis._id.toString())

            const whoWillReciveData = await User.findOne({ email: friendEmail })


            if (!whoWillReciveData) {
                io.to(findTheSender.socketId).emit("getMessage", {
                    success: false,
                    message: "you may change reciver email address"
                })
                return;
            }


            const response = await Messenger.findOneAndUpdate({ _id: roomId }, {
                $push: {
                    room: {
                        sender, text
                    }
                }
            }, { new: true })

            const sorted = response.room[response.room.length - 1]



            const findTheReciver = users.find(e => e.userId === whoWillReciveData._id.toString())


            if (findTheReciver) {
                //  send the message to the reciver
                io.to(findTheReciver.socketId).to(findTheSender.socketId).emit("getMessage", {
                    roomId,
                    messages: {
                        _id: sorted._id,
                        sender: sorted.sender,
                        text: sorted.text,
                    }
                })
            } else {
                io.to(findTheSender.socketId).emit("getMessage", {
                    roomId,
                    messages: {
                        _id: sorted._id,
                        sender: sorted.sender,
                        text: sorted.text,
                    }
                })
            }


        } catch (err) {
            console.log(err.message)
        }
    })
}

const GetRoomConversations = (io, socket) => {
    socket.on("roomConversation", async ({ roomId, userId }) => {
        try {
            addUser(socket.id, userId)
            const whoWantToSee = users.find(e => e.userId === userId)


            if (whoWantToSee) {
                const convesation = await Messenger.findOne({ _id: roomId })

                io.to(whoWantToSee.socketId).emit("getRoomConversation", {
                    roomId,
                    messages: convesation.room
                })
            }

        } catch (err) {

            if (err) {
                const whoWantToSee = users.find(e => e.userId === userId)
                if (whoWantToSee) {
                    io.to(whoWantToSee.socketId).emit("getRoomConversation", {
                        success: false,
                        error: true
                    })
                }
            }
            // throw new Error(err.message);
        }
    })
}

const NewConversationIsCreated = (io, socket) => {
    socket.on("yourNewConversationCreated", async ({ creator, newFriend }) => {


        const isThisUserActive = activeUsers.find(e => e.userEmail === newFriend.friendEmail)


        const whoIsTheCreator = users.find(e => e.userId === creator)

        if (isThisUserActive) {

            const connectedUser = await User.findOne({ email: isThisUserActive.userEmail })
            const { email, firstName, lastName, photoUrl } = await User.findOne({ _id: creator })

            const { friendEmail, roomId, _id } = connectedUser.friends.find(e => e.friendEmail === email)

            io.to(isThisUserActive.socketId).emit("newRoomToactiveUser", {
                friendName: `${firstName} ${lastName}`,
                friendEmail,
                roomId,
                photoUrl,
                _id
            })
        }

        io.to(whoIsTheCreator.socketId).emit("newConversation", newFriend)

    })
}


module.exports = SOCKET_IO