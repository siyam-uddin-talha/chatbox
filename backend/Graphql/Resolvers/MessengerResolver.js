const Messenger = require('../../Models/Messenger');
const User = require('../../Models/User');

const { PubSub, withFilter } = require('graphql-subscriptions');
const pubsub = new PubSub();



const NewConversation = async (_, { email, }, { user }) => {

    try {
        if (user.user.email === email) {
            return {
                success: false,
                message: `You can't create a new conversation with your own Email`
            }
        }
        const receiver = await User.findOne({ email })

        if (receiver) {

            const currentUser = await User.findOne({ email: user.user.email })

            const isThisFriendExist = currentUser.friends.some(e => e.friendEmail === email)

            if (!isThisFriendExist) {

                const messengerRes = await Messenger.create({ room: [] })
                // to add a new friend to the user who is creating the conversation
                await User.findOneAndUpdate({ email: user.user.email }, {
                    $push: {
                        friends: {
                            friendEmail: email, // email for whom,that I went to invite or create conversation
                            roomId: messengerRes._id, // It's the room id of both user will chat
                            // who is the creator of the conversation
                        },
                    }
                }, {
                    upsert: true,
                    new: true,
                })

                // add new conversation to the receiver
                const friendWith = await User.findOneAndUpdate({ email }, {
                    $push: {
                        friends: {
                            friendEmail: user.user.email, // email for whom,that I went to invite or create conversation
                            roomId: messengerRes._id, // It's the room id of both user will chat
                            // who is the creator of the conversation
                        },
                    }
                }, {
                    upsert: true,
                    new: true,
                })


                return {
                    success: true,
                    friends: {
                        friendEmail: email,
                        roomId: messengerRes._id,
                        friendName: `${friendWith.firstName} ${friendWith.lastName}`,
                        photoUrl: friendWith.photoUrl
                    }
                }
            }
            return {
                success: false,
                message: `This user is already in your conversation`
            }
        } else {
            return {
                success: false,
                message: `No user found as ${email}`
            }
        }


    } catch (err) {
        throw new Error(err.message);
    }
}

// user all friends, he is connected
const UserMessenger = async (_, __, { user }) => {

    try {
        const userFriends = await User.findOne({ _id: user.user._id }).sort({ createdAt: -1 })

        return userFriends.friends.map(
            ({ friendEmail, roomId, connected, friend, friendName, photoUrl }) => {
                return {
                    friendName,
                    photoUrl,
                    friendEmail,
                    roomId,
                }
            })

    } catch (err) {
        throw new Error(err.message);
    }
}

const ConversationFriend = async (_, { email },) => {
    try {
        return await User.findOne({ email })
    } catch (err) {
        throw new Error(err.message);
    }
}

// convercation between user and friend
const UserConversation = async (_, { roomId },) => {
    try {
        const convesation = await Messenger.findOne({ _id: roomId })
        return {
            roomId,
            messages: convesation.room
        }
    } catch (err) {
        throw new Error(err.message);
    }

}

const SendMessage = async (_, { input }) => {
    try {
        const { roomId, sender, text } = input
        const response = await Messenger.findOneAndUpdate({ _id: roomId }, {
            $push: {
                room: {
                    sender, text
                }
            }
        }, { new: true })

        const sorted = response.room[response.room.length - 1]

        pubsub.publish("NEW_MESSAGE_ADDED", {
            sendMessage: {
                sender: sorted.sender,
                text: sorted.text,
                _id: sorted._id,
                roomId
            }
        })
        return {
            success: true,
            message: `message id is ${sorted._id}`
        }
    } catch (err) {
        throw new Error(err.message);
    }

}


const resolvers = {
    // Querys
    Query: {
        userMessenger: UserMessenger,
        userConversation: UserConversation,
        conversationFriend: ConversationFriend
    },
    //Mutations
    Mutation: {
        newConversation: NewConversation,
        sendMessage: SendMessage
    },

};

module.exports = resolvers