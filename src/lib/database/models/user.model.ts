import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false, // Senha não é obrigatória para usuários do Google OAuth
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    userBio: {
      type: String,
      default: "",
    },
    verificationToken: {
      type: String,
      required: false,
    },
    verificationExpires: {
      type: Date,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    googleId: { // Novo campo para armazenar o ID do Google
      type: String,
      required: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = models?.User || model("User", UserSchema);

export default User;
