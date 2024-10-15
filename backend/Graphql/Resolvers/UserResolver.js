const User = require("../../Models/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const SendEmail = require("../../controllers/SendEmail");
const crypto = require("crypto");
const Cloudinary = require("../../controllers/Cloudinary");

const CurrentUser = async (_, __, { user }) => {
  try {
    if (user) {
      const isExixt = await User.findOne({ email: user.user.email });
      return {
        success: true,
        user: isExixt,
      };
    }
    return {
      success: false,
      message: "User is not login",
    };
  } catch (err) {
    throw new Error("user is not login");
  }
};

const SingUp = async (_, { input }, { res }) => {
  const { email, password, firstName, lastName, photoUrl } = input;
  try {
    const isExixt = await User.findOne({ email });
    if (isExixt) {
      return {
        success: false,
        message: `User exist! try to login`,
      };
    } else {
      const cloudinaryResponse = await Cloudinary.uploader.upload(photoUrl, {
        folder: "profile",
        public_id: email,
      });
      const newUser = await User.create({
        email,
        password,
        firstName,
        lastName,
        photoUrl: cloudinaryResponse.url,
      });

      const chat_token = jwt.sign(
        { user: newUser },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "7d",
        }
      );
      res.cookie("chat_token", chat_token, {
        expires: new Date(Date.now() + 604800000),
        httpOnly: true,
      });
      return { success: true, chat_token, user: newUser };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const OneTabJoin = async (_, __, { res }) => {
  try {
    const fkmail = new FakeMail();
    const email = fkmail.email();
    const firstName = fkmail.firstName;
    const lastName = fkmail.lastName;
    const password = generatePassword();
    const response = await User.create({
      email,
      firstName,
      lastName,
      password,
    });
    if (!response) {
      return { success: false, message: `Unable to procced. Try again.` };
    }
    const chat_token = jwt.sign(
      { user: response },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("chat_token", chat_token, {
      expires: new Date(Date.now() + 604800000),
      httpOnly: true,
    });

    return {
      message: `One tap join success. Password: ${password}`,
      success: true,
      user: response,
    };
  } catch (error) {
    return { message: `${error.message}`, success: false };
  }
};

const Login = async (_, { email, password }, { res }) => {
  try {
    const response = await User.findOne({ email });

    if (!response) {
      return { success: false, message: `No user found! please signup` };
    }

    const byres = await bcryptjs.compare(password, response.password);

    if (byres) {
      const chat_token = jwt.sign(
        { user: response },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "7d",
        }
      );
      res.cookie("chat_token", chat_token, {
        expires: new Date(Date.now() + 604800000),
        httpOnly: true,
      });
      return { success: true, chat_token, user: response };
    } else {
      return { success: false, message: `wrong password! Try again` };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const ForgetPassword = async (_, { email }, { req }) => {
  try {
    const response = await User.findOne({ email });
    if (!response) {
      return { success: false, message: `No user found! as ${email}` };
    }

    const resetToken = response.getResetPasswordToken();

    await response.save({ validateBeforeSave: true });

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/user/reset-password/${resetToken}`;

    await SendEmail({
      email: response.email,
      subject: "Reset your password",
      message: `Reset your password ${resetLink}`,
      html: ` <div  style="width: 20rem; text-align: center; margin: auto;padding: 2rem 1rem; font-family: sans-serif;" >
        <div>
            <h3> Password reset </h2>
            <br>
       <h3> Reset your password by clicking this link ${resetLink} </h2>
        </div>
     
   
    </div>`,
    });

    return {
      success: true,
      message: `We have sent the password reset instructions to your email. Please check your inbox.`,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const ResetPassword = async (_, { resetToken, password }) => {
  try {
    const newPassword = await bcryptjs.hash(password, 12);
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOneAndUpdate(
      { resetPasswordToken, resetPasswordTokenExpireDate: { $gt: Date.now() } },
      {
        password: newPassword,
        resetPasswordToken: "",
        resetPasswordTokenExpireDate: "",
      },
      { new: true, runValidators: true }
    );
    if (user) {
      return { success: true, message: `Password reset successfully` };
    }
    if (!user) {
      return {
        success: false,
        message: `Invalid token or reset time is out`,
      };
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const UpdateUserProfile = async (_, { input }, { user }) => {
  const { password, firstName, lastName, photoUrl } = input;

  try {
    const findThatUser = await User.findOne({ _id: user.user._id });

    if (!findThatUser) {
      return {
        success: false,
        message: `User not found.`,
      };
    }

    if (photoUrl !== findThatUser.photoUrl) {
      await Cloudinary.uploader.destroy(`profile/${user.user.email}`);

      const cloudinaryResponse = await Cloudinary.uploader.upload(photoUrl, {
        folder: "profile",
        public_id: user.user.email,
      });
      if (password) {
        const newPassword = await bcryptjs.hash(password, 12);

        const updated = await User.findOneAndUpdate(
          { _id: user.user._id },
          {
            password: newPassword,
            firstName,
            lastName,
            photoUrl: cloudinaryResponse.url,
          },
          { new: true, runValidators: true }
        );
        if (!updated) {
          return { success: false, message: `Unable to update user` };
        }
        if (updated) {
          return {
            success: true,
            message: `Profile updated successfully.`,
            user: updated,
          };
        }
      }
      const updated = await User.findOneAndUpdate(
        { _id: user.user._id },
        {
          firstName,
          lastName,
          photoUrl: cloudinaryResponse.url,
        },
        { new: true, runValidators: true }
      );
      if (updated) {
        return {
          success: true,
          message: `Profile updated successfully.`,
          user: updated,
        };
      }
      if (!updated) {
        return { success: false, message: `Unable to update user` };
      }
    }

    if (password) {
      const newPassword = await bcryptjs.hash(password, 12);

      const updated = await User.findOneAndUpdate(
        { _id: user.user._id },
        {
          password: newPassword,
          firstName,
          lastName,
        },
        { new: true, runValidators: true }
      );
      if (!updated) {
        return { success: false, message: `Unable to update user` };
      }
      if (updated) {
        return {
          success: true,
          message: `Profile updated successfully.`,
          user: updated,
        };
      }
    }
    const updated = await User.findOneAndUpdate(
      { _id: user.user._id },
      {
        firstName,
        lastName,
      },
      { new: true, runValidators: true }
    );
    if (updated) {
      return {
        success: true,
        message: `Profile updated successfully.`,
        user: updated,
      };
    }
    if (!updated) {
      return { success: false, message: `Unable to update user` };
    }
  } catch (err) {
    return { success: false, message: `Fail to update user. Try again` };
  }
};

const LogOut = async (_, __, { res }) => {
  try {
    res.clearCookie("chat_token");
    return { success: true, message: "logout success" };
  } catch (err) {
    throw new Error(err.message);
  }
};

class FakeMail {
  adjectives = [
    "silly",
    "wacky",
    "zany",
    "goofy",
    "quirky",
    "loopy",
    "bonkers",
    "kooky",
    "nutty",
    "daffy",
    "whimsical",
    "bizarre",
    "peculiar",
    "absurd",
    "ludicrous",
    "hilarious",
    "comical",
    "dorky",
    "giddy",
    "madcap",
    "eccentric",
    "jolly",
    "wacko",
    "oddball",
    "batty",
    "zapped",
    "loony",
    "dizzy",
    "dopey",
    "gaga",
  ];
  nouns = [
    "banana",
    "unicorn",
    "pickle",
    "noodle",
    "penguin",
    "moustache",
    "socks",
    "teapot",
    "flamingo",
    "raccoon",
    "spatula",
    "kazoo",
    "hamburger",
    "toaster",
    "llama",
    "coconut",
    "waffle",
    "platypus",
    "cupcake",
    "sombrero",
    "accordion",
    "pineapple",
    "bubbles",
    "gizmo",
    "noodle",
    "pancake",
    "squirrel",
    "turnip",
    "marshmallow",
    "doodle",
  ];
  domains = [
    "laughmail.com",
    "giggles.net",
    "sillyweb.org",
    "funkymail.io",
    "chucklebox.com",
    "goofypost.com",
    "wackyweb.net",
    "zanyzone.org",
    "quirkycorner.io",
    "nuttynook.com",
    "bizarromail.net",
    "kookycomms.org",
    "sillysender.com",
    "madcapmail.io",
    "laughalot.net",
    "wackyworldweb.com",
    "gigglegram.org",
    "funnybonemail.net",
    "chucklenetwork.io",
    "zanypants.com",
    "hohohomail.org",
    "teeheetech.net",
    "jokerpost.com",
    "hilarioushost.io",
  ];

  firstName = "";
  lastName = "";

  email() {
    const getRandomElement = (arr) =>
      arr[Math.floor(Math.random() * arr.length)];

    const adjective = getRandomElement(this.adjectives);
    const noun = getRandomElement(this.nouns);
    const domain = getRandomElement(this.domains);

    this.firstName = adjective;
    this.lastName = noun;

    const randomNumber = Math.floor(Math.random() * 1000); // Increased to 3 digits

    return `${this.firstName}${this.lastName}${randomNumber}@${domain}`;
  }
  get firstName() {
    return this.firstName;
  }
  get lastName() {
    return this.lastName;
  }
}

const generatePassword = (length = 10) => {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$?";

  const allCharacters = uppercase + lowercase + numbers + specialChars;
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  return password;
};

const resolver = {
  Query: {
    user: CurrentUser,
  },
  Mutation: {
    signUp: SingUp,
    oneTap: OneTabJoin,
    login: Login,
    forgetPassword: ForgetPassword,
    resetPassword: ResetPassword,
    logout: LogOut,
    updateProfile: UpdateUserProfile,
  },
};

module.exports = resolver;
